import { digest, HttpError } from './security.mjs';

const identity = (namespace, name) => JSON.stringify([namespace, name]);
const flatName = (namespace, name) => namespace
  ? `oh_${name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 42)}_${digest(identity(namespace, name)).slice(0, 12)}`
  : name;

function customInput(argumentsJSON, empty = false) {
  if (empty && !argumentsJSON) return '';
  try {
    const value = JSON.parse(argumentsJSON);
    if (typeof value.input === 'string') return value.input;
  } catch { /* Do not dispatch a malformed patch to the client. */ }
  throw new HttpError(502, 'Upstream custom tool arguments must contain a string input.', 'upstream_error');
}

function toolHistoryID(item, output = false) {
  if (!item || typeof item !== 'object') return null;
  const value = output ? item.call_id : (item.call_id || item.id);
  return typeof value === 'string' && value ? value : null;
}

// Codex can replay an assistant text item between Responses function calls and
// their outputs. OpenCode's Responses -> Chat bridge cannot represent that
// sequence as separate Chat turns: all tool results must come immediately
// after the assistant tool-call turn. Keep the items intact, but postpone only
// those assistant messages until the corresponding results have arrived.
function normalizeToolHistory(input) {
  const normalized = [];
  const pending = new Set();
  const deferred = [];
  let changed = false;

  const flush = () => {
    if (pending.size || deferred.length === 0) return;
    normalized.push(...deferred.splice(0));
    changed = true;
  };

  for (const item of input) {
    if (item?.type === 'function_call') {
      normalized.push(item);
      const id = toolHistoryID(item);
      if (id) pending.add(id);
      continue;
    }
    if (item?.type === 'function_call_output') {
      normalized.push(item);
      const id = toolHistoryID(item, true);
      if (id) pending.delete(id);
      flush();
      continue;
    }
    if (pending.size && (!item?.type || item.type === 'message') && item.role === 'assistant') {
      deferred.push(item);
      continue;
    }
    normalized.push(item);
  }

  // If a replay is incomplete, do not make an already-invalid history look
  // valid by moving an assistant item to the end. The upstream can report the
  // original missing-result error instead.
  if (pending.size && deferred.length) return { input, changed: false };
  return { input: normalized, changed };
}

