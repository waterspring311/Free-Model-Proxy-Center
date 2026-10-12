import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { digest, mask, randomToken } from './security.mjs';

export function createStore(directory, vault) {
  mkdirSync(directory, { recursive: true });
  const db = new DatabaseSync(path.join(directory, 'onehub.sqlite'));
  db.exec(`
    PRAGMA journal_mode=WAL;
    PRAGMA foreign_keys=ON;
    PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL,
      secret TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, provider TEXT NOT NULL,
      prefix TEXT NOT NULL UNIQUE, base_url TEXT NOT NULL, secret TEXT NOT NULL DEFAULT '',
      realm TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 1,
      priority INTEGER NOT NULL DEFAULT 10, max_concurrency INTEGER NOT NULL DEFAULT 8,
      managed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, hash TEXT NOT NULL UNIQUE,
      display TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1,
      allowed_channels TEXT NOT NULL DEFAULT '[]', models TEXT NOT NULL DEFAULT '[]',
      rpm INTEGER NOT NULL DEFAULT 60, daily_tokens INTEGER NOT NULL DEFAULT 0,
      expires_at TEXT, created_at TEXT NOT NULL, last_used_at TEXT
    );
    CREATE TABLE IF NOT EXISTS aliases (
      name TEXT PRIMARY KEY, target TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS model_catalogs (
      channel_id TEXT PRIMARY KEY REFERENCES channels(id) ON DELETE CASCADE,
      source TEXT NOT NULL, synced_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY, channel_id TEXT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
      upstream_id TEXT NOT NULL, is_free INTEGER CHECK(is_free IN (0,1)),
      metadata TEXT NOT NULL, synced_at TEXT NOT NULL,
      UNIQUE(channel_id,upstream_id)
    );
    CREATE INDEX IF NOT EXISTS models_channel_free ON models(channel_id,is_free);
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY, at TEXT NOT NULL, key_id TEXT, key_name TEXT,
      channel_id TEXT, channel_name TEXT, model TEXT, upstream_model TEXT,
      endpoint TEXT NOT NULL, status INTEGER NOT NULL, duration_ms INTEGER NOT NULL,
      first_ms INTEGER, input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0, cached_tokens INTEGER NOT NULL DEFAULT 0,
      usage_reported INTEGER NOT NULL DEFAULT 0, stream INTEGER NOT NULL DEFAULT 0,
      outcome TEXT NOT NULL DEFAULT 'success', error TEXT
    );
    CREATE INDEX IF NOT EXISTS requests_at ON requests(at);
    CREATE INDEX IF NOT EXISTS requests_key_at ON requests(key_id, at);
    CREATE INDEX IF NOT EXISTS requests_channel_model_at ON requests(channel_id, upstream_model, at);
    CREATE TABLE IF NOT EXISTS model_probes (
      model_id TEXT PRIMARY KEY, channel_id TEXT, at TEXT NOT NULL, ok INTEGER NOT NULL,
      status INTEGER, latency_ms INTEGER, error TEXT, history TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS probe_samples (
      id INTEGER PRIMARY KEY, model_id TEXT, channel_id TEXT, at TEXT NOT NULL,
      ok INTEGER NOT NULL, status INTEGER, latency_ms INTEGER
    );
    CREATE INDEX IF NOT EXISTS probe_samples_channel_at ON probe_samples(channel_id, at);
    CREATE TABLE IF NOT EXISTS audit (
      id INTEGER PRIMARY KEY, at TEXT NOT NULL, action TEXT NOT NULL, detail TEXT NOT NULL
    );
  `);
  // Older databases predate the captured upstream error column.
  if (!db.prepare('PRAGMA table_info(requests)').all().some(row => row.name === 'error')) {
    db.exec('ALTER TABLE requests ADD COLUMN error TEXT');
  }
  const store = {
    db, vault, directory,
    get(key, fallback = null) {
      const row = db.prepare('SELECT value FROM settings WHERE key=?').get(key);
      return row ? JSON.parse(row.value) : fallback;
    },
    set(key, value) {
      db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, JSON.stringify(value));
    },
    secret(key) {
      return vault.decrypt(store.get(key, ''));
    },
    setSecret(key, value) {
      store.set(key, vault.encrypt(value));
    },
    accounts() {
      return db.prepare('SELECT * FROM accounts ORDER BY created_at').all();
    },
    channels() {
      return db.prepare('SELECT * FROM channels ORDER BY priority DESC,created_at').all();
    },
    modelCatalog(channelId, source) {
      const row = db.prepare('SELECT * FROM model_catalogs WHERE channel_id=? AND source=?').get(channelId, source);
      if (!row) return null;
      return {
        synced_at: row.synced_at,
        models: db.prepare('SELECT metadata FROM models WHERE channel_id=? ORDER BY id')
          .all(channelId).map(model => JSON.parse(model.metadata)),
      };
    },
    replaceModelCatalog(channelId, source, syncedAt, models) {
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('DELETE FROM models WHERE channel_id=?').run(channelId);
        const insert = db.prepare(`INSERT INTO models(id,channel_id,upstream_id,is_free,metadata,synced_at)
          VALUES(?,?,?,?,?,?)`);
        for (const model of models) {
          insert.run(model.id, channelId, model.upstream_id, model.is_free == null ? null : +model.is_free,
            JSON.stringify(model), syncedAt);
        }
        db.prepare(`INSERT INTO model_catalogs(channel_id,source,synced_at) VALUES(?,?,?)
          ON CONFLICT(channel_id) DO UPDATE SET source=excluded.source,synced_at=excluded.synced_at`)
          .run(channelId, source, syncedAt);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    keys() {
      return db.prepare('SELECT * FROM api_keys ORDER BY created_at DESC').all().map(row => ({
        ...row, hash: undefined, enabled: !!row.enabled,
        allowed_channels: JSON.parse(row.allowed_channels), models: JSON.parse(row.models),
      }));
    },
    createKey(input) {
      const id = randomToken('key_', 12);
      const key = randomToken('sk-onehub-');
      db.prepare(`INSERT INTO api_keys(id,name,hash,display,allowed_channels,models,rpm,daily_tokens,expires_at,created_at)
        VALUES(?,?,?,?,?,?,?,?,?,?)`).run(id, input.name, digest(key), mask(key),
        JSON.stringify(input.allowed_channels || []), JSON.stringify(input.models || []),
        input.rpm ?? 60, input.daily_tokens ?? 0, input.expires_at || null, new Date().toISOString());
      return { id, key };
    },
    matchKey(key) {
      const row = db.prepare('SELECT * FROM api_keys WHERE hash=? AND enabled=1').get(digest(key));
      if (!row || (row.expires_at && Date.parse(row.expires_at) <= Date.now())) return null;
      return { ...row, allowed_channels: JSON.parse(row.allowed_channels), models: JSON.parse(row.models) };
    },
    record(row) {
      const columns = ['id', 'at', 'key_id', 'key_name', 'channel_id', 'channel_name', 'model',
        'upstream_model', 'endpoint', 'status', 'duration_ms', 'first_ms', 'input_tokens',
        'output_tokens', 'cached_tokens', 'usage_reported', 'stream', 'outcome', 'error'];
      db.prepare(`INSERT INTO requests(${columns.join(',')}) VALUES(${columns.map(() => '?').join(',')})`)
        .run(...columns.map(column => row[column] ?? null));
      if (row.key_id) db.prepare('UPDATE api_keys SET last_used_at=? WHERE id=?').run(row.at, row.key_id);
    },
    probes() {
      return db.prepare('SELECT * FROM model_probes ORDER BY model_id').all().map(row => ({
        ...row, ok: !!row.ok, history: JSON.parse(row.history || '[]'),
      }));
    },
    saveProbe(row) {
      const previous = db.prepare('SELECT history FROM model_probes WHERE model_id=?').get(row.model_id);
      const history = (previous ? JSON.parse(previous.history || '[]') : []).slice(-11);
      history.push({ at: row.at, ok: row.ok ? 1 : 0, ms: row.latency_ms ?? null });
      db.prepare(`INSERT INTO model_probes(model_id,channel_id,at,ok,status,latency_ms,error,history)
        VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(model_id) DO UPDATE SET channel_id=excluded.channel_id,
        at=excluded.at,ok=excluded.ok,status=excluded.status,latency_ms=excluded.latency_ms,
        error=excluded.error,history=excluded.history`)
        .run(row.model_id, row.channel_id, row.at, row.ok ? 1 : 0, row.status ?? null,
          row.latency_ms ?? null, row.error ? String(row.error).slice(0, 300) : null, JSON.stringify(history));
      db.prepare(`INSERT INTO probe_samples(model_id,channel_id,at,ok,status,latency_ms) VALUES(?,?,?,?,?,?)`)
        .run(row.model_id, row.channel_id ?? null, row.at, row.ok ? 1 : 0, row.status ?? null, row.latency_ms ?? null);
      // Keep the per-minute availability series bounded (48h is plenty for the console).
      db.prepare('DELETE FROM probe_samples WHERE at < ?').run(new Date(Date.now() - 48 * 3600 * 1000).toISOString());
    },
    audit(action, detail) {
      db.prepare('INSERT INTO audit(at,action,detail) VALUES(?,?,?)').run(new Date().toISOString(), action, String(detail));
    },
    close() { db.close(); },
  };
  if (!store.get('initialized')) {
    store.set('username', 'admin');
    store.set('anonymous_enabled', true);
    store.set('timeout_seconds', 300);
    store.set('models_ttl_seconds', 300);
    store.set('model_free_only', false);
    store.set('probe_enabled', true);
    store.set('probe_interval_seconds', 60);
    store.set('probe_openrouter_seconds', 3600);
    store.set('probe_qwen_seconds', 3600);
    store.set('probe_siliconflow_seconds', 3600);
    store.set('probe_timeout_seconds', 30);
    store.set('probe_scope', 'free');
    for (const key of ['opencode_api_key', 'opencode_panel_password', 'workbuddy_api_key', 'workbuddy_panel_password']) {
      store.setSecret(key, randomToken('internal-', 24));
    }
    const now = new Date().toISOString();
    for (const row of [
      ['opencode', 'OpenCode Zen / Go', 'opencode', 'opencode', 'http://127.0.0.1:8080', '', ''],
      ['workbuddy-intl', 'WorkBuddy 国际版', 'workbuddy', 'workbuddy', 'http://127.0.0.1:8788', '', 'intl'],
      ['workbuddy-cn', 'CodeBuddy 国内版', 'workbuddy', 'codebuddy', 'http://127.0.0.1:8788', '', 'cn'],
    ]) {
      db.prepare(`INSERT INTO channels(id,name,provider,prefix,base_url,secret,realm,managed,created_at)
        VALUES(?,?,?,?,?,?,?,1,?)`).run(...row, now);
    }
    store.set('initialized', true);
  }
  return store;
}
