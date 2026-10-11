/*
 * OneHub portable launcher.
 *
 * Modes:
 *   (no args)   start the gateway in the background and open the console
 *   --console   run the gateway in this process so logs stay visible
 *   --server    internal mode used by the background launcher
 *   --stop      stop the running gateway (including its engines)
 *   --status    print the current health response
 */
'use strict';
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const exeDir = path.dirname(process.execPath);
const appDir = path.join(exeDir, 'app');

// The data directory can be redirected with ONEHUB_DATA_DIR or by placing a
// data-dir.txt next to the executable (absolute path, or relative to it).
// Sharing one data directory keeps accounts, keys and logs identical no matter
// how the gateway was started.
function resolveDataDir() {
  if (process.env.ONEHUB_DATA_DIR) return path.resolve(process.env.ONEHUB_DATA_DIR);
  try {
    const pointer = path.join(exeDir, 'data-dir.txt');
    if (fs.existsSync(pointer)) {
      const value = fs.readFileSync(pointer, 'utf8').split(/\r?\n/)[0].trim();
      if (value) return path.resolve(exeDir, value);
    }
  } catch { /* fall back to the default location */ }
  return path.join(exeDir, 'data');
}

const dataDir = resolveDataDir();
const logDir = path.join(dataDir, 'logs');
const pidFile = path.join(dataDir, 'onehub.pid');
const pythonExe = path.join(exeDir, 'python', 'python.exe');
const port = Number(process.env.ONEHUB_PORT || 3000);
const url = 'http://127.0.0.1:' + port + '/';
const args = process.argv.slice(2);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function ensureLayout() {
  fs.mkdirSync(logDir, { recursive: true });
  if (!fs.existsSync(path.join(appDir, 'server', 'main.mjs'))) {
    throw new Error('安装不完整：缺少 app\\server 目录。请重新解压完整压缩包。');
  }
}

function healthy(timeout = 900) {
  return new Promise(resolve => {
    const request = http.get({ host: '127.0.0.1', port, path: '/healthz', timeout }, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(body).service === 'onehub'); } catch { resolve(false); }
      });
    });
    request.on('timeout', () => { request.destroy(); resolve(false); });
    request.on('error', () => resolve(false));
  });
}

function openBrowser(target) {
  if (process.env.ONEHUB_NO_BROWSER) return;
  try {
    spawn('cmd', ['/c', 'start', '', target], { windowsHide: true, detached: true, stdio: 'ignore' }).unref();
  } catch { /* the console URL is still printed */ }
}

function quotePowerShell(value) {
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function messageBox(title, text) {
  const script = 'Add-Type -AssemblyName System.Windows.Forms;'
    + '[void][System.Windows.Forms.MessageBox]::Show(' + quotePowerShell(text) + ',' + quotePowerShell(title) + ')';
  try {
    spawn('powershell.exe', ['-NoProfile', '-Command', script], { windowsHide: true, detached: true, stdio: 'ignore' }).unref();
  } catch { /* ignore */ }
}

function readPid() {
  try {
    const value = Number(fs.readFileSync(pidFile, 'utf8').trim());
    return Number.isInteger(value) && value > 0 ? value : null;
  } catch { return null; }
}

function alive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

function clearPid() {
  try { fs.rmSync(pidFile, { force: true }); } catch { /* ignore */ }
}

async function runServer() {
  ensureLayout();
  fs.writeFileSync(pidFile, String(process.pid));
  process.on('exit', () => { if (readPid() === process.pid) clearPid(); });
  process.env.ONEHUB_DATA_DIR = dataDir;
  process.env.ONEHUB_PORT = String(port);
  if (fs.existsSync(pythonExe)) process.env.ONEHUB_PYTHON = pythonExe;
  await import(pathToFileURL(path.join(appDir, 'server', 'main.mjs')).href);
}

async function startBackground() {
  ensureLayout();
  if (await healthy()) {
    console.log('OneHub 已在运行：' + url);
    openBrowser(url);
    return 0;
  }
  const stdout = fs.openSync(path.join(logDir, 'onehub.stdout.log'), 'a');
  const stderr = fs.openSync(path.join(logDir, 'onehub.stderr.log'), 'a');
  const child = spawn(process.execPath, ['--server'], {
    cwd: appDir, detached: true, windowsHide: true, stdio: ['ignore', stdout, stderr],
    env: { ...process.env, ONEHUB_DATA_DIR: dataDir, ONEHUB_PORT: String(port) },
  });
  fs.closeSync(stdout);
  fs.closeSync(stderr);
  child.unref();
  console.log('正在启动 OneHub……');
  for (let attempt = 0; attempt < 60; attempt++) {
    await sleep(1000);
    if (await healthy()) {
      console.log('启动成功：' + url);
      openBrowser(url);
      return 0;
    }
    if (child.pid && !alive(child.pid)) break;
  }
  const hint = '未能启动 OneHub。\n\n日志目录：' + logDir;
  console.error(hint);
  messageBox('OneHub 启动失败', hint);
  return 1;
}

async function stopBackground() {
  const pid = readPid();
  if (!pid || !alive(pid)) {
    clearPid();
    console.log('OneHub 没有在运行。');
    return 0;
  }
  spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  clearPid();
  console.log('OneHub 已停止。');
  return 0;
}

async function status() {
  const running = await healthy(1500);
  console.log(JSON.stringify({ running, url, data: dataDir, python: fs.existsSync(pythonExe) }));
  return running ? 0 : 1;
}

async function main() {
  if (args.includes('--server')) return runServer();
  if (args.includes('--stop')) return stopBackground();
  if (args.includes('--status')) return status();
  if (args.includes('--console')) return runServer();
  return startBackground();
}

Promise.resolve()
  .then(main)
  .then(code => { if (typeof code === 'number') process.exitCode = code; })
  .catch(error => {
    const detail = String(error && error.message || error);
    console.error(detail);
    if (!args.includes('--console') && !args.includes('--server')) messageBox('OneHub 启动失败', detail);
    process.exitCode = 1;
  });
