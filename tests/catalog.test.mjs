import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Catalog, creditMultiplier } from '../server/catalog.mjs';
import { createStore } from '../server/store.mjs';
import { createVault } from '../server/security.mjs';

async function fixture(t, rows, publicOnly = false, channelId = 'opencode') {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'onehub-catalog-'));
  const state = { rows, status: 200, payload: null, requests: 0 };
  const mock = http.createServer((req, res) => {
    state.requests++;
    res.writeHead(state.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(state.payload || { data: state.rows,
      ...(state.pricingVerified === undefined ? {} : { pricing_verified: state.pricingVerified }) }));
  });
  await new Promise(resolve => mock.listen(0, '127.0.0.1', resolve));
  const f = {
    state, store: createStore(directory, createVault(directory)),
    engines: { headers: () => ({}) },
  };
  f.store.db.prepare('UPDATE channels SET enabled=0 WHERE id!=?').run(channelId);
  f.store.db.prepare('UPDATE channels SET enabled=1,base_url=?,managed=? WHERE id=?')
    .run('http://127.0.0.1:' + mock.address().port, +publicOnly, channelId);
  f.catalog = new Catalog(f.store, f.engines);
  f.channel = () => f.store.channels().find(row => row.id === channelId);
  f.reopen = () => {
    f.store.close();
    f.store = createStore(directory, createVault(directory));
    f.catalog = new Catalog(f.store, f.engines);
  };
  t.after(async () => {
    f.store.close();
    mock.closeAllConnections();
    await new Promise(resolve => mock.close(resolve));
    const resolved = path.resolve(directory);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('onehub-catalog-'));
    await rm(resolved, { recursive: true, force: true });
  });
  return f;
}

test('model pricing distinguishes free, paid and unknown data in SQLite', async t => {
  const f = await fixture(t, [
    { id: 'alpha-free' },
    { id: 'zero-cost', cost: { input: 0, output: 0 } },
    { id: 'priced', cost: { input: 1, output: 0 } },
    { id: 'unknown' },
    { id: 'partial-cost', cost: { input: 0 } },
    { id: 'free-name-with-price', cost: { input: 1, output: 1 } },
  ]);
  const result = await f.catalog.list();
  assert.deepEqual(Object.fromEntries(result.data.map(row => [row.upstream_id, row.is_free])), {
    'alpha-free': true, 'zero-cost': true, priced: false, unknown: null,
    'partial-cost': null, 'free-name-with-price': false,
  });
  const rows = f.store.db.prepare('SELECT upstream_id,is_free FROM models').all();
  assert.equal(rows.length, 6);
  assert.equal(rows.find(row => row.upstream_id === 'unknown').is_free, null);
  assert.equal(rows.find(row => row.upstream_id === 'zero-cost').is_free, 1);
  assert.equal(rows.find(row => row.upstream_id === 'priced').is_free, 0);
});

test('public-only OpenCode catalogs include free models without a free suffix', async t => {
  const f = await fixture(t, [{ id: 'big-pickle' }], true);
  const result = await f.catalog.list();
  assert.equal(result.data[0].is_free, true);
  assert.equal(result.providers[0].free_count, 1);
  assert.equal(f.store.db.prepare('SELECT is_free FROM models').get().is_free, 1);
  // Account access changes invalidate the public-only snapshot.
  f.store.set('anonymous_enabled', false);
  f.state.status = 503;
  const unavailable = await f.catalog.list();
  assert.equal(unavailable.data.length, 0);
  assert.equal(unavailable.providers[0].stale, true);
});

test('catalogs and protocol restrictions survive reopening the database and failed refreshes', async t => {
  const f = await fixture(t, [{
    id: 'system-only-free', native_protocol: 'systemone',
    supported_endpoints: ['/v1/systemone'], metadata: { context_window: 4096 },
  }]);
  const first = await f.catalog.list();
  const syncedAt = first.providers[0].synced_at;
  const requests = f.state.requests;
  f.state.status = 503;
  f.reopen();
  const key = { allowed_channels: [], models: [] };
  await assert.rejects(() => f.catalog.resolve('opencode/system-only-free', key, '/v1/chat/completions'),
    /does not support this endpoint/);
  assert.equal((await f.catalog.resolve('opencode/system-only-free', key, '/v1/systemone')).upstream, 'system-only-free');
  const restored = await f.catalog.list();
  assert.equal(f.state.requests, requests, 'a fresh persisted catalog should need no network request');
  assert.equal(restored.data[0].metadata.context_window, 4096);
  assert.equal(restored.providers[0].synced_at, syncedAt);
  const stale = await f.catalog.list(null, true);
  assert.equal(stale.data.length, 1);
  assert.equal(stale.data[0].stale, true);
  assert.equal(stale.providers[0].synced_at, syncedAt);
  assert.equal(f.store.db.prepare('SELECT synced_at FROM model_catalogs').get().synced_at, syncedAt);
  f.reopen();
  assert.equal((await f.catalog.list()).data[0].id, 'opencode/system-only-free');
});

