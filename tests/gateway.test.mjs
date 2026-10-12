import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import http from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server/app.mjs';
import { UsageReader, dayStart } from '../server/usage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let app, mock, directory, base, allKey, syncs = 0;
const seen = [], jobs = new Map(), failures = new Set(), wbCalls = [];
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
async function json(url, options = {}) {
  const response = await fetch(base + url, options);
  return { response, body: await response.json() };
}
function management(url, method = 'GET', body, headers = {}) {
  return json('/api' + url, { method, headers: { 'Content-Type': 'application/json', ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function createKey(body = {}) {
  const result = await management('/keys', 'POST', { name: 'Test key', ...body });
  assert.equal(result.response.status, 201);
  return result.body;
}
function infer(body, key = allKey.key, endpoint = '/v1/chat/completions') {
  return fetch(base + endpoint, { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json',
    'X-Realm': 'attacker-override', 'Anthropic-Version': '2023-06-01' }, body: JSON.stringify(body) });
}

before(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), 'onehub-test-'));
  mock = http.createServer(async (req, res) => {
    if (req.url.split('?')[0] === '/v1/models') {
      const realm = req.headers['x-realm'] || 'opencode';
      if (failures.has(realm)) { res.writeHead(503); res.end('{}'); return; }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: [
        { id: 'shared-model', cost: { input: 0, output: 0 }, credits: 'x0.00', pricing_source: 'product_config' },
        { id: 'shared-model:free', pricing: { prompt: '0', completion: '0' } },
        { id: 'hold' }, { id: 'error-model' },
        { id: 'paid-model', cost: { input: 1, output: 1 }, credits: 'x0.29', pricing_source: 'product_config' },
      ] }));
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks));
    seen.push({ body, headers: req.headers, url: req.url });
    if (req.url === '/v1/responses' && !req.headers['x-realm'] && body.tools?.some(tool => tool.name === 'apply_patch')) {
      if (body.tools.some(tool => tool.type !== 'function') || body.input?.some?.(item => /custom_tool/.test(item.type))) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'must be a function tool' } })); return;
      }
      const patch = '*** Begin Patch\n*** Add File: 示例.txt\n+你好\n*** End Patch\n';
      const namespaced = body.tools.find(tool => tool.name.startsWith('oh_'));
      const replay = body.input?.some?.(item => item.type === 'function_call_output');
      const output = replay
        ? [{ id: 'msg_done', type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: 'done', annotations: [] }] }]
        : [
          { id: 'fc_patch', type: 'function_call', name: 'apply_patch', call_id: 'c_patch', arguments: JSON.stringify({ input: patch }), status: 'completed' },
          { id: 'fc_echo', type: 'function_call', name: namespaced.name, call_id: 'c_echo', arguments: '{"value":"hello"}', status: 'completed' },
        ];
      const response = { id: 'resp_test', object: 'response', status: 'completed', output, usage: { input_tokens: 17, output_tokens: 5, total_tokens: 22 } };
      if (!body.stream) {
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(response)); return;
      }
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      const event = value => res.write('event: ' + value.type + '\ndata: ' + JSON.stringify(value) + '\n\n');
      event({ type: 'response.created', response: { ...response, status: 'in_progress', output: [] } });
      output.forEach((item, output_index) => {
        event({ type: 'response.output_item.added', output_index, item: { ...item, status: 'in_progress', ...(item.type === 'function_call' ? { arguments: '' } : {}) } });
        if (item.type === 'function_call') {
          event({ type: 'response.function_call_arguments.delta', output_index, item_id: item.id, delta: item.arguments });
          event({ type: 'response.function_call_arguments.done', output_index, item_id: item.id, arguments: item.arguments });
        }
        event({ type: 'response.output_item.done', output_index, item });
      });
      event({ type: 'response.completed', response }); res.end(); return;
    }
    if (body.model === 'error-model') {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '9' });
      res.end(JSON.stringify({ error: { message: 'Upstream test limit' } })); return;
    }
    if (body.model === 'hold') {
      jobs.get('entered')?.resolve();
      await jobs.get('release')?.promise;
    }
    if (body.stream) {
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      const event = `data: ${JSON.stringify({ choices: [{ delta: { content: '你' } }] })}\n\n`;
      const bytes = Buffer.from(event), at = bytes.indexOf(Buffer.from('你'));
      res.write(bytes.subarray(0, at + 1));
      res.write(bytes.subarray(at + 1));
      await jobs.get('stream')?.promise;
      res.write('data: ' + JSON.stringify({ choices: [], usage: { prompt_tokens: 10, completion_tokens: 5, prompt_tokens_details: { cached_tokens: 3 } } }) + '\r\n\r\n');
      res.end('data: [DONE]\n\n');
    } else {
      const usage = req.url === '/v1/messages' ? { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 3 }
        : { prompt_tokens: 10, completion_tokens: 5, prompt_tokens_details: { cached_tokens: 3 } };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ model: body.model, usage, choices: [{ message: { content: 'ok' } }] }));
    }
  });
  await new Promise(resolve => mock.listen(0, '127.0.0.1', resolve));
  const engines = {
    states: { opencode: { status: 'running' }, workbuddy: { status: 'running' } },
    start: async () => {}, stop: async () => {}, restart: async provider => ({ status: 'starting', provider }),
    headers: channel => ({ Authorization: 'Bearer upstream-' + channel.provider, ...(channel.realm ? { 'X-Realm': channel.realm } : {}) }),
    key: channel => 'upstream-' + channel.provider,
    health: async () => ({ status: 'online', ready: true, latency_ms: 1 }),
    syncOpenCode: async () => { syncs++; },
    accounts: async () => ({ accounts: [
      { id: 'public', name: '公开通道', provider: 'opencode', enabled: app.store.get('anonymous_enabled') },
      ...app.store.accounts().map(row => ({ id: row.id, name: row.name, provider: 'opencode', enabled: !!row.enabled })),
    ] }),
    admin: async (provider, endpoint, method, body) => {
      wbCalls.push({ provider, endpoint, method, body });
      if (endpoint.endsWith('/start')) return { state: 'test-oauth-state', authUrl: 'https://example.com/authorize' };
      if (endpoint.includes('/poll')) return { status: 'pending', accessToken: 'never-expose-this' };
      if (endpoint.endsWith('/import')) return { count: 1, result: { added: ['test'], skipped: [], invalid: [] }, secret: 'never-expose-this' };
      if (endpoint.endsWith('/refresh') || endpoint.endsWith('/credits')) return {
        results: body.uid === 'missing' ? [] : [{ uid: body.uid, ok: !failures.has('account-operation'),
          error: 'never-expose-upstream-token-or-error', accessToken: 'never-expose-this' }],
      };
      return { ok: true };
    },
  };
  app = createApp({ root, directory, engines });
  app.store.db.prepare('UPDATE channels SET base_url=?').run('http://127.0.0.1:' + mock.address().port);
  await app.start(0);
  base = 'http://127.0.0.1:' + app.server.address().port;
});

