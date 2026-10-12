import path from 'node:path';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';
const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const ch = store.channels().find(c => c.provider === 'qwen');
const key = vault.decrypt(ch.secret);
console.log('waiting 180s...');
await new Promise(r => setTimeout(r, 180000));
const tests = [
  ['chat', 'glm-5', { model: 'glm-5', messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }],
  ['mt-uni', 'qwen-mt-uni', { model: 'qwen-mt-uni', input: { target_lang: 'English', source_texts: ['Hello'] } }],
];
for (const [label, m, body] of tests) {
  try {
    const r = await fetch(ch.base_url + '/v1/chat/completions', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(25000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const t = await r.text();
    console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${label} :: ${t.slice(0,160)}`);
  } catch (ex) { console.log('ERR ', label, String(ex.message||ex)); }
  await new Promise(r => setTimeout(r, 5000));
}