test('successful sync removes withdrawn models while preserving aliases and model controls', async t => {
  const f = await fixture(t, [{ id: 'alpha-free' }]);
  await f.catalog.list();
  f.store.set('model_disabled:opencode/alpha-free', true);
  f.store.db.prepare('INSERT INTO aliases(name,target) VALUES(?,?)').run('default', 'opencode/alpha-free');
  f.state.rows = [{ id: 'beta-free' }];
  const replaced = await f.catalog.list(null, true);
  assert.deepEqual(replaced.data.map(row => row.id), ['opencode/beta-free']);
  assert.equal(f.store.db.prepare("SELECT COUNT(*) AS n FROM models WHERE upstream_id='alpha-free'").get().n, 0);
  assert.equal(f.store.db.prepare("SELECT target FROM aliases WHERE name='default'").get().target, 'opencode/alpha-free');
  f.state.rows = [{ id: 'alpha-free' }];
  const returned = await f.catalog.list(null, true, true);
  assert.equal(returned.data.find(row => row.id === 'opencode/alpha-free').enabled, false);
});

test('malformed upstream catalogs do not overwrite a successful snapshot; valid empty catalogs do', async t => {
  const f = await fixture(t, [{ id: 'alpha-free' }, { id: 'beta-free' }]);
  const first = await f.catalog.list();
  f.state.payload = { data: [{ id: 'alpha-free' }, null] };
  const failed = await f.catalog.list(null, true);
  assert.equal(failed.partial, true);
  assert.equal(failed.data.length, 2);
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM models').get().n, 2);
  assert.equal(failed.providers[0].synced_at, first.providers[0].synced_at);
  f.state.payload = { data: [] };
  const empty = await f.catalog.list(null, true);
  assert.equal(empty.partial, false);
  assert.equal(empty.data.length, 0);
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM models').get().n, 0);
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM model_catalogs').get().n, 1);
  const requests = f.state.requests;
  f.reopen();
  assert.equal((await f.catalog.list()).data.length, 0);
  assert.equal(f.state.requests, requests);
});

test('persisted models follow channel renames but cannot leak across upstream URL changes', async t => {
  const f = await fixture(t, [{ id: 'alpha-free' }]);
  await f.catalog.list();
  f.store.db.prepare("UPDATE channels SET name='Renamed' WHERE id='opencode'").run();
  f.catalog.clear();
  const renamed = await f.catalog.list();
  assert.equal(renamed.data[0].channel_name, 'Renamed');
  f.store.db.prepare("UPDATE channels SET base_url=base_url||'/changed' WHERE id='opencode'").run();
  f.state.status = 503;
  f.catalog.clear();
  const changed = await f.catalog.list();
  assert.equal(changed.data.length, 0);
  assert.equal(changed.partial, true);
  f.reopen();
  assert.equal((await f.catalog.list()).data.length, 0);
});

test('concurrent syncs share one upstream fetch and duplicate IDs are stored once', async t => {
  const f = await fixture(t, [{ id: 'alpha-free', max_output: 10 }, { id: 'alpha-free', max_output: 20 }]);
  const results = await Promise.all(Array.from({ length: 3 }, () => f.catalog.load(f.channel(), true)));
  assert.equal(f.state.requests, 1);
  assert.ok(results.every(row => row.models.length === 1 && row.models[0].max_output === 20));
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM models').get().n, 1);
});

test('credit multipliers accept explicit zero and reject missing or malformed prices', () => {
  for (const value of [0, 'x0.00', 'X0', '0', '0.00x', '×0.00', ' x0.00 credits ']) {
    assert.equal(creditMultiplier(value), 0);
  }
  assert.equal(creditMultiplier('x0.11'), 0.11);
  for (const value of [undefined, null, false, '', 'free', '-0.1', 'x0.00x', 'x0.00 discounted', Infinity, '0'.repeat(100)]) {
    assert.equal(creditMultiplier(value), null);
  }
});

test('WorkBuddy uses verified regional multipliers instead of historical prices or generic token estimates', async t => {
  const f = await fixture(t, [
    { id: 'hy3', credits: 'x0.00', pricing_source: 'product_config' },
    { id: 'hy4-preview-f', credits: '0.00x', pricing_source: 'product_config', quota_remaining: 0, rate_limited: true },
    { id: 'hy4-preview', credits: 'x0.29', pricing_source: 'product_config', cost: { input: 0, output: 0 }, is_free: true },
    { id: 'bundled-free', credits: 'x0.00' },
    { id: 'unknown', credits: '', pricing_source: 'product_config' },
  ], true, 'workbuddy-cn');
  const result = await f.catalog.list();
  assert.deepEqual(Object.fromEntries(result.data.map(row => [row.upstream_id, row.is_free])), {
    hy3: true, 'hy4-preview-f': true, 'hy4-preview': false, 'bundled-free': null, unknown: null,
  });
  assert.equal(result.data.find(row => row.upstream_id === 'hy4-preview-f').rate_limited, true);
  assert.equal(f.catalog.freeStatus({ provider: 'workbuddy', managed: true, realm: 'intl' },
    { id: 'deepseek-v4.1-flash', credits: 'x0.00', pricing_source: 'product_config' }), true);
  assert.equal(f.catalog.freeStatus(f.channel(),
    { id: 'deepseek-v4.1-flash', credits: 'x0.11', pricing_source: 'product_config' }), false);
});