after(async () => {
  for (const job of jobs.values()) job.resolve();
  await app?.close();
  mock?.closeAllConnections();
  if (mock) await new Promise(resolve => mock.close(resolve));
  const resolved = path.resolve(directory);
  assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
  assert.ok(path.basename(resolved).startsWith('onehub-test-'));
  await rm(resolved, { recursive: true, force: true });
});

test('management API needs no login and still rejects cross-origin writes', async () => {
  const session = await json('/api/auth/session');
  assert.equal(session.response.status, 200);
  assert.equal(session.body.authenticated, true);
  assert.equal(session.body.setup_required, false);
  assert.equal(session.body.username, 'admin');
  assert.equal((await management('/overview')).response.status, 200);
  assert.equal((await management('/keys', 'POST', {}, { Origin: 'https://outside.example' })).response.status, 403);
  allKey = await createKey();
  assert.ok(allKey.key.startsWith('sk-onehub-'));
  const rows = await management('/keys');
  assert.equal(rows.body.keys[0].hash, undefined);
  assert.ok(!JSON.stringify(rows.body).includes(allKey.key));
});

test('same-named models stay separated by provider and realm', async () => {
  const result = await json('/v1/models', { headers: { Authorization: 'Bearer ' + allKey.key } });
  assert.equal(result.response.status, 200);
  for (const prefix of ['opencode', 'workbuddy', 'codebuddy']) assert.ok(result.body.data.some(row => row.id === prefix + '/shared-model'));
  for (const prefix of ['opencode', 'workbuddy', 'codebuddy']) {
    const response = await infer({ model: prefix + '/shared-model', messages: [{ role: 'user', content: 'hello' }] });
    assert.equal(response.status, 200); await response.json();
    const latest = seen.at(-1);
    assert.equal(latest.body.model, 'shared-model');
    assert.equal(latest.headers.authorization, 'Bearer upstream-' + (prefix === 'opencode' ? 'opencode' : 'workbuddy'));
    assert.equal(latest.headers['x-realm'], prefix === 'codebuddy' ? 'cn' : prefix === 'workbuddy' ? 'intl' : undefined);
    assert.notEqual(latest.headers.authorization, 'Bearer ' + allKey.key);
  }
});

test('streaming is delivered before the upstream finishes and records terminal usage', async () => {
  const finish = deferred(); jobs.set('stream', finish);
  try {
    const response = await infer({ model: 'opencode/shared-model', stream: true, messages: [] });
    const reader = response.body.getReader();
    const first = await reader.read();
    assert.equal(first.done, false);
    assert.match(Buffer.from(first.value).toString(), /data:/);
    finish.resolve();
    let text = Buffer.from(first.value).toString();
    for (;;) { const chunk = await reader.read(); if (chunk.done) break; text += Buffer.from(chunk.value).toString(); }
    assert.ok(text.includes('[DONE]'));
    const row = app.store.db.prepare('SELECT * FROM requests WHERE id=?').get(response.headers.get('x-request-id'));
    assert.equal(row.outcome, 'success'); assert.equal(row.stream, 1); assert.equal(row.input_tokens, 10);
    assert.equal(row.output_tokens, 5); assert.equal(row.cached_tokens, 3); assert.equal(row.usage_reported, 1);
  } finally { finish.resolve(); jobs.delete('stream'); }
});

