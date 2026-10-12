// Minimal model probing: every channel model gets a tiny request on a timer so
// the console can show per-model availability instead of only channel health.
const probeEndpoint = model => {
  const supported = Array.isArray(model.supported_endpoints) ? model.supported_endpoints : [];
  for (const endpoint of ['/v1/chat/completions', '/v1/responses', '/v1/messages']) {
    if (supported.includes(endpoint)) return endpoint;
  }
  return '/v1/chat/completions';
};

function probeBody(endpoint, model, channel) {
  // DashScope translation models reject a plain chat body. qwen-mt-uni is the
  // multimodal translator and wants the native input object, while the plain
  // qwen-mt-* models expect translation_options alongside the messages.
  if (channel?.provider === 'qwen' && /^qwen-mt-uni$/i.test(model)) {
    return { model, input: { target_lang: 'English', source_texts: ['Hello'] } };
  }
  if (channel?.provider === 'qwen' && /^qwen-mt-/i.test(model)) {
    return { model, messages: [{ role: 'user', content: 'Hello' }],
      translation_options: { source_lang: 'auto', target_lang: 'English' }, max_tokens: 16, stream: false };
  }
  if (endpoint === '/v1/responses') return { model, input: 'ping', max_output_tokens: 16, stream: false };
  if (endpoint === '/v1/messages') return { model, max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] };
  return { model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false };
}

function describe(body, status) {
  if (!body) return `HTTP ${status}`;
  try {
    const parsed = JSON.parse(body);
    const message = parsed?.error?.message || parsed?.message;
    if (typeof message === 'string' && message.trim()) return message.trim().slice(0, 200);
  } catch { /* not JSON */ }
  return body.trim().slice(0, 200) || `HTTP ${status}`;
}

// A manual sweep must never burn a metered channel's free quota, so only one
// model per OpenRouter / Qwen / SiliconFlow channel is tested in a single run.
export function manualSweep(models, providers) {
  const seen = new Set();
  return models.filter(model => {
    const provider = providers.get(model.channel_id);
    if (provider !== 'openrouter' && provider !== 'qwen' && provider !== 'siliconflow') return true;
    if (seen.has(model.channel_id)) return false;
    seen.add(model.channel_id);
    return true;
  });
}

export class ModelProber {
  constructor(store, catalog, engines) {
    this.store = store;
    this.catalog = catalog;
    this.engines = engines;
    this.running = false;
    this.timer = null;
    this.stopped = false;
    this.lastRunAt = null;
    this.lastSummary = null;
    this.lastCount = 1;
    this.lastTickAt = null;
    this.lastProbe = null;
    this.lastError = null;
  }

  get interval() {
    return Math.max(60, Number(this.store.get('probe_interval_seconds', 60)) || 60);
  }

  get timeout() {
    return Math.min(120, Math.max(5, Number(this.store.get('probe_timeout_seconds', 30)) || 30));
  }

  enabled() { return this.store.get('probe_enabled', true) !== false; }
  scope() { return this.store.get('probe_scope', 'free') === 'all' ? 'all' : 'free'; }
  results() { return this.store.probes(); }

  status() {
    const results = this.results();
    return { running: this.running, enabled: this.enabled(), interval_seconds: this.interval,
      gap_seconds: this.gap, channel_gap_seconds: this.channelGap,
      openrouter_gap_seconds: this.openrouterGap, qwen_gap_seconds: this.qwenGap,
      siliconflow_gap_seconds: this.siliconflowGap,
      cooldown_seconds: this.cooldown,
      models: this.lastCount, timeout_seconds: this.timeout, scope: this.scope(), last_run_at: this.lastRunAt,
      last_tick_at: this.lastTickAt, last_probe: this.lastProbe, last_error: this.lastError,
      last_summary: this.lastSummary, results };
  }

  start(delay = 8000) {
    this.stopped = false;
    this.schedule(delay);
  }

