import path from 'node:path';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';
const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const ch = store.channels().find(c => c.provider === 'qwen');
const key = vault.decrypt(ch.secret);
const url = ch.base_url + '/v1/chat/completions';
const tests = ['glm-5','glm-5.3','qwen-plus','qwen-flash','qwen-max','qwen-long','kimi-k3','MiniMax-M2.5','deepseek-v4-pro','qwen3-coder-flash','qwen-vl-ocr','qwen3.5-122b-a10b','qwen3.5-27b','qwen-mt-plus','qwen-mt-flash','qwen-mt-lite'];
for (const m of tests) {
  const isMt = /^qwen-mt-/.test(m);
  const body = isMt
    ? { model: m, messages: [{ role: 'user', content: 'Hello' }], translation_options: { source_lang: 'auto', target_lang: 'English' }, max_tokens: 16, stream: false }
    : { model: m, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false };
  try {
    const r = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(25000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const t = await r.text();
    let e = ''; try { e = JSON.parse(t)?.error?.message || ''; } catch { e = t.slice(0,100); }
    console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${m.padEnd(22)} ${e.slice(0,80)}`);
  } catch (ex) { console.log('ERR ', m, String(ex.message||ex)); }
  await new Promise(r => setTimeout(r, 4000));
}