test('Responses and Anthropic endpoints preserve payloads and auth headers', async () => {
  for (const endpoint of ['/v1/responses', '/v1/messages']) {
    const response = await infer({ model: 'workbuddy/shared-model', input: 'test', max_tokens: 20 }, allKey.key, endpoint);
    assert.equal(response.status, 200); await response.json();
    assert.equal(seen.at(-1).url, endpoint);
    assert.equal(seen.at(-1).headers['anthropic-version'], '2023-06-01');
  }
  const unsupported = await infer({ model: 'opencode/shared-model' }, allKey.key, '/v1/messages/count_tokens');
  assert.equal(unsupported.status, 400); assert.equal((await unsupported.json()).type, 'error');
});

test('Codex custom and namespace tools work through the gateway in JSON, SSE and replay', async () => {
  const tools = [
    ...Array.from({ length: 7 }, (_, i) => ({ type: 'function', name: 'ordinary_' + i, parameters: { type: 'object', properties: {} } })),
    { type: 'custom', name: 'apply_patch', format: { type: 'grammar', syntax: 'lark', definition: 'start: /.+/s' } },
    { type: 'namespace', name: 'client_tools', tools: [{ type: 'function', name: 'echo', parameters: { type: 'object', properties: { value: { type: 'string' } } } }] },
  ];
  const input = { model: 'opencode/shared-model', input: [{ role: 'user', content: 'edit' }], tools };
  const response = await infer(input, allKey.key, '/v1/responses');
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.ok(seen.at(-1).body.tools.every(tool => tool.type === 'function'));
  assert.equal(result.output[0].type, 'custom_tool_call');
  assert.match(result.output[0].input, /你好/);
  assert.equal(result.output[1].name, 'echo');
  assert.equal(result.output[1].namespace, 'client_tools');
  const replay = await infer({ ...input, input: [
    ...input.input, ...result.output,
    { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'intermediate text' }] },
    { type: 'web_search_call', id: 'ws_replayed', status: 'completed',
      action: { type: 'search', query: 'compatibility probe' } },
    { type: 'custom_tool_call_output', call_id: 'c_patch', output: 'Success' },
    { type: 'function_call_output', call_id: 'c_echo', output: 'hello' },
  ] }, allKey.key, '/v1/responses');
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).output[0].content[0].text, 'done');
  assert.equal(seen.at(-1).body.input[1].type, 'function_call');
  assert.equal(JSON.parse(seen.at(-1).body.input[1].arguments).input, result.output[0].input);
  assert.equal(seen.at(-1).body.input[2].namespace, undefined);
  assert.ok(!seen.at(-1).body.input.some(item => item.type === 'web_search_call'));
  assert.equal(seen.at(-1).body.input.at(-1).type, 'message');
  assert.equal(seen.at(-1).body.input.at(-1).role, 'assistant');
  const stream = await infer({ ...input, stream: true }, allKey.key, '/v1/responses');
  assert.equal(stream.status, 200);
  const text = await stream.text();
  assert.match(text, /response.custom_tool_call_input.delta/);
  assert.match(text, /"namespace":"client_tools"/);
  assert.ok(!text.split('\n').some(line => line.includes('response.function_call_arguments') && line.includes('fc_patch')));
  const row = app.store.db.prepare('SELECT * FROM requests WHERE id=?').get(stream.headers.get('x-request-id'));
  assert.equal(row.input_tokens, 17); assert.equal(row.output_tokens, 5); assert.equal(row.usage_reported, 1);
});

test('WorkBuddy tools pass through and OpenCode built-in search errors remain actionable', async () => {
  const tools = [{ type: 'custom', name: 'edit' }, { type: 'namespace', name: 'client', tools: [{ type: 'function', name: 'echo' }] }];
  const forwarded = await infer({ model: 'workbuddy/shared-model', tools, input: 'test' }, allKey.key, '/v1/responses');
  assert.equal(forwarded.status, 200); await forwarded.json();
  assert.deepEqual(seen.at(-1).body.tools, tools);
  const before = seen.length;
  const unsupported = await infer({ model: 'opencode/shared-model', tools: [{ type: 'web_search' }], input: 'test' }, allKey.key, '/v1/responses');
  assert.equal(unsupported.status, 400);
  assert.match((await unsupported.json()).error.message, /web_search = "disabled"/);
  assert.equal(seen.length, before);
});

test('channel and model allowlists include alias-only keys without allowing targets', async () => {
  await management('/aliases', 'POST', { name: 'default', target: 'opencode/shared-model' });
  const restricted = await createKey({ allowed_channels: ['opencode'], models: ['default'] });
  const list = await json('/v1/models', { headers: { Authorization: 'Bearer ' + restricted.key } });
  assert.deepEqual(list.body.data.map(row => row.id), ['default']);
  assert.equal(list.body.providers.length, 1);
  const allowed = await infer({ model: 'default' }, restricted.key);
  assert.equal(allowed.status, 200); await allowed.text();
  assert.equal((await infer({ model: 'opencode/shared-model' }, restricted.key)).status, 403);
  assert.equal((await infer({ model: 'workbuddy/shared-model' }, restricted.key)).status, 403);
  assert.equal((await infer({ model: 'shared-model' }, allKey.key)).status, 400);
  await management('/models/toggle', 'POST', { model: 'opencode/shared-model', enabled: false });
  assert.equal((await infer({ model: 'default' }, restricted.key)).status, 400);
  assert.equal((await json('/v1/models', { headers: { Authorization: 'Bearer ' + restricted.key } })).body.data.length, 0);
  await management('/models/toggle', 'POST', { model: 'opencode/shared-model', enabled: true });
});