  schedule(delay) {
    if (this.stopped) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      void this.tick().catch(error => {
        this.lastError = String(error?.message || error);
        console.error('[probe] tick failed:', this.lastError);
      }).finally(() => this.schedule(this.gap * 1000));
    }, delay);
    this.timer.unref?.();
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.timer);
  }

  // Spread the sweep over the configured interval: the managed engines share a
  // small anonymous pool, so probing every model at once trips upstream limits.
  async targets() {
    const listing = await this.catalog.list(null, false, false);
    // Free models consume no credits wherever they live, so they are always
    // probed (OpenCode public pool and the free WorkBuddy / CodeBuddy models).
    // Paid models on account-backed channels draw down the account's own
    // balance, so they are only probed when the operator opts in.
    const accounts = this.store.get('probe_account_channels', false) === true;
    return listing.data.filter(row => !row.alias && row.enabled
      && (row.is_free === true || accounts)
      && (this.scope() === 'all' || row.is_free === true));
  }

  async tick() {
    if (!this.enabled()) return;
    const models = await this.targets();
    if (!models.length) return;
    this.lastCount = models.length;
    const next = this.select(models);
    if (next) {
      // A stuck upstream must never stall the rotation, but the guard only fires
      // after the probe's own two timeouts so we never abandon an in-flight call.
      const guard = new Promise(resolve => setTimeout(resolve, (this.timeout * 2 + 20) * 1000, 'guard'));
      const result = await Promise.race([this.probe(next), guard]);
      this.lastProbe = { model: next.id, result: result === 'guard' ? 'timeout' : result, at: new Date().toISOString() };
    }
    this.lastTickAt = new Date().toISOString();
    this.lastError = null;
  }

  // Minimum spacing between any two probes, no matter the channel.
  get gap() {
    return Math.min(120, Math.max(1, Number(this.store.get('probe_gap_seconds', 5)) || 5));
  }

  // Isolation: the same upstream channel is never probed twice inside this
  // window, so a channel with many free models cannot be swept back-to-back.
  // The configured interval is now the per-channel cadence, not a global sweep.
  get channelGap() {
    return Math.min(3600, Math.max(10, this.interval));
  }

  // OpenRouter's free tier has a hard daily request cap (as low as 50/day on an
  // uncredited key), so its channel is probed far less often than the default
  // per-minute cadence. The sweep still round-robins across its models.
  get openrouterGap() {
    return Math.min(86400, Math.max(600, Number(this.store.get('probe_openrouter_seconds', 3600)) || 3600));
  }

  // Qwen / DashScope free quota is per model and finite (1M tokens, 90 days),
  // so its channel is probed far less often than the default per-minute cadence.
  get qwenGap() {
    return Math.min(86400, Math.max(600, Number(this.store.get('probe_qwen_seconds', 3600)) || 3600));
  }

  // SiliconFlow's ¥0 models still share a rate-limited free pool, so keep the
  // channel on the same slow cadence as the other metered providers.
  get siliconflowGap() {
    return Math.min(86400, Math.max(600, Number(this.store.get('probe_siliconflow_seconds', 3600)) || 3600));
  }

  channelGapFor(channelId) {
    const channel = this.store.channels().find(row => row.id === channelId);
    if (channel?.provider === 'openrouter') return this.openrouterGap;
    if (channel?.provider === 'qwen') return this.qwenGap;
    if (channel?.provider === 'siliconflow') return this.siliconflowGap;
    return this.channelGap;
  }

  // After a model reports a rate limit it is left alone for this long.
  get cooldown() {
    return Math.min(6 * 3600, Math.max(60, Number(this.store.get('probe_cooldown_seconds', 600)) || 600));
  }

  // A fast 429 means the shared pool is busy, not that the model itself is gone.
  rateLimited(row) {
    if (!row || row.ok) return false;
    return row.status === 429 || /rate ?limit|too many|retry in \d+/i.test(row.error || '');
  }

  coolingDown(row, now = Date.now()) {
    if (!this.rateLimited(row)) return false;
    let span = this.cooldown * 1000;
    const match = /retry in (\d+)s/i.exec(row.error || '');
    if (match) span = Math.min(6 * 3600 * 1000, Math.max(span, Number(match[1]) * 1000));
    return now - Date.parse(row.at) < span;
  }

  // Round-robin the target list, but skip a channel still inside its isolation
  // window and any model still cooling down from a rate limit.
  select(models, rows = this.results(), now = Date.now()) {
    const lastByModel = new Map(rows.map(row => [row.model_id, row]));
    const lastByChannel = new Map();
    for (const row of rows) {
      const prev = lastByChannel.get(row.channel_id);
      if (!prev || row.at > prev) lastByChannel.set(row.channel_id, row.at);
    }
    const eligible = models.filter(model => {
      const at = lastByChannel.get(model.channel_id);
      if (at && now - Date.parse(at) < this.channelGapFor(model.channel_id) * 1000) return false;
      return !this.coolingDown(lastByModel.get(model.id), now);
    });
    if (!eligible.length) return null;
    return eligible.reduce((oldest, model) => {
      const at = lastByModel.get(model.id)?.at || '';
      const current = lastByModel.get(oldest.id)?.at || '';
      return at < current ? model : oldest;
    });
  }

  async run({ force = false, gapMs = 2000 } = {}) {
    if (this.running) return { skipped: true, running: true };
    if (!force && !this.enabled()) return { skipped: true, disabled: true };
    this.running = true;
    try {
      const models = await this.targets();
      this.lastCount = models.length;
      const providers = new Map(this.store.channels().map(row => [row.id, row.provider]));
      const queue = manualSweep(models, providers);
      const summary = { total: queue.length, ok: 0, failed: 0, skipped: 0, started_at: new Date().toISOString() };
      // Sequential with a pause: parallel probes were reported as false failures.
      while (queue.length && !this.stopped) {
        const result = await this.probe(queue.shift());
        if (result === null) summary.skipped += 1;
        else if (result) summary.ok += 1;
        else summary.failed += 1;
        if (queue.length && !this.stopped && gapMs > 0) await new Promise(resolve => setTimeout(resolve, gapMs));
      }
      summary.finished_at = new Date().toISOString();
      this.lastSummary = summary;
      this.lastRunAt = summary.finished_at;
      return summary;
    } finally {
      this.running = false;
    }
  }

  async probe(model) {
    const channel = this.store.channels().find(row => row.id === model.channel_id);
    if (!channel || !channel.enabled) return null;
    let result = await this.attempt(model, channel);
    if (!result.ok && !this.stopped) {
      // One retry keeps transient upstream hiccups from looking like an outage.
      await new Promise(resolve => setTimeout(resolve, 1500));
      result = await this.attempt(model, channel);
    }
    this.store.saveProbe({ model_id: model.id, channel_id: channel.id, at: new Date().toISOString(),
      ok: result.ok, status: result.status, latency_ms: result.latency_ms, error: result.error });
    return result.ok;
  }

  async attempt(model, channel) {
    const endpoint = probeEndpoint(model);
    const started = performance.now();
    let ok = false, status = null, error = null;
    try {
      const response = await fetch(channel.base_url + endpoint, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(this.timeout * 1000),
        headers: { ...this.engines.headers(channel), 'Content-Type': 'application/json' },
        body: JSON.stringify(probeBody(endpoint, model.upstream_id, channel)),
      });
      status = response.status;
      ok = response.ok;
      const text = await response.text().catch(() => '');
      if (!ok) error = describe(text, status);
    } catch (exception) {
      const name = exception?.name;
      error = name === 'TimeoutError' || name === 'AbortError'
        ? `探测超时（${this.timeout}s）` : String(exception?.message || exception).slice(0, 200);
    }
    return { ok, status, latency_ms: Math.round(performance.now() - started), error };
  }
}
