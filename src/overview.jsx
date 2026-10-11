import React, { useLayoutEffect, useRef, useState } from 'react';
import { Activity, ArrowDownLeft, ArrowUpRight, Clock3, Copy, KeyRound, Network, Plus, RefreshCw, Users, Zap } from 'lucide-react';
import { api, compact, date, duration, number } from './api.js';
import { Alert, Button, CopyButton, Empty, LoadState, PageHeader, ProviderMark, RequestDetail, RequestTable, Status, useData } from './ui.jsx';

function ActivityChart({ hourly }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(900);
  useLayoutEffect(() => {
    const measure = () => setWidth(Math.max(300, Math.round(ref.current.clientWidth)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const today = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
  const rows = Array.from({ length: 24 }, (_, hour) => {
    const match = hourly.find(row => new Date(row.hour + ':00:00Z').getTime() + 8 * 3600 * 1000 === Date.parse(today + 'T00:00:00Z') + hour * 3600 * 1000);
    return { hour, requests: match?.requests || 0, tokens: match?.tokens || 0 };
  });
  const max = Math.max(4, ...rows.map(row => row.requests)), height = 190, floor = 160, step = (width - 42) / 24;
  const bar = Math.min(20, Math.max(4, step * .56));
  return <div className="activity-chart" ref={ref}><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="今日每小时请求数">
    {[0, 1, 2, 3, 4].map(i => <g key={i}><line x1="32" x2={width - 5} y1={floor - i * 36} y2={floor - i * 36} className="chart-grid" />
      <text x="22" y={floor - i * 36 + 4} textAnchor="end">{Math.ceil(max / 4 * i)}</text></g>)}
    {rows.map(row => <g key={row.hour}><rect x={35 + row.hour * step} y={floor - row.requests / max * 144}
      width={bar} height={Math.max(2, row.requests / max * 144)} rx="2" className={row.requests ? 'chart-bar' : 'chart-bar empty-bar'}>
      <title>{String(row.hour).padStart(2, '0')}:00 / {number(row.requests)} 次 / {number(row.tokens)} Token</title></rect>
      {row.hour % 3 === 0 && <text x={35 + row.hour * step + bar / 2} y="184" textAnchor="middle">{String(row.hour).padStart(2, '0')}:00</text>}</g>)}
  </svg></div>;
}

export function Overview() {
  const state = useData(() => api('/overview'));
  const [detail, setDetail] = useState(null);
  const summary = state.data?.summary || {}, accounts = state.data?.accounts || [], channels = state.data?.channels || [];
  const realAccounts = accounts.filter(row => row.kind !== 'anonymous');
  const metrics = [
    { name: '今日请求', value: number(summary.requests), sub: '成功 ' + number(summary.successes) + ' 次', icon: Activity, tone: 'green' },
    { name: '总 Token', value: compact((summary.input_tokens || 0) + (summary.output_tokens || 0)), sub: '缓存 ' + compact(summary.cached_tokens), icon: Zap, tone: 'blue' },
    { name: '成功率', value: summary.requests ? ((summary.successes || 0) / summary.requests * 100).toFixed(1) + '%' : '-', sub: 'HTTP 2xx · 完整响应', icon: ArrowUpRight, tone: 'green' },
    { name: '平均耗时', value: duration(summary.avg_ms == null ? null : Math.round(summary.avg_ms)), sub: '首字节 ' + duration(summary.first_ms == null ? null : Math.round(summary.first_ms)), icon: Clock3, tone: 'amber' },
  ];
  return <>
    <PageHeader title="总览" subtitle={new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}>
      <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={state.refresh}>刷新</Button>
      <a className="button primary" href="#accounts"><Plus size={16} />添加账号</a>
    </PageHeader>
    <LoadState {...state} hasData={state.data} retry={state.refresh}>
      <div className="metrics">{metrics.map(item => <div className="metric" key={item.name}><div className="metric-top"><span>{item.name}</span><span className={'metric-icon ' + item.tone}><item.icon size={17} /></span></div>
        <strong className="tabular">{item.value}</strong><small>{item.sub}</small></div>)}</div>
      <div className="endpoint-band"><span className="endpoint-label"><Network size={17} />API Base URL</span><code>{location.origin}/v1</code>
        <CopyButton value={location.origin + '/v1'} title="复制 API Base URL" /><span className="endpoint-badge">OPENAI / ANTHROPIC</span></div>
      <div className="overview-grid"><section className="unframed-section activity-section">
        <div className="section-heading"><h2>请求趋势</h2><span className="chart-legend"><i />请求数<span className="tag">今日</span></span></div>
        <ActivityChart hourly={state.data?.hourly || []} />
        <div className="token-breakdown"><span><ArrowDownLeft size={15} />输入<strong>{compact(summary.input_tokens)}</strong></span>
          <span><ArrowUpRight size={15} />输出<strong>{compact(summary.output_tokens)}</strong></span>
          <span>未上报用量<strong>{number(summary.unknown_usage)} 次</strong></span></div>
      </section><section className="unframed-section inventory-section"><div className="section-heading"><h2>资源概况</h2><span className="tag">实时</span></div>
        {[{ icon: Users, name: '账号', n: realAccounts.length, sub: realAccounts.filter(row => row.enabled).length + ' 个启用', href: 'accounts' },
          { icon: Network, name: '渠道', n: channels.filter(row => row.enabled).length, sub: channels.filter(row => row.health?.status === 'online').length + ' 个就绪', href: 'channels' },
          { icon: KeyRound, name: 'API Keys', n: state.data?.keys || 0, sub: '已启用', href: 'keys' }].map(row =>
          <a className="inventory-row" href={'#' + row.href} key={row.name}><span className="inventory-icon"><row.icon size={19} /></span><div><strong>{row.name}</strong><small>{row.sub}</small></div><b>{row.n}</b><ArrowUpRight size={16} /></a>)}
        <div className="public-channel"><span><i className={accounts.find(row => row.id === 'public')?.enabled ? 'green-dot' : 'neutral-dot'} />OpenCode 公开通道</span>
          <span className="muted">{accounts.find(row => row.id === 'public')?.enabled ? '已启用' : '已停用'}</span></div>
      </section></div>
      <section className="channels-section"><div className="section-heading"><h2>渠道状态<span className="count">{channels.length}</span></h2><a href="#status">渠道详情<ArrowUpRight size={14} /></a></div>
        <div className="channel-cards">{channels.map(channel => <a className="channel-card" href="#channels" key={channel.id}>
          <div className="channel-card-top"><ProviderMark kind={channel.realm || channel.provider} /><div><strong>{channel.name}</strong><code>{channel.prefix}/*</code></div>
            <Status value={channel.health?.status || 'offline'} /></div>
          <div className="channel-card-bottom"><span>今日请求<b>{number(state.data?.grouped.find(row => row.channel_id === channel.id)?.requests)}</b></span>
            <span>检查耗时<b>{duration(channel.health?.latency_ms)}</b></span></div></a>)}</div>
      </section>
      {state.data?.account_error && <Alert>{state.data.account_error}</Alert>}
      <section className="recent-section"><div className="section-heading"><h2>最近请求</h2><a href="#requests">全部日志<ArrowUpRight size={14} /></a></div>
        <RequestTable rows={state.data?.recent || []} onSelect={setDetail} compact /></section>
    </LoadState>{detail && <RequestDetail row={detail} onClose={() => setDetail(null)} />}
  </>;
}