test('rate and daily usage limits block excess traffic', async () => {
  const limited = await createKey({ rpm: 1 });
  const first = await infer({ model: 'opencode/shared-model' }, limited.key);
  assert.equal(first.status, 200); await first.text();
  const second = await infer({ model: 'opencode/shared-model' }, limited.key);
  assert.equal(second.status, 429); assert.equal(second.headers.get('retry-after'), '60'); await second.text();
  const daily = await createKey({ daily_tokens: 10 });
  const initial = await infer({ model: 'opencode/shared-model' }, daily.key);
  assert.equal(initial.status, 200); await initial.text();
  const blocked = await infer({ model: 'opencode/shared-model' }, daily.key);
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).error.message, /daily token/);
});

test('concurrency is released when an upstream request completes', async () => {
  const entered = deferred(), release = deferred(); jobs.set('entered', entered); jobs.set('release', release);
  await management('/channels/opencode', 'PATCH', { max_concurrency: 1 });
  const first = infer({ model: 'opencode/hold' });
  try {
    await entered.promise;
    const blocked = await infer({ model: 'opencode/shared-model' });
    assert.equal(blocked.status, 503); await blocked.text();
    release.resolve();
    const done = await first; assert.equal(done.status, 200); await done.text();
    const after = await infer({ model: 'opencode/shared-model' });
    assert.equal(after.status, 200); await after.text();
  } finally {
    release.resolve(); jobs.delete('entered'); jobs.delete('release');
    await management('/channels/opencode', 'PATCH', { max_concurrency: 8 });
  }
});

test('upstream HTTP errors and retry headers are preserved and logged', async () => {
  const response = await infer({ model: 'workbuddy/error-model' });
  assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '9');
  assert.equal((await response.json()).error.message, 'Upstream test limit');
  const logs = await management('/requests?errors=1&channel=workbuddy-intl');
  const failed = logs.body.rows.find(row => row.status === 429 && row.outcome === 'upstream_error');
  assert.ok(failed);
  // The console keeps the upstream error body, not just the status code.
  assert.match(failed.error, /Upstream test limit/);
  const overview = await management('/overview');
  assert.ok(overview.body.summary.requests >= 1);
  assert.ok(overview.body.summary.input_tokens >= 10);
});

test('channel status board aggregates per-channel health, usage and errors', async () => {
  const { response, body } = await management('/channel-status');
  assert.equal(response.status, 200);
  assert.ok(body.channels.length >= 3);
  assert.equal(body.totals.channels, body.channels.length);
  assert.ok(body.totals.requests >= 1);
  const intl = body.channels.find(row => row.id === 'workbuddy-intl');
  assert.equal(intl.today.failures >= 1, true);
  assert.equal(intl.last_error.status, 429);
  assert.equal(intl.last_error.outcome, 'upstream_error');
  assert.equal(intl.hourly.length, 24);
  assert.equal(intl.hourly.every(row => /^\d{2}$/.test(row.hour)), true);
  assert.equal(intl.hourly.reduce((sum, row) => sum + row.requests, 0), intl.today.requests);
  for (const row of body.channels) {
    // The latest error is reported exactly when the channel recorded failures today.
    assert.equal(row.last_error === null, row.today.failures === 0, row.id);
    assert.equal(row.hourly.reduce((sum, bucket) => sum + bucket.failures, 0), row.today.failures, row.id);
  }
  const opencode = body.channels.find(row => row.id === 'opencode');
  assert.equal(opencode.today.requests >= 1, true);
  assert.ok(body.totals.input_tokens >= 10);
});

