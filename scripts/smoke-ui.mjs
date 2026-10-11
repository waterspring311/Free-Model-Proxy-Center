import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';
import { createApp } from '../server/app.mjs';
import { mask } from '../server/security.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const screenshots = path.join(root, 'artifacts', 'ui');
const directory = await mkdtemp(path.join(os.tmpdir(), 'onehub-ui-'));
const accounts = [], flows = new Map(), errors = [];
let app, upstream, browser;

function step(message) { console.log('UI:', message); }
async function capture(page, name) {
  await page.screenshot({ path: path.join(screenshots, name + '.png'), fullPage: true });
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth, page: document.documentElement.scrollWidth,
  }));
  assert.ok(dimensions.page <= dimensions.viewport + 1, `${name}: page overflows horizontally ${JSON.stringify(dimensions)}`);
}
async function navigate(page, id, title) {
  if (page.viewportSize().width <= 700 && !await page.locator('.sidebar.visible').count()) {
    await page.getByRole('button', { name: '打开导航', exact: true }).click();
  }
  await page.locator(`.sidebar nav a[href="#${id}"]`).click();
  await expect(page.getByRole('heading', { name: title, exact: true, level: 1 })).toBeVisible();
  await page.locator('.loading').waitFor({ state: 'hidden' });
}
function watch(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
}

