import {
  createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync, timingSafeEqual,
} from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export function randomToken(prefix = '', bytes = 32) {
  return prefix + randomBytes(bytes).toString('base64url');
}

export function digest(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

export function constantEqual(a, b) {
  return timingSafeEqual(Buffer.from(digest(a)), Buffer.from(digest(b)));
}

export function passwordHash(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password, hash) {
  const [salt, expected] = String(hash).split(':');
  if (!salt || expected?.length !== 128) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(expected, 'hex'));
}

export function createVault(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const keyFile = path.join(directory, 'master.key');
  if (!existsSync(keyFile)) writeFileSync(keyFile, randomBytes(32), { mode: 0o600, flag: 'wx' });
  const key = readFileSync(keyFile);
  if (key.length !== 32) throw new Error('Invalid data/master.key; preserve the original encryption key.');
  return {
    encrypt(value) {
      if (!value) return '';
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const bytes = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
      return [iv, cipher.getAuthTag(), bytes].map(b => b.toString('base64')).join('.');
    },
    decrypt(value) {
      if (!value) return '';
      const [iv, tag, bytes] = value.split('.').map(b => Buffer.from(b, 'base64'));
      const cipher = createDecipheriv('aes-256-gcm', key, iv);
      cipher.setAuthTag(tag);
      return Buffer.concat([cipher.update(bytes), cipher.final()]).toString('utf8');
    },
  };
}

export function mask(value) {
  return value ? `${value.slice(0, 5)}...${value.slice(-4)}` : '';
}

export class HttpError extends Error {
  constructor(status, message, type = 'invalid_request_error') {
    super(message);
    this.status = status;
    this.type = type;
  }
}

export async function readJSON(req, limit = 16 * 1024 * 1024) {
  const declared = Number(req.headers['content-length'] || 0);
  if (!Number.isFinite(declared) || declared > limit) throw new HttpError(413, 'Request body exceeds the size limit.');
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > limit) throw new HttpError(413, 'Request body exceeds the size limit.');
    chunks.push(chunk);
  }
  try {
    const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error();
    return payload;
  } catch {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }
}

export function credential(req) {
  const bearer = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  return bearer?.[1].trim() || String(req.headers['x-api-key'] || '').trim();
}

export function validateBaseURL(input) {
  let url;
  try { url = new URL(input); } catch { throw new HttpError(400, 'Invalid channel URL.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new HttpError(400, 'Use an HTTP(S) URL without embedded credentials, query or fragment.');
  }
  if (url.protocol === 'http:' && !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
    throw new HttpError(400, 'Remote channels require HTTPS. HTTP is allowed only on loopback.');
  }
  return url.toString().replace(/\/$/, '').replace(/\/v1$/, '');
}

export function finiteInteger(value, fallback, min, max) {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new HttpError(400, `Expected an integer between ${min} and ${max}.`);
  return parsed;
}

export function publicError(error) {
  return error instanceof HttpError ? error.message : 'Internal operation failed. Check the local service logs.';
}