test('model prober records per-model results and feeds the status board', async () => {
  const { ModelProber } = await import('../server/probes.mjs');
  const prober = new ModelProber(app.store, app.catalog, app.engines);
  const summary = await prober.run({ force: true, gapMs: 0 });
  assert.ok(summary.total >= 1, JSON.stringify(summary));
  const first = prober.status();
  // Free models consume no credits, so they are probed on every channel. Paid
  // models on account-backed channels are skipped unless probe_account_channels
  // is enabled.
  assert.ok(first.results.some(row => row.channel_id === 'opencode'), 'the public channel is probed');
  assert.ok(first.results.some(row => row.channel_id === 'workbuddy-intl'), 'free models on account channels are probed');
  assert.ok(first.results.every(row => !/paid-model/.test(row.model_id)), 'paid models are skipped by default');
  assert.equal(first.results.length, summary.total);
  assert.ok(first.results.some(row => row.ok), JSON.stringify(first.results));
  assert.ok(first.results.every(row => row.history.length === 1));
  await prober.run({ force: true, gapMs: 0 });
  const second = prober.status();
  assert.ok(second.results.every(row => row.history.length === 2));
  assert.equal(second.last_run_at != null, true);

  // Isolation: a channel that was just swept is skipped inside its window, so a
  // many-model channel can never be probed back-to-back. The real tick right
  // after a full sweep therefore rotates nothing.
  const before = new Map(second.results.map(row => [row.model_id, row.at]));
  await prober.tick();
  const rotated = prober.results().filter(row => before.get(row.model_id) !== row.at);
  assert.equal(rotated.length, 0, 'channel isolation blocks an immediate re-sweep');
  assert.equal(prober.status().last_tick_at != null, true);

  // Deterministic checks of the rotation/isolation policy itself.
  const now = Date.now();
  const models = [
    { id: 'opencode/a', channel_id: 'opencode' },
    { id: 'opencode/b', channel_id: 'opencode' },
    { id: 'workbuddy-intl/c', channel_id: 'workbuddy-intl' },
  ];
  const fresh = [
    { model_id: 'opencode/a', channel_id: 'opencode', at: new Date(now - 5000).toISOString(), ok: false, status: 502, error: 'all upstream attempts failed' },
    { model_id: 'opencode/b', channel_id: 'opencode', at: new Date(now - 120000).toISOString(), ok: false, status: 502, error: 'all upstream attempts failed' },
    { model_id: 'workbuddy-intl/c', channel_id: 'workbuddy-intl', at: new Date(now - 60000).toISOString(), ok: true, status: 200, error: null },
  ];
  // A freshly probed channel is skipped even though its models are the oldest.
  assert.equal(prober.select(models, fresh, now).id, 'workbuddy-intl/c');
  // Once the window passes, the oldest eligible model is chosen again.
  assert.equal(prober.select(models, fresh, now + (prober.channelGap + 1) * 1000).id, 'opencode/b');
  // A model in rate-limit cooldown is skipped even when it is the oldest.
  const cooled = [
    { model_id: 'opencode/a', channel_id: 'opencode', at: new Date(now - 20 * 60 * 1000).toISOString(), ok: false, status: 429, error: 'rate limit reached; retry in 56347s' },
    { model_id: 'opencode/b', channel_id: 'opencode', at: new Date(now - 60 * 60 * 1000).toISOString(), ok: true, status: 200, error: null },
    { model_id: 'workbuddy-intl/c', channel_id: 'workbuddy-intl', at: new Date(now - 5 * 60 * 1000).toISOString(), ok: true, status: 200, error: null },
  ];
  assert.equal(prober.select(models, cooled, now).id, 'opencode/b');

  const board = await management('/channel-status');
  const channel = board.body.channels.find(row => row.models.length);
  assert.ok(channel, 'at least one channel exposes models');
  assert.ok(channel.models.some(row => row.probe), 'models carry probe results');
  assert.equal(channel.probe.probed, channel.models.filter(row => row.probe).length);
  assert.ok(board.body.probes.results.length >= 1);
  assert.equal(board.body.probes.enabled, true);
});

test('openrouter channels are accepted, classify free models and use the slower probe cadence', async () => {
  const mockUrl = (await management('/channels')).body.channels
    .find(row => row.base_url.startsWith('http://127.0.0.1')).base_url;
  // A trailing /v1 is stripped so upstream paths resolve as <base>/v1/models.
  const created = await management('/channels', 'POST', { name: 'OpenRouter', provider: 'openrouter',
    prefix: 'openrouter', base_url: 'https://openrouter.ai/api/v1', key: 'sk-or-test' });
  assert.equal(created.response.status, 201);
  const id = created.body.id;
  try {
    const listed = (await management('/channels')).body.channels.find(row => row.id === id);
    assert.equal(listed.provider, 'openrouter');
    assert.equal(listed.managed, false);
    assert.equal(listed.base_url, 'https://openrouter.ai/api');

    // Free classification only trusts OpenRouter's explicit free IDs; a zero
    // advertised price can still be a paid model requiring account credits.
    const channel = app.store.channels().find(row => row.id === id);
    assert.equal(app.catalog.freeStatus(channel, { id: 'vendor/free-model:free', pricing: { prompt: '0', completion: '0' } }), true);
    assert.equal(app.catalog.freeStatus(channel, { id: 'vendor/zero-price-paid', pricing: { prompt: '0', completion: '0' } }), false);
    assert.equal(app.catalog.freeStatus(channel, { id: 'openrouter/free', pricing: { prompt: '0', completion: '0' } }), true);
    assert.equal(app.catalog.freeStatus(channel, { id: 'vendor/paid-model', pricing: { prompt: '0.000001', completion: '0.000002' } }), false);
    assert.equal(app.catalog.freeStatus(channel, { id: 'vendor/other' }), false);

    // Point it at the mock and confirm the free model flows through discovery.
    await management('/channels/' + id, 'PATCH', { base_url: mockUrl });
    const models = await management('/models?refresh=1');
    const ids = models.body.data.filter(row => row.channel_id === id).map(row => row.id);
    assert.ok(ids.includes('openrouter/shared-model:free'), 'free model listed: ' + ids.join(','));
    assert.equal(models.body.data.find(row => row.id === 'openrouter/shared-model')?.is_free, false,
      'zero-priced non-free model is not marked free');
    assert.ok(!ids.some(model => /paid-model/.test(model) && models.body.data
      .find(row => row.id === model)?.is_free === true), 'paid models are never marked free');

    // OpenRouter's channel gap is the slow override; other channels stay per-minute.
    const { ModelProber, manualSweep } = await import('../server/probes.mjs');
    const prober = new ModelProber(app.store, app.catalog, app.engines);
    assert.ok(prober.openrouterGap >= 600, 'openrouter gap is conservative');
    assert.equal(prober.channelGapFor(id), prober.openrouterGap);
    const other = app.store.channels().find(row => row.provider === 'opencode');
    assert.equal(prober.channelGapFor(other.id), prober.channelGap);

    // A manual "test all" sweep must not fire every OpenRouter model at once.
    const swept = manualSweep([
      { id: 'openrouter/a', channel_id: id }, { id: 'openrouter/b', channel_id: id },
      { id: 'opencode/c', channel_id: other.id },
    ], new Map([[id, 'openrouter'], [other.id, 'opencode']])).map(row => row.id);
    assert.deepEqual(swept, ['openrouter/a', 'opencode/c']);
  } finally {
    await management('/channels/' + id, 'DELETE');
    app.store.db.prepare('DELETE FROM models WHERE channel_id=?').run(id);
  }
});