// OpenCode 1.3.7 accepts function tools only. Keep the translation at the
// gateway boundary so Codex still receives its original custom/namespace API.
export function prepareResponsesTools(body) {
  const definitions = new Map(), names = new Map(), declared = new Set();
  let changed = false;
  function register(name, namespace = '', custom = false) {
    if (typeof name !== 'string' || !name || typeof namespace !== 'string') {
      throw new HttpError(400, 'Responses tools require a name and a valid namespace.');
    }
    const key = identity(namespace, name);
    let definition = definitions.get(key);
    if (!definition) {
      const flat = flatName(namespace, name);
      if (names.has(flat)) throw new HttpError(400, 'Responses tool names collide.');
      definition = { name, namespace, custom, flat };
      definitions.set(key, definition); names.set(flat, definition);
    } else if (definition.custom !== custom) {
      throw new HttpError(400, 'Responses tool type does not match its declaration.');
    }
    changed ||= !!namespace || custom;
    return definition;
  }

  function collect(tool, namespace = '', depth = 0, location = 'tools') {
    if (!tool || typeof tool !== 'object' || Array.isArray(tool) || depth > 8) {
      throw new HttpError(400, `${location} contains an invalid tool or excessive namespace nesting.`);
    }
    const type = tool.type || (namespace ? 'function' : '');
    if (type === 'namespace') {
      if (typeof tool.name !== 'string' || !tool.name) throw new HttpError(400, `${location} requires a namespace name.`);
      const children = tool.tools ?? tool.functions ?? tool.children;
      if (!Array.isArray(children)) throw new HttpError(400, `${location} requires namespace tools.`);
      changed = true;
      return children.flatMap((child, i) => collect(child, namespace ? namespace + '.' + tool.name : tool.name, depth + 1, `${location}.tools[${i}]`));
    }
    if (type !== 'function' && type !== 'custom') {
      const hint = /^web_search/.test(type) ? ' Set web_search = "disabled" in the Codex CLI configuration.' : '';
      throw new HttpError(400, `OpenCode does not provide the built-in Responses tool "${type}" at ${location}.${hint}`);
    }
    const source = tool.function && namespace ? tool.function : tool;
    const definition = register(source.name, namespace, type === 'custom');
    const key = identity(namespace, source.name);
    if (declared.has(key)) throw new HttpError(400, `${location} duplicates a tool name.`);
    declared.add(key);
    if (type === 'function' && !namespace) return [tool];
    const namespaceHint = namespace ? `\nTool ${namespace}.${source.name}.` : '';
    if (type === 'function') {
      return [{ ...source, type: 'function', name: definition.flat, description: (source.description || '') + namespaceHint }];
    }
    const format = tool.format || {};
    const grammar = format.type === 'grammar' && typeof format.definition === 'string'
      ? `\nFollow this ${format.syntax || ''} grammar for input:\n${format.definition}` : '';
    return [{
      type: 'function', name: definition.flat,
      description: `${tool.description || ''}${namespaceHint}\nThis is a freeform tool. Put the complete raw tool input verbatim in the input string.${grammar}`,
      parameters: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'], additionalProperties: false },
      strict: true,
    }];
  }

  const request = { ...body };
  if (body.tools !== undefined) {
    if (!Array.isArray(body.tools)) throw new HttpError(400, 'Responses tools must be an array.');
    request.tools = body.tools.flatMap((tool, i) => collect(tool, '', 0, `tools[${i}]`));
  }
  if (Array.isArray(body.input)) {
    const translatedInput = body.input.flatMap(item => {
      // `web_search_call` is an output-only Responses item. Codex replays
      // search cards in the next request, but OpenCode's Responses decoder
      // cannot consume them as conversation history. The search result is
      // already represented by the surrounding assistant/user messages, so
      // dropping the card is the lossless compatibility translation.
      if (item?.type === 'web_search_call') {
        changed = true;
        return [];
      }
      if (item?.type === 'custom_tool_call_output') {
        changed = true;
        return [{ ...item, type: 'function_call_output' }];
      }
      if (item?.type !== 'custom_tool_call' && !(item?.type === 'function_call' && item.namespace)) return [item];
      const definition = register(item.name, item.namespace || '', item.type === 'custom_tool_call');
      const converted = { ...item, type: 'function_call', name: definition.flat };
      delete converted.namespace;
      if (item.type === 'custom_tool_call') {
        if (typeof item.input !== 'string') throw new HttpError(400, 'custom_tool_call input must be a string.');
        converted.arguments = JSON.stringify({ input: item.input });
        delete converted.input;
      }
      return [converted];
    });
    const history = normalizeToolHistory(translatedInput);
    request.input = history.input;
    changed ||= history.changed;
  }

  function choice(value) {
    if (!value || typeof value !== 'object') return value;
    if (value.type !== 'function' && value.type !== 'custom') {
      throw new HttpError(400, 'OpenCode supports auto, none, required, named tools, and allowed_tools tool choices.');
    }
    const definition = definitions.get(identity(value.namespace || '', value.name));
    if (!definition) throw new HttpError(400, 'tool_choice must refer to a declared tool.');
    changed ||= !!value.namespace || value.type === 'custom';
    return { type: 'function', name: definition.flat };
  }
  if (body.tool_choice?.type === 'allowed_tools') {
    const { mode, tools } = body.tool_choice;
    if (!['auto', 'required'].includes(mode) || !Array.isArray(tools) || !tools.length || !Array.isArray(request.tools)) {
      throw new HttpError(400, 'allowed_tools requires a mode and at least one tool.');
    }
    const allowed = new Set(tools.map(value => choice(value).name));
    request.tools = request.tools.filter(tool => allowed.has(tool.name));
    request.tool_choice = mode;
    changed = true;
  } else if (body.tool_choice && typeof body.tool_choice === 'object') {
    request.tool_choice = choice(body.tool_choice);
  }
  return changed ? { request, adapter: new ResponsesToolAdapter(names) } : { request: body, adapter: null };
}

