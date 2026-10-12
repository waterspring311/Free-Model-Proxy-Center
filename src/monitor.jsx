import React, { useEffect, useState } from 'react';
import { Check, LockKeyhole, Radar, RefreshCw, Save, Search, ShieldCheck, Terminal } from 'lucide-react';
import { api, date } from './api.js';
import { Alert, Button, CopyButton, Empty, Field, LoadState, PageHeader, Pagination, RequestDetail, RequestTable, Toggle, mutate, useData, useNotice } from './ui.jsx';

export function Requests() {
  const [search, setSearch] = useState(''), [query, setQuery] = useState(''), [channel, setChannel] = useState(''), [key, setKey] = useState('');
  const [errors, setErrors] = useState(false), [page, setPage] = useState(1), [detail, setDetail] = useState(null);
  const options = useData(async () => {
    const [channels, keys] = await Promise.all([api('/channels'), api('/keys')]);
    return { channels: channels.channels, keys: keys.keys };
  });
  useEffect(() => {
    const timer = setTimeout(() => { setQuery(search); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const state = useData(() => api('/requests?' + new URLSearchParams({ page, search: query, channel, key, errors: errors ? '1' : '0' })),
    [page, query, channel, key, errors]);
  function filter(setter, value) { setter(value); setPage(1); }
  return <><PageHeader title="请求日志" subtitle="查看模型路由、请求状态与上游上报用量">
    <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={state.refresh}>刷新</Button></PageHeader>
    <div className="toolbar log-toolbar"><div className="search"><Search size={16} /><input placeholder="搜索模型 / 请求 ID" aria-label="搜索请求" value={search} onChange={event => setSearch(event.target.value)} /></div>
      <select className="filter-select" aria-label="日志渠道筛选" value={channel} onChange={event => filter(setChannel, event.target.value)}><option value="">全部渠道</option>
        {(options.data?.channels || []).map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
      <select className="filter-select" aria-label="日志 Key 筛选" value={key} onChange={event => filter(setKey, event.target.value)}><option value="">全部 Key</option>
        {(options.data?.keys || []).map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
      <label className="check-label"><input type="checkbox" checked={errors} onChange={event => filter(setErrors, event.target.checked)} />仅异常</label>
    </div><LoadState {...state} hasData={state.data} retry={state.refresh}><RequestTable rows={state.data?.rows || []} onSelect={setDetail} />
      <Pagination page={state.data?.page || page} pages={state.data?.pages || 1} total={state.data?.total || 0} onChange={setPage} /></LoadState>
    {detail && <RequestDetail row={detail} onClose={() => setDetail(null)} />}
  </>;
}

export function Settings() {
  const [view, setView] = useState('general'), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [probing, setProbing] = useState(false);
  const notice = useNotice();
  const state = useData(async () => {
    const [settings, audit] = await Promise.all([api('/settings'), api('/audit')]);
    return { ...settings, audit: audit.rows };
  });
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    const input = Object.fromEntries(new FormData(event.currentTarget));
    try { await mutate('/settings', 'PATCH', { timeout_seconds: Number(input.timeout_seconds), models_ttl_seconds: Number(input.models_ttl_seconds) },
      state.refresh, notice, '网关设置已保存'); } catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  async function saveProbes(event) {
    event.preventDefault(); setBusy(true); setError('');
    const input = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await mutate('/settings', 'PATCH', { probe_interval_seconds: Number(input.probe_interval_seconds),
        probe_timeout_seconds: Number(input.probe_timeout_seconds), probe_scope: input.probe_scope,
        probe_gap_seconds: Number(input.probe_gap_seconds), probe_cooldown_seconds: Number(input.probe_cooldown_seconds),
        probe_openrouter_seconds: Number(input.probe_openrouter_seconds),
        probe_qwen_seconds: Number(input.probe_qwen_seconds),
        probe_siliconflow_seconds: Number(input.probe_siliconflow_seconds) },
        state.refresh, notice, '模型探测设置已保存');
    } catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  async function runProbes() {
    setProbing(true);
    try {
      await api('/probes/run', { method: 'POST', body: {} });
      notice('已开始测试全部模型。');
      for (let attempt = 0; attempt < 12; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        if (!(await api('/probes')).running) break;
      }
      await state.refresh();
      notice('模型探测完成。');
    } catch (error) { notice(error.message, 'error'); } finally { setProbing(false); }
  }
  const sample = `curl ${location.origin}/v1/chat/completions \\\n  -H "Authorization: Bearer <YOUR_ONEHUB_KEY>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"<MODEL_ID>","messages":[{"role":"user","content":"你好"}],"stream":true}'`;
  return <><PageHeader title="设置" subtitle="管理网关配置与工作空间">
    <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={state.refresh}>刷新</Button></PageHeader>
    <div className="view-tabs">{[['general', '通用设置'], ['security', '安全'], ['audit', '操作记录']].map(([value, label]) =>
      <button key={value} className={view === value ? 'active' : ''} onClick={() => setView(value)}>{label}</button>)}</div>
    <LoadState {...state} hasData={state.data} retry={state.refresh}>
      {view === 'general' && <>
        <section className="settings-section"><div className="settings-description"><h2>网关</h2><p>统一接口与请求参数</p></div><div className="settings-content">
          <Field label="API Base URL"><div className="copy-field"><code>{location.origin}/v1</code><CopyButton value={location.origin + '/v1'} /></div></Field>
          <form className="settings-form" onSubmit={save}>{error && <Alert tone="red">{error}</Alert>}
            <div className="form-grid"><Field label="请求超时（秒）"><input type="number" name="timeout_seconds" min={10} max={900} required defaultValue={state.data?.timeout_seconds} key={'timeout' + state.data?.timeout_seconds} /></Field>
              <Field label="模型目录缓存（秒）"><input type="number" name="models_ttl_seconds" min={30} max={3600} required defaultValue={state.data?.models_ttl_seconds} key={'ttl' + state.data?.models_ttl_seconds} /></Field></div>
            <Button type="submit" icon={Save} loading={busy}>保存设置</Button></form></div></section>
        <section className="settings-section"><div className="settings-description"><h2>模型费用</h2><p>控制目录和 API 调用范围</p></div><div className="settings-content">
          <div className="setting-toggle"><div><strong>仅允许免费模型</strong><small>保留零费用模型，阻止付费及价格未知的模型和别名调用</small></div>
            <Toggle label="仅允许免费模型" checked={!!state.data?.model_free_only} disabled={busy} onChange={async enabled => {
              setBusy(true); try { await mutate('/settings', 'PATCH', { model_free_only: enabled }, state.refresh, notice, '模型费用策略已保存'); }
              catch (error) { notice(error.message, 'error'); } finally { setBusy(false); }
            }} /></div></div></section>
        <section className="settings-section"><div className="settings-description"><h2>公开通道</h2><p>OpenCode 匿名模型池</p></div><div className="settings-content">
          <div className="setting-toggle"><div><strong>OpenCode 公开免费通道</strong><small>可用模型由上游动态提供</small></div>
            <Toggle label="OpenCode 公开免费通道" checked={state.data?.anonymous_enabled} disabled={busy} onChange={async enabled => {
              setBusy(true); try { await mutate('/settings', 'PATCH', { anonymous_enabled: enabled }, state.refresh, notice); }
              catch (error) { notice(error.message, 'error'); } finally { setBusy(false); }
            }} /></div></div></section>
        <section className="settings-section"><div className="settings-description"><h2>模型探测</h2><p>定时对每个模型做最小化请求</p></div><div className="settings-content">
          <div className="setting-toggle"><div><strong>定时探测</strong><small>隔离式探测：一次只发一个请求，同一渠道两次探测之间保持最小间隔，命中限流后进入冷却；不会把一条渠道的全部模型同时打满，避免触发上游限流。结果在渠道状态页查看</small></div>
            <Toggle label="定时探测" checked={state.data?.probe_enabled !== false} disabled={busy} onChange={async enabled => {
              setBusy(true); try { await mutate('/settings', 'PATCH', { probe_enabled: enabled }, state.refresh, notice, '探测设置已保存'); }
              catch (error) { notice(error.message, 'error'); } finally { setBusy(false); }
            }} /></div>
          <div className="setting-toggle"><div><strong>额外探测付费模型</strong>
            <small>免费模型（OpenCode 公开池以及 WorkBuddy / CodeBuddy 的免费模型）默认全部自动探测，不消耗额度。开启后会以「全部模型」范围额外探测账号渠道的付费模型，会消耗账号的积分/资源包余额</small></div>
            <Toggle label="额外探测付费模型" checked={state.data?.probe_account_channels === true} disabled={busy}
              onChange={async enabled => {
                setBusy(true); try { await mutate('/settings', 'PATCH', { probe_account_channels: enabled }, state.refresh, notice, '探测设置已保存'); }
                catch (error) { notice(error.message, 'error'); } finally { setBusy(false); }
              }} /></div>
          <form className="settings-form" onSubmit={saveProbes}>{error && <Alert tone="red">{error}</Alert>}
            <div className="form-grid">
              <Field label="同渠道探测间隔（秒）"><input type="number" name="probe_interval_seconds" min={60} max={86400} required
                defaultValue={state.data?.probe_interval_seconds} key={'probe' + state.data?.probe_interval_seconds} /></Field>
              <Field label="探测超时（秒）"><input type="number" name="probe_timeout_seconds" min={5} max={120} required
                defaultValue={state.data?.probe_timeout_seconds} key={'probeTimeout' + state.data?.probe_timeout_seconds} /></Field>
              <Field label="全局最小间隔（秒）"><input type="number" name="probe_gap_seconds" min={1} max={120} required
                defaultValue={state.data?.probe_gap_seconds ?? 5} key={'probeGap' + state.data?.probe_gap_seconds} /></Field>
              <Field label="限流冷却（秒）"><input type="number" name="probe_cooldown_seconds" min={60} max={21600} required
                defaultValue={state.data?.probe_cooldown_seconds ?? 600} key={'probeCooldown' + state.data?.probe_cooldown_seconds} /></Field>
              <Field label="OpenRouter 探测间隔（秒）"><input type="number" name="probe_openrouter_seconds" min={600} max={86400} required
                defaultValue={state.data?.probe_openrouter_seconds ?? 3600} key={'probeOR' + state.data?.probe_openrouter_seconds} /></Field>
              <Field label="千问探测间隔（秒）"><input type="number" name="probe_qwen_seconds" min={600} max={86400} required
                defaultValue={state.data?.probe_qwen_seconds ?? 3600} key={'probeQW' + state.data?.probe_qwen_seconds} /></Field>
              <Field label="硅基流动探测间隔（秒）"><input type="number" name="probe_siliconflow_seconds" min={600} max={86400} required
                defaultValue={state.data?.probe_siliconflow_seconds ?? 3600} key={'probeSF' + state.data?.probe_siliconflow_seconds} /></Field>
            </div>
            <Field label="探测范围"><select name="probe_scope" defaultValue={state.data?.probe_scope || 'free'} key={'probeScope' + state.data?.probe_scope}>
              <option value="free">仅免费模型</option><option value="all">全部模型（可能产生费用）</option></select></Field>
            <Button type="submit" icon={Save} loading={busy} variant="secondary">保存探测设置</Button>
          </form>
          <div className="probe-actions">
            <Button variant="secondary" icon={Radar} loading={probing} onClick={runProbes}>立即测试全部模型</Button>
            <span className="settings-note">{state.data?.probe?.last_run_at
              ? `上次运行 ${date(state.data.probe.last_run_at)} · ${state.data.probe.results.filter(row => row.ok).length}/${state.data.probe.results.length} 正常`
              : '尚未执行模型探测'}</span>
          </div>
        </div></section>
        <section className="settings-section"><div className="settings-description"><h2>客户端接入</h2><p>从模型目录复制模型 ID</p></div><div className="settings-content">
          <div className="code-sample"><header><span><Terminal size={15} />cURL</span><CopyButton value={sample} title="复制 cURL 示例" /></header><pre>{sample}</pre></div>
          <div className="integration-note"><span>模型前缀</span><code>opencode/</code><code>workbuddy/</code><code>codebuddy/</code><code>openrouter/</code><code>qwen/</code><code>siliconflow/</code></div>
          <p className="settings-note">每日 Token 上限根据已完成请求的上报用量计算，属于软上限；并发请求及未上报用量可能导致超出。</p>
        </div></section>
        <section className="settings-section"><div className="settings-description"><h2>工作空间信息</h2></div><div className="settings-content">
          <dl className="detail-grid"><div><dt>版本</dt><dd>{state.data?.version}</dd></div><div><dt>时区</dt><dd>Asia/Shanghai</dd></div>
            <div><dt>监听地址</dt><dd>127.0.0.1</dd></div><div><dt>数据目录</dt><dd>data/</dd></div></dl>
          <p className="settings-note">备份时请停止服务并完整保存 data 目录，其中包含数据库、加密主密钥和两个引擎的运行状态。</p>
        </div></section></>}
      {view === 'security' && <>
        <section className="settings-section"><div className="settings-description"><h2>凭据存储</h2></div><div className="settings-content security-facts">
          <p><ShieldCheck size={17} /><span>OneHub 上游 Key 使用 AES-256-GCM 加密；客户端 API Key 仅保存哈希。</span></p>
          <p><LockKeyhole size={17} /><span>OpenCode 运行配置和 WorkBuddy 账号文件遵循各自引擎的存储格式，备份包含敏感凭据。</span></p>
          <p><Check size={17} /><span>账号通过手动添加、JSON 导入或 OAuth 授权接入。</span></p>
        </div></section></>}
      {view === 'audit' && (!state.data?.audit.length ? <Empty title="暂无操作记录" /> : <div className="table-scroll"><table><thead><tr><th>时间</th><th>操作</th><th>详情</th></tr></thead>
        <tbody>{state.data.audit.map(row => <tr key={row.id}><td className="muted nowrap">{date(row.at)}</td><td><code>{row.action}</code></td><td>{row.detail}</td></tr>)}</tbody></table></div>)}
    </LoadState>
  </>;
}
