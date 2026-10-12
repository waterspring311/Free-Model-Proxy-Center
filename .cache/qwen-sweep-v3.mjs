import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';

const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const ch = store.channels().find(c => c.provider === 'qwen');
const key = vault.decrypt(ch.secret);
const url = ch.base_url + '/v1/chat/completions';
const all = store.db.prepare('SELECT id, upstream_id FROM models WHERE channel_id=? AND is_free=1 ORDER BY id').all(ch.id);

let prior = { results: [] };
try { prior = JSON.parse(readFileSync(path.resolve('.cache/qwen-free-probe.json'), 'utf8')); } catch {}
const tested = new Set(prior.results.map(r => r.id));
const queue = all.filter(r => !tested.has(r.id));
console.log(`continue: ${queue.length} untested (${tested.size} already recorded)`);

function bodyFor(upstream) {
  if (upstream === 'qwen-mt-uni') return { model: upstream, input: { target_lang: 'English', source_texts: ['Hello'] } };
  if (/^qwen-mt-/.test(upstream)) return { model: upstream, messages: [{ role: 'user', content: 'Hello' }],
    translation_options: { source_lang: 'auto', target_lang: 'English' }, max_tokens: 16, stream: false };
  return { model: upstream, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false };
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const GAP = 6000;
const results = prior.results.slice();
let consecutive429 = 0;

async function once(upstream) {
  const started = Date.now();
  try {
    const r = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(bodyFor(upstream)) });
    const t = await r.text().catch(() => '');
    let error = null;
    if (!r.ok) { try { const p = JSON.parse(t); error = (p?.error?.message || p?.message || t).slice(0, 220); } catch { error = t.slice(0, 220); } }
    return { status: r.status, ok: r.ok, ms: Date.now() - started, error };
  } catch (e) { return { status: null, ok: false, ms: Date.now() - started, error: String(e?.message || e).slice(0, 200) }; }
}

for (const row of queue) {
  const res = await once(row.upstream_id);
  results.push({ id: row.id, upstream: row.upstream_id, ...res });
  store.saveProbe({ model_id: row.id, channel_id: ch.id, at: new Date().toISOString(), ok: res.ok, status: res.status, latency_ms: res.ms, error: res.error });
  console.log(`${res.ok ? 'OK  ' : 'FAIL'} ${String(res.status ?? '-').padEnd(4)} ${String(res.ms).padStart(6)}ms  ${row.id}${res.error ? '  :: ' + res.error : ''}`);
  consecutive429 = res.status === 429 ? consecutive429 + 1 : 0;
  if (consecutive429 >= 5) { console.log('!! 5 consecutive 429s; pausing sweep to respect the account limit'); break; }
  await sleep(res.status === 429 ? 15000 : GAP);
}

const summary = { channel: ch.id, total: all.length, tested: results.length,
  ok: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok).length,
  finished_at: new Date().toISOString(), results };
writeFileSync(path.resolve('.cache/qwen-free-probe.json'), JSON.stringify(summary, null, 2));
console.log(`\nPROGRESS tested=${summary.tested}/${summary.total} ok=${summary.ok} failed=${summary.failed}`);
