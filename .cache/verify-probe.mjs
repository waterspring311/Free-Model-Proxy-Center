import path from 'node:path';
import { createVault } from '../server/security.mjs';
import { createStore } from '../server/store.mjs';
import { Engines } from '../server/engines.mjs';
import { Catalog } from '../server/catalog.mjs';
import { ModelProber } from '../server/probes.mjs';

const data = path.resolve('data');
const vault = createVault(data);
const store = createStore(data, vault);
const engines = new Engines(path.resolve('.'), store, { disabled: true });
const catalog = new Catalog(store, engines);
const prober = new ModelProber(store, catalog, engines);
const ch = store.channels().find(c => c.provider === 'qwen');
for (const upstream of ['qwen-mt-uni', 'qwen-mt-plus', 'qwen-mt-flash', 'qwen-mt-lite']) {
  const model = { id: 'qwen/' + upstream, upstream_id: upstream, channel_id: ch.id };
  const r = await prober.attempt(model, ch);
  console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${upstream} :: ${r.error || ''}`);
}
