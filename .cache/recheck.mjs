import path from 'node:path';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';
const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const ch = store.channels().find(c => c.provider === 'qwen');
const key = vault.decrypt(ch.secret);
const url = ch.base_url + '/v1/chat/completions';
const tests = ['glm-5','qwen-plus','qwen-flash','qwen-max','qwen-mt-plus','kimi-k3','MiniMax-M2.5'];
for (const m of tests) {
  const started = Date.now();
  try {
    const r = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(25000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: m, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }) });
    const t = await r.text();
    let e = ''; try { e = JSON.parse(t)?.error?.message || ''; } catch { e = t.slice(0,120); }
    console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${String(Date.now()-started).padStart(5)}ms ${m} :: ${e.slice(0,120)}`);
  } catch (ex) { console.log('ERR ', m, String(ex.message||ex)); }
  await new Promise(r => setTimeout(r, 3000));
}
