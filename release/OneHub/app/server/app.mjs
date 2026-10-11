import http from 'node:http';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createVault, credential, digest, finiteInteger, HttpError, mask, publicError,
  randomToken, readJSON, validateBaseURL } from './security.mjs';
import { createStore } from './store.mjs';
import { Engines } from './engines.mjs';
import { Catalog } from './catalog.mjs';
import { ModelProber } from './probes.mjs';
import { dayStart, UsageReader } from './usage.mjs';
import { prepareResponsesTools } from './responses-tools.mjs';

const inferencePaths = new Set(['/v1/chat/completions', '/v1/responses', '/v1/messages',
  '/v1/messages/count_tokens', '/v1/systemone']);
const mutating = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' };

function send(res, status, body) {
  if (res.writableEnded || res.destroyed) return;
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(data), 'Cache-Control': 'no-store' });
  res.end(data);
}

function strings(value, label, max = 100) {
  if (!Array.isArray(value) || value.length > max || value.some(row => typeof row !== 'string' || row.length > 200)) {
    throw new HttpError(400, `${label} must be a list of strings.`);
  }
  return [...new Set(value)];
}

function label(value, fallback) {
  const result = String(value || fallback || '').trim();
  if (!result || result.length > 100) throw new HttpError(400, 'Name must contain 1-100 characters.');
  return result;
}

async function writeChunk(res, chunk) {
  if (res.destroyed) throw new Error('Client disconnected.');
  if (res.write(chunk)) return;
  await new Promise((resolve, reject) => {
    const done = () => { cleanup(); resolve(); };
    const closed = () => { cleanup(); reject(new Error('Client disconnected.')); };
    const cleanup = () => { res.off('drain', done); res.off('close', closed); res.off('error', closed); };
    res.once('drain', done); res.once('close', closed); res.once('error', closed);
  });
}

