import { HttpError } from './security.mjs';

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
      pricing_version: 2, free_only: this.freeOnly(),
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
    if (channel.provider === 'workbuddy') {
      if (channel.managed && row.pricing_source !== 'product_config') return null;
      if (row.credits !== undefined) {
        const multiplier = creditMultiplier(row.credits);
        return multiplier == null ? null : multiplier === 0;
      }
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
        models.push({ ...row, enabled, stale: result.stale });
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
