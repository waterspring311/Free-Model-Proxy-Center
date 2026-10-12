import { assessCapability } from './capability.mjs';
import { HttpError } from './security.mjs';

// Qwen / DashScope grants every model its own newcomer free quota (typically
// 1,000,000 tokens, valid 90 days, 华北2北京 region only). There is no public
// API that reports the remaining quota or marks a model as free, so free
// status is driven by explicit allowlists: the `qwen_free_models` setting
// (newline/comma separated IDs, a trailing `*` matches a prefix) overrides the
// built-in defaults below. Anything not listed stays unknown, so free-only mode
// keeps it hidden.
const QWEN_FREE_PREFIXES = [
  'qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-flash', 'qwen-long',
  'qwen-vl', 'qwen-coder', 'qwen-mt',
  'qwen3-max', 'qwen3-plus', 'qwen3-flash', 'qwen3-turbo',
  'qwen3-coder', 'qwen3-vl', 'qwen3-omni',
  'qwen3.5-', 'qwen3.6-', 'qwen3.7-', 'qwen3.8-',
];
// These non-Qwen model IDs are documented on the same mainland-China pricing
// page as having a 1,000,000-token newcomer quota. Provider-namespaced hosted
// variants (for example `vanchin/deepseek-v4.1-flash`) are deliberately absent:
// Alibaba lists those as paid even when the bare model ID is free.
const QWEN_FREE_MODELS = [
  'deepseek-v4.1-flash', 'deepseek-v4-pro', 'deepseek-v4-pro-0813',
  'deepseek-v4-flash-0731', 'deepseek-r1-distill-llama-70b',
  'kimi-k3', 'kimi-k2.7-code', 'kimi-k2.6', 'kimi-k2.5',
  'glm-5.3', 'glm-5.2', 'glm-5.1', 'glm-5',
  'MiniMax-M2.5', 'tongyi-xiaomi-analysis-flash', 'tongyi-xiaomi-analysis-pro',
];
// Media and service models share the platform but are not chat endpoints, so
// they are never advertised as free in this chat-focused gateway.
const QWEN_NON_CHAT = /(image|tts|asr|speech|embedding|rerank|realtime|livetranslate|deep-research|deep-search|audio|sre-|test-sre)/i;

// SiliconFlow (硅基流动) /v1/models exposes only IDs, never prices, so free
// status comes from an explicit allowlist matching the models its 价格中心 lists
// as 免费 (¥0). The `siliconflow_free_models` setting overrides this (newline or
// comma separated, a trailing `*` matches a prefix); anything not listed stays
// unknown so free-only mode keeps it hidden. Only chat-capable endpoints are
// listed, since the gateway routes chat completions.
const SILICONFLOW_FREE_MODELS = [
  'Qwen/Qwen2.5-7B-Instruct',
  'Qwen/Qwen3-8B',
  'Qwen/Qwen3.5-4B',
  'THUDM/GLM-4-9B-0414',
  'THUDM/GLM-Z1-9B-0414',
  'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
  'deepseek-ai/DeepSeek-OCR',
  'tencent/Hunyuan-MT-7B',
  'XingChenAGI/Xing4.0-29B',
  'PaddlePaddle/PaddleOCR-VL-1.5',
];

export function creditMultiplier(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null;
  if (typeof value !== 'string' || value.length > 64) return null;
  const match = /^(?:(?:x|×)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:x|×)?)(?:\s+credits?)?$/i.exec(value.trim());
  if (!match) return null;
  const number = Number(match[1] ?? match[2]);
  return Number.isFinite(number) ? number : null;
}

export class Catalog {
  constructor(store, engines) {
    this.store = store;
    this.engines = engines;
    this.cache = new Map();
    this.pending = new Map();
    for (const channel of store.channels()) this.restore(channel, this.source(channel));
  }

  clear() { this.cache.clear(); }

  source(channel) {
    return JSON.stringify({
      base_url: channel.base_url, prefix: channel.prefix, provider: channel.provider, realm: channel.realm,
      pricing_version: 3, free_only: this.freeOnly(),
      ...(channel.provider === 'qwen' ? { qwen_free: String(this.store.get('qwen_free_models', '') || '') } : {}),
      ...(channel.provider === 'siliconflow' ? { sf_free: String(this.store.get('siliconflow_free_models', '') || '') } : {}),
      ...(channel.managed && channel.provider === 'opencode' ? {
        anonymous: this.store.get('anonymous_enabled', true),
        accounts: this.store.accounts().filter(row => row.enabled).map(row => [row.id, row.kind]).sort(),
      } : {}),
    });
  }

  restore(channel, source) {
    const saved = this.store.modelCatalog(channel.id, source);
    if (!saved) return null;
    const result = {
      at: Date.parse(saved.synced_at), synced_at: saved.synced_at, source, stale: false, error: null,
      models: saved.models.map(row => ({
        ...row, id: channel.prefix + '/' + row.upstream_id, channel_name: channel.name,
        owned_by: channel.prefix,
      })),
    };
    this.cache.set(channel.id, result);
    return result;
  }

