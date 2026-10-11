import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, closeSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { HttpError, mask } from './security.mjs';

async function portAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

export class Engines {
  constructor(root, store, options = {}) {
    this.root = root;
    this.store = store;
    this.disabled = options.disabled;
    this.processes = new Map();
    this.states = { opencode: { status: 'stopped' }, workbuddy: { status: 'stopped' } };
    this.sessions = {};
    this.loginJobs = {};
    this.syncJob = Promise.resolve();
    this.stopping = false;
    this.data = store.directory;
    mkdirSync(path.join(this.data, 'logs'), { recursive: true });
  }

  binary() {
    if (process.env.ONEHUB_OPENCODE_BIN) return path.resolve(process.env.ONEHUB_OPENCODE_BIN);
    const runtime = path.join(this.root, 'runtime');
    if (!existsSync(runtime)) return null;
    for (const directory of readdirSync(runtime).filter(name => name.startsWith('opencode2api_')).sort().reverse()) {
      const file = path.join(runtime, directory, process.platform === 'win32' ? 'opencode2api.exe' : 'opencode2api');
      if (existsSync(file)) return file;
    }
    return null;
  }

  writeOpenCodeConfig() {
    const directory = path.join(this.data, 'opencode');
    mkdirSync(directory, { recursive: true });
    const file = path.join(directory, 'config.json');
    const keys = this.store.accounts().filter(account => account.enabled);
    let previous = {};
    if (existsSync(file)) {
      try { previous = JSON.parse(readFileSync(file, 'utf8')); } catch { /* Recreate only OneHub-owned configuration. */ }
    }
    const config = {
      listen: '127.0.0.1:8080',
      server_keys: [this.store.secret('opencode_api_key')],
      zen_keys: keys.filter(row => row.kind === 'zen').map(row => this.store.vault.decrypt(row.secret)),
      go_keys: keys.filter(row => row.kind === 'go').map(row => this.store.vault.decrypt(row.secret)),
      anonymous: this.store.get('anonymous_enabled', true),
      proxies: ['direct'],
      prefer: 'go',
      retry: { max_attempts: 2, timeout_seconds: this.store.get('timeout_seconds', 300) },
      models: { refresh_seconds: 300, protocols: {} },
      logging: { level: 'info', ring_size: 1000, dump_request_bodies: false },
      webui: {
        enabled: true, listen: '127.0.0.1:8081', username: 'onehub-internal',
        ...(previous.webui?.password_hash
          ? { password_hash: previous.webui.password_hash }
          : { password: this.store.secret('opencode_panel_password') }),
        session_ttl_minutes: 720,
      },
    };
    writeFileSync(file + '.new', JSON.stringify(config, null, 2), { mode: 0o600 });
    renameSync(file + '.new', file);
    return { file, usable: config.anonymous || config.zen_keys.length > 0 || config.go_keys.length > 0 };
  }

  async start() {
    if (this.disabled) return;
    await Promise.all([this.startOne('opencode'), this.startOne('workbuddy')]);
  }