test('channel status prefers a newer successful request over a stale probe limit', async () => {
  const modelId = 'workbuddy/paid-model', channelId = 'workbuddy-intl';
  app.store.saveProbe({ model_id: modelId, channel_id: channelId, at: '2000-01-01T00:00:00.000Z',
    ok: false, status: 429, latency_ms: 12, error: 'upstream rate limit reached for this model; retry in 999999s' });
  const response = await infer({ model: modelId });
  assert.equal(response.status, 200); await response.text();
  const board = await management('/channel-status');
  const channel = board.body.channels.find(row => row.id === channelId);
  const model = channel.models.find(row => row.id === modelId);
  assert.equal(model.probe.ok, true);
  assert.equal(model.probe.status, 200);
  assert.equal(model.probe.source, 'request');
  assert.equal(model.probe.error, null);
  const aggregate = board.body.probes.results.find(row => row.model_id === modelId);
  assert.equal(aggregate.ok, true);
  assert.equal(aggregate.source, 'request');
});

test('token dashboard aggregates daily usage per channel and direction', async () => {
  const { response, body } = await management('/token-stats?days=7');
  assert.equal(response.status, 200);
  assert.equal(body.days.length, 7);
  assert.equal(body.daily.length, 7);
  assert.equal(body.series.length, app.store.channels().length * 2);
  assert.ok(body.series.every(row => row.values.length === 7 && row.label && row.channel_id));
  assert.equal(body.series.filter(row => row.kind === 'input').length, app.store.channels().length);
  for (const row of body.series) {
    assert.equal(row.values.reduce((sum, value) => sum + value, 0), row.total, row.id);
  }
  assert.ok(body.totals.input_tokens >= 10);
  assert.equal(body.totals.input_tokens + body.totals.output_tokens,
    body.daily.reduce((sum, row) => sum + row.tokens, 0));
  const today = body.days.at(-1);
  const todayTotal = body.series.reduce((sum, row) => sum + row.values.at(-1), 0);
  assert.equal(body.daily.find(row => row.day === today).tokens, todayTotal);
});

test('credentials are encrypted, deduplicated, controllable and synchronised', async () => {
  const secret = 'test-upstream-secret-' + 'x'.repeat(20);
  const result = await management('/accounts', 'POST', { kind: 'zen', key: secret, name: 'Test Zen' });
  assert.equal(result.response.status, 201); assert.equal(result.body.synced, true);
  const row = app.store.accounts().find(row => row.id === result.body.id);
  assert.notEqual(row.secret, secret); assert.equal(app.store.vault.decrypt(row.secret), secret);
  assert.equal((await management('/accounts', 'POST', { kind: 'go', key: secret })).response.status, 409);
  assert.ok(!(await readFile(path.join(directory, 'onehub.sqlite'))).includes(Buffer.from(secret)));
  assert.equal((await management('/accounts/' + row.id, 'PATCH', { enabled: false, name: 'Renamed' })).response.status, 200);
  assert.equal(app.store.accounts().find(saved => saved.id === row.id).enabled, 0);
  assert.equal((await management('/accounts/' + row.id, 'DELETE')).response.status, 200);
  assert.ok(syncs >= 3);
});

test('manual check-in triggers the WorkBuddy scheduler', async () => {
  const trigger = await management('/accounts/checkin', 'POST', {});
  assert.equal(trigger.response.status, 200);
  assert.equal(trigger.body.ok, true);
  assert.equal(wbCalls.at(-1).endpoint, '/scheduler/trigger');
  assert.equal(wbCalls.at(-1).provider, 'workbuddy');
  const status = await management('/accounts/checkin');
  assert.equal(status.response.status, 200);
});

