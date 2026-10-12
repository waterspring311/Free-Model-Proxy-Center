import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
const file = path.resolve('server/probes.mjs');
let src = readFileSync(file, 'utf8');

const oldFn = `function probeBody(endpoint, model) {
  if (endpoint === '/v1/responses') return { model, input: 'ping', max_output_tokens: 16, stream: false };
  if (endpoint === '/v1/messages') return { model, max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] };
  return { model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false };
}`;

const newFn = `function probeBody(endpoint, model, channel) {
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
}`;

if (!src.includes(oldFn)) { console.error('probeBody signature not found'); process.exit(1); }
src = src.replace(oldFn, newFn);

const oldCall = `body: JSON.stringify(probeBody(endpoint, model.upstream_id)),`;
const newCall = `body: JSON.stringify(probeBody(endpoint, model.upstream_id, channel)),`;
if (!src.includes(oldCall)) { console.error('probeBody call not found'); process.exit(1); }
src = src.replace(oldCall, newCall);

writeFileSync(file, src);
console.log('patched server/probes.mjs');
