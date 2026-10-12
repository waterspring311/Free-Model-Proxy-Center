import path from 'node:path';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';
const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const ch = store.channels().find(c => c.provider === 'qwen');
const key = vault.decrypt(ch.secret);
const url = ch.base_url + '/v1/chat/completions';
const variants = [
  { name: 'F source_texts array of string', body: { model: 'qwen-mt-uni', input: { target_lang: 'English', source_texts: ['Hello'] } } },
  { name: 'G source_texts string', body: { model: 'qwen-mt-uni', input: { target_lang: 'English', source_texts: 'Hello' } } },
  { name: 'H source_texts obj', body: { model: 'qwen-mt-uni', input: { target_lang: 'English', source_texts: [{ text: 'Hello' }] } } },
  { name: 'I source_lang+source_texts', body: { model: 'qwen-mt-uni', input: { source_lang: 'auto', target_lang: 'English', source_texts: ['Hello'] } } },
];
for (const v of variants) {
  try {
    const r = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(v.body) });
    const t = await r.text();
    console.log('===', v.name, '=>', r.status);
    console.log(t.slice(0, 500));
  } catch (e) { console.log('===', v.name, 'ERR', String(e.message || e)); }
  await new Promise(r => setTimeout(r, 2500));
}
