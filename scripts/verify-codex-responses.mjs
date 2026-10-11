import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server/app.mjs';

// Exercise the installed CLI against a deterministic local model. Gateway data
// and any generated file changes stay in a temporary directory.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const executable = process.argv[2] || path.join(process.env.APPDATA || '', 'npm/node_modules/@openai/codex',
  'node_modules/@openai/codex-win32-x64/vendor/x86_64-pc-windows-msvc/bin/codex.exe');
assert.ok(existsSync(executable), 'Pass the installed Codex executable as the first argument.');
const directory = await mkdtemp(path.join(os.tmpdir(), 'onehub-codex-'));
const workspace = path.join(directory, 'workspace');
const patch = '*** Begin Patch\n*** Add File: compat-probe.txt\n+onehub codex OK\n*** End Patch\n';
const original = [], upstream = [];
let app, child, modelError;
const mock = http.createServer(async (req, res) => {
  try {
    if (req.url === '/v1/models') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: [{ id: 'mimo-v2.6-flash-free', cost: { input: 0, output: 0 } }] }));
      return;
    }
    assert.equal(req.url, '/v1/responses');
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks));
    upstream.push(body);
    assert.ok(body.tools.length > 0 && body.tools.every(tool => tool.type === 'function'));
    assert.ok(!body.input.some(item => /^custom_tool/.test(item.type)));
    const tool = body.tools.find(item => item.name === 'apply_patch')
      || body.tools.find(item => item.name === 'get_goal');
    assert.ok(tool, 'The CLI must expose apply_patch or the read-only get_goal tool.');
    const replay = body.input.some(item => item.type === 'function_call_output' && item.call_id === 'call_probe');
    const output = replay
      ? [{ type: 'message', id: 'msg_probe', status: 'completed', role: 'assistant',
        content: [{ type: 'output_text', text: 'ONEHUB_CODEX_OK', annotations: [] }] }]
      : [{ type: 'function_call', id: 'fc_probe', status: 'completed', name: tool.name,
        call_id: 'call_probe', arguments: JSON.stringify(tool.name === 'apply_patch' ? { input: patch } : {}) }];
    const response = { id: 'resp_probe', object: 'response', created_at: Math.floor(Date.now() / 1000),
      status: 'completed', model: body.model, output, usage: { input_tokens: 20, output_tokens: 10, total_tokens: 30 } };
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    let sequence = 0;
    const event = value => res.write(`event: ${value.type}\ndata: ${JSON.stringify({ ...value, sequence_number: sequence++ })}\n\n`);
    event({ type: 'response.created', response: { ...response, status: 'in_progress', output: [] } });
    output.forEach((item, output_index) => {
      event({ type: 'response.output_item.added', output_index,
        item: { ...item, status: 'in_progress', ...(item.type === 'function_call' ? { arguments: '' } : { content: [] }) } });
      if (item.type === 'function_call') {
        event({ type: 'response.function_call_arguments.delta', item_id: item.id, output_index, delta: item.arguments });
        event({ type: 'response.function_call_arguments.done', item_id: item.id, output_index, arguments: item.arguments });
      } else {
        event({ type: 'response.content_part.added', item_id: item.id, output_index, content_index: 0,
          part: { type: 'output_text', text: '', annotations: [] } });
        event({ type: 'response.output_text.delta', item_id: item.id, output_index, content_index: 0, delta: 'ONEHUB_CODEX_OK' });
        event({ type: 'response.output_text.done', item_id: item.id, output_index, content_index: 0, text: 'ONEHUB_CODEX_OK' });
        event({ type: 'response.content_part.done', item_id: item.id, output_index, content_index: 0, part: item.content[0] });
      }
      event({ type: 'response.output_item.done', output_index, item });
    });
    event({ type: 'response.completed', response });
    res.end();
  } catch (error) {
    modelError = error;
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: 'Mock compatibility assertion failed.' } }));
  }
});

try {
  await mkdir(workspace);
  await new Promise(resolve => mock.listen(0, '127.0.0.1', resolve));
  app = createApp({ root, directory: path.join(directory, 'data'), engines: {
    start: async () => {}, stop: async () => {}, headers: () => ({ Authorization: 'Bearer local-mock' }),
  } });
  app.store.db.prepare("UPDATE channels SET enabled=0 WHERE provider!='opencode'").run();
  app.store.db.prepare("UPDATE channels SET base_url=? WHERE provider='opencode'").run('http://127.0.0.1:' + mock.address().port);
  app.store.set('model_free_only', true);
  const key = app.store.createKey({ name: 'CLI integration test' });
  app.server.prependListener('request', req => {
    if (req.url !== '/v1/responses') return;
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => { original.push(JSON.parse(Buffer.concat(chunks))); });
  });
  await app.start(0);
  const provider = 'onehub_compat';
  const args = ['exec', '--ignore-user-config', '--ignore-rules', '--ephemeral', '--skip-git-repo-check',
    '--sandbox', 'workspace-write', '--cd', workspace, '--json', '--color', 'never',
    '-c', `model_provider="${provider}"`, '-c', 'model="opencode/mimo-v2.6-flash-free"',
    '-c', 'web_search="disabled"', '-c', 'approval_policy="never"',
    '-c', `model_providers.${provider}.name="OneHub compatibility test"`,
    '-c', `model_providers.${provider}.base_url="http://127.0.0.1:${app.server.address().port}/v1"`,
    '-c', `model_providers.${provider}.wire_api="responses"`,
    '-c', `model_providers.${provider}.env_key="ONEHUB_CODEX_TEST_KEY"`,
    '-c', `model_providers.${provider}.requires_openai_auth=false`,
    'This is a local interoperability test. If apply_patch is available, create only compat-probe.txt containing onehub codex OK. '
      + 'Otherwise inspect the current goal with get_goal. Do not run shell commands, create goals, or call agents. Then reply ONEHUB_CODEX_OK.'];
  const result = await new Promise((resolve, reject) => {
    child = spawn(executable, args, {
      cwd: workspace, env: { ...process.env, ONEHUB_CODEX_TEST_KEY: key.key }, windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '', stderr = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('Codex integration test timed out.')); }, 60000);
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); resolve({ code, stdout, stderr }); });
  });
  if (modelError) throw modelError;
  assert.equal(result.code, 0, result.stderr.slice(-2000));
  assert.ok(original[0].tools.some(tool => tool.type === 'namespace'), 'The installed CLI must exercise namespace conversion.');
  assert.ok(original[0].tools.every(tool => !/^web_search/.test(tool.type)), 'The installed CLI must disable built-in search.');
  const custom = original[0].tools.some(tool => tool.type === 'custom' && tool.name === 'apply_patch');
  assert.ok(original.at(-1).input.some(item => item.type === (custom ? 'custom_tool_call_output' : 'function_call_output')
    && item.call_id === 'call_probe'));
  if (custom) assert.equal(await readFile(path.join(workspace, 'compat-probe.txt'), 'utf8'), 'onehub codex OK\n');
  assert.match(result.stdout, /ONEHUB_CODEX_OK/);
  console.log(JSON.stringify({ result: 'passed', cli_requests: original.length,
    custom_tool_execution: custom, namespace_conversion: true, tool_history_replay: true, web_search_disabled: true, free_only: true }));
} finally {
  if (child && child.exitCode === null) child.kill();
  await app?.close();
  mock.closeAllConnections();
  await new Promise(resolve => mock.close(resolve));
  const resolved = path.resolve(directory);
  assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
  assert.ok(path.basename(resolved).startsWith('onehub-codex-'));
  await rm(resolved, { recursive: true, force: true });
}