  async startOne(provider) {
    if (this.disabled || this.stopping || this.processes.has(provider)) return;
    const ports = provider === 'opencode' ? [8080, 8081] : [8788];
    for (const port of ports) {
      if (!await portAvailable(port)) {
        this.states[provider] = { status: 'port_conflict', message: `Port ${port} belongs to another service.` };
        return;
      }
    }
    let command, args, env = { ...process.env, PYTHONUNBUFFERED: '1', TZ: 'Asia/Shanghai' };
    if (provider === 'opencode') {
      command = this.binary();
      if (!command) {
        this.states[provider] = { status: 'missing', message: 'OpenCode engine is not installed. Run npm run setup.' };
        return;
      }
      const config = this.writeOpenCodeConfig();
      if (!config.usable) {
        this.states[provider] = { status: 'needs_account', message: 'Add a Zen/Go key or enable the public channel.' };
        return;
      }
      args = ['-config', config.file];
    } else {
      if (!existsSync(path.join(this.root, 'upstream/workbuddy2api-hub/wb_proxy.py'))) {
        this.states[provider] = { status: 'missing', message: 'WorkBuddy engine source is missing. Run npm run setup.' };
        return;
      }
      command = process.env.ONEHUB_PYTHON || 'python';
      const accounts = path.join(this.data, 'workbuddy/accounts');
      mkdirSync(accounts, { recursive: true });
      args = [path.join(this.root, 'scripts/workbuddy-entry.py'), '--host', '127.0.0.1', '--port', '8788',
        '--accounts-dir', accounts, '--usage-dir', path.join(this.data, 'workbuddy/usage')];
      env = {
        ...env, ACCOUNTS_DIR: accounts, API_KEY: this.store.secret('workbuddy_api_key'),
        ONEHUB_WB_PANEL_PASSWORD: this.store.secret('workbuddy_panel_password'),
      };
    }
    const fd = openSync(path.join(this.data, 'logs', provider + '.log'), 'a', 0o600);
    const child = spawn(command, args, { cwd: this.root, env, stdio: ['ignore', fd, fd], windowsHide: true });
    closeSync(fd);
    this.processes.set(provider, child);
    this.states[provider] = { status: 'starting', pid: child.pid || null };
    child.once('error', () => {
      this.processes.delete(provider);
      this.states[provider] = { status: 'error', message: 'Engine failed to start. Check its local log.' };
    });
    child.once('exit', (code) => {
      if (this.processes.get(provider) === child) this.processes.delete(provider);
      this.states[provider] = { status: 'stopped', exit_code: code };
      delete this.sessions[provider];
    });
  }

  async stopOne(provider) {
    const child = this.processes.get(provider);
    if (!child) return;
    await new Promise(resolve => {
      const timer = setTimeout(resolve, 5000);
      child.once('exit', () => { clearTimeout(timer); resolve(); });
      child.kill();
    });
    this.processes.delete(provider);
    delete this.sessions[provider];
  }

  async restart(provider) {
    if (!['opencode', 'workbuddy'].includes(provider)) throw new HttpError(400, 'Unknown engine.');
    await this.stopOne(provider);
    await this.startOne(provider);
    return this.states[provider];
  }

  async stop() {
    this.stopping = true;
    await Promise.all([...this.processes.keys()].map(provider => this.stopOne(provider)));
  }

  key(channel) {
    return channel.managed ? this.store.secret(channel.provider + '_api_key') : this.store.vault.decrypt(channel.secret);
  }

  headers(channel) {
    return { Authorization: `Bearer ${this.key(channel)}`, ...(channel.realm ? { 'X-Realm': channel.realm } : {}) };
  }

  async health(channel) {
    const started = performance.now();
    try {
      const response = await fetch(channel.base_url + (channel.provider === 'opencode' ? '/healthz' : '/health'), {
        headers: this.headers(channel), redirect: 'error', signal: AbortSignal.timeout(2500),
      });
      const body = await response.json();
      const reachable = response.ok || (channel.provider === 'opencode' && response.status === 503 && body.ready === false);
      const ready = channel.provider === 'workbuddy' ? body.accounts_ready > 0 : body.ready !== false;
      if (reachable && channel.managed && this.processes.has(channel.provider)) {
        this.states[channel.provider] = { status: 'running', pid: this.processes.get(channel.provider).pid };
      }
      return { status: reachable ? (ready ? 'online' : 'degraded') : 'error',
        latency_ms: Math.round(performance.now() - started), ready: reachable && ready };
    } catch {
      return { status: 'offline', latency_ms: null, ready: false };
    }
  }

