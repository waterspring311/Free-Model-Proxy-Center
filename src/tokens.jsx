import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, compact, number } from './api.js';
import { Empty, IconButton, LoadState, PageHeader, useData } from './ui.jsx';

const ranges = [{ value: 7, label: '7 天' }, { value: 30, label: '30 天' }, { value: 90, label: '90 天' }];

function level(value, max) {
  if (!value) return 'l0';
  const ratio = max ? value / max : 0;
  if (ratio > 0.75) return 'l4';
  if (ratio > 0.5) return 'l3';
  if (ratio > 0.25) return 'l2';
  return 'l1';
}

export function Tokens() {
  const [days, setDays] = useState(30);
  const [selected, setSelected] = useState(null);
  const state = useData(() => api('/token-stats?days=' + days), [days]);
  const series = state.data?.series || [];
  const dayList = state.data?.days || [];
  const totals = state.data?.totals || {};
  const daily = state.data?.daily || [];
  const active = selected ? series.filter(row => selected.includes(row.id)) : series;
  const max = Math.max(1, ...active.flatMap(row => row.values));
  const grand = totals.input_tokens + totals.output_tokens;
  const average = days ? Math.round(grand / days) : 0;
  const cachedShare = totals.input_tokens ? totals.cached_tokens / totals.input_tokens * 100 : 0;
  const busyDays = daily.filter(row => row.tokens > 0).length;
  const tiles = [
    ['总 Token', compact(grand)],
    ['输入', compact(totals.input_tokens)],
    ['输出', compact(totals.output_tokens)],
    ['缓存命中', compact(totals.cached_tokens)],
    ['请求数', number(totals.requests)],
    ['日均 Token', compact(average)],
  ];
  const toggle = id => {
    const current = selected || series.map(row => row.id);
    setSelected(current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  };
  return <>
    <PageHeader title="Token 看板" subtitle={`最近 ${days} 天 · 更新于 ${new Date(state.data?.time || Date.now())
      .toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })}`}>
      <div className="text-tabs">{ranges.map(range =>
        <button type="button" key={range.value} className={days === range.value ? 'active' : ''}
          onClick={() => setDays(range.value)}>{range.label}</button>)}</div>
      <IconButton icon={RefreshCw} title="刷新" className={state.loading ? 'spin' : ''} onClick={state.refresh} />
    </PageHeader>
    <LoadState {...state} hasData={state.data} retry={state.refresh}>
      <div className="stat-grid">{tiles.map(([name, value]) =>
        <div className="stat-box" key={name}><span>{name}</span><strong>{value}</strong></div>)}</div>

      <section className="heat-section">
        <div className="heat-head">
          <h2>历史 Token 热力图</h2>
          <div className="text-tabs small">
            <button type="button" className={selected ? '' : 'active'} onClick={() => setSelected(null)}>全部</button>
            {series.map(row => <button type="button" key={row.id}
              className={selected?.includes(row.id) ? 'active' : ''} onClick={() => toggle(row.id)}>
              {row.label.replace('国际版', '').replace('国内版', '')}<em>{compact(row.total)}</em></button>)}
          </div>
        </div>
        {!series.length ? <Empty title="还没有 Token 用量" />
          : !active.length ? <p className="heat-note">至少选择一条序列。</p>
            : <>
              <div className="heatmap">
                {active.map(row => <div className="heat-row" key={row.id}>
                  <span className="heat-label">{row.label}</span>
                  <div className="heat-cells">{row.values.map((value, index) =>
                    <span key={dayList[index]} className={'heat-cell ' + level(value, max)}
                      title={`${dayList[index]} · ${row.label} · ${number(value)} Token`} />)}</div>
                  <span className="heat-total">{compact(row.total)}</span>
                </div>)}
                <div className="heat-row total">
                  <span className="heat-label">全部合计</span>
                  <div className="heat-cells">{daily.map(row =>
                    <span key={row.day} className={'heat-cell ' + level(row.tokens, Math.max(1, ...daily.map(item => item.tokens)))}
                      title={`${row.day} · 合计 ${number(row.tokens)} Token · ${number(row.requests)} 次请求`} />)}</div>
                  <span className="heat-total">{compact(daily.reduce((sum, row) => sum + row.tokens, 0))}</span>
                </div>
              </div>
              <div className="heat-foot"><span>{dayList[0]}</span>
                <span>{dayList[Math.floor(dayList.length / 2)]}</span>
                <span>{dayList.at(-1)}</span></div>
              <div className="heat-legend"><span>少</span>
                <span className="heat-cell l0" /><span className="heat-cell l1" /><span className="heat-cell l2" />
                <span className="heat-cell l3" /><span className="heat-cell l4" /><span>多</span></div>
            </>}
        <p className="heat-note">最近 {days} 天共使用 {compact(grand)} Token，日均 {compact(average)}，
          有 {busyDays} 天产生过请求，缓存命中率 {cachedShare.toFixed(0)}%。</p>
      </section>
    </LoadState>
  </>;
}