test('free-only catalogs persist only free models and reject direct IDs, removed models and paid alias targets', async t => {
  const f = await fixture(t, [
    { id: 'hy3', credits: 'x0.00', pricing_source: 'product_config' },
    { id: 'hy4-preview-f', credits: 'x0.00', pricing_source: 'product_config', rate_limited: true },
    { id: 'hy4-preview', credits: 'x0.29', pricing_source: 'product_config' },
    { id: 'unknown' },
  ], true, 'workbuddy-cn');
  f.store.set('model_free_only', true);
  f.store.db.prepare('INSERT INTO aliases(name,target) VALUES(?,?)').run('free-hy4', 'codebuddy/hy4-preview-f');
  f.store.db.prepare('INSERT INTO aliases(name,target) VALUES(?,?)').run('paid-hy4', 'codebuddy/hy4-preview');
  const result = await f.catalog.list(null, true, true);
  assert.equal(result.free_only, true);
  assert.deepEqual(result.data.map(row => row.id), ['codebuddy/hy3', 'codebuddy/hy4-preview-f', 'free-hy4']);
  assert.equal(result.providers.find(row => row.id === 'workbuddy-cn').count, 2);
  assert.equal(f.store.db.prepare('SELECT COUNT(*) AS n FROM models WHERE is_free IS NOT 1').get().n, 0);
  const key = { allowed_channels: [], models: [] };
  for (const id of ['codebuddy/hy4-preview', 'codebuddy/hy4-preview-x', 'codebuddy/unknown', 'paid-hy4']) {
    await assert.rejects(() => f.catalog.resolve(id, key, '/v1/chat/completions'),
      error => error.status === 403 && error.type === 'free_only_error');
  }
  assert.equal((await f.catalog.resolve('free-hy4', key, '/v1/chat/completions')).upstream, 'hy4-preview-f');
  f.reopen();
  assert.equal(f.store.get('model_free_only'), true);
  assert.equal((await f.catalog.resolve('codebuddy/hy4-preview-f', key, '/v1/chat/completions')).upstream, 'hy4-preview-f');
  // Expired pricing is refreshed on the inference path, even without a list request.
  f.state.rows[1].credits = 'x0.29';
  f.catalog.cache.get('workbuddy-cn').at -= 301000;
  await assert.rejects(() => f.catalog.resolve('free-hy4', key, '/v1/chat/completions'), /Only confirmed free models/);
  assert.equal(f.store.db.prepare("SELECT COUNT(*) AS n FROM models WHERE upstream_id='hy4-preview-f'").get().n, 0);
  assert.ok(!(await f.catalog.list()).data.some(row => row.id === 'free-hy4'));
});

test('free-only routing keeps a stale free catalog visible but blocks calls when live pricing cannot be verified', async t => {
  const f = await fixture(t, [{ id: 'hy3', credits: 'x0.00', pricing_source: 'product_config' }], true, 'workbuddy-cn');
  f.store.set('model_free_only', true);
  await f.catalog.list();
  f.state.pricingVerified = false;
  const stale = await f.catalog.list(null, true, true);
  assert.equal(stale.partial, true);
  assert.equal(stale.data[0].is_free, true);
  assert.equal(stale.data[0].stale, true);
  await assert.rejects(() => f.catalog.resolve('codebuddy/hy3', { allowed_channels: [], models: [] }, '/v1/chat/completions'),
    error => error.status === 503);
  f.state.pricingVerified = true;
  await f.catalog.list(null, true);
  assert.equal((await f.catalog.resolve('codebuddy/hy3', { allowed_channels: [], models: [] }, '/v1/chat/completions')).upstream, 'hy3');
});

test('Qwen free status includes documented partner models without opening hosted paid aliases', () => {
  const catalog = new Catalog({ channels: () => [], get: () => null }, {});
  const channel = { provider: 'qwen' };
  for (const id of [
    'deepseek-v4.1-flash', 'deepseek-v4-pro', 'deepseek-v4-pro-0813',
    'deepseek-v4-flash-0731', 'deepseek-r1-distill-llama-70b',
    'kimi-k3', 'kimi-k2.7-code', 'kimi-k2.6', 'kimi-k2.5',
    'glm-5.3', 'glm-5.2', 'glm-5.1', 'glm-5',
    'MiniMax-M2.5', 'tongyi-xiaomi-analysis-flash', 'tongyi-xiaomi-analysis-pro',
  ]) assert.equal(catalog.freeStatus(channel, { id }), true, id);
  for (const id of [
    'vanchin/deepseek-v4.1-flash', 'siliconflow/deepseek-v3.2',
    'ZHIPU/GLM-5.3', 'kimi/kimi-k3', 'MiniMax/MiniMax-M2.5',
    'glm-5.2-fast-preview', 'gui-plus', 'qwen3.7-text-embedding',
  ]) assert.equal(catalog.freeStatus(channel, { id }), null, id);
});