  async login(provider) {
    if (this.loginJobs[provider]) return this.loginJobs[provider];
    const job = (async () => {
      const url = provider === 'opencode' ? 'http://127.0.0.1:8081/api/auth/login' : 'http://127.0.0.1:8788/panel/login';
      let response;
      try {
        response = await fetch(url, {
          method: 'POST', redirect: 'error',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'onehub-internal', password: this.store.secret(provider + '_panel_password') }),
          signal: AbortSignal.timeout(10000),
        });
      } catch { throw new HttpError(503, '对应引擎未启动，请在渠道页检查状态。', 'service_unavailable'); }
      if (!response.ok) throw new HttpError(502, '引擎管理认证失败，请检查本地引擎日志。', 'upstream_error');
      const body = await response.json();
      const session = provider === 'opencode'
        ? { cookie: (response.headers.get('set-cookie') || '').split(';')[0], csrf: body.csrf_token }
        : { token: body.token };
      this.sessions[provider] = session;
      return session;
    })();
    this.loginJobs[provider] = job;
    try { return await job; } finally { delete this.loginJobs[provider]; }
  }

  async admin(provider, endpoint, method = 'GET', payload, retry = true) {
    const session = this.sessions[provider] || await this.login(provider);
    const base = provider === 'opencode' ? 'http://127.0.0.1:8081' : 'http://127.0.0.1:8788';
    const headers = {
      'Content-Type': 'application/json',
      ...(provider === 'opencode' ? { Cookie: session.cookie, 'X-CSRF-Token': session.csrf } : { 'X-Panel-Token': session.token }),
    };
    let response;
    try {
      response = await fetch(base + endpoint, { method, headers, redirect: 'error',
        body: payload === undefined ? undefined : JSON.stringify(payload),
        signal: AbortSignal.timeout(60000) });
    } catch { throw new HttpError(503, '引擎不可达或操作超时，请检查渠道状态。', 'service_unavailable'); }
    if (response.status === 401 && retry) {
      delete this.sessions[provider];
      return this.admin(provider, endpoint, method, payload, false);
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new HttpError(response.status, '引擎操作失败，请检查参数、账号状态或本地日志。', 'upstream_error');
    return body;
  }

  syncOpenCode() {
    const job = this.syncJob.catch(() => {}).then(async () => {
      const config = this.writeOpenCodeConfig();
      if (this.disabled) return;
      if (!config.usable) { await this.stopOne('opencode'); return; }
      if (!this.processes.has('opencode')) { await this.startOne('opencode'); return; }
      await this.admin('opencode', '/api/config/reload', 'POST', {});
    });
    this.syncJob = job;
    return job;
  }

  async accounts() {
    const rows = this.store.accounts().map(account => ({
      id: account.id, name: account.name, provider: 'opencode', kind: account.kind,
      enabled: !!account.enabled, display: mask(this.store.vault.decrypt(account.secret)),
      status: account.enabled ? 'enabled' : 'disabled', credits: null, expires_at: null,
      created_at: account.created_at,
    }));
    rows.unshift({
      id: 'public', name: '公开免费通道', provider: 'opencode', kind: 'anonymous',
      enabled: this.store.get('anonymous_enabled', true), display: 'public',
      status: this.store.get('anonymous_enabled', true) ? 'enabled' : 'disabled',
      credits: null, expires_at: null,
    });
    let workbuddyError = null;
    try {
      const responses = await Promise.all(['intl', 'cn'].map(realm => this.admin('workbuddy', '/accounts?realm=' + realm)));
      for (const response of responses) for (const row of response.accounts || []) {
        rows.push({
          id: 'wb:' + row.uid, uid: row.uid, name: row.nickname, provider: 'workbuddy', kind: row.realm,
          enabled: !!row.enabled, display: row.uid?.slice(0, 8),
          status: !row.enabled ? 'disabled' : row.inCooldown || row.reserveBlocked || row.dailyLimitBlocked
            ? 'limited' : row.expiresAt && row.expiresAt * 1000 < Date.now() ? 'expired' : 'enabled',
          credits: typeof row.credits?.remain === 'number' ? row.credits.remain : null,
          expires_at: row.expiresAt ? new Date(row.expiresAt * 1000).toISOString() : null,
          refreshable: !!row.hasRefreshToken, created_at: row.addedAt, cooldowns: row.modelCooldowns || [],
        });
      }
    } catch { workbuddyError = 'WorkBuddy 引擎暂不可达'; }
    return { accounts: rows, workbuddy_error: workbuddyError };
  }
}