test('WorkBuddy OAuth, import and account control use the engine without exposing tokens', async () => {
  const start = await management('/accounts/oauth/start', 'POST', { realm: 'cn' });
  assert.equal(start.body.state, 'test-oauth-state'); assert.equal(wbCalls.at(-1).body.realm, 'cn');
  const poll = await management('/accounts/oauth/poll?state=test-oauth-state');
  assert.deepEqual(Object.keys(poll.body).sort(), ['message', 'status']);
  const imported = await management('/accounts/import', 'POST', { realm: 'intl', data: [{ accessToken: 'manual-import' }] });
  assert.equal(imported.body.count, 1); assert.equal(imported.body.secret, undefined);
  assert.equal((await management('/accounts/wb%3Atest-uid', 'PATCH', { enabled: false })).response.status, 200);
  assert.equal(wbCalls.at(-1).body.uid, 'test-uid');
  assert.equal((await management('/accounts/wb%3Atest-uid/refresh', 'POST', {})).body.results[0].ok, true);
  const credits = await management('/accounts/wb%3Atest-uid/credits', 'POST', {});
  assert.equal(credits.body.ok, true);
  assert.deepEqual(credits.body.results, [{ uid: 'test-uid', ok: true }]);
  failures.add('account-operation');
  try {
    const failed = await management('/accounts/wb%3Atest-uid/credits', 'POST', {});
    assert.equal(failed.body.ok, false);
    assert.equal(failed.body.results[0].ok, false);
    assert.ok(!JSON.stringify(failed.body).includes('never-expose'));
  } finally { failures.delete('account-operation'); }
  assert.equal((await management('/accounts/wb%3Amissing/credits', 'POST', {})).response.status, 404);
});

test('keys can be edited, revoked, disabled and expired, with no plaintext in the database', async () => {
  const key = await createKey({ name: 'Mutable' });
  const updated = await management('/keys/' + key.id, 'PATCH', { name: 'Updated', allowed_channels: ['workbuddy-cn'], models: ['codebuddy/*'], rpm: 7, daily_tokens: 300 });
  assert.equal(updated.response.status, 200);
  const rows = (await management('/keys')).body.keys, row = rows.find(row => row.id === key.id);
  assert.equal(row.name, 'Updated'); assert.equal(row.rpm, 7); assert.deepEqual(row.allowed_channels, ['workbuddy-cn']);
  assert.notEqual(app.store.db.prepare('SELECT hash FROM api_keys WHERE id=?').get(key.id).hash, key.key);
  assert.equal((await infer({ model: 'opencode/shared-model' }, key.key)).status, 403);
  await management('/keys/' + key.id, 'PATCH', { enabled: false });
  assert.equal((await infer({ model: 'codebuddy/shared-model' }, key.key)).status, 401);
  app.store.db.prepare('UPDATE api_keys SET expires_at=? WHERE id=?').run('2000-01-01T00:00:00.000Z', key.id);
  assert.equal((await management('/keys/' + key.id, 'PATCH', { enabled: false })).response.status, 200);
  assert.equal((await management('/keys/' + key.id, 'DELETE')).response.status, 200);
});

test('stale model catalogs are labelled and disabled channels cannot be routed', async () => {
  await management('/models?refresh=1');
  failures.add('intl');
  const result = await management('/models?refresh=1');
  assert.equal(result.body.partial, true);
  assert.equal(result.body.data.find(row => row.id === 'workbuddy/shared-model').stale, true);
  failures.clear();
  await management('/channels/workbuddy-intl', 'PATCH', { enabled: false });
  assert.equal((await infer({ model: 'workbuddy/shared-model' })).status, 400);
  assert.equal((await management('/channels/workbuddy-intl', 'DELETE')).response.status, 400);
  await management('/channels/workbuddy-intl', 'PATCH', { enabled: true });
});

test('malformed requests and unauthenticated access do not reach an upstream', async () => {
  assert.equal((await fetch(base + '/v1/models')).status, 401);
  const before = seen.length;
  const malformed = await fetch(base + '/v1/chat/completions', { method: 'POST', headers: { Authorization: 'Bearer ' + allKey.key }, body: '{' });
  assert.equal(malformed.status, 400);
  assert.equal((await infer({ model: 'workbuddy/shared-model' }, 'wrong-key')).status, 401);
  assert.equal(seen.length, before);
  const leaked = await fetch(base + '/data/master.key');
  assert.equal(leaked.status, 404);
});

