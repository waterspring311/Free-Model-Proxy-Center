import path from 'node:path';
import { readFileSync } from 'node:fs';
const s = JSON.parse(readFileSync(path.resolve('.cache/qwen-free-probe.json'), 'utf8'));
const byId = new Map();
for (const r of s.results) {
  const prev = byId.get(r.id);
  if (!prev || (r.ok && !prev.ok)) byId.set(r.id, r);
}
const all = [...byId.values()];
const ok = all.filter(r => r.ok);
const fail = all.filter(r => !r.ok);
console.log(`unique=${all.length} ok=${ok.length} fail=${fail.length}`);
const cat = { notfound: [], overdue: [], rate: [], denied: [], other: [] };
for (const r of fail) {
  const e = r.error || '';
  if (r.status === 404 || /does not exist|not found/i.test(e)) cat.notfound.push(r);
  else if (/overdue|good standing|balance|quota/i.test(e)) cat.overdue.push(r);
  else if (r.status === 429 || /rate limit|request limit/i.test(e)) cat.rate.push(r);
  else if (r.status === 403 || /access denied/i.test(e)) cat.denied.push(r);
  else cat.other.push(r);
}
for (const [k, v] of Object.entries(cat)) {
  if (!v.length) continue;
  console.log(`\n## ${k} (${v.length})`);
  for (const r of v) console.log(`  ${r.status} ${r.id} :: ${(r.error||'').slice(0,80)}`);
}
console.log('\n## OK list (' + ok.length + ')');
console.log(ok.map(r => r.id.replace('qwen/','')).join(', '));
