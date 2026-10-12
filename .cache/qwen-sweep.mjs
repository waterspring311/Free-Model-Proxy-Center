import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';

const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const ch = store.channels().find(c => c.provider === 'qwen');
if (!ch) { console.log('no qwen channel'); process.exit(1); }
const key = vault.decrypt(ch.secret);
const url = ch.base_url + '/v1/chat/completions';

const rows = store.db.prepare('SELECT id, upstream_id FROM models WHERE channel_id=? AND is_free=1 ORDER BY id').all(ch.id);

function bodyFor(upstream) {
  if (upstream === 'qwen-mt-uni') {
    return { model: upstream, input: { target_lang: 'English', source_texts: ['Hello'] } };
  }
  if (/^qwen-mt-/.test(upstream)) {
    return { model: upstream, messages: [{ role: 'user', content: 'Hello' }],
      translation_options: { source_lang: 'auto', target_lang: 'English' }, max_tokens: 16, stream: false };
  }
  return { model: upstream, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false };
}

const GAP_MS = 3000;
const results = [];
let stopped = null;
console.log(`sweeping ${rows.length} qwen free models, gap ${GAP_MS}ms, sequential`);

for (const row of rows) {
  const started = Date.now();
  let status = null, ok = false, error = null, body = '';
  try {
    const r = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(bodyFor(row.upstream_id)) });
    status = r.status; ok = r.ok;
    body = await r.text().catch(() => '');
    if (!ok) {
      try { const p = JSON.parse(body); error = (p?.error?.message || p?.message || body).slice(0, 220); }
      catch { error = body.slice(0, 220); }
    }
  } catch (e) { error = String(e?.message || e).slice(0, 200); }
  const ms = Date.now() - started;
  results.push({ id: row.id, upstream: row.upstream_id, status, ok, ms, error });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${String(status ?? '-').padEnd(4)} ${String(ms).padStart(6)}ms  ${row.id}${error ? '  :: ' + error : ''}`);
  store.saveProbe({ model_id: row.id, channel_id: ch.id, at: new Date().toISOString(), ok, status, latency_ms: ms, error });
  if (status === 429) { stopped = row.id; console.log(`!! 429 rate limit on ${row.id}; stopping channel sweep`); break; }
  await new Promise(r => setTimeout(r, GAP_MS));
}

const summary = { channel: ch.id, total: rows.length, tested: results.length,
  ok: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok).length, stopped_at: stopped,
  finished_at: new Date().toISOString(), results };
writeFileSync(path.resolve('.cache/qwen-free-probe.json'), JSON.stringify(summary, null, 2));
console.log(`\nDONE tested=${summary.tested}/${summary.total} ok=${summary.ok} failed=${summary.failed}`);
