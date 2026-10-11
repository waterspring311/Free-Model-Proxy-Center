import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepareResponsesTools } from '../server/responses-tools.mjs';

const patch = '*** Begin Patch\n*** Add File: 示例.txt\n+中文 "quotes" \\\n*** End Patch\n';
const custom = { type: 'custom', name: 'apply_patch', description: 'Edit files.', format: { type: 'grammar', syntax: 'lark', definition: 'start: /.+/s' } };
const functionTool = { type: 'function', name: 'get_weather', parameters: { type: 'object', properties: { city: { type: 'string' } } } };
const call = (name, argumentsJSON, id = 'fc_1') => ({
  id, type: 'function_call', status: 'completed', name, call_id: 'call_' + id, arguments: argumentsJSON,
});
const eventFrame = value => `event: ${value.type}\r\ndata: ${JSON.stringify(value)}\r\n\r\n`;

test('ordinary Responses tools keep their original payload and need no adapter', () => {
  const body = { tools: [functionTool], input: 'weather', stream: true, tool_choice: 'auto' };
  const prepared = prepareResponsesTools(body);
  assert.equal(prepared.request, body);
  assert.equal(prepared.adapter, null);
});

test('custom tools translate definitions, named choices and replay without mutating the client payload', () => {
  const body = {
    tools: [functionTool, custom], tool_choice: { type: 'custom', name: 'apply_patch' },
    input: [
      { type: 'custom_tool_call', id: 'ctc_1', call_id: 'call_1', name: 'apply_patch', input: patch },
      { type: 'custom_tool_call_output', call_id: 'call_1', output: 'Success' },
    ],
  };
  const before = structuredClone(body);
  const { request, adapter } = prepareResponsesTools(body);
  assert.deepEqual(body, before);
  assert.equal(request.tools[0], functionTool);
  assert.equal(request.tools[1].type, 'function');
  assert.match(request.tools[1].description, /start: \/\.\+\/s/);
  assert.deepEqual(request.tools[1].parameters.required, ['input']);
  assert.equal(request.tools[1].parameters.additionalProperties, false);
  assert.deepEqual(request.tool_choice, { type: 'function', name: 'apply_patch' });
  assert.equal(request.input[0].type, 'function_call');
  assert.equal(request.input[0].call_id, 'call_1');
  assert.equal(JSON.parse(request.input[0].arguments).input, patch);
  assert.equal(request.input[1].type, 'function_call_output');
  const output = adapter.response({ output: [call('apply_patch', JSON.stringify({ input: patch })), call('get_weather', '{"city":"Beijing"}')] });
  assert.equal(output.output[0].type, 'custom_tool_call');
  assert.equal(output.output[0].input, patch);
  assert.equal(output.output[0].arguments, undefined);
  assert.equal(output.output[1].type, 'function_call');
  assert.equal(output.output[1].arguments, '{"city":"Beijing"}');
});

test('namespaces keep same-named tools distinct and restore names on calls and history', () => {
  const body = {
    tools: [
      { type: 'namespace', name: 'first', tools: [functionTool, custom] },
      { type: 'namespace', name: 'second', tools: [functionTool] },
      functionTool,
    ],
    input: [{ type: 'function_call', namespace: 'second', name: 'get_weather', call_id: 'c', arguments: '{"city":"Shanghai"}' }],
    tool_choice: { type: 'custom', namespace: 'first', name: 'apply_patch' },
  };
  const { request, adapter } = prepareResponsesTools(body);
  assert.equal(request.tools.length, 4);
  assert.equal(new Set(request.tools.map(row => row.name)).size, 4);
  assert.ok(request.tools.every(row => row.type === 'function' && row.name.length <= 64));
  assert.equal(request.input[0].name, request.tools[2].name);
  assert.equal(request.input[0].namespace, undefined);
  assert.equal(request.tool_choice.name, request.tools[1].name);
  const result = adapter.response({ output: [
    call(request.tools[0].name, '{}'), call(request.tools[1].name, JSON.stringify({ input: patch })),
    call(request.tools[2].name, '{}'), call('get_weather', '{}'),
  ] });
  assert.deepEqual(result.output.map(row => [row.type, row.name, row.namespace]), [
    ['function_call', 'get_weather', 'first'], ['custom_tool_call', 'apply_patch', 'first'],
    ['function_call', 'get_weather', 'second'], ['function_call', 'get_weather', undefined],
  ]);
});

