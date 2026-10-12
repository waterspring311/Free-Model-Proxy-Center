export async function api(path, options = {}) {
  const { method = 'GET', body, signal } = options;
  const response = await fetch('/api' + path, {
    method, signal, credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || '请求失败，请稍后重试。');
  }
  return result;
}

export const number = value => new Intl.NumberFormat('zh-CN').format(value || 0);
export const compact = value => value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' :
  value >= 1000 ? (value / 1000).toFixed(1) + 'K' : number(value);
export const date = value => value ? new Date(value).toLocaleString('zh-CN', {
  timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
}) : '-';
export const duration = value => value == null ? '-' : value >= 1000 ? (value / 1000).toFixed(2) + ' s' : value + ' ms';
export const provider = kind => ({ opencode: 'OpenCode', workbuddy: 'WorkBuddy', intl: 'WorkBuddy', cn: 'CodeBuddy',
  openrouter: 'OpenRouter', qwen: '千问 DashScope', siliconflow: '硅基流动', zen: 'Zen Key', go: 'Go Key', anonymous: '公开通道' }[kind] || kind);
