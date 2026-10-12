import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, Check, CheckCircle2, ChevronLeft, ChevronRight, Copy, Inbox, LoaderCircle, X } from 'lucide-react';
import { api, date, duration, number } from './api.js';

export const NoticeContext = createContext(() => {});
export const useNotice = () => useContext(NoticeContext);

export function useData(load, dependencies = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  const alive = useRef(true);
  const loader = useRef(load);
  loader.current = load;
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    setLoading(true); setError('');
    try {
      const result = await loader.current();
      if (alive.current && version === generation.current) setData(result);
      return result;
    } catch (error) {
      if (alive.current && version === generation.current) setError(error.message);
    } finally {
      if (alive.current && version === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    refresh();
    return () => { alive.current = false; generation.current++; };
  }, dependencies);
  return { data, error, loading, refresh };
}

export function IconButton({ icon: Icon, title, className = '', ...props }) {
  return <button type="button" className={'icon-button ' + className} title={title} aria-label={title} {...props}><Icon size={17} /></button>;
}

export function Button({ icon: Icon, children, variant = 'primary', loading, className = '', ...props }) {
  return <button type="button" className={`button ${variant} ${className}`} {...props} disabled={loading || props.disabled}>
    {loading ? <LoaderCircle size={16} className="spin" /> : Icon ? <Icon size={16} /> : null}{children}
  </button>;
}

export function CopyButton({ value, title = '复制', label }) {
  const [copied, setCopied] = useState(false);
  const notice = useNotice();
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    } catch { notice('复制失败，请选中内容复制。', 'error'); }
  }
  return label ? <Button variant="secondary" icon={copied ? Check : Copy} onClick={copy}>{copied ? '已复制' : label}</Button>
    : <IconButton icon={copied ? Check : Copy} title={copied ? '已复制' : title} onClick={copy} />;
}

const statuses = {
  enabled: ['可用', 'green'], success: ['成功', 'green'], online: ['在线', 'green'], running: ['运行中', 'green'],
  disabled: ['已停用', 'neutral'], stopped: ['已停止', 'neutral'], starting: ['启动中', 'amber'],
  degraded: ['未就绪', 'amber'], limited: ['限流中', 'amber'], expired: ['已过期', 'red'],
  offline: ['离线', 'red'], error: ['异常', 'red'], needs_account: ['等待账号', 'amber'],
  missing: ['未安装', 'red'], port_conflict: ['端口冲突', 'red'], upstream_error: ['上游错误', 'red'],
  client_cancelled: ['客户端取消', 'amber'], stream_error: ['流中断', 'red'], server_shutdown: ['服务关闭', 'amber'],
};
export function Status({ value, text }) {
  const [label, color] = statuses[value] || [value || '未知', 'neutral'];
  return <span className={`status ${color}`}><i />{text || label}</span>;
}

export function Toggle({ checked, onChange, label, disabled }) {
  return <button className={'toggle ' + (checked ? 'on' : '')} type="button" role="switch"
    aria-checked={!!checked} aria-label={label} title={label} disabled={disabled} onClick={() => onChange(!checked)}><span /></button>;
}

export function Field({ label, children, className = '' }) {
  const generated = useId();
  let control;
  React.Children.forEach(children, child => {
    if (!control && React.isValidElement(child) && ['input', 'select', 'textarea'].includes(child.type)) control = child;
  });
  const id = control?.props.id || generated;
  return <div className={'field ' + className}>{control ? <label htmlFor={id}>{label}</label> : <span>{label}</span>}
    {React.Children.map(children, child => child === control ? React.cloneElement(child, { id }) : child)}
  </div>;
}

