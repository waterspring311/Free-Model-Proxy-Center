import React, { useEffect, useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { api, date, duration, number } from './api.js';
import { Button, Confirm, LoadState, PageHeader, ProviderMark, Status, useData, useNotice } from './ui.jsx';

function tone(value) {
  if (value === 'online') return 'green';
  if (!value || value === 'disabled' || value === 'stopped') return 'neutral';
  return 'red';
}

function statusLabel(channel) {
  if (!channel.enabled) return '已停用';
  const value = channel.health?.status;
  if (value === 'online') return '运行正常';
  if (value === 'degraded' || value === 'limited') return '性能下降';
  if (value === 'needs_account') return '等待账号';
  if (!value || value === 'offline') return '服务中断';
  return value;
}

// A 429 means the model itself is rate limited; a 502 / "all upstream attempts
// failed" means the managed engine could not reach upstream at all (the shared
// anonymous proxy pool is down), which is a different problem from a limit.
export function probeState(probe) {
  if (!probe) return 'unknown';
  if (probe.ok) return 'ok';
  if (probe.status === 429 || /rate ?limit|too many|retry in \d+/i.test(probe.error || '')) return 'limited';
  if (probe.status === 502
    || /all upstream attempts failed|no healthy anonymous proxies|endpoint is unavailable/i.test(probe.error || '')) return 'upstream';
  return 'fail';
}

function barState(row) {
  if (!row.requests) return 'idle';
  if (row.failures >= row.requests) return 'down';
  return row.failures ? 'partial' : 'up';
}

function TrendBars({ rows }) {
  return <div className={'uptime-bars' + (rows.length > 40 ? ' dense' : '')}>{rows.map((row, index) => (
    <span key={index} className={'uptime-bar ' + barState(row)}
      title={`${row.label} · ${number(row.requests)} 次请求${row.failures ? ` · 异常 ${number(row.failures)} 次` : ''}`} />
  ))}</div>;
}

const clockTime = value => new Date(value).toLocaleTimeString('zh-CN',
  { timeZone: 'Asia/Shanghai', hour12: false, hour: '2-digit', minute: '2-digit' });

function minuteRows(channel) {
  return (channel.minutes || []).map(row => ({
    label: clockTime(row.at), requests: row.requests, failures: row.failures }));
}

function hourlyRows(channel) {
  return (channel.hourly || []).map(row => ({
    label: `${row.hour}:00`, requests: row.requests, failures: row.failures }));
}

function windowUptime(rows) {
  const requests = rows.reduce((sum, row) => sum + row.requests, 0);
  if (!requests) return null;
  const failures = rows.reduce((sum, row) => sum + row.failures, 0);
  return (requests - failures) / requests * 100;
}

export function ChannelStatus() {
  const state = useData(() => api('/channel-status'));
  const notice = useNotice();
  const [auto, setAuto] = useState(true);
  const [restart, setRestart] = useState(null);
  const [busy, setBusy] = useState(false);
  const [probing, setProbing] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [range, setRange] = useState('90m');
  const refresh = state.refresh;
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => { refresh(); }, 15000);
    return () => clearInterval(timer);
  }, [auto, refresh]);

  const channels = state.data?.channels || [], totals = state.data?.totals || {};
  const engines = state.data?.engines || {};
  const probes = state.data?.probes || {};
  const probeResults = probes.results || [];
  const probed = probeResults.length;
  const probeOk = probeResults.filter(row => row.ok).length;
  const probeLimited = probeResults.filter(row => probeState(row) === 'limited').length;
  const probeUpstream = probeResults.filter(row => probeState(row) === 'upstream').length;
  const probeFailed = probeResults.filter(row => probeState(row) === 'fail').length;
  const probeLine = `模型探测：每 ${Math.max(1, Math.round((probes.interval_seconds || 60) / 60))} 分钟 · ` +
    (probes.last_run_at ? `上次 ${new Date(probes.last_run_at).toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })} · ` : '尚未运行 · ') +
    `${probeOk}/${probed} 正常` + (probeLimited ? ` · ${probeLimited} 限流` : '')
    + (probeUpstream ? ` · ${probeUpstream} 上游不可用` : '') + (probeFailed ? ` · ${probeFailed} 失败` : '');
  const updated = state.data?.time ? new Date(state.data.time).toLocaleTimeString('zh-CN',
    { timeZone: 'Asia/Shanghai', hour12: false }) : '-';
  async function restartEngine() {
    setBusy(true);
    try {
      await api('/engines/' + restart + '/restart', { method: 'POST', body: {} });
      notice('引擎已重启。');
      setRestart(null);
      await refresh();
    } catch (error) { notice(error.message, 'error'); }
    finally { setBusy(false); }
  }

  async function runProbes() {
    setProbing(true);
    try {
      await api('/probes/run', { method: 'POST', body: {} });
      notice('已开始测试全部模型，稍后自动刷新。');
      for (let attempt = 0; attempt < 12; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const result = await api('/probes');
        if (!result.running) break;
      }
      await refresh();
      notice('模型探测完成。');
    } catch (error) { notice(error.message, 'error'); }
    finally { setProbing(false); }
  }

  return <>
    <PageHeader title="渠道状态" subtitle={`${totals.channels || 0} 个渠道 · ${totals.online || 0} 个在线 · 更新于 ${updated}`}>
      <label className="check-label"><input type="checkbox" checked={auto} onChange={event => setAuto(event.target.checked)} />自动刷新</label>
      <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={refresh}>立即刷新</Button>
    </PageHeader>
    <LoadState {...state} hasData={state.data} retry={refresh}>
      <section className="status-block">
        <div className="block-heading"><h2>系统组件</h2>
          <span className="probe-line">{probeLine}
            <button type="button" className="link-button" disabled={probing} onClick={runProbes}>{probing ? '测试中…' : '立即测试'}</button></span></div>
        <div className="component-group">
          {channels.map(channel => {
              const today = channel.today || {};
              const value = tone(channel.enabled ? channel.health?.status : 'disabled');
              const models = channel.models || [];
              const probe = channel.probe || { total: models.length, probed: 0, ok: 0, failed: 0 };
              const open = expanded === channel.id;
              return <div className={'component-row' + (open ? ' expanded' : '')} key={channel.id}>
                <div className="component-name"><ProviderMark kind={channel.realm || channel.provider} />
                  <div><strong>{channel.name}</strong><code>{channel.prefix}/*</code></div></div>
                <div className="component-metrics">
                  <span>今日 {number(today.requests)} 次</span>
                  <span>平均 {duration(today.avg_ms == null ? null : Math.round(today.avg_ms))}</span>
                  <span>成功率 {today.success_rate == null ? '-' : (today.success_rate * 100).toFixed(1) + '%'}</span>
                  <span>检查 {duration(channel.health?.latency_ms)}</span>
                </div>
                <span className={'probe-summary ' + (!probe.probed ? 'neutral' : probe.healthy ? 'green' : 'warn')}>
                  模型 {probe.ok}/{probe.probed || 0} 正常{probe.limited ? ` · ${probe.limited} 限流` : ''}
                  {probe.unavailable ? ` · ${probe.unavailable} 上游不可用` : ''}
                </span>
                <span className={'component-status ' + value}><i />{statusLabel(channel)}</span>
                <button type="button" className={'model-toggle' + (open ? ' open' : '')} aria-expanded={open}
                  onClick={() => setExpanded(open ? null : channel.id)}>模型状态<ChevronDown size={13} /></button>
                {open && <div className="channel-models">
                  <div className="channel-models-head">
                    <strong>模型状态</strong>
                    <span>{models.length} 个模型 · {probe.ok} 个可用
                      {probe.failed ? ` · ${probe.failed} 个失败` : ''}
                      {probe.at ? ` · 最近更新 ${date(probe.at)}` : ''}</span>
                  </div>
                  {!models.length ? <p className="channel-models-empty">模型目录尚未同步。</p>
                    : <ul className="model-list">{models.map(model => {
                      const result = model.probe;
                      const state = !model.enabled ? 'off' : !result ? 'unknown' : probeState(result);
                      const label = !model.enabled ? '已停用' : !result ? '未探测'
                        : result.ok ? (result.source === 'request' ? '实测 ' : '') + duration(result.latency_ms)
                          : state === 'limited' ? `限流 ${result.status}`
                            : state === 'upstream' ? '上游不可用' : `HTTP ${result.status || '错误'}`;
                      return <li key={model.id} className={'model-row ' + state}>
                        <i className={'probe-dot ' + state} />
                        <code title={model.id}>{model.id}</code>
                        <span className="model-flag">{model.is_free ? '' : '付费'}</span>
                        <span className="model-status">{label}</span>
                        <span className="model-reason" title={result?.error || ''}>{result?.error || ''}</span>
                      </li>;
                    })}</ul>}
                </div>}
              </div>;
          })}
        </div>
      </section>

      <section className="status-block">
        <div className="block-heading"><h2>可用率趋势</h2>
          <div className="range-switch">{[['90m', '近90分钟'], ['today', '今日 · 按小时']].map(([id, label]) => (
            <button key={id} type="button" className={range === id ? 'active' : ''} onClick={() => setRange(id)}>{label}</button>
          ))}</div>
        </div>
        {channels.map(channel => {
          const rows = range === '90m' ? minuteRows(channel) : hourlyRows(channel);
          const uptime = windowUptime(rows);
          const axis = range === '90m'
            ? [rows[0]?.label, rows[Math.floor(rows.length / 2)]?.label, '现在']
            : ['00:00', '12:00', '现在'];
          return <div className="uptime-row" key={channel.id}>
            <div className="uptime-head"><strong>{channel.name}</strong>
              <span className={uptime != null && uptime < 99 ? 'uptime-value warn' : 'uptime-value'}>
                {uptime == null ? '暂无数据' : uptime.toFixed(2) + '% 可用'}</span></div>
            <TrendBars rows={rows} />
            <div className="uptime-axis"><span>{axis[0]}</span><span>{axis[1]}</span><span>{axis[2]}</span></div>
          </div>;
        })}
      </section>

      <section className="status-block">
        <div className="block-heading"><h2>托管引擎</h2><span>127.0.0.1</span></div>
        <div className="engine-rows">{['opencode', 'workbuddy'].map(id => {
          const engine = engines[id] || { status: 'stopped' };
          return <div className="engine-row" key={id}><ProviderMark kind={id} />
            <div><strong>{id === 'opencode' ? 'OpenCode Zen / Go' : 'WorkBuddy / CodeBuddy'}</strong>
              <small>{engine.message || (engine.pid ? `进程 ${engine.pid} · ` : '') +
                (id === 'opencode' ? 'API :8080 / 管理 :8081' : 'API 与管理 :8788')}</small></div>
            <Status value={engine.status || 'stopped'} />
            <Button variant="secondary" icon={RefreshCw} disabled={busy} onClick={() => setRestart(id)}>重启</Button></div>;
        })}</div>
      </section>

      <p className="status-note">渠道状态由本机 OneHub 汇总：健康检查每 15 秒刷新，模型状态优先采用最近一次真实成功调用；“可用率趋势”按分钟统计最近 90 分钟（真实流量 + 每分钟一次的探测），点击“立即刷新”即可反映最新可用性。</p>
    </LoadState>
    {restart && <Confirm title="重启引擎" destructive={false} detail={`确定重启 ${restart === 'opencode' ? 'OpenCode' : 'WorkBuddy'} 引擎？进行中的请求会中断。`}
      onClose={() => setRestart(null)} onConfirm={restartEngine} />}
  </>;
}