test('nested namespace custom tools and undeclared custom history round trip', () => {
  const nested = { type: 'namespace', name: 'outer', tools: [{ type: 'namespace', name: 'inner', functions: [custom] }] };
  const first = prepareResponsesTools({ tools: [nested], input: [] });
  const returned = first.adapter.response({ output: [call(first.request.tools[0].name, JSON.stringify({ input: patch }))] }).output[0];
  assert.equal(returned.namespace, 'outer.inner');
  const replay = prepareResponsesTools({ input: [returned, { type: 'custom_tool_call_output', call_id: returned.call_id, output: 'Done' }] });
  assert.equal(replay.request.input[0].name, first.request.tools[0].name);
  assert.equal(JSON.parse(replay.request.input[0].arguments).input, patch);
  assert.equal(replay.request.input[1].type, 'function_call_output');
});

test('allowed_tools limits upstream declarations rather than silently turning into auto', () => {
  const { request } = prepareResponsesTools({
    tools: [custom, functionTool], input: 'edit',
    tool_choice: { type: 'allowed_tools', mode: 'required', tools: [{ type: 'custom', name: 'apply_patch' }] },
  });
  assert.deepEqual(request.tools.map(row => row.name), ['apply_patch']);
  assert.equal(request.tool_choice, 'required');
  assert.throws(() => prepareResponsesTools({ tools: [custom], tool_choice: { type: 'custom', name: 'missing' } }), /declared tool/);
  assert.throws(() => prepareResponsesTools({ tool_choice: { type: 'allowed_tools', mode: 'auto', tools: [functionTool] } }), /allowed_tools/);
});

test('built-in server tools give actionable errors and malformed custom outputs are not dispatched', () => {
  assert.throws(() => prepareResponsesTools({ tools: [{ type: 'web_search' }] }), /web_search = "disabled"/);
  assert.throws(() => prepareResponsesTools({ tools: [{ type: 'computer_use_preview' }] }), /built-in/);
  assert.throws(() => prepareResponsesTools({ tools: [custom, custom] }), /duplicates/);
  assert.throws(() => prepareResponsesTools({ tools: [custom], input: [{ type: 'custom_tool_call', name: 'apply_patch', input: 42 }] }), /must be a string/);
  const { adapter } = prepareResponsesTools({ tools: [custom] });
  for (const value of ['not JSON', '{"input":42}', 'null']) {
    assert.throws(() => adapter.response({ output: [call('apply_patch', value)] }), /string input/);
  }
});

test('output-only web search cards are removed from replayed OpenCode history', () => {
  const body = {
    model: 'step-5-preview-free',
    input: [
      { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'Search this.' }] },
      { type: 'web_search_call', id: 'ws_1', status: 'completed',
        action: { type: 'search', query: 'example' } },
      { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Found it.' }] },
    ],
  };
  const before = structuredClone(body);
  const { request } = prepareResponsesTools(body);
  assert.deepEqual(body, before);
  assert.deepEqual(request.input, [body.input[0], body.input[2]]);
});

test('assistant replay text is placed after all pending tool results', () => {
  const body = {
    input: [
      { type: 'function_call', id: 'fc_1', call_id: 'call_1', name: 'apply_patch', arguments: '{}' },
      { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'intermediate text' }] },
      { type: 'function_call_output', call_id: 'call_1', output: 'done' },
    ],
  };
  const before = structuredClone(body);
  const { request } = prepareResponsesTools(body);
  assert.deepEqual(body, before);
  assert.deepEqual(request.input.map(item => item.type), [
    'function_call', 'function_call_output', 'message',
  ]);
  assert.equal(request.input[2].role, 'assistant');
});

test('incomplete tool history is not reordered', () => {
  const body = {
    input: [
      { type: 'function_call', id: 'fc_1', call_id: 'call_1', name: 'apply_patch', arguments: '{}' },
      { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'still running' }] },
    ],
  };
  const { request } = prepareResponsesTools(body);
  assert.deepEqual(request.input, body.input);
});