  freeStatus(channel, row) {
    if (channel.provider === 'qwen') return this.qwenFree(row.id);
    if (channel.provider === 'siliconflow') return this.siliconflowFree(row.id);
    if (channel.provider === 'workbuddy') {
      if (channel.managed && row.pricing_source !== 'product_config') return null;
      if (row.credits !== undefined) {
        const multiplier = creditMultiplier(row.credits);
        return multiplier == null ? null : multiplier === 0;
      }
    }
    if (channel.provider === 'openrouter') {
      // OpenRouter marks the no-credit free variants with a `:free` suffix.
      // Some paid/non-suffixed models also advertise zero token prices but
      // still require account credits (they return HTTP 402), so price alone
      // is not sufficient to treat them as free.
      return /:free$/i.test(row.id) || row.id.toLowerCase() === 'openrouter/free';
    }
    const cost = row.cost || row.pricing || row.metadata?.cost;
    if (Number.isFinite(cost?.input) && Number.isFinite(cost?.output)) {
      return cost.input === 0 && cost.output === 0;
    }
    if (typeof row.is_free === 'boolean') return row.is_free;
    if (channel.provider === 'opencode' && /free/i.test(row.id)) return true;
    // The managed engine exposes only public/free models when it has no account keys.
    if (channel.managed && channel.provider === 'opencode' && this.store.get('anonymous_enabled', true)
      && !this.store.accounts().some(account => account.enabled)) return true;
    return null;
  }

  // See QWEN_FREE_PREFIXES and QWEN_FREE_MODELS: documented Qwen and partner
  // chat models count as free, while everything else stays unknown so free-only
  // mode keeps it hidden.
  qwenFree(model) {
    if (typeof model !== 'string' || !model) return null;
    const id = model.toLowerCase();
    const configured = String(this.store.get('qwen_free_models', '') || '').trim();
    if (configured) {
      const matched = configured.split(/[\n,]+/).map(part => part.trim()).filter(Boolean).some(pattern => {
        const needle = pattern.toLowerCase();
        return needle.endsWith('*') ? id.startsWith(needle.slice(0, -1)) : id === needle;
      });
      return matched ? true : null;
    }
    if (QWEN_NON_CHAT.test(model)) return null;
    return QWEN_FREE_MODELS.some(entry => entry.toLowerCase() === id)
      || QWEN_FREE_PREFIXES.some(prefix => id.startsWith(prefix)) ? true : null;
  }

  // See SILICONFLOW_FREE_MODELS: only the allowlisted ¥0 chat models count as
  // free; everything else stays unknown so free-only mode keeps it hidden.
  siliconflowFree(model) {
    if (typeof model !== 'string' || !model) return null;
    const id = model.toLowerCase();
    const configured = String(this.store.get('siliconflow_free_models', '') || '').trim();
    if (configured) {
      const matched = configured.split(/[\n,]+/).map(part => part.trim()).filter(Boolean).some(pattern => {
        const needle = pattern.toLowerCase();
        return needle.endsWith('*') ? id.startsWith(needle.slice(0, -1)) : id === needle;
      });
      return matched ? true : null;
    }
    return SILICONFLOW_FREE_MODELS.some(entry => entry.toLowerCase() === id) ? true : null;
  }