test('free-only policy filters management and client lists, persists only free rows and blocks paid IDs and aliases before forwarding', async () => {
  await management('/aliases', 'POST', { name: 'paid-alias', target: 'workbuddy/paid-model' });
  const key = await createKey({ models: ['*'] });
  try {
    assert.equal((await management('/settings', 'PATCH', { model_free_only: 'yes' })).response.status, 400);
    const enabled = await management('/settings', 'PATCH', { model_free_only: true });
    assert.equal(enabled.response.status, 200);
    assert.equal(enabled.body.models_synced, true);
    assert.equal((await management('/settings')).body.model_free_only, true);
    const adminList = await management('/models');
    assert.equal(adminList.body.free_only, true);
    assert.ok(adminList.body.data.every(row => row.is_free === true));
    assert.equal(app.store.db.prepare('SELECT COUNT(*) AS n FROM models WHERE is_free IS NOT 1').get().n, 0);
    const list = await json('/v1/models', { headers: { Authorization: 'Bearer ' + key.key } });
    assert.ok(list.body.data.every(row => row.is_free === true));
    assert.ok(!(await management('/aliases')).body.aliases.some(row => row.name === 'paid-alias'));
    const before = seen.length;
    for (const model of ['workbuddy/paid-model', 'opencode/paid-model', 'codebuddy/hold', 'workbuddy/unlisted', 'paid-alias']) {
      const denied = await infer({ model, messages: [] }, key.key);
      assert.equal(denied.status, 403, model);
      assert.equal((await denied.json()).error.type, 'free_only_error');
    }
    assert.equal(seen.length, before, 'blocked models must never reach inference upstreams');
    const rejectedAlias = await management('/aliases', 'POST', { name: 'new-paid', target: 'workbuddy/paid-model' });
    assert.equal(rejectedAlias.response.status, 403);
    assert.equal(app.store.db.prepare("SELECT COUNT(*) AS n FROM aliases WHERE name='new-paid'").get().n, 0);
    const allowed = await infer({ model: 'workbuddy/shared-model' }, key.key);
    assert.equal(allowed.status, 200); await allowed.text();
    failures.add('intl');
    const stale = await management('/models?refresh=1');
    assert.equal(stale.body.partial, true);
    const unavailable = await infer({ model: 'workbuddy/shared-model' }, key.key);
    assert.equal(unavailable.status, 503); await unavailable.text();
  } finally {
    failures.delete('intl');
    await management('/settings', 'PATCH', { model_free_only: false });
    await management('/aliases/paid-alias', 'DELETE');
    await management('/keys/' + key.id, 'DELETE');
  }
});

test('shutdown aborts an unfinished SSE response and saves its log before closing SQLite', { timeout: 10000 }, async () => {
  const shutdownDirectory = await mkdtemp(path.join(os.tmpdir(), 'onehub-shutdown-'));
  const finish = deferred(); jobs.set('stream', finish);
  let stoppingApp, reopened;
  try {
    stoppingApp = createApp({ root, directory: shutdownDirectory, engines: {
      start: async () => {}, stop: async () => {},
      headers: () => ({ Authorization: 'Bearer shutdown-test' }),
    } });
    stoppingApp.store.db.prepare('UPDATE channels SET base_url=?').run('http://127.0.0.1:' + mock.address().port);
    const key = stoppingApp.store.createKey({ name: 'Shutdown test' });
    await stoppingApp.start(0);
    const response = await fetch('http://127.0.0.1:' + stoppingApp.server.address().port + '/v1/chat/completions', {
      method: 'POST', headers: { Authorization: 'Bearer ' + key.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'opencode/shared-model', stream: true, messages: [] }),
    });
    const reader = response.body.getReader();
    assert.equal((await reader.read()).done, false);
    const disconnected = (async () => {
      try { while (!(await reader.read()).done) { /* Drain until shutdown closes the socket. */ } }
      catch { return true; }
      return false;
    })();
    const closing = stoppingApp.close();
    assert.equal(stoppingApp.close(), closing);
    await closing;
    assert.equal(await disconnected, true);

    reopened = createApp({ root, directory: shutdownDirectory, disableEngines: true });
    const row = reopened.store.db.prepare('SELECT * FROM requests WHERE id=?').get(response.headers.get('x-request-id'));
    assert.ok(row, 'the interrupted request must survive a restart');
    assert.equal(row.stream, 1);
    assert.equal(row.outcome, 'server_shutdown');
    assert.equal(row.status, 503);
    assert.equal(row.usage_reported, 0);
  } finally {
    finish.resolve(); jobs.delete('stream');
    await stoppingApp?.close();
    await reopened?.close();
    const resolved = path.resolve(shutdownDirectory);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('onehub-shutdown-'));
    await rm(resolved, { recursive: true, force: true });
  }
});

test('settings and credentials survive a restart without a login', async () => {
  const saved = await management('/settings', 'PATCH', { timeout_seconds: 120 });
  assert.equal(saved.response.status, 200);
  await app.close();
  app = createApp({ root, directory, disableEngines: true });
  await app.start(0); base = 'http://127.0.0.1:' + app.server.address().port;
  assert.ok(app.store.matchKey(allKey.key));
  assert.equal((await management('/settings')).body.timeout_seconds, 120);
  assert.equal((await json('/api/auth/session')).body.authenticated, true);
});

test('usage parsing handles split UTF-8, Anthropic cached input and terminal SSE usage', () => {
  const parser = new UsageReader(true);
  const payload = Buffer.from('data: {"message":{"usage":{"input_tokens":2,"cache_creation_input_tokens":4,"cache_read_input_tokens":8}}}\r\n\r\n'
    + 'data: {"usage":{"output_tokens":6}}\n\n' + 'data: [DONE]\n\n');
  for (let i = 0; i < payload.length; i += 3) parser.chunk(payload.subarray(i, i + 3));
  assert.deepEqual(parser.finish(), { input_tokens: 14, output_tokens: 6, cached_tokens: 8, usage_reported: 1 });
  const jsonParser = new UsageReader(false);
  const raw = Buffer.from('{"content":"你好","usage":{"input_tokens":5,"output_tokens":3}}');
  for (const byte of raw) jsonParser.chunk(Buffer.from([byte]));
  assert.equal(jsonParser.finish().input_tokens, 5);
  assert.equal(new Date(dayStart()).getUTCHours(), 16);
});