try {
  if (!existsSync(path.join(root, 'dist', 'index.html'))) throw new Error('Run npm run build before the UI test.');
  await mkdir(screenshots, { recursive: true });
  upstream = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url.split('?')[0] === '/v1/models') {
      res.end(JSON.stringify({ data: [
        { id: 'shared-model', context_length: 128000, cost: { input: 0, output: 0 }, credits: 'x0.00', pricing_source: 'product_config' },
        { id: 'fast-model', cost: { input: 1, output: 1 }, credits: 'x0.29', pricing_source: 'product_config' },
        { id: 'error-model' },
      ] }));
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const input = JSON.parse(Buffer.concat(chunks).toString());
    if (input.model === 'error-model') {
      res.writeHead(429); res.end(JSON.stringify({ error: { message: 'Simulated upstream rate limit' } })); return;
    }
    const usage = { prompt_tokens: 10, completion_tokens: 5, prompt_tokens_details: { cached_tokens: 3 } };
    if (input.stream) {
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      res.write('data: {"choices":[{"delta":{"content":"模拟响应"}}]}\n\n');
      res.write('data: ' + JSON.stringify({ choices: [], usage }) + '\n\n');
      res.end('data: [DONE]\n\n');
    } else {
      res.end(JSON.stringify({ model: input.model, choices: [{ message: { role: 'assistant', content: '模拟响应' } }], usage }));
    }
  });
  await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
  const engines = {
    states: { opencode: { status: 'running' }, workbuddy: { status: 'running' } },
    start: async () => {}, stop: async () => {}, syncOpenCode: async () => {},
    restart: async provider => ({ status: 'running', provider }),
    key: () => 'mock-internal-key',
    headers: channel => ({ Authorization: 'Bearer mock-internal-key', ...(channel.realm ? { 'X-Realm': channel.realm } : {}) }),
    health: async channel => {
      const ready = channel.provider === 'opencode' || accounts.some(row => row.enabled && row.kind === channel.realm);
      return { ready, status: ready ? 'online' : 'degraded', latency_ms: 2 };
    },
    accounts: async () => ({ accounts: [
      { id: 'public', name: '公开免费通道', provider: 'opencode', kind: 'anonymous', enabled: app.store.get('anonymous_enabled'),
        status: app.store.get('anonymous_enabled') ? 'enabled' : 'disabled', display: 'public' },
      ...app.store.accounts().map(row => ({ ...row, secret: undefined, enabled: !!row.enabled,
        provider: 'opencode', display: mask(app.store.vault.decrypt(row.secret)), status: row.enabled ? 'enabled' : 'disabled' })),
      ...accounts.map(row => ({ ...row, status: row.enabled ? 'enabled' : 'disabled' })),
    ], workbuddy_error: null }),
    admin: async (provider, endpoint, method, body) => {
      if (endpoint.endsWith('/import')) {
        const input = Array.isArray(body.data) ? body.data : body.data.accounts || [body.data];
        const added = [];
        for (const row of input) {
          const uid = row.uid || 'ui-wb-' + accounts.length;
          if (accounts.some(item => item.uid === uid)) continue;
          accounts.push({ id: 'wb:' + uid, uid, name: row.nickname || '导入账号', display: uid, provider: 'workbuddy',
            kind: body.realm, enabled: true, credits: 200, refreshable: true, expires_at: new Date(Date.now() + 86400000).toISOString() });
          added.push(uid);
        }
        return { count: accounts.length, result: { added, skipped: [], invalid: [] } };
      }
      if (endpoint.endsWith('/start')) {
        flows.set('ui-oauth-state', body.realm);
        return { state: 'ui-oauth-state', authUrl: 'https://example.com/onehub-ui-mock-oauth' };
      }
      if (endpoint.includes('/poll')) {
        const kind = flows.get('ui-oauth-state');
        if (kind) {
          accounts.push({ id: 'wb:ui-oauth', uid: 'ui-oauth', name: 'OAuth 测试账号', provider: 'workbuddy',
            kind, enabled: true, credits: 120, refreshable: true, display: 'ui-oauth' });
          flows.delete('ui-oauth-state');
        }
        return { status: 'ok' };
      }
      if (endpoint.endsWith('/cancel')) { flows.delete(body.state); return { ok: true }; }
      const row = accounts.find(account => account.uid === body?.uid);
      if (endpoint.endsWith('/set') && row) row.enabled = body.enabled;
      if (endpoint.endsWith('/delete') && row) accounts.splice(accounts.indexOf(row), 1);
      if (endpoint.endsWith('/credits') || endpoint.endsWith('/refresh')) {
        return { results: row ? [{ uid: row.uid, ok: row.uid !== 'ui-failed', error: 'mock credential failure' }] : [] };
      }
      return { ok: true };
    },
  };
  app = createApp({ root, directory, engines });
  app.store.db.prepare('UPDATE channels SET base_url=?').run('http://127.0.0.1:' + upstream.address().port);
  const address = await app.start(0), base = 'http://127.0.0.1:' + address.port;
  const executablePath = [
    process.env.ONEHUB_BROWSER,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].find(file => file && existsSync(file));
  browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000); watch(page);
  await page.goto(base);
  await expect(page.getByRole('heading', { name: '总览', exact: true })).toBeVisible();
  await capture(page, 'desktop-overview-initial');
  step('console opens without a login screen');

  await navigate(page, 'accounts', '账号管理');
  await page.getByRole('button', { name: '添加账号', exact: true }).first().click();
  let dialog = page.getByRole('dialog');
  await dialog.getByLabel('账号名称', { exact: true }).fill('UI Zen');
  await dialog.getByLabel('上游 Key（每行一个）', { exact: true }).fill('mock-zen-key-000000001\nmock-zen-key-000000002');
  await dialog.getByRole('button', { name: '添加 Key', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('UI Zen 1', { exact: true })).toBeVisible();
  await page.getByRole('switch', { name: '停用 UI Zen 1', exact: true }).click();
  await expect(page.getByRole('switch', { name: '启用 UI Zen 1', exact: true })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: '编辑 UI Zen 1', exact: true }).click();
  await page.getByRole('dialog').getByLabel('账号名称', { exact: true }).fill('UI Zen 已修改');
  await page.getByRole('dialog').getByRole('button', { name: '保存', exact: true }).click();
  await expect(page.getByText('UI Zen 已修改', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '添加账号', exact: true }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'WorkBuddy / CodeBuddy', exact: true }).click();
  await dialog.getByRole('button', { name: 'JSON 导入', exact: true }).click();
  await dialog.getByLabel('账号 JSON', { exact: true }).fill(JSON.stringify([
    { uid: 'ui-imported', nickname: '导入测试账号', accessToken: 'mock-only' },
    { uid: 'ui-failed', nickname: '失效测试账号', accessToken: 'mock-only' },
  ]));
  await dialog.getByRole('button', { name: '导入账号', exact: true }).click();
  await expect(dialog.getByText('新增 2', { exact: true })).toBeVisible();
  await dialog.locator('footer').getByRole('button', { name: '关闭', exact: true }).click();
  await page.getByRole('button', { name: '刷新额度 导入测试账号', exact: true }).click();
  await expect(page.getByText('额度已刷新', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '刷新额度 失效测试账号', exact: true }).click();
  await expect(page.getByText('额度查询失败，请检查账号状态或重新授权。', { exact: true })).toBeVisible();
  await page.getByRole('switch', { name: '停用 导入测试账号', exact: true }).click();
  await expect(page.getByRole('switch', { name: '启用 导入测试账号', exact: true })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('switch', { name: '启用 导入测试账号', exact: true }).click();
  await page.getByRole('button', { name: '添加账号', exact: true }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'WorkBuddy / CodeBuddy', exact: true }).click();
  await dialog.getByLabel('账号区域', { exact: true }).selectOption('cn');
  await dialog.getByRole('button', { name: '获取授权链接', exact: true }).click();
  await expect(dialog.getByRole('link', { name: '打开授权页' })).toHaveAttribute('href', 'https://example.com/onehub-ui-mock-oauth');
  await expect(dialog.getByText('账号已加入工作空间', { exact: true })).toBeVisible({ timeout: 15000 });
  await dialog.getByRole('button', { name: '完成', exact: true }).click();
  await capture(page, 'desktop-accounts');
  step('batch Zen keys, WorkBuddy import, mock OAuth, toggles and truthful credit failures');

  await navigate(page, 'models', '模型管理');
  await page.getByRole('button', { name: '创建别名', exact: true }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('别名', { exact: true }).fill('local-default');
  await dialog.getByLabel('目标模型', { exact: true }).fill('opencode/shared-model');
  await dialog.getByRole('button', { name: '保存别名', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole('button', { name: /模型别名/ }).click();
  await expect(page.locator('tbody').getByText('local-default', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /模型目录/ }).click();
  await page.getByRole('button', { name: '查看 opencode/shared-model', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '模型详情' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '查看 opencode/shared-model', exact: true })).toBeFocused();
  await capture(page, 'desktop-models');

  await navigate(page, 'keys', 'API Keys');
  await page.getByRole('button', { name: '创建 Key', exact: true }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Key 名称', { exact: true }).fill('UI 客户端');
  await dialog.getByRole('button', { name: '指定渠道', exact: true }).click();
  await dialog.getByRole('checkbox', { name: 'OpenCode Zen / Go', exact: true }).check();
  await dialog.getByLabel('模型白名单（可选，每行一个；支持 * 后缀）', { exact: true }).fill('local-default');
  await dialog.getByLabel('每日 Token 软上限', { exact: true }).fill('10000');
  await dialog.getByRole('button', { name: '创建 Key', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'API Key 已创建', exact: true })).toBeVisible();
  const key = (await page.locator('.revealed-key code').textContent()).trim();
  assert.match(key, /^sk-onehub-/);
  await page.getByRole('dialog').getByRole('button', { name: '完成', exact: true }).click();
  const clientHeaders = { Authorization: 'Bearer ' + key };
  const discovered = await context.request.get(base + '/v1/models', { headers: clientHeaders });
  assert.deepEqual((await discovered.json()).data.map(row => row.id), ['local-default']);
  for (const stream of [false, true]) {
    const response = await context.request.post(base + '/v1/chat/completions', {
      headers: clientHeaders, data: { model: 'local-default', messages: [{ role: 'user', content: 'UI mock' }], stream },
    });
    assert.equal(response.status(), 200);
    if (stream) assert.match(await response.text(), /\[DONE\]/);
  }
  const denied = await context.request.post(base + '/v1/chat/completions', {
    headers: clientHeaders, data: { model: 'workbuddy/shared-model', messages: [] },
  });
  assert.equal(denied.status(), 403);
  await page.getByRole('button', { name: '编辑 UI 客户端', exact: true }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Key 名称', { exact: true }).fill('UI 客户端已编辑');
  await dialog.getByLabel('每分钟请求上限', { exact: true }).fill('90');
  await dialog.getByRole('button', { name: '保存 Key', exact: true }).click();
  await expect(page.getByText('UI 客户端已编辑', { exact: true })).toBeVisible();
  await expect(page.locator('tbody')).toContainText('90 RPM');
  await page.getByRole('switch', { name: '停用 UI 客户端已编辑', exact: true }).click();
  await expect(page.getByRole('switch', { name: '启用 UI 客户端已编辑', exact: true })).toHaveAttribute('aria-checked', 'false');
  assert.equal((await context.request.get(base + '/v1/models', { headers: clientHeaders })).status(), 401);
  await page.getByRole('switch', { name: '启用 UI 客户端已编辑', exact: true }).click();
  await capture(page, 'desktop-keys');
  step('model aliases, model details, scoped API keys, key editing and actual JSON/SSE gateway calls');

  await navigate(page, 'requests', '请求日志');
  await expect(page.locator('tbody')).toContainText('local-default');
  await page.locator('tbody tr').filter({ hasText: 'local-default' }).first().click();
  await expect(page.getByRole('dialog', { name: '请求详情' }).locator('dl > div').filter({ hasText: '输入 Token' })).toContainText('10');
  await expect(page.getByRole('dialog', { name: '请求详情' }).locator('dl > div').filter({ hasText: '输出 Token' })).toContainText('5');
  await page.keyboard.press('Escape');
  await page.getByLabel('仅异常', { exact: true }).check();
  await expect(page.locator('tbody')).toContainText('403');
  await expect(page.locator('.error-flag').first()).toBeVisible();
  await page.locator('tbody tr').filter({ hasText: '403' }).first().click();
  await expect(page.getByRole('dialog').locator('.error-detail')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByLabel('仅异常', { exact: true }).uncheck();
  await capture(page, 'desktop-requests');
  for (let i = 0; i < 30; i++) {
    const response = await context.request.post(base + '/v1/chat/completions', {
      headers: clientHeaders, data: { model: 'local-default', messages: [] },
    });
    assert.equal(response.status(), 200);
  }
  await page.getByRole('button', { name: '刷新', exact: true }).click();
  await expect(page.getByRole('button', { name: '下一页', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: '下一页', exact: true }).click();
  await expect(page.locator('.pagination')).toContainText('2 / 2');
  step('request log details, error filters and pagination');

  await navigate(page, 'channels', '渠道管理');
  await page.getByRole('button', { name: '编辑 OpenCode Zen / Go', exact: true }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('并发上限', { exact: true }).fill('6');
  await dialog.getByRole('button', { name: '保存渠道', exact: true }).click();
  await expect(page.locator('tbody tr').filter({ hasText: 'OpenCode Zen / Go' })).toContainText('0 / 6');
  await capture(page, 'desktop-channels');
  await navigate(page, 'status', '渠道状态');
  await expect(page.locator('.status-block').first()).toBeVisible();
  await expect(page.locator('.component-row').first()).toBeVisible();
  await expect(page.locator('.uptime-row').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '可用率趋势', exact: true, level: 2 })).toBeVisible();
  await expect(page.locator('.range-switch button.active')).toHaveText('近90分钟');
  await page.getByRole('button', { name: '今日 · 按小时', exact: true }).click();
  await expect(page.locator('.range-switch button.active')).toHaveText('今日 · 按小时');
  await page.getByRole('button', { name: '近90分钟', exact: true }).click();
  await expect(page.locator('.range-switch button.active')).toHaveText('近90分钟');
  await expect(page.locator('.channel-models')).toHaveCount(0);
  await page.locator('.model-toggle').first().click();
  await expect(page.locator('.channel-models')).toBeVisible();
  await expect(page.locator('.channel-models .model-row').first()).toBeVisible();
  await page.locator('.model-toggle').first().click();
  await expect(page.locator('.channel-models')).toHaveCount(0);
  await capture(page, 'desktop-channel-status');
  await navigate(page, 'tokens', 'Token 看板');
  await expect(page.locator('.heat-row').first()).toBeVisible();
  await expect(page.locator('.stat-box')).toHaveCount(6);
  const tabs = page.locator('.heat-head .text-tabs button');
  await expect(tabs.first()).toBeVisible();
  const seriesCount = await tabs.count() - 1;
  await expect(page.locator('.heat-row')).toHaveCount(seriesCount + 1);
  await tabs.nth(1).click();
  await expect(page.locator('.heat-row')).toHaveCount(seriesCount);
  await tabs.first().click();
  await expect(page.locator('.heat-row')).toHaveCount(seriesCount + 1);
  await capture(page, 'desktop-tokens');
  await navigate(page, 'settings', '设置');
  await page.getByLabel('请求超时（秒）', { exact: true }).fill('120');
  await page.getByLabel('模型目录缓存（秒）', { exact: true }).fill('180');
  await page.getByRole('button', { name: '保存设置', exact: true }).click();
  await expect(page.getByText('网关设置已保存', { exact: true })).toBeVisible();
  await page.getByRole('switch', { name: '仅允许免费模型', exact: true }).click();
  await expect(page.getByRole('switch', { name: '仅允许免费模型', exact: true })).toHaveAttribute('aria-checked', 'true');
  await navigate(page, 'models', '模型管理');
  await expect(page.locator('tbody')).not.toContainText('fast-model');
  await expect(page.locator('tbody')).not.toContainText('error-model');
  await expect(page.getByText('仅允许免费模型', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '查看 workbuddy/shared-model', exact: true }).click();
  await expect(page.getByRole('dialog').locator('dl > div').filter({ hasText: '计费倍率' })).toContainText('x0.00');
  await page.keyboard.press('Escape');
  const paid = await context.request.post(base + '/v1/chat/completions', {
    headers: clientHeaders, data: { model: 'workbuddy/fast-model', messages: [] },
  });
  assert.equal(paid.status(), 403);
  await capture(page, 'desktop-free-only-models');
  await navigate(page, 'settings', '设置');
  step('free-only setting, hidden paid models, pricing details and blocked paid API calls');
  await page.getByRole('button', { name: '操作记录', exact: true }).click();
  await expect(page.locator('tbody')).toContainText('key.patch');
  await navigate(page, 'overview', '总览');
  await capture(page, 'desktop-overview');
  step('channels, gateway settings, audit log and desktop layout');

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'zh-CN', timezoneId: 'Asia/Shanghai',
    storageState: await context.storageState(),
  });
  const mobile = await mobileContext.newPage(); watch(mobile);
  await mobile.goto(base);
  await expect(mobile.getByRole('heading', { name: '总览', exact: true })).toBeVisible();
  await mobile.locator('.loading').waitFor({ state: 'hidden' });
  await capture(mobile, 'mobile-overview');
  for (const [id, title] of [['accounts', '账号管理'], ['channels', '渠道管理'], ['status', '渠道状态'], ['tokens', 'Token 看板'], ['models', '模型管理'], ['keys', 'API Keys'], ['requests', '请求日志'], ['settings', '设置']]) {
    await navigate(mobile, id, title);
    await capture(mobile, 'mobile-' + id);
  }
  await navigate(mobile, 'accounts', '账号管理');
  await mobile.getByRole('button', { name: '添加账号', exact: true }).first().click();
  await expect(mobile.getByRole('dialog')).toBeVisible();
  const bounds = await mobile.getByRole('dialog').boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y >= 0 && bounds.y + bounds.height <= 845);
  await capture(mobile, 'mobile-add-account');
  await mobile.keyboard.press('Escape');
  await mobileContext.close();
  step('390px mobile navigation, all pages and account modal: no horizontal page overflow');

  await navigate(page, 'settings', '设置');
  await page.getByRole('button', { name: '安全', exact: true }).click();
  await expect(page.getByText('凭据存储', { exact: true })).toBeVisible();
  await expect(page.getByLabel('当前密码', { exact: true })).toHaveCount(0);
  step('security tab keeps credential facts and has no password form');
  assert.deepEqual(errors, [], 'Browser runtime or console errors');
  console.log('PASS: isolated browser smoke test. Screenshots: ' + screenshots);
} catch (error) {
  if (browser) {
    const pages = browser.contexts().flatMap(context => context.pages());
    for (const [index, page] of pages.entries()) await page.screenshot({ path: path.join(screenshots, 'failure-' + index + '.png'), fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser?.close();
  await app?.close();
  upstream?.closeAllConnections();
  if (upstream) await new Promise(resolve => upstream.close(resolve));
  const resolved = path.resolve(directory);
  assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
  assert.ok(path.basename(resolved).startsWith('onehub-ui-'));
  await rm(resolved, { recursive: true, force: true });
}