class ResponsesToolAdapter {
  constructor(names) {
    this.names = names;
    this.items = new Map();
    this.sequence = 0;
  }

  item(item, empty = false) {
    const definition = item?.type === 'function_call' && this.names.get(item.name);
    if (!definition || (!definition.custom && !definition.namespace)) return item;
    const converted = { ...item, name: definition.name };
    if (definition.namespace) converted.namespace = definition.namespace;
    if (definition.custom) {
      converted.type = 'custom_tool_call';
      converted.input = empty ? '' : customInput(item.arguments);
      delete converted.arguments;
    }
    return converted;
  }

  response(body) {
    return Array.isArray(body?.output) ? { ...body, output: body.output.map(item => this.item(item, item.status === 'in_progress')) } : body;
  }

  inputEvents(event, state, argumentsJSON) {
    const input = customInput(argumentsJSON);
    state.arguments = argumentsJSON; state.emitted = true;
    const base = { ...event }; delete base.arguments; delete base.delta;
    return [
      ...(input ? [{ ...base, type: 'response.custom_tool_call_input.delta', delta: input }] : []),
      { ...base, type: 'response.custom_tool_call_input.done', input },
    ];
  }

  event(event) {
    const state = this.items.get(event.item_id);
    if (event.type === 'response.function_call_arguments.delta' && state?.custom) {
      state.arguments += event.delta || '';
      return [];
    }
    if (event.type === 'response.function_call_arguments.done' && state?.custom) {
      return this.inputEvents(event, state, event.arguments ?? state.arguments);
    }
    if (event.item?.type === 'function_call') {
      const definition = this.names.get(event.item.name);
      if (definition) {
        const current = this.items.get(event.item.id) || { ...definition, arguments: event.item.arguments || '', emitted: false };
        this.items.set(event.item.id, current);
        const prefix = definition.custom && event.type === 'response.output_item.done' && !current.emitted
          ? this.inputEvents({ item_id: event.item.id, output_index: event.output_index }, current, event.item.arguments ?? current.arguments) : [];
        const item = definition.custom && event.type === 'response.output_item.done'
          ? { ...event.item, arguments: event.item.arguments ?? current.arguments } : event.item;
        return [...prefix, { ...event, item: this.item(item, event.type === 'response.output_item.added') }];
      }
    }
    if (event.response) return [{ ...event, response: this.response(event.response) }];
    return [event];
  }

  frame(frame) {
    const lines = frame.split(/\r\n|\n|\r/);
    const data = lines.filter(line => line.startsWith('data:')).map(line => line.slice(5).replace(/^ /, '')).join('\n');
    if (!data || data === '[DONE]') return frame + '\n\n';
    let event;
    try { event = JSON.parse(data); } catch { return frame + '\n\n'; }
    if (!event || typeof event !== 'object' || Array.isArray(event)) return frame + '\n\n';
    const metadata = lines.filter(line => !line.startsWith('data:') && !line.startsWith('event:'));
    const eventName = lines.find(line => line.startsWith('event:'))?.slice(6).trim();
    return this.event(event).map(value => {
      const named = value.type || eventName;
      return [...metadata, ...(named ? ['event: ' + named] : []),
        'data: ' + JSON.stringify({ ...value, sequence_number: this.sequence++ }), '', ''].join('\n');
    }).join('');
  }

  async *stream(chunks) {
    const decoder = new TextDecoder();
    let pending = '';
    const consume = function* (adapter) {
      for (;;) {
        const boundary = /\r\n\r\n|\n\n|\r\r/.exec(pending);
        if (!boundary) break;
        const frame = pending.slice(0, boundary.index);
        pending = pending.slice(boundary.index + boundary[0].length);
        const transformed = adapter.frame(frame);
        if (transformed) yield Buffer.from(transformed);
      }
    };
    for await (const chunk of chunks || []) {
      pending += decoder.decode(chunk, { stream: true });
      yield* consume(this);
      if (pending.length > 64 * 1024 * 1024) throw new HttpError(502, 'Upstream SSE event is too large.', 'upstream_error');
    }
    pending += decoder.decode();
    yield* consume(this);
    if (pending) yield Buffer.from(this.frame(pending));
  }
}