  async load(channel, force = false) {
    const source = this.source(channel);
    const memory = this.cache.get(channel.id);
    const cached = memory?.source === source ? memory : this.restore(channel, source);
    const ttl = this.store.get('models_ttl_seconds', 300) * 1000;
    if (!force && cached && Date.now() - cached.at < ttl) return cached;
    if (this.pending.has(channel.id)) {
      await this.pending.get(channel.id);
      const completed = this.cache.get(channel.id);
      if (completed?.source === source) return completed;
      return this.load(channel, force);
    }
    const job = (async () => {
      try {
        const query = channel.managed && channel.provider === 'workbuddy' ? '?refresh=1' : '';
        const response = await fetch(channel.base_url + '/v1/models' + query, {
          headers: this.engines.headers(channel), redirect: 'error', signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw new Error('Model discovery failed.');
        const body = await response.json();
        if (channel.managed && channel.provider === 'workbuddy' && body.pricing_verified === false) {
          throw new Error('Live model prices are unavailable.');
        }
        if (!Array.isArray(body.data)) throw new Error('Invalid model list.');
        if (body.data.some(row => !row || typeof row.id !== 'string' || !row.id.trim() || row.id.length > 200)) {
          throw new Error('Invalid model entry.');
        }
        const at = Date.now(), syncedAt = new Date(at).toISOString();
        const rows = [...new Map(body.data.map(row => [row.id, row])).values()];
        const result = { at, synced_at: syncedAt, source, stale: false, error: null,
          models: rows.map(row => ({
            ...row, id: channel.prefix + '/' + row.id, upstream_id: row.id,
            channel_id: channel.id, channel_name: channel.name, provider: channel.provider,
            owned_by: channel.prefix, is_free: this.freeStatus(channel, row), synced_at: syncedAt,
          })).filter(row => this.allowedByPrice(row)) };
        this.store.replaceModelCatalog(channel.id, source, syncedAt, result.models);
        this.cache.set(channel.id, result);
        return result;
      } catch {
        // A stale catalog remains visible to admins, but is labelled explicitly.
        const result = { at: Date.now(), source, synced_at: cached?.synced_at || null,
          stale: true, error: '模型目录同步失败，保留上次同步结果',
          models: cached?.models || [] };
        this.cache.set(channel.id, result);
        return result;
      } finally { this.pending.delete(channel.id); }
    })();
    this.pending.set(channel.id, job);
    return job;
  }

  disabled(model) { return this.store.get('model_disabled:' + model, false); }

  freeOnly() { return this.store.get('model_free_only', false); }

  allowedByPrice(row) { return !this.freeOnly() || row.is_free === true; }

  async requireFree(channel, upstream) {
    const result = await this.load(channel);
    if (result.stale) throw new HttpError(503, 'Free model pricing could not be verified; refresh the model catalog and retry.', 'service_unavailable');
    const row = result.models.find(model => model.upstream_id === upstream);
    if (row?.is_free !== true) {
      throw new HttpError(403, 'Only confirmed free models are allowed. Select a model from /v1/models.', 'free_only_error');
    }
    return row;
  }

  keyAllows(key, channelId, model) {
    return (!key.allowed_channels.length || key.allowed_channels.includes(channelId))
      && (!key.models.length || key.models.some(pattern => {
        if (pattern.endsWith('*')) return model.startsWith(pattern.slice(0, -1));
        return model === pattern;
      }));
  }

  async list(key = null, force = false, includeDisabled = false) {
    const channels = this.store.channels().filter(row => includeDisabled || row.enabled);
    const results = await Promise.all(channels.map(async channel => ({ channel, ...await this.load(channel, force) })));
    const models = [];
    const providers = [];
    for (const result of results) {
      const permitted = result.models.filter(row => this.allowedByPrice(row));
      providers.push({ id: result.channel.id, stale: result.stale, error: result.error, count: permitted.length,
        free_count: permitted.filter(row => row.is_free === true).length, synced_at: result.synced_at });
      for (const row of permitted) {
        const enabled = !!result.channel.enabled && !this.disabled(row.id);
        if (!includeDisabled && !enabled) continue;
        models.push({ ...row, enabled, stale: result.stale, ...(includeDisabled ? { capability: assessCapability(row) } : {}) });
      }
    }
    const targets = new Map(models.map(row => [row.id, row]));
    for (const alias of this.store.db.prepare('SELECT * FROM aliases ORDER BY name').all()) {
      const target = targets.get(alias.target);
      if (!target || (!alias.enabled && !includeDisabled) || (key && !this.keyAllows(key, target.channel_id, alias.name))) continue;
      models.push({ ...target, id: alias.name, target: alias.target, alias: true, enabled: !!alias.enabled && target.enabled });
    }
    return { object: 'list', data: key ? models.filter(row => this.keyAllows(key, row.channel_id, row.id)) : models,
      providers: key ? providers.filter(row => !key.allowed_channels.length || key.allowed_channels.includes(row.id)) : providers,
      partial: providers.some(row => row.error), free_only: this.freeOnly() };
  }

  async resolve(model, key, endpoint) {
    if (typeof model !== 'string' || !model.trim()) throw new HttpError(400, 'model is required.');
    const alias = this.store.db.prepare('SELECT * FROM aliases WHERE name=?').get(model);
    if (alias && !alias.enabled) throw new HttpError(400, 'Model alias is disabled.');
    const target = alias?.target || model;
    const separator = target.indexOf('/');
    if (separator < 1 || separator === target.length - 1) {
      throw new HttpError(400, 'Use a namespaced model from /v1/models, or create a model alias.');
    }
    const prefix = target.slice(0, separator), upstream = target.slice(separator + 1);
    const channel = this.store.channels().find(row => row.prefix === prefix && row.enabled);
    if (!channel) throw new HttpError(400, 'Channel does not exist or is disabled.');
    if (this.disabled(target)) throw new HttpError(400, 'Model is disabled.');
    if (!this.keyAllows(key, channel.id, model) || !this.keyAllows({ ...key, models: [] }, channel.id, target)) {
      throw new HttpError(403, 'This API key cannot access the selected channel or model.', 'permission_error');
    }
    if (endpoint === '/v1/systemone' && channel.provider !== 'opencode') throw new HttpError(400, 'System One requires an OpenCode channel.');
    if (endpoint === '/v1/messages/count_tokens' && channel.provider !== 'workbuddy') {
      throw new HttpError(400, 'count_tokens is available only on WorkBuddy and returns an estimate.');
    }
    const freeModel = this.freeOnly() ? await this.requireFree(channel, upstream) : null;
    const source = this.source(channel);
    const memory = this.cache.get(channel.id);
    const cached = memory?.source === source ? memory : this.restore(channel, source);
    const cachedModel = freeModel || cached?.models.find(row => row.upstream_id === upstream);
    if (cachedModel?.supported_endpoints?.length && !cachedModel.supported_endpoints.includes(endpoint)) {
      throw new HttpError(400, 'The selected model does not support this endpoint.');
    }
    return { channel, upstream, target };
  }
}