export function createApp(options) {
  const { root, directory, disableEngines = false, probe = false, engines: suppliedEngines, frontend } = options;
  const vault = createVault(directory);
  const store = createStore(directory, vault);
  const engines = suppliedEngines || new Engines(root, store, { disabled: disableEngines });
  const catalog = new Catalog(store, engines);
  const prober = new ModelProber(store, catalog, engines);
  const rpm = new Map(), active = new Map();
  const accountCache = { at: 0, data: null, job: null };
  const tasks = new Set(), controllers = new Set();
  let closed = false;
  let closing;
  let versionChecks = 0;

  function origin(req) {
    if (!req.headers.origin) return;
    let parsed;
    try { parsed = new URL(req.headers.origin); } catch { throw new HttpError(403, 'Invalid origin.'); }
    if (parsed.host !== req.headers.host || parsed.protocol !== 'http:') throw new HttpError(403, 'Cross-origin management requests are not allowed.');
  }

  function apiKey(req) {
    const token = credential(req);
    const key = token && store.matchKey(token);
    if (!key) throw new HttpError(401, 'Invalid or expired API key.', 'authentication_error');
    return key;
  }

  async function accounts(force = false) {
    if (!force && accountCache.data && Date.now() - accountCache.at < 10000) return accountCache.data;
    if (accountCache.job) return accountCache.job;
    accountCache.job = engines.accounts();
    try { accountCache.data = await accountCache.job; accountCache.at = Date.now(); return accountCache.data; }
    finally { accountCache.job = null; }
  }

  function invalidate() { accountCache.at = 0; catalog.clear(); }

  function keySettings(input, row = {}) {
    const allowed = strings(input.allowed_channels ?? row.allowed_channels ?? [], 'allowed_channels');
    if (allowed.some(id => !store.channels().some(channel => channel.id === id))) throw new HttpError(400, 'Unknown allowed channel.');
    const expires = input.expires_at === undefined ? row.expires_at : input.expires_at;
    if (expires && input.expires_at !== undefined && (!Number.isFinite(Date.parse(expires)) || Date.parse(expires) <= Date.now())) {
      throw new HttpError(400, '过期时间必须在未来。');
    }
    if (input.enabled !== undefined && typeof input.enabled !== 'boolean') throw new HttpError(400, 'enabled must be boolean.');
    return {
      name: label(input.name, row.name || 'New Key'),
      allowed_channels: allowed, models: strings(input.models ?? row.models ?? [], 'models'),
      rpm: finiteInteger(input.rpm, row.rpm ?? 60, 1, 10000),
      daily_tokens: finiteInteger(input.daily_tokens, row.daily_tokens ?? 0, 0, 1e12),
      expires_at: expires ? new Date(expires).toISOString() : null,
      enabled: input.enabled === undefined ? +(row.enabled ?? true) : +input.enabled,
    };
  }

  function exposeChannel(row) {
    return { ...row, secret: undefined, enabled: !!row.enabled, managed: !!row.managed,
      key_display: mask(engines.key(row)) };
  }

  async function channelViews() {
    return Promise.all(store.channels().map(async row => ({ ...exposeChannel(row),
      health: row.enabled ? await engines.health(row) : { status: 'disabled', latency_ms: null },
      engine: row.managed ? engines.states[row.provider] : null, in_flight: active.get(row.id) || 0 })));
  }

  async function syncSaved() {
    invalidate();
    try { await engines.syncOpenCode(); return { saved: true, synced: true }; }
    catch { return { saved: true, synced: false, warning: '配置已保存，但引擎尚未应用；请检查渠道状态后重启引擎。' }; }
  }

  async function inference(req, res, endpoint, key) {
    const start = performance.now(), id = randomToken('req_', 12);
    const tracker = new UsageReader(false);
    const row = { id, at: new Date().toISOString(), key_id: key.id, key_name: key.name, endpoint,
      status: 500, stream: 0, outcome: 'error', input_tokens: 0, output_tokens: 0, cached_tokens: 0,
      usage_reported: 0, first_ms: null, error: null };
    let acquired = false, controller;
    const disconnected = () => { if (!res.writableEnded) controller?.abort(); };
    res.once('close', disconnected);
    try {
      const body = await readJSON(req);
      row.model = typeof body.model === 'string' ? body.model.slice(0, 200) : '';
      row.stream = +!!body.stream;
      tracker.stream = !!body.stream;
      const { channel, upstream } = await catalog.resolve(body.model, key, endpoint);
      row.channel_id = channel.id; row.channel_name = channel.name; row.upstream_model = upstream;
      const now = Date.now();
      if (rpm.size > 10000) for (const [k, stamps] of rpm) if (!stamps.length || stamps.at(-1) < now - 60000) rpm.delete(k);
      const times = (rpm.get(key.id) || []).filter(time => time > now - 60000);
      if (times.length >= key.rpm) {
        res.setHeader('Retry-After', '60');
        throw new HttpError(429, 'API key request rate exceeded.', 'rate_limit_error');
      }
      if (key.daily_tokens > 0) {
        const spent = store.db.prepare('SELECT COALESCE(SUM(input_tokens+output_tokens),0) AS n FROM requests WHERE key_id=? AND at>=?')
          .get(key.id, dayStart()).n;
        if (spent >= key.daily_tokens) throw new HttpError(429, 'API key daily token soft limit reached.', 'rate_limit_error');
      }
      const count = active.get(channel.id) || 0;
      if (count >= channel.max_concurrency) throw new HttpError(503, 'Channel concurrency limit reached; retry shortly.', 'overloaded_error');
      times.push(now); rpm.set(key.id, times);
      active.set(channel.id, count + 1); acquired = true;
      controller = new AbortController();
      controllers.add(controller);
      const timer = setTimeout(() => controller.abort(new Error('Upstream timeout')), store.get('timeout_seconds', 300) * 1000);
      try {
        const headers = { ...engines.headers(channel), 'Content-Type': 'application/json' };
        for (const name of ['anthropic-version', 'anthropic-beta', 'x-session-id', 'x-opencode-session',
          'x-session-affinity', 'conversation-id', 'conversation_id']) {
          if (typeof req.headers[name] === 'string') headers[name] = req.headers[name];
        }
        body.model = upstream;
        const compatibility = endpoint === '/v1/responses' && channel.provider === 'opencode'
          ? prepareResponsesTools(body) : { request: body, adapter: null };
        if (res.destroyed) throw new Error('Client disconnected.');
        const response = await fetch(channel.base_url + endpoint, {
          method: 'POST', headers, body: JSON.stringify(compatibility.request), redirect: 'error', signal: controller.signal,
        });
        row.status = response.status;
        res.setHeader('X-Request-Id', id);
        for (const name of ['content-type', 'retry-after']) {
          const value = response.headers.get(name);
          if (value) res.setHeader(name, value);
        }
        if (body.stream) { res.setHeader('Cache-Control', 'no-cache'); res.setHeader('X-Accel-Buffering', 'no'); }
        let chunks = response.body || [];
        if (response.ok && compatibility.adapter) {
          if (response.headers.get('content-type')?.includes('text/event-stream')) {
            chunks = compatibility.adapter.stream(chunks);
          } else {
            const converted = compatibility.adapter.response(await response.json());
            chunks = [Buffer.from(JSON.stringify(converted))];
          }
        }
        res.writeHead(response.status);
        res.flushHeaders();
        let upstreamError = '';
        for await (const chunk of chunks) {
          // Keep the upstream error text so the console can explain a failure
          // instead of only showing the status code.
          if (!response.ok && upstreamError.length < 2000) upstreamError += Buffer.from(chunk).toString('utf8');
          if (row.first_ms === null && chunk.length) row.first_ms = Math.round(performance.now() - start);
          tracker.chunk(chunk);
          await writeChunk(res, chunk);
        }
        res.end();
        row.outcome = response.ok ? 'success' : 'upstream_error';
        row.error = response.ok ? null : (upstreamError.trim().slice(0, 2000) || `HTTP ${response.status}`);
      } finally { clearTimeout(timer); }
    } catch (error) {
      row.status = closing ? 503 : error instanceof HttpError ? error.status : controller?.signal.aborted ? 504 : 502;
      row.outcome = closing ? 'server_shutdown' : res.destroyed ? 'client_cancelled' : res.headersSent ? 'stream_error' : 'error';
      row.error = String(error?.message || error).slice(0, 500);
      if (!res.headersSent) send(res, row.status, endpoint.startsWith('/v1/messages')
        ? { type: 'error', error: { type: error.type || 'api_error', message: publicError(error) } }
        : { error: { type: error.type || 'upstream_error', message: publicError(error) } });
      else if (!res.writableEnded) res.destroy();
    } finally {
      res.off('close', disconnected);
      if (controller) controllers.delete(controller);
      if (acquired) active.set(row.channel_id, Math.max(0, (active.get(row.channel_id) || 1) - 1));
      Object.assign(row, tracker.finish());
      row.duration_ms = Math.round(performance.now() - start);
      if (!closed) store.record(row);
    }
  }

  async function management(req, res, url) {
    const pathname = url.pathname, method = req.method;
    // This console has no login: handle() already limits requests to loopback
    // hosts, and mutating calls additionally reject cross-origin requests.
    if (mutating.has(method)) origin(req);
    if (pathname === '/api/auth/session' && method === 'GET') {
      return send(res, 200, { authenticated: true, setup_required: false, username: store.get('username') });
    }
    // The desktop shell polls this to reload itself after a frontend rebuild.
    if (pathname === '/api/version' && method === 'GET') {
      let build = 'unknown';
      try {
        const html = await readFile(path.join(root, 'dist', 'index.html'));
        build = createHash('sha256').update(html).digest('hex').slice(0, 12);
      } catch { /* keep the placeholder when dist is missing */ }
      versionChecks += 1;
      return send(res, 200, { build, checks: versionChecks, version: '0.1.0' });
    }
    if (pathname === '/api/overview' && method === 'GET') {
      const today = dayStart();
      const summary = store.db.prepare(`SELECT COUNT(*) AS requests,
        SUM(CASE WHEN status BETWEEN 200 AND 299 AND outcome='success' THEN 1 ELSE 0 END) AS successes,
        COALESCE(SUM(input_tokens),0) AS input_tokens,COALESCE(SUM(output_tokens),0) AS output_tokens,
        COALESCE(SUM(cached_tokens),0) AS cached_tokens,AVG(duration_ms) AS avg_ms,AVG(first_ms) AS first_ms,
        SUM(CASE WHEN usage_reported=0 THEN 1 ELSE 0 END) AS unknown_usage
        FROM requests WHERE at>=?`).get(today);
      const [pool, channels] = await Promise.all([accounts(), channelViews()]);
      const grouped = store.db.prepare(`SELECT channel_id,channel_name,COUNT(*) AS requests,
        SUM(input_tokens+output_tokens) AS tokens FROM requests WHERE at>=? GROUP BY channel_id`).all(today);
      const hourly = store.db.prepare(`SELECT substr(at,1,13) AS hour,COUNT(*) AS requests,
        SUM(input_tokens+output_tokens) AS tokens FROM requests WHERE at>=? GROUP BY hour ORDER BY hour`).all(today);
      const recent = store.db.prepare('SELECT * FROM requests ORDER BY at DESC LIMIT 8').all();
      return send(res, 200, { summary, channels, accounts: pool.accounts, account_error: pool.workbuddy_error,
        grouped, hourly, recent, keys: store.keys().filter(row => row.enabled).length,
        engines: engines.states, timezone: 'Asia/Shanghai' });
    }
    if (pathname === '/api/channel-status' && method === 'GET') {
      const today = dayStart();
      const perChannel = store.db.prepare(`SELECT channel_id,
        COUNT(*) AS requests,
        SUM(CASE WHEN status BETWEEN 200 AND 299 AND outcome='success' THEN 1 ELSE 0 END) AS successes,
        SUM(CASE WHEN status BETWEEN 200 AND 299 AND outcome='success' THEN 0 ELSE 1 END) AS failures,
        AVG(duration_ms) AS avg_ms,AVG(first_ms) AS first_ms,
        COALESCE(SUM(input_tokens),0) AS input_tokens,COALESCE(SUM(output_tokens),0) AS output_tokens,
        COALESCE(SUM(cached_tokens),0) AS cached_tokens,
        SUM(CASE WHEN usage_reported=0 THEN 1 ELSE 0 END) AS unknown_usage,MAX(at) AS last_at
        FROM requests WHERE at>=? GROUP BY channel_id`).all(today);
      const perHour = store.db.prepare(`SELECT channel_id,substr(at,1,13) AS hour,COUNT(*) AS requests,
        SUM(CASE WHEN status BETWEEN 200 AND 299 AND outcome='success' THEN 0 ELSE 1 END) AS failures
        FROM requests WHERE at>=? GROUP BY channel_id,hour`).all(today);
      const errorRows = store.db.prepare(`SELECT * FROM requests WHERE at>=? AND (status>=400 OR outcome!='success')
        ORDER BY at DESC LIMIT 200`).all(today);
      const stats = new Map(perChannel.map(row => [row.channel_id, row]));
      const buckets = new Map();
      for (const row of perHour) {
        if (!buckets.has(row.channel_id)) buckets.set(row.channel_id, new Map());
        // Requests are stored in UTC; the console reports Asia/Shanghai hours.
        const hour = String((Number(row.hour.slice(11, 13)) + 8) % 24).padStart(2, '0');
        buckets.get(row.channel_id).set(hour, row);
      }
      const lastErrors = new Map();
      for (const row of errorRows) if (!lastErrors.has(row.channel_id)) lastErrors.set(row.channel_id, row);
      const hours = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
      // Per-minute availability for the last 90 minutes: real traffic plus the
      // 1-minute probe samples, so idle minutes still carry a health signal.
      const windowMinutes = 90;
      const minuteStart = Math.floor(Date.now() / 60000) * 60000 - (windowMinutes - 1) * 60000;
      const sinceMinute = new Date(minuteStart).toISOString();
      const minuteSlots = Array.from({ length: windowMinutes }, (_, index) => {
        const iso = new Date(minuteStart + index * 60000).toISOString();
        return { at: iso, key: iso.slice(0, 16) };
      });
      const minuteBuckets = new Map();
      const addMinute = (channelId, minute, requests, failures) => {
        if (!channelId) return;
        if (!minuteBuckets.has(channelId)) minuteBuckets.set(channelId, new Map());
        const map = minuteBuckets.get(channelId);
        const slot = map.get(minute) || { requests: 0, failures: 0 };
        slot.requests += requests; slot.failures += failures;
        map.set(minute, slot);
      };
      for (const row of store.db.prepare(`SELECT channel_id,substr(at,1,16) AS minute,COUNT(*) AS requests,
        SUM(CASE WHEN status BETWEEN 200 AND 299 AND outcome='success' THEN 0 ELSE 1 END) AS failures
        FROM requests WHERE at>=? AND channel_id IS NOT NULL GROUP BY channel_id,minute`).all(sinceMinute)) {
        addMinute(row.channel_id, row.minute, row.requests, row.failures);
      }
      for (const row of store.db.prepare(`SELECT channel_id,substr(at,1,16) AS minute,COUNT(*) AS requests,
        SUM(CASE WHEN ok THEN 0 ELSE 1 END) AS failures
        FROM probe_samples WHERE at>=? AND channel_id IS NOT NULL GROUP BY channel_id,minute`).all(sinceMinute)) {
        addMinute(row.channel_id, row.minute, row.requests, row.failures);
      }
      const minuteSeries = channelId => {
        const map = minuteBuckets.get(channelId) || new Map();
        return minuteSlots.map(slot => {
          const hit = map.get(slot.key);
          return { at: slot.at, requests: hit?.requests || 0, failures: hit?.failures || 0 };
        });
      };
      const channels = (await channelViews()).map(row => {
        const stat = stats.get(row.id) || {}, bucket = buckets.get(row.id) || new Map();
        const requests = stat.requests || 0, successes = stat.successes || 0, error = lastErrors.get(row.id);
        return { id: row.id, name: row.name, prefix: row.prefix, provider: row.provider, realm: row.realm,
          enabled: row.enabled, managed: row.managed, base_url: row.base_url, priority: row.priority,
          max_concurrency: row.max_concurrency, in_flight: row.in_flight, health: row.health, engine: row.engine,
          today: { requests, successes, failures: stat.failures || 0,
            success_rate: requests ? successes / requests : null, avg_ms: stat.avg_ms, first_ms: stat.first_ms,
            input_tokens: stat.input_tokens || 0, output_tokens: stat.output_tokens || 0,
            cached_tokens: stat.cached_tokens || 0, unknown_usage: stat.unknown_usage || 0 },
          hourly: hours.map(hour => ({ hour, requests: bucket.get(hour)?.requests || 0,
            failures: bucket.get(hour)?.failures || 0 })),
          minutes: minuteSeries(row.id),
          last_request_at: stat.last_at || null,
          last_error: error ? { at: error.at, model: error.model, endpoint: error.endpoint,
            status: error.status, outcome: error.outcome } : null };
      });
      const probeRows = new Map(prober.results().map(row => [row.model_id, row]));
      const effectiveProbes = new Map(probeRows);
      const successfulRows = store.db.prepare(`SELECT channel_id,upstream_model,at,status,first_ms,duration_ms
        FROM (SELECT channel_id,upstream_model,at,status,first_ms,duration_ms,
          ROW_NUMBER() OVER (PARTITION BY channel_id,upstream_model ORDER BY at DESC) AS rank
          FROM requests WHERE at>=? AND status BETWEEN 200 AND 299 AND outcome='success'
            AND channel_id IS NOT NULL AND upstream_model IS NOT NULL) WHERE rank=1`).all(today);
      const successfulByModel = new Map(successfulRows.map(row => [row.channel_id + '\0' + row.upstream_model, row]));
      const catalogRows = await catalog.list(null, false, true);
      const modelsByChannel = new Map();
      for (const row of catalogRows.data) {
        if (row.alias) continue;
        if (!modelsByChannel.has(row.channel_id)) modelsByChannel.set(row.channel_id, []);
        const stored = probeRows.get(row.id) || null;
        const success = successfulByModel.get(row.channel_id + '\0' + row.upstream_id);
        const probe = success && (!stored || success.at > stored.at)
          ? { model_id: row.id, channel_id: row.channel_id, at: success.at, ok: true, status: success.status,
              latency_ms: success.first_ms == null ? success.duration_ms : Math.round(success.first_ms),
              error: null, history: stored?.history || [], source: 'request' }
          : stored ? { ...stored, source: 'probe' } : null;
        if (probe) effectiveProbes.set(row.id, probe);
        modelsByChannel.get(row.channel_id).push({ id: row.id, upstream_id: row.upstream_id,
          enabled: row.enabled, is_free: row.is_free === true,
          probe: probe ? { at: probe.at, ok: probe.ok, status: probe.status,
            latency_ms: probe.latency_ms, error: probe.error, history: probe.history, source: probe.source } : null });
      }
      for (const channel of channels) {
        const models = (modelsByChannel.get(channel.id) || []).sort((a, b) => a.id.localeCompare(b.id));
        const probed = models.filter(row => row.probe);
        const limited = probed.filter(row => !row.probe.ok && (row.probe.status === 429
          || /rate ?limit|too many|retry in \d+/i.test(row.probe.error || ''))).length;
        const unavailable = probed.filter(row => !row.probe.ok && (row.probe.status === 502
          || /all upstream attempts failed|no healthy anonymous proxies|endpoint is unavailable/i.test(row.probe.error || ''))).length;
        channel.models = models;
        channel.probe = { total: models.length, probed: probed.length,
          ok: probed.filter(row => row.probe.ok).length,
          limited, unavailable, failed: probed.filter(row => !row.probe.ok).length - limited - unavailable,
          healthy: probed.length > 0 && probed.filter(row => !row.probe.ok).length === limited,
          at: probed.reduce((latest, row) => !latest || row.probe.at > latest ? row.probe.at : latest, null) };
      }
      const totals = channels.reduce((sum, row) => ({
        channels: sum.channels + 1, online: sum.online + (row.health?.status === 'online' ? 1 : 0),
        enabled: sum.enabled + (row.enabled ? 1 : 0), requests: sum.requests + row.today.requests,
        successes: sum.successes + row.today.successes, failures: sum.failures + row.today.failures,
        input_tokens: sum.input_tokens + row.today.input_tokens, output_tokens: sum.output_tokens + row.today.output_tokens,
      }), { channels: 0, online: 0, enabled: 0, requests: 0, successes: 0, failures: 0, input_tokens: 0, output_tokens: 0 });
      const probeStatus = prober.status();
      return send(res, 200, { time: new Date().toISOString(), timezone: 'Asia/Shanghai',
        engines: engines.states, channels, totals,
        probes: { ...probeStatus, results: [...effectiveProbes.values()].map(row => ({ ...row, source: row.source || 'probe' }))
          .sort((a, b) => a.model_id.localeCompare(b.model_id)) } });
    }
    if (pathname === '/api/probes' && method === 'GET') return send(res, 200, prober.status());
    if (pathname === '/api/probes/run' && method === 'POST') {
      if (prober.running) throw new HttpError(409, '模型探测正在进行，请稍候。');
      void prober.run({ force: true }).catch(() => {});
      store.audit('probe.run', 'manual');
      return send(res, 202, prober.status());
    }
    if (pathname === '/api/token-stats' && method === 'GET') {
      const days = finiteInteger(url.searchParams.get('days') || undefined, 30, 7, 365);
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const rows = store.db.prepare(`SELECT substr(datetime(at,'+8 hours'),1,10) AS day,channel_id,channel_name,
        COUNT(*) AS requests,COALESCE(SUM(input_tokens),0) AS input_tokens,
        COALESCE(SUM(output_tokens),0) AS output_tokens,COALESCE(SUM(cached_tokens),0) AS cached_tokens
        FROM requests WHERE at>=? GROUP BY day,channel_id`).all(since);
      const byChannel = new Map();
      for (const row of rows) {
        if (!byChannel.has(row.channel_id)) byChannel.set(row.channel_id, new Map());
        byChannel.get(row.channel_id).set(row.day, row);
      }
      // Beijing calendar days, oldest first.
      const shifted = new Date(Date.now() + 8 * 3600 * 1000);
      const calendar = Array.from({ length: days }, (_, index) => {
        const stamp = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(),
          shifted.getUTCDate() - (days - 1 - index)));
        return stamp.toISOString().slice(0, 10);
      });
      const channels = store.channels();
      const series = [];
      for (const channel of channels) {
        const bucket = byChannel.get(channel.id) || new Map();
        for (const kind of ['input', 'output']) {
          const values = calendar.map(day => bucket.get(day)?.[kind + '_tokens'] || 0);
          series.push({ id: channel.id + ':' + kind, channel_id: channel.id, channel_name: channel.name,
            kind, label: channel.name + (kind === 'input' ? ' 输入' : ' 输出'),
            values, total: values.reduce((sum, value) => sum + value, 0) });
        }
      }
      const daily = calendar.map((day, index) => ({
        day, requests: [...byChannel.values()].reduce((sum, bucket) => sum + (bucket.get(day)?.requests || 0), 0),
        tokens: series.reduce((sum, row) => sum + row.values[index], 0),
      }));
      const totals = {
        input_tokens: series.filter(row => row.kind === 'input').reduce((sum, row) => sum + row.total, 0),
        output_tokens: series.filter(row => row.kind === 'output').reduce((sum, row) => sum + row.total, 0),
        cached_tokens: rows.reduce((sum, row) => sum + row.cached_tokens, 0),
        requests: rows.reduce((sum, row) => sum + row.requests, 0),
      };
      return send(res, 200, { days: calendar, series, daily, totals,
        timezone: 'Asia/Shanghai', time: new Date().toISOString() });
    }
    if (pathname === '/api/accounts' && method === 'GET') return send(res, 200, await accounts(url.searchParams.get('refresh') === '1'));
    if (pathname === '/api/accounts' && method === 'POST') {
      const input = await readJSON(req, 65536);
      if (!['zen', 'go'].includes(input.kind)) throw new HttpError(400, 'OpenCode account kind must be zen or go.');
      const secret = String(input.key || '').trim();
      if (secret.length < 8 || secret.length > 8192 || /[\r\n]/.test(secret)) throw new HttpError(400, '请输入有效的上游 Key。');
      if (store.accounts().some(row => vault.decrypt(row.secret) === secret)) throw new HttpError(409, '这个 Key 已存在。');
      const id = randomToken('oc_', 12), name = label(input.name, input.kind.toUpperCase() + ' Key');
      store.db.prepare('INSERT INTO accounts(id,name,kind,secret,enabled,created_at) VALUES(?,?,?,?,1,?)')
        .run(id, name, input.kind, vault.encrypt(secret), new Date().toISOString());
      store.audit('account.create', name);
      return send(res, 201, { id, ...await syncSaved() });
    }
    if (pathname === '/api/accounts/oauth/start' && method === 'POST') {
      const input = await readJSON(req, 16384);
      if (!['intl', 'cn'].includes(input.realm)) throw new HttpError(400, 'realm must be intl or cn.');
      const result = await engines.admin('workbuddy', '/accounts/login/start', 'POST', { realm: input.realm, platform: 'CLI' });
      let parsed;
      try { parsed = new URL(result.authUrl); } catch { throw new HttpError(502, '上游没有返回有效的授权地址。'); }
      if (parsed.protocol !== 'https:') throw new HttpError(502, '上游授权地址必须使用 HTTPS。');
      return send(res, 200, { state: result.state, authUrl: result.authUrl, realm: input.realm });
    }
    if (pathname === '/api/accounts/oauth/poll' && method === 'GET') {
      const state = url.searchParams.get('state') || '';
      if (!state || state.length > 512) throw new HttpError(400, 'Invalid OAuth state.');
      const result = await engines.admin('workbuddy', '/accounts/login/poll?state=' + encodeURIComponent(state));
      if (result.status === 'ok') { invalidate(); store.audit('account.oauth', result.account?.uid || ''); }
      return send(res, 200, { status: result.status, message: result.message || null });
    }
    if (pathname === '/api/accounts/oauth/cancel' && method === 'POST') {
      const input = await readJSON(req, 16384);
      return send(res, 200, await engines.admin('workbuddy', '/accounts/login/cancel', 'POST', { state: String(input.state || '') }));
    }
    if (pathname === '/api/accounts/import' && method === 'POST') {
      const input = await readJSON(req);
      if (!['intl', 'cn'].includes(input.realm) || !input.data || typeof input.data !== 'object') throw new HttpError(400, '请选择区域并提交合法的账号 JSON。');
      const result = await engines.admin('workbuddy', '/accounts/import', 'POST', { data: input.data, realm: input.realm, overwrite: false });
      invalidate(); store.audit('account.import', input.realm);
      return send(res, 200, { result: result.result, count: result.count });
    }
    if (pathname === '/api/accounts/checkin' && method === 'POST') {
      // Manual trigger of the WorkBuddy engine's growth tasks: daily check-in,
      // cat travel and token keepalive for every enabled account.
      const result = await engines.admin('workbuddy', '/scheduler/trigger', 'POST', {});
      store.audit('account.checkin', result?.msg || 'triggered');
      return send(res, 200, result);
    }
    if (pathname === '/api/accounts/checkin' && method === 'GET') {
      return send(res, 200, await engines.admin('workbuddy', '/scheduler', 'GET'));
    }
    const accountMatch = /^\/api\/accounts\/([^/]+)(?:\/(refresh|credits))?$/.exec(pathname);
    if (accountMatch) {
      const id = decodeURIComponent(accountMatch[1]), action = accountMatch[2];
      if (id === 'public' && method === 'PATCH') {
        const input = await readJSON(req, 16384);
        if (typeof input.enabled !== 'boolean') throw new HttpError(400, 'enabled must be boolean.');
        store.set('anonymous_enabled', input.enabled);
        return send(res, 200, await syncSaved());
      }
      if (id.startsWith('wb:')) {
        const uid = id.slice(3);
        if (method === 'PATCH') {
          const input = await readJSON(req, 16384);
          if (typeof input.enabled !== 'boolean') throw new HttpError(400, 'enabled must be boolean.');
          await engines.admin('workbuddy', '/accounts/set', 'POST', { uid, enabled: input.enabled });
        } else if (method === 'DELETE' && !action) {
          await engines.admin('workbuddy', '/accounts/delete', 'POST', { uid });
        } else if (method === 'POST' && action) {
          const result = await engines.admin('workbuddy', '/accounts/' + action, 'POST', { uid });
          invalidate();
          const results = (Array.isArray(result.results) ? result.results : []).filter(row => row.uid === uid);
          store.audit('account.' + action, uid);
          if (!results.length) throw new HttpError(404, '账号不存在或引擎未返回操作结果。');
          return send(res, 200, { ok: results.every(row => row.ok), results: results.map(row => ({
            uid: row.uid, ok: !!row.ok,
            ...(!row.ok ? { error: action === 'credits' ? '额度查询失败，请检查账号状态或重新授权。' : '凭据刷新失败，请重新授权账号。' } : {}),
          })) });
        } else throw new HttpError(405, 'Method not allowed.');
        invalidate(); store.audit('account.' + method.toLowerCase(), uid);
        return send(res, 200, { ok: true });
      }
      const row = store.db.prepare('SELECT * FROM accounts WHERE id=?').get(id);
      if (!row) throw new HttpError(404, 'Account not found.');
      if (method === 'DELETE') store.db.prepare('DELETE FROM accounts WHERE id=?').run(id);
      else if (method === 'PATCH') {
        const input = await readJSON(req, 16384);
        const enabled = input.enabled === undefined ? row.enabled : typeof input.enabled === 'boolean' ? +input.enabled : null;
        if (enabled === null) throw new HttpError(400, 'enabled must be boolean.');
        store.db.prepare('UPDATE accounts SET enabled=?,name=? WHERE id=?').run(enabled, label(input.name, row.name), id);
      } else throw new HttpError(405, 'Method not allowed.');
      store.audit('account.' + method.toLowerCase(), row.name);
      return send(res, 200, await syncSaved());
    }
    if (pathname === '/api/channels' && method === 'GET') return send(res, 200, { channels: await channelViews() });
    if (pathname === '/api/channels' && method === 'POST') {
      const input = await readJSON(req, 32768);
      if (!['opencode', 'workbuddy'].includes(input.provider)) throw new HttpError(400, 'Invalid provider.');
      const prefix = String(input.prefix || '').trim();
      if (!/^[a-z][a-z0-9-]{1,39}$/.test(prefix)) throw new HttpError(400, '渠道前缀需使用 2-40 位小写字母、数字或连字符。');
      if (store.channels().some(row => row.prefix === prefix)) throw new HttpError(409, '渠道前缀已存在。');
      const id = randomToken('ch_', 10);
      store.db.prepare(`INSERT INTO channels(id,name,provider,prefix,base_url,secret,realm,priority,max_concurrency,created_at)
        VALUES(?,?,?,?,?,?,?,?,?,?)`).run(id, label(input.name), input.provider, prefix, validateBaseURL(input.base_url),
        vault.encrypt(String(input.key || '')), ['intl', 'cn'].includes(input.realm) ? input.realm : '',
        finiteInteger(input.priority, 10, 0, 100), finiteInteger(input.max_concurrency, 8, 1, 128), new Date().toISOString());
      invalidate(); store.audit('channel.create', input.name);
      return send(res, 201, { id });
    }
    const channelMatch = /^\/api\/channels\/([^/]+)$/.exec(pathname);
    if (channelMatch && method === 'PATCH') {
      const row = store.db.prepare('SELECT * FROM channels WHERE id=?').get(channelMatch[1]);
      if (!row) throw new HttpError(404, 'Channel not found.');
      const input = await readJSON(req, 32768);
      if (input.enabled !== undefined && typeof input.enabled !== 'boolean') throw new HttpError(400, 'enabled must be boolean.');
      const base = row.managed ? row.base_url : validateBaseURL(input.base_url || row.base_url);
      const secret = row.managed || !input.key ? row.secret : vault.encrypt(String(input.key));
      store.db.prepare('UPDATE channels SET name=?,enabled=?,base_url=?,secret=?,priority=?,max_concurrency=? WHERE id=?')
        .run(label(input.name, row.name), input.enabled === undefined ? row.enabled : +input.enabled, base, secret,
          finiteInteger(input.priority, row.priority, 0, 100), finiteInteger(input.max_concurrency, row.max_concurrency, 1, 128), row.id);
      invalidate(); store.audit('channel.update', row.name);
      return send(res, 200, { ok: true });
    }
    if (channelMatch && method === 'DELETE') {
      const row = store.db.prepare('SELECT * FROM channels WHERE id=?').get(channelMatch[1]);
      if (!row || row.managed) throw new HttpError(400, '内置渠道不能删除，可将其禁用。');
      store.db.prepare('DELETE FROM channels WHERE id=?').run(row.id);
      invalidate(); return send(res, 200, { ok: true });
    }
    const engineMatch = /^\/api\/engines\/(opencode|workbuddy)\/restart$/.exec(pathname);
    if (engineMatch && method === 'POST') {
      const state = await engines.restart(engineMatch[1]);
      invalidate(); store.audit('engine.restart', engineMatch[1]);
      return send(res, 200, state);
    }
    if (pathname === '/api/models' && method === 'GET') return send(res, 200, await catalog.list(null, url.searchParams.get('refresh') === '1', true));
    if (pathname === '/api/models/toggle' && method === 'POST') {
      const input = await readJSON(req, 16384);
      if (typeof input.model !== 'string' || input.model.length > 200 || typeof input.enabled !== 'boolean') throw new HttpError(400, 'Invalid model setting.');
      store.set('model_disabled:' + input.model, !input.enabled);
      return send(res, 200, { ok: true });
    }
    if (pathname === '/api/aliases' && method === 'GET') {
      const aliases = store.db.prepare('SELECT * FROM aliases ORDER BY name').all();
      const targets = catalog.freeOnly() ? new Set((await catalog.list(null, false, true)).data.filter(row => !row.alias).map(row => row.id)) : null;
      return send(res, 200, { aliases: targets ? aliases.filter(row => targets.has(row.target)) : aliases });
    }
    if (pathname === '/api/aliases' && method === 'POST') {
      const input = await readJSON(req, 16384);
      const name = String(input.name || '').trim(), target = String(input.target || '').trim();
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,79}$/.test(name) || !target.includes('/') || target.length > 200) throw new HttpError(400, '别名不含斜线，目标必须是带渠道前缀的模型。');
      const channel = store.channels().find(row => target.startsWith(row.prefix + '/'));
      if (!channel) throw new HttpError(400, '目标渠道不存在。');
      if (catalog.freeOnly()) await catalog.requireFree(channel, target.slice(channel.prefix.length + 1));
      store.db.prepare('INSERT INTO aliases(name,target) VALUES(?,?) ON CONFLICT(name) DO UPDATE SET target=excluded.target').run(name, target);
      store.audit('alias.save', name + ' -> ' + target);
      return send(res, 200, { ok: true });
    }
    const aliasMatch = /^\/api\/aliases\/([^/]+)$/.exec(pathname);
    if (aliasMatch && method === 'DELETE') {
      store.db.prepare('DELETE FROM aliases WHERE name=?').run(decodeURIComponent(aliasMatch[1]));
      return send(res, 200, { ok: true });
    }
    if (pathname === '/api/keys' && method === 'GET') return send(res, 200, { keys: store.keys() });
    if (pathname === '/api/keys' && method === 'POST') {
      const input = await readJSON(req, 32768);
      const result = store.createKey(keySettings(input));
      store.audit('key.create', input.name || '');
      return send(res, 201, result);
    }
    const keyMatch = /^\/api\/keys\/([^/]+)$/.exec(pathname);
    if (keyMatch && (method === 'PATCH' || method === 'DELETE')) {
      const row = store.db.prepare('SELECT * FROM api_keys WHERE id=?').get(keyMatch[1]);
      if (!row) throw new HttpError(404, 'API key not found.');
      if (method === 'DELETE') store.db.prepare('DELETE FROM api_keys WHERE id=?').run(row.id);
      else {
        const input = await readJSON(req, 16384);
        const settings = keySettings(input, { ...row, allowed_channels: JSON.parse(row.allowed_channels), models: JSON.parse(row.models) });
        store.db.prepare(`UPDATE api_keys SET name=?,enabled=?,allowed_channels=?,models=?,rpm=?,daily_tokens=?,expires_at=? WHERE id=?`)
          .run(settings.name, settings.enabled, JSON.stringify(settings.allowed_channels), JSON.stringify(settings.models),
            settings.rpm, settings.daily_tokens, settings.expires_at, row.id);
      }
      store.audit('key.' + method.toLowerCase(), row.name);
      return send(res, 200, { ok: true });
    }
    if (pathname === '/api/requests' && method === 'GET') {
      const page = finiteInteger(url.searchParams.get('page') || undefined, 1, 1, 100000);
      const limit = 30, filters = [], params = [];
      for (const [param, column] of [['channel', 'channel_id'], ['key', 'key_id']]) {
        const value = url.searchParams.get(param);
        if (value) { filters.push(column + '=?'); params.push(value); }
      }
      if (url.searchParams.get('errors') === '1') filters.push("(status>=400 OR outcome!='success')");
      const search = url.searchParams.get('search')?.slice(0, 200);
      if (search) { filters.push('(model LIKE ? OR id LIKE ?)'); params.push('%' + search + '%', '%' + search + '%'); }
      const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
      const total = store.db.prepare('SELECT COUNT(*) AS n FROM requests ' + where).get(...params).n;
      const rows = store.db.prepare('SELECT * FROM requests ' + where + ' ORDER BY at DESC LIMIT ? OFFSET ?').all(...params, limit, (page - 1) * limit);
      return send(res, 200, { rows, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
    }
    if (pathname === '/api/settings' && method === 'GET') return send(res, 200, {
      username: store.get('username'), anonymous_enabled: store.get('anonymous_enabled'),
      model_free_only: catalog.freeOnly(),
      timeout_seconds: store.get('timeout_seconds'), models_ttl_seconds: store.get('models_ttl_seconds'),
      probe_enabled: prober.enabled(), probe_interval_seconds: prober.interval,
      probe_timeout_seconds: prober.timeout, probe_scope: prober.scope(),
      probe_gap_seconds: prober.gap, probe_cooldown_seconds: prober.cooldown, probe: prober.status(),
      probe_account_channels: store.get('probe_account_channels', false) === true,
      engines: engines.states, timezone: 'Asia/Shanghai', version: '0.1.0',
    });
    if (pathname === '/api/settings' && method === 'PATCH') {
      const input = await readJSON(req, 16384);
      if (input.anonymous_enabled !== undefined && typeof input.anonymous_enabled !== 'boolean') throw new HttpError(400, 'anonymous_enabled must be boolean.');
      if (input.model_free_only !== undefined && typeof input.model_free_only !== 'boolean') throw new HttpError(400, 'model_free_only must be boolean.');
      const timeout = finiteInteger(input.timeout_seconds, store.get('timeout_seconds'), 10, 900);
      const ttl = finiteInteger(input.models_ttl_seconds, store.get('models_ttl_seconds'), 30, 3600);
      if (input.probe_enabled !== undefined) {
        if (typeof input.probe_enabled !== 'boolean') throw new HttpError(400, 'probe_enabled must be boolean.');
        store.set('probe_enabled', input.probe_enabled);
      }
      if (input.probe_scope !== undefined) {
        if (!['free', 'all'].includes(input.probe_scope)) throw new HttpError(400, 'probe_scope must be free or all.');
        store.set('probe_scope', input.probe_scope);
      }
      if (input.probe_account_channels !== undefined) {
        if (typeof input.probe_account_channels !== 'boolean') throw new HttpError(400, 'probe_account_channels must be boolean.');
        store.set('probe_account_channels', input.probe_account_channels);
      }
      store.set('probe_interval_seconds', finiteInteger(input.probe_interval_seconds,
        store.get('probe_interval_seconds', 60), 60, 86400));
      store.set('probe_timeout_seconds', finiteInteger(input.probe_timeout_seconds,
        store.get('probe_timeout_seconds', 30), 5, 120));
      store.set('probe_gap_seconds', finiteInteger(input.probe_gap_seconds,
        store.get('probe_gap_seconds', 5), 1, 120));
      store.set('probe_cooldown_seconds', finiteInteger(input.probe_cooldown_seconds,
        store.get('probe_cooldown_seconds', 600), 60, 21600));
      if (input.anonymous_enabled !== undefined) store.set('anonymous_enabled', input.anonymous_enabled);
      if (input.model_free_only !== undefined) store.set('model_free_only', input.model_free_only);
      store.set('timeout_seconds', timeout); store.set('models_ttl_seconds', ttl);
      store.audit('settings.update', 'gateway settings');
      const saved = await syncSaved();
      const models = input.model_free_only === undefined ? null : await catalog.list(null, true, true);
      return send(res, 200, { ...saved,
        ...(models ? { model_free_only: catalog.freeOnly(), models_synced: !models.partial,
          ...(models.partial ? { warning: '免费模型策略已保存，部分渠道价格同步失败；恢复同步后再调用。' } : {}) } : {}) });
    }
    if (pathname === '/api/audit' && method === 'GET') return send(res, 200, { rows: store.db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 100').all() });
    throw new HttpError(404, 'Management endpoint not found.');
  }

  async function handle(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    try {
      if (closing) throw new HttpError(503, 'Gateway is shutting down.', 'service_unavailable');
      const host = new URL('http://' + req.headers.host).hostname;
      if (!['127.0.0.1', 'localhost', '[::1]'].includes(host)) throw new HttpError(403, 'This instance accepts loopback access only.');
      const url = new URL(req.url, 'http://' + req.headers.host);
      if (url.pathname === '/healthz') return send(res, 200, { service: 'onehub', status: 'ok', version: '0.1.0' });
      if (url.pathname === '/v1' && req.method === 'GET') return send(res, 200, { service: 'OneHub', endpoints: [...inferencePaths, '/v1/models'] });
      if (url.pathname.startsWith('/api/')) return await management(req, res, url);
      if (url.pathname === '/v1/models' && req.method === 'GET') {
        const result = await catalog.list(apiKey(req));
        if (!result.data.length && result.providers.every(row => row.error)) throw new HttpError(503, 'No channel model catalog is currently reachable.', 'service_unavailable');
        return send(res, 200, result);
      }
      if (inferencePaths.has(url.pathname) && req.method === 'POST') return await inference(req, res, url.pathname, apiKey(req));
      if (url.pathname.startsWith('/v1/')) throw new HttpError(404, 'API endpoint not supported.');
      if (!['GET', 'HEAD'].includes(req.method)) throw new HttpError(405, 'Method not allowed.');
      if (frontend) return frontend(req, res);
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.includes('\0')) throw new HttpError(400, 'Invalid path.');
      const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const assets = path.resolve(root, 'dist'), file = path.resolve(assets, relative);
      if (!file.startsWith(assets + path.sep)) throw new HttpError(403, 'Invalid file path.');
      let bytes;
      try { bytes = await readFile(file); }
      catch {
        if (path.extname(relative)) throw new HttpError(404, 'Asset not found.');
        bytes = await readFile(path.join(assets, 'index.html'));
      }
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'");
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/html; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      if (!res.headersSent) send(res, error.status || 500, req.url.startsWith('/v1/messages')
        ? { type: 'error', error: { type: error.type || 'api_error', message: publicError(error) } }
        : { error: { type: error.type || 'internal_error', message: publicError(error) } });
      else res.destroy();
    }
  }
  const server = http.createServer((req, res) => {
    const task = handle(req, res);
    tasks.add(task);
    void task.catch(() => res.destroy()).finally(() => tasks.delete(task));
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
  server.keepAliveTimeout = 5000;
  return {
    server, store, engines, catalog,
    async start(port = 3000) {
      await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
      await engines.start();
      if (probe) prober.start();
      return server.address();
    },
    close() {
      if (closing) return closing;
      closing = (async () => {
        prober.stop();
        const stopped = new Promise(resolve => server.close(resolve));
        for (const controller of controllers) controller.abort(new Error('Gateway stopping'));
        server.closeAllConnections();
        const [engineResult] = await Promise.allSettled([engines.stop(), stopped]);
        while (tasks.size) await Promise.allSettled([...tasks]);
        closed = true;
        store.close();
        if (engineResult.status === 'rejected') throw engineResult.reason;
      })();
      return closing;
    },
  };
}
