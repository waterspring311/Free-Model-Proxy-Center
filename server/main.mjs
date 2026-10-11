import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let vite;
if (process.argv.includes('--dev')) {
  const { createServer } = await import('vite');
  vite = await createServer({ root, server: { middlewareMode: true, hmr: false }, appType: 'spa' });
}
const directory = process.env.ONEHUB_DATA_DIR ? path.resolve(process.env.ONEHUB_DATA_DIR) : path.join(root, 'data');
const app = createApp({
  root, directory, disableEngines: process.env.ONEHUB_NO_ENGINES === '1', frontend: vite?.middlewares,
  probe: process.env.ONEHUB_NO_PROBES !== '1',
});
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await app.close();
  await vite?.close();
}
process.on('SIGINT', () => stop().then(() => process.exit(0)));
process.on('SIGTERM', () => stop().then(() => process.exit(0)));
try {
  const address = await app.start(Number(process.env.ONEHUB_PORT || 3000));
  console.log(`OneHub: http://127.0.0.1:${address.port}/`);
  console.log(`API:    http://127.0.0.1:${address.port}/v1`);
  console.log('First visit: create an administrator. Upstream credentials are never imported automatically.');
} catch (error) {
  console.error('OneHub startup failed:', error.message);
  await stop();
  process.exitCode = 1;
}