export function Segments({ options, value, onChange, label }) {
  return <div className="segments" role="group" aria-label={label}>{options.map(option =>
    <button type="button" key={option.value} aria-pressed={value === option.value}
      className={value === option.value ? 'selected' : ''} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>;
}

export function Alert({ children, tone = 'amber' }) {
  return <div className={'alert ' + tone} role="status"><AlertCircle size={16} /><span>{children}</span></div>;
}

export function Empty({ title = '暂无数据', action }) {
  return <div className="empty"><Inbox size={30} strokeWidth={1.4} /><strong>{title}</strong>{action}</div>;
}

export function LoadState({ loading, error, retry, children, hasData }) {
  if (loading && !hasData) return <div className="loading"><LoaderCircle size={23} className="spin" />加载中</div>;
  if (error && !hasData) return <div className="error-state"><AlertCircle size={28} /><p>{error}</p><Button variant="secondary" onClick={retry}>重试</Button></div>;
  return <>{error && <Alert tone="red">{error}</Alert>}{children}</>;
}

export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const initial = ref.current?.querySelector('input:not(:disabled):not([type="hidden"]),textarea:not(:disabled),select:not(:disabled)');
    (initial || ref.current)?.focus();
    function keyboard(event) {
      if (event.key === 'Escape') close.current();
      if (event.key !== 'Tab') return;
      const elements = [...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')];
      if (!elements.length) { event.preventDefault(); ref.current?.focus(); return; }
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keyboard); if (previous?.isConnected) previous.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={'modal ' + (wide ? 'wide' : '')} ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}>
      <header><h2>{title}</h2><IconButton icon={X} title="关闭" onClick={onClose} /></header>{children}
    </section>
  </div>;
}

export function Confirm({ title, detail, onConfirm, onClose, destructive = true }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  return <Modal title={title} onClose={onClose}><div className="modal-body"><p className="confirm-detail">{detail}</p>{error && <Alert tone="red">{error}</Alert>}</div>
    <footer><Button variant="secondary" onClick={onClose} disabled={busy}>取消</Button><Button variant={destructive ? 'danger' : 'primary'} loading={busy} onClick={async () => {
      setBusy(true);
      try { await onConfirm(); onClose(); } catch (error) { setError(error.message); setBusy(false); }
    }}>确认</Button></footer></Modal>;
}

export function PageHeader({ title, subtitle, children }) {
  return <div className="page-heading"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="heading-actions">{children}</div></div>;
}

export function ProviderMark({ kind }) {
  const value = kind === 'cn' ? 'codebuddy' : kind === 'intl' ? 'workbuddy' : kind;
  const label = value === 'opencode' ? 'OC' : value === 'codebuddy' ? 'CB' : value === 'openrouter' ? 'OR' : value === 'qwen' ? 'QW' : value === 'siliconflow' ? 'SF' : 'WB';
  return <span className={'provider-mark ' + value}>{label}</span>;
}

export function RequestTable({ rows, onSelect, compact = false }) {
  if (!rows.length) return <Empty title="暂无请求记录" />;
  return <div className="table-scroll"><table><thead><tr><th>时间</th><th>模型</th><th>状态</th>
    {!compact && <th>API Key</th>}<th>Token</th><th>耗时</th>{!compact && <th>首字节</th>}<th>模式</th></tr></thead>
    <tbody>{rows.map(row => <tr key={row.id} className={onSelect ? 'clickable-row' : ''} onClick={() => onSelect?.(row)}>
      <td className="muted nowrap">{date(row.at)}</td><td><span className="model-id" title={row.model}>{row.model || '-'}</span><small>{row.channel_name || row.endpoint}</small></td>
      <td><Status value={row.outcome} text={row.status + (row.outcome === 'success' ? ' 成功' : '')} />
        {!!row.error && <span className="error-flag" title={row.error}>上游报错</span>}</td>
      {!compact && <td>{row.key_name || '-'}</td>}<td className="tabular">{row.usage_reported ? number(row.input_tokens + row.output_tokens) : <span className="muted">未上报</span>}</td>
      <td className="tabular nowrap">{duration(row.duration_ms)}</td>{!compact && <td className="tabular nowrap">{duration(row.first_ms)}</td>}
      <td><span className="tag">{row.stream ? 'SSE' : 'JSON'}</span></td></tr>)}</tbody></table></div>;
}

export function RequestDetail({ row, onClose }) {
  return <Modal title="请求详情" onClose={onClose} wide><div className="modal-body">
    <dl className="detail-grid">
      {Object.entries({ '请求 ID': row.id, '时间': date(row.at), '模型': row.model, '上游模型': row.upstream_model,
        '渠道': row.channel_name, 'API Key': row.key_name, '接口': row.endpoint, 'HTTP 状态': row.status,
        '结果': statuses[row.outcome]?.[0] || row.outcome, '总耗时': duration(row.duration_ms),
        '首字节': duration(row.first_ms), '模式': row.stream ? 'SSE' : 'JSON',
        '输入 Token': row.usage_reported ? number(row.input_tokens) : '未上报',
        '输出 Token': row.usage_reported ? number(row.output_tokens) : '未上报',
        '缓存 Token': row.usage_reported ? number(row.cached_tokens) : '未上报',
      }).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value ?? '-'}</dd></div>)}
    </dl>
    {!!row.error && <div className="error-detail"><strong>上游原始返回</strong>
      <pre>{row.error}</pre></div>}
  </div></Modal>;
}

export function Pagination({ page, pages, total, onChange }) {
  return <div className="pagination"><span>共 {number(total)} 条</span><div>
    <IconButton icon={ChevronLeft} title="上一页" disabled={page <= 1} onClick={() => onChange(page - 1)} />
    <span>{page} / {pages}</span><IconButton icon={ChevronRight} title="下一页" disabled={page >= pages} onClick={() => onChange(page + 1)} />
  </div></div>;
}

export function Notices({ notices }) {
  return <div className="notices" aria-live="polite">{notices.map(notice => <div key={notice.id} className={'notice ' + notice.tone}>
    {notice.tone === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}<span>{notice.text}</span>
  </div>)}</div>;
}

export async function mutate(path, method, body, refresh, notice, message = '已保存') {
  const result = await api(path, { method, body });
  if (result.warning) notice(result.warning, 'error'); else notice(message);
  await refresh?.();
  return result;
}