test('SSE converts custom inputs and namespace calls across byte boundaries, preserving UTF-8 and usage', async () => {
  const { request, adapter } = prepareResponsesTools({ tools: [custom, { type: 'namespace', name: 'weather', tools: [functionTool] }] });
  const tool = call('apply_patch', JSON.stringify({ input: patch }));
  const weather = call(request.tools[1].name, '{"city":"北京"}', 'fc_2');
  const events = [
    { type: 'response.created', response: { id: 'r', output: [], status: 'in_progress' } },
    { type: 'response.output_item.added', output_index: 0, item: { ...tool, status: 'in_progress', arguments: '' } },
    { type: 'response.function_call_arguments.delta', item_id: tool.id, output_index: 0, delta: tool.arguments.slice(0, 12) },
    { type: 'response.function_call_arguments.delta', item_id: tool.id, output_index: 0, delta: tool.arguments.slice(12) },
    { type: 'response.function_call_arguments.done', item_id: tool.id, output_index: 0, arguments: tool.arguments },
    { type: 'response.output_item.done', output_index: 0, item: tool },
    { type: 'response.output_item.added', output_index: 1, item: { ...weather, status: 'in_progress', arguments: '' } },
    { type: 'response.function_call_arguments.delta', item_id: weather.id, output_index: 1, delta: weather.arguments },
    { type: 'response.function_call_arguments.done', item_id: weather.id, output_index: 1, arguments: weather.arguments },
    { type: 'response.output_item.done', output_index: 1, item: weather },
    { type: 'response.completed', response: { status: 'completed', output: [tool, weather], usage: { input_tokens: 8, output_tokens: 9 } } },
  ];
  const encoded = Buffer.from(': keepalive\r\n\r\n' + events.map(eventFrame).join('') + 'data: [DONE]\r\n\r\n');
  async function* bytes() { for (let i = 0; i < encoded.length; i++) yield encoded.subarray(i, i + 1); }
  const chunks = []; for await (const chunk of adapter.stream(bytes())) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString();
  assert.match(text, /: keepalive/); assert.match(text, /data: \[DONE\]/);
  const received = text.split('\n').filter(line => line.startsWith('data: {')).map(line => JSON.parse(line.slice(6)));
  const inputEvents = received.filter(row => row.type.startsWith('response.custom_tool_call_input.'));
  assert.deepEqual(inputEvents.map(row => row.type), ['response.custom_tool_call_input.delta', 'response.custom_tool_call_input.done']);
  assert.equal(inputEvents[0].delta, patch); assert.equal(inputEvents[1].input, patch);
  assert.ok(!received.some(row => row.type.startsWith('response.function_call_arguments.') && row.item_id === tool.id));
  assert.ok(received.some(row => row.type === 'response.function_call_arguments.delta' && row.delta === weather.arguments));
  const done = received.find(row => row.type === 'response.completed');
  assert.equal(done.response.output[0].input, patch);
  assert.equal(done.response.output[1].namespace, 'weather');
  assert.deepEqual(done.response.usage, { input_tokens: 8, output_tokens: 9 });
  assert.deepEqual(received.map(row => row.sequence_number), received.map((_, i) => i));
});

test('SSE starts delivering text before a custom tool is complete and handles missing argument-done events', async () => {
  const { adapter } = prepareResponsesTools({ tools: [custom] });
  const tool = call('apply_patch', JSON.stringify({ input: patch }));
  let release;
  const waiting = new Promise(resolve => { release = resolve; });
  async function* source() {
    yield Buffer.from(eventFrame({ type: 'response.output_text.delta', delta: 'first' }));
    await waiting;
    yield Buffer.from(eventFrame({ type: 'response.output_item.added', item: { ...tool, arguments: '', status: 'in_progress' }, output_index: 0 }));
    yield Buffer.from(eventFrame({ type: 'response.function_call_arguments.delta', item_id: tool.id, output_index: 0, delta: tool.arguments }));
    const item = { ...tool }; delete item.arguments;
    yield Buffer.from(eventFrame({ type: 'response.output_item.done', item, output_index: 0 }));
  }
  const stream = adapter.stream(source());
  try {
    const first = await stream.next();
    assert.match(first.value.toString(), /first/);
    release();
    const chunks = []; for await (const chunk of stream) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString();
    const received = text.split('\n').filter(line => line.startsWith('data: ')).map(line => JSON.parse(line.slice(6)));
    assert.equal(received.find(row => row.type === 'response.custom_tool_call_input.done').input, patch);
    assert.equal(received.find(row => row.type === 'response.output_item.done').item.input, patch);
  } finally { release(); }
});
