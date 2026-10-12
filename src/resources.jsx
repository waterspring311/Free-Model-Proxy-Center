import React, { useState } from 'react';
import { ArrowLeftRight, Check, ChevronRight, Code2, Copy, KeyRound, Link2, Network, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { api, date, duration, number, provider } from './api.js';
import { Alert, Button, Confirm, CopyButton, Empty, Field, IconButton, LoadState, Modal, PageHeader, ProviderMark, Segments, Status, Toggle, mutate, useData, useNotice } from './ui.jsx';

function ChannelForm({ row, onClose, onSaved }) {
  const notice = useNotice(), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [platform, setPlatform] = useState(row?.provider || 'opencode');
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const input = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await mutate('/channels' + (row ? '/' + row.id : ''), row ? 'PATCH' : 'POST',
        { ...input, provider: platform, priority: Number(input.priority), max_concurrency: Number(input.max_concurrency) }, onSaved, notice);
      onClose();
    } catch (error) { setError(error.message); setBusy(false); }
  }
  return <Modal title={row ? '编辑渠道' : '添加渠道'} onClose={onClose}><form onSubmit={submit}>
    <div className="modal-body form-stack">{error && <Alert tone="red">{error}</Alert>}
      <Field label="渠道名称"><input name="name" required maxLength={100} defaultValue={row?.name} /></Field>
      <div className="form-grid"><Field label="平台"><select name="provider" value={platform} disabled={!!row} onChange={event => setPlatform(event.target.value)}>
        <option value="opencode">OpenCode</option><option value="workbuddy">WorkBuddy</option><option value="openrouter">OpenRouter</option><option value="qwen">千问 / DashScope</option><option value="siliconflow">硅基流动 / SiliconFlow</option></select></Field>
        <Field label="模型前缀"><input name="prefix" defaultValue={row?.prefix} disabled={!!row} required pattern={'[a-z][a-z0-9\\-]{1,39}'} placeholder="例如 opencode-2" /></Field></div>
      <Field label="上游 Base URL"><input name="base_url" type="url" defaultValue={row?.base_url} disabled={!!row?.managed} required placeholder="https://proxy.example.com" /></Field>
      {!row?.managed && <Field label="上游 API Key"><input name="key" type="password" autoComplete="new-password" placeholder={row ? '留空保留现有 Key' : '可选'} /></Field>}
      {platform === 'workbuddy' && <Field label="区域"><select name="realm" defaultValue={row?.realm || 'intl'} disabled={!!row}>
        <option value="intl">WorkBuddy 国际版</option><option value="cn">CodeBuddy 国内版</option><option value="">上游默认</option></select></Field>}
      <div className="form-grid"><Field label="优先级"><input name="priority" type="number" min={0} max={100} required defaultValue={row?.priority ?? 10} /></Field>
        <Field label="并发上限"><input name="max_concurrency" type="number" min={1} max={128} required defaultValue={row?.max_concurrency ?? 8} /></Field></div>
    </div><footer><Button variant="secondary" onClick={onClose} disabled={busy}>取消</Button><Button type="submit" loading={busy}>保存渠道</Button></footer>
  </form></Modal>;
}

export function Channels() {
  const state = useData(() => api('/channels'));
  const [editor, setEditor] = useState(null), [confirm, setConfirm] = useState(null), [busy, setBusy] = useState('');
  const notice = useNotice(), rows = state.data?.channels || [];
  async function toggle(row, enabled) {
    setBusy(row.id);
    try { await mutate('/channels/' + row.id, 'PATCH', { enabled }, state.refresh, notice, enabled ? '渠道已启用' : '渠道已停用'); }
    catch (error) { notice(error.message, 'error'); } finally { setBusy(''); }
  }
  return <><PageHeader title="渠道管理" subtitle={`${rows.length} 个渠道 · ${rows.filter(row => row.health?.ready).length} 个就绪`}>
    <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={state.refresh}>检查状态</Button><Button icon={Plus} onClick={() => setEditor({})}>添加渠道</Button>
  </PageHeader><LoadState {...state} hasData={state.data} retry={state.refresh}>
    <div className="table-scroll"><table><thead><tr><th>渠道</th><th>地址</th><th>状态</th><th>优先级</th><th>并发</th><th>检查耗时</th><th>启用</th><th className="right">操作</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.id}><td><div className="identity"><ProviderMark kind={row.realm || row.provider} /><div><strong>{row.name}</strong>
        <small><code>{row.prefix}/*</code>{!!row.managed && <span className="mini-tag">内置</span>}</small></div></div></td>
        <td><code className="muted base-url">{row.base_url}</code></td><td><Status value={row.health?.status} /></td>
        <td className="tabular">{row.priority}</td><td className="tabular">{row.in_flight} / {row.max_concurrency}</td><td className="nowrap tabular">{duration(row.health?.latency_ms)}</td>
        <td><Toggle checked={row.enabled} label={(row.enabled ? '停用 ' : '启用 ') + row.name} disabled={busy === row.id} onChange={enabled => toggle(row, enabled)} /></td>
        <td><div className="row-actions"><IconButton icon={Pencil} title={'编辑 ' + row.name} onClick={() => setEditor(row)} />
          {!row.managed && <IconButton icon={Trash2} title={'删除 ' + row.name} className="danger-icon" onClick={() => setConfirm(row)} />}</div></td>
      </tr>)}</tbody></table></div>
  </LoadState>
    <section className="engine-section"><div className="section-heading"><h2>托管引擎</h2><span className="muted">127.0.0.1</span></div>
      <div className="engine-rows">{['opencode', 'workbuddy'].map(id => {
        const engine = rows.find(row => row.provider === id && row.managed)?.engine;
        return <div className="engine-row" key={id}><ProviderMark kind={id} /><div><strong>{provider(id)}</strong>
          <small>{engine?.message || (id === 'opencode' ? 'API :8080 / 管理 :8081' : 'API / 管理 :8788')}</small></div><Status value={engine?.status || 'stopped'} />
          <Button variant="secondary" icon={RefreshCw} loading={busy === 'engine:' + id} onClick={() => setConfirm({ engine: id })}>重启</Button></div>;
      })}</div>
    </section>
    {editor && <ChannelForm row={editor.id ? editor : null} onClose={() => setEditor(null)} onSaved={state.refresh} />}
    {confirm && <Confirm title={confirm.engine ? '重启引擎' : '删除渠道'} destructive={!confirm.engine}
      detail={confirm.engine ? `重启 ${provider(confirm.engine)} 会中断该引擎的当前请求，确定继续？` : `确定删除「${confirm.name}」？历史日志会保留。`}
      onClose={() => setConfirm(null)} onConfirm={async () => {
        setBusy(confirm.engine ? 'engine:' + confirm.engine : confirm.id);
        try { await mutate(confirm.engine ? '/engines/' + confirm.engine + '/restart' : '/channels/' + confirm.id, confirm.engine ? 'POST' : 'DELETE', undefined,
          state.refresh, notice, confirm.engine ? '已发起引擎重启' : '渠道已删除'); } finally { setBusy(''); }
      }} />}
  </>;
}

function AliasForm({ row, models, onClose, onSaved }) {
  const notice = useNotice(), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  return <Modal title={row ? '编辑模型别名' : '创建模型别名'} onClose={onClose}><form onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError('');
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try { await mutate('/aliases', 'POST', { name: row?.name || form.name, target: form.target }, onSaved, notice, '模型别名已保存'); onClose(); }
    catch (error) { setError(error.message); setBusy(false); }
  }}><div className="modal-body form-stack">{error && <Alert tone="red">{error}</Alert>}
    <Field label="别名"><input name="name" required maxLength={80} defaultValue={row?.name} disabled={!!row} pattern={'[a-zA-Z0-9][a-zA-Z0-9_.\\-]{0,79}'} placeholder="my-default-model" /></Field>
    <Field label="目标模型"><input name="target" list="alias-targets" required defaultValue={row?.target} placeholder="opencode/model-id" />
      <datalist id="alias-targets">{models.map(model => <option key={model.id} value={model.id} />)}</datalist></Field>
  </div><footer><Button variant="secondary" onClick={onClose}>取消</Button><Button type="submit" loading={busy}>保存别名</Button></footer></form></Modal>;
}

function capabilityTone(score) {
  return score >= 85 ? 'high' : score >= 70 ? 'mid' : 'low';
}

function confidenceLabel(value) {
  return value === 'high' ? '高置信度' : value === 'medium' ? '中等置信度' : value === 'low' ? '低置信度' : '待核验';
}

const CAPABILITY_SORT_OPTIONS = [
  { value: 'default', label: '默认排序' },
  { value: 'capability-desc', label: '综合能力：高 → 低' },
  { value: 'capability-asc', label: '综合能力：低 → 高' },
  { value: 'reasoning-desc', label: '推理能力：高 → 低' },
  { value: 'coding-desc', label: '编码能力：高 → 低' },
  { value: 'longContext-desc', label: '长上下文：高 → 低' },
  { value: 'tools-desc', label: '工具调用：高 → 低' },
  { value: 'multimodal-desc', label: '多模态：高 → 低' },
  { value: 'efficiency-desc', label: '响应效率：高 → 低' },
];

function capabilitySortValue(row, key) {
  if (!row.capability) return null;
  if (key === 'capability') return row.capability.score;
  return row.capability.dimensions?.find(item => item.key === key)?.score ?? null;
}

function sortModelsByCapability(rows, sort) {
  if (!sort || sort === 'default') return rows;
  const [key, direction = 'desc'] = sort.split('-');
  const factor = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const left = capabilitySortValue(a, key), right = capabilitySortValue(b, key);
    if (left == null && right == null) return a.id.localeCompare(b.id);
    if (left == null) return 1;
    if (right == null) return -1;
    return left === right ? a.id.localeCompare(b.id) : (left - right) * factor;
  });
}

function CapabilityCell({ row, expanded, onToggle }) {
  const capability = row.capability;
  if (!capability) return <span className="muted">-</span>;
  return <button type="button" className={`score-chip ${capabilityTone(capability.score)}`} aria-expanded={expanded}
    title="点击展开能力评分明细" onClick={onToggle}>
    <span>{capability.score}</span><small>{capability.grade}</small><ChevronRight size={13} />
  </button>;
}

function CapabilityPanel({ capability }) {
  if (!capability) return null;
  return <div className="capability-panel">
    <div className="capability-summary">
      <div className="capability-kicker"><span>能力评估</span><span className={`capability-label ${capabilityTone(capability.score)}`}>{capability.grade} · {capability.label}</span></div>
      <div className="capability-overall"><strong>{capability.score}</strong><span>/100</span></div>
      <p>{capability.summary}</p>
      <small><ShieldCheck size={13} />{capability.basis} · {confidenceLabel(capability.confidence)}</small>
    </div>
    <div className="capability-grid">{capability.dimensions.map(item => <div className="capability-item" key={item.key}>
      <div><span>{item.label}</span><strong>{item.score}</strong></div>
      <div className="capability-track"><i style={{ width: `${item.score}%` }} /></div>
    </div>)}</div>
  </div>;
}

function ModelDetail({ row, onClose }) {
  const endpoints = row.supported_endpoints || ['/v1/chat/completions', '/v1/responses', '/v1/messages'];
  return <Modal title="模型详情" onClose={onClose} wide><div className="modal-body">
    <div className="model-detail-title"><code>{row.id}</code><CopyButton value={row.id} /></div>
    <dl className="detail-grid">{Object.entries({ '上游模型': row.upstream_id, '渠道': row.channel_name, '平台': provider(row.provider),
      '上下文长度': row.context_length || row.context_window || '-', '缓存状态': row.stale ? '已过期' : '有效', '状态': row.enabled ? '启用' : '停用',
      '费用类型': row.is_free === true ? '免费' : row.is_free === false ? '按上游计费' : '上游未标价', '最近同步': date(row.synced_at),
       ...(row.credits !== undefined ? { '计费倍率': row.credits, '价格核验时间': date(row.pricing_synced_at) } : {}),
    }).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
    <div className="endpoint-list">{endpoints.map(value => <code key={value}>{value}</code>)}</div>
  </div></Modal>;
}

export function Models() {
  const state = useData(async () => {
    const [catalog, aliases, channels] = await Promise.all([api('/models'), api('/aliases'), api('/channels')]);
    return { ...catalog, aliases: aliases.aliases, channels: channels.channels };
  });
  const [view, setView] = useState('models'), [search, setSearch] = useState(''), [filter, setFilter] = useState(''), [freeOnly, setFreeOnly] = useState('');
  const [sort, setSort] = useState('capability-desc');
  const [editor, setEditor] = useState(null), [confirm, setConfirm] = useState(null), [detail, setDetail] = useState(null), [busy, setBusy] = useState(''), [expanded, setExpanded] = useState('');
  const notice = useNotice(), models = (state.data?.data || []).filter(row => !row.alias);
  const filtered = models.filter(row => (!filter || row.channel_id === filter) && (!freeOnly || row.is_free === true)
    && row.id.toLowerCase().includes(search.toLowerCase()));
  const visible = sortModelsByCapability(filtered, sort);
  const capabilitySort = sort === 'capability-asc' ? 'asc' : sort === 'capability-desc' ? 'desc' : null;
  const aliases = (state.data?.aliases || []).filter(row => (row.name + ' ' + row.target).toLowerCase().includes(search.toLowerCase()));
  async function toggle(row, enabled) {
    setBusy(row.id);
    try { await mutate('/models/toggle', 'POST', { model: row.id, enabled }, state.refresh, notice, enabled ? '模型已启用' : '模型已停用'); }
    catch (error) { notice(error.message, 'error'); } finally { setBusy(''); }
  }
  return <><PageHeader title="模型管理" subtitle={`${models.length} 个模型 · ${models.filter(row => row.is_free === true).length} 个免费模型 · ${state.data?.aliases.length || 0} 个别名`}>
    <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={async () => {
      try {
        const result = await api('/models?refresh=1');
        await state.refresh();
        if (result.partial) notice('部分渠道同步失败，已保留上次同步结果。', 'error');
        else notice(`已同步 ${result.data.filter(row => !row.alias).length} 个模型，其中 ${result.data.filter(row => !row.alias && row.is_free === true).length} 个免费模型。`);
      } catch (error) { notice(error.message, 'error'); }
    }}>同步模型</Button><Button icon={Link2} onClick={() => setEditor({})}>创建别名</Button></PageHeader>
    <div className="view-tabs"><button className={view === 'models' ? 'active' : ''} onClick={() => setView('models')}><Network size={16} />模型目录<span>{models.length}</span></button>
      <button className={view === 'aliases' ? 'active' : ''} onClick={() => setView('aliases')}><ArrowLeftRight size={16} />模型别名<span>{state.data?.aliases.length || 0}</span></button></div>
    <div className="toolbar"><div className="search"><Search size={16} /><input placeholder="搜索模型或别名" aria-label="搜索模型" value={search} onChange={event => setSearch(event.target.value)} /></div>
      {view === 'models' && <><select className="filter-select" aria-label="模型渠道筛选" value={filter} onChange={event => setFilter(event.target.value)}><option value="">全部渠道</option>
        {(state.data?.channels || []).map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
        {state.data?.free_only ? <span className="tag">仅允许免费模型</span> : <select className="filter-select" aria-label="模型费用筛选" value={freeOnly} onChange={event => setFreeOnly(event.target.value)}><option value="">全部模型</option><option value="free">仅免费模型</option></select>}
        <select className="filter-select" aria-label="模型能力排序" value={sort} onChange={event => setSort(event.target.value)}>
          {CAPABILITY_SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select></>}<span className="result-count">{view === 'models' ? visible.length : aliases.length} 项</span></div>
    <LoadState {...state} hasData={state.data} retry={state.refresh}>
      {state.data?.free_only && <Alert>当前仅保留确认免费的模型。免费模型仍可能有使用限额；限额不会将模型移出目录。上游改为收费后，下次同步会自动移除。</Alert>}
      {state.data?.partial && <Alert>部分渠道模型目录同步失败：{state.data.providers.filter(row => row.error).map(row => state.data.channels.find(ch => ch.id === row.id)?.name || row.id).join('、')}</Alert>}
      {view === 'models' ? !visible.length ? <Empty title="没有匹配的模型" /> : <div className="table-scroll"><table><thead><tr><th>模型 ID</th><th aria-sort={capabilitySort === 'asc' ? 'ascending' : capabilitySort === 'desc' ? 'descending' : 'none'}><button type="button" className={'sort-header' + (capabilitySort ? ' active' : '')} title="点击切换综合能力排序" onClick={() => setSort(current => current === 'capability-desc' ? 'capability-asc' : 'capability-desc')}>能力<span className="sort-arrow">{capabilitySort === 'asc' ? '↑' : capabilitySort === 'desc' ? '↓' : '↕'}</span></button></th><th>渠道</th><th>协议</th><th>目录状态</th><th>启用</th><th className="right">操作</th></tr></thead>
        <tbody>{visible.map(row => <React.Fragment key={row.id}>
          <tr><td><code className="model-id" title={row.id}>{row.id}</code>{row.is_free === true && <small>免费</small>}</td>
            <td><CapabilityCell row={row} expanded={expanded === row.id} onToggle={() => setExpanded(current => current === row.id ? '' : row.id)} /></td><td>{row.channel_name}</td>
            <td><div className="protocols">{(row.supported_endpoints || ['/v1/chat/completions', '/v1/responses', '/v1/messages']).map(endpoint => {
              const label = endpoint.endsWith('/chat/completions') ? 'Chat' : endpoint.endsWith('/responses') ? 'Responses' : endpoint.endsWith('/messages') ? 'Messages' : endpoint.replace('/v1/', '');
              return <span className="tag" key={endpoint} title={endpoint}>{label}</span>;
            })}</div></td><td><span title={'最近同步：' + date(row.synced_at)} className={'catalog-state ' + (row.stale ? 'stale' : '')}>{row.stale ? '已过期' : '已同步'}</span></td>
            <td><Toggle checked={row.enabled} label={(row.enabled ? '停用 ' : '启用 ') + row.id} disabled={busy === row.id} onChange={enabled => toggle(row, enabled)} /></td>
            <td><div className="row-actions"><CopyButton value={row.id} title={'复制 ' + row.id} /><IconButton icon={Code2} title={'查看 ' + row.id} onClick={() => setDetail(row)} /></div></td>
          </tr>
          {expanded === row.id && <tr className="capability-expand-row"><td colSpan={7}><CapabilityPanel capability={row.capability} /></td></tr>}
        </React.Fragment>)}</tbody></table></div>
        : !aliases.length ? <Empty title="暂无模型别名" action={<Button icon={Link2} onClick={() => setEditor({})}>创建别名</Button>} />
          : <div className="table-scroll"><table><thead><tr><th>别名</th><th>目标模型</th><th>状态</th><th className="right">操作</th></tr></thead>
            <tbody>{aliases.map(row => <tr key={row.name}><td><code>{row.name}</code></td><td><div className="alias-target"><ArrowLeftRight size={15} /><code>{row.target}</code></div></td>
              <td><Status value={models.find(model => model.id === row.target)?.enabled ? 'enabled' : 'disabled'} /></td><td><div className="row-actions">
                <CopyButton value={row.name} title={'复制 ' + row.name} /><IconButton icon={Pencil} title={'编辑 ' + row.name} onClick={() => setEditor(row)} />
                <IconButton icon={Trash2} title={'删除 ' + row.name} className="danger-icon" onClick={() => setConfirm(row)} /></div></td></tr>)}</tbody></table></div>}
    </LoadState>
    {editor && <AliasForm row={editor.name ? editor : null} models={models} onClose={() => setEditor(null)} onSaved={state.refresh} />}
    {confirm && <Confirm title="删除模型别名" detail={`确定删除「${confirm.name}」？使用此别名的调用会失效。`} onClose={() => setConfirm(null)}
      onConfirm={() => mutate('/aliases/' + encodeURIComponent(confirm.name), 'DELETE', undefined, state.refresh, notice, '别名已删除')} />}
    {detail && <ModelDetail row={detail} onClose={() => setDetail(null)} />}
  </>;
}

function KeyForm({ row, channels, onClose, onSaved, onCreated }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [scope, setScope] = useState(row?.allowed_channels.length ? 'selected' : 'all');
  const [allowed, setAllowed] = useState(row?.allowed_channels || []), notice = useNotice();
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const input = Object.fromEntries(new FormData(event.currentTarget));
    if (scope === 'selected' && !allowed.length) { setError('请至少选择一个渠道。'); setBusy(false); return; }
    try {
      const result = await api('/keys' + (row ? '/' + row.id : ''), { method: row ? 'PATCH' : 'POST', body: {
        name: input.name, allowed_channels: scope === 'all' ? [] : allowed,
        models: input.models.split(/[\n,]/).map(value => value.trim()).filter(Boolean),
        rpm: Number(input.rpm), daily_tokens: Number(input.daily_tokens),
        expires_at: input.expires_at ? new Date(input.expires_at).toISOString() : null,
      } });
      await onSaved(); if (row) { notice('Key 已更新'); onClose(); } else onCreated(result);
    } catch (error) { setError(error.message); setBusy(false); }
  }
  const expires = row?.expires_at ? new Date(Date.parse(row.expires_at) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
  return <Modal title={row ? '编辑 API Key' : '创建 API Key'} onClose={onClose}><form onSubmit={submit}><div className="modal-body form-stack">
    {error && <Alert tone="red">{error}</Alert>}<Field label="Key 名称"><input name="name" required maxLength={100} defaultValue={row?.name} placeholder="例如：开发环境" /></Field>
    <fieldset className="permissions"><legend>渠道权限</legend><Segments label="渠道权限范围" options={[{ value: 'all', label: '全部渠道' }, { value: 'selected', label: '指定渠道' }]} value={scope} onChange={setScope} />
      {scope === 'selected' && <div className="check-list">{channels.map(channel => <label key={channel.id}><input type="checkbox" checked={allowed.includes(channel.id)}
        onChange={event => setAllowed(current => event.target.checked ? [...current, channel.id] : current.filter(id => id !== channel.id))} /><span>{channel.name}</span></label>)}</div>}</fieldset>
    <Field label="模型白名单（可选，每行一个；支持 * 后缀）"><textarea name="models" rows={3} defaultValue={row?.models.join('\n')} placeholder={'opencode/*\nworkbuddy/model-id'} spellCheck={false} /></Field>
    <div className="form-grid"><Field label="每分钟请求上限"><input name="rpm" type="number" min={1} max={10000} required defaultValue={row?.rpm ?? 60} /></Field>
      <Field label="每日 Token 软上限"><input name="daily_tokens" type="number" min={0} max={1e12} required defaultValue={row?.daily_tokens ?? 0} /></Field></div>
    <Field label="到期时间（可选）"><input name="expires_at" type="datetime-local" defaultValue={expires} /></Field>
  </div><footer><Button variant="secondary" onClick={onClose} disabled={busy}>取消</Button><Button type="submit" loading={busy} icon={row ? Check : KeyRound}>{row ? '保存 Key' : '创建 Key'}</Button></footer></form></Modal>;
}

function CreatedKey({ result, onClose }) {
  return <Modal title="API Key 已创建" onClose={onClose}><div className="modal-body form-stack">
    <Alert>此 Key 仅展示一次，请妥善保管。</Alert><div className="revealed-key"><code>{result.key}</code><CopyButton value={result.key} title="复制新建 API Key" /></div>
    <Field label="API Base URL"><div className="copy-field"><code>{location.origin}/v1</code><CopyButton value={location.origin + '/v1'} /></div></Field>
  </div><footer><CopyButton value={result.key} label="复制 Key" /><Button onClick={onClose}>完成</Button></footer></Modal>;
}

export function Keys() {
  const state = useData(async () => {
    const [keys, channels] = await Promise.all([api('/keys'), api('/channels')]);
    return { keys: keys.keys, channels: channels.channels };
  });
  const [search, setSearch] = useState(''), [editor, setEditor] = useState(null), [created, setCreated] = useState(null), [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(''), notice = useNotice(), rows = state.data?.keys || [], channels = state.data?.channels || [];
  const visible = rows.filter(row => (row.name + ' ' + row.display).toLowerCase().includes(search.toLowerCase()));
  async function toggle(row, enabled) {
    setBusy(row.id);
    try { await mutate('/keys/' + row.id, 'PATCH', { enabled }, state.refresh, notice, enabled ? 'Key 已启用' : 'Key 已停用'); }
    catch (error) { notice(error.message, 'error'); } finally { setBusy(''); }
  }
  return <><PageHeader title="API Keys" subtitle={`${rows.length} 个 Key · ${rows.filter(row => row.enabled && (!row.expires_at || Date.parse(row.expires_at) > Date.now())).length} 个有效`}>
    <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={state.refresh}>刷新</Button><Button icon={Plus} onClick={() => setEditor({})}>创建 Key</Button></PageHeader>
    <div className="toolbar"><div className="search"><Search size={16} /><input placeholder="搜索 Key" aria-label="搜索 Key" value={search} onChange={event => setSearch(event.target.value)} /></div>
      <span className="result-count">{visible.length} 项</span></div>
    <LoadState {...state} hasData={state.data} retry={state.refresh}>{!visible.length ? <Empty title={search ? '没有匹配的 Key' : '暂无 API Key'}
      action={<Button icon={Plus} onClick={() => setEditor({})}>创建 Key</Button>} /> : <div className="table-scroll"><table><thead><tr><th>Key 名称</th><th>渠道权限</th><th>模型权限</th><th>限额</th><th>到期 / 最近使用</th><th>状态</th><th className="right">操作</th></tr></thead>
        <tbody>{visible.map(row => {
          const expired = row.expires_at && Date.parse(row.expires_at) <= Date.now();
          return <tr key={row.id}><td><div className="identity"><span className="key-mark"><KeyRound size={18} /></span><div><strong>{row.name}</strong><small className="mono">{row.display}</small></div></div></td>
            <td>{row.allowed_channels.length ? <div className="permission-tags">{row.allowed_channels.map(id => <span className="tag" key={id}>{channels.find(ch => ch.id === id)?.name || '已删除渠道'}</span>)}</div> : <span className="muted">全部渠道</span>}</td>
            <td><span className="model-permission" title={row.models.join(', ')}>{row.models.length ? row.models.join(', ') : '全部模型'}</span></td>
            <td className="nowrap">{number(row.rpm)} RPM<small>{row.daily_tokens ? number(row.daily_tokens) + ' Token / 日' : '无 Token 软上限'}</small></td>
            <td className="muted nowrap">{row.expires_at ? date(row.expires_at) : '长期有效'}<small>最近 {date(row.last_used_at)}</small></td>
            <td><div className="key-state"><Status value={expired ? 'expired' : row.enabled ? 'enabled' : 'disabled'} />
              <Toggle checked={row.enabled} label={(row.enabled ? '停用 ' : '启用 ') + row.name} disabled={busy === row.id || (!!expired && !row.enabled)} onChange={enabled => toggle(row, enabled)} /></div></td>
            <td><div className="row-actions"><IconButton icon={Pencil} title={'编辑 ' + row.name} onClick={() => setEditor(row)} />
              <IconButton icon={Trash2} title={'撤销 ' + row.name} className="danger-icon" onClick={() => setConfirm(row)} /></div></td></tr>;
        })}</tbody></table></div>}
    </LoadState>
    {editor && <KeyForm row={editor.id ? editor : null} channels={channels} onClose={() => setEditor(null)} onSaved={state.refresh} onCreated={result => { setEditor(null); setCreated(result); }} />}
    {created && <CreatedKey result={created} onClose={() => setCreated(null)} />}
    {confirm && <Confirm title="撤销 API Key" detail={`确定撤销「${confirm.name}」？此 Key 将立即失效，且无法恢复。`} onClose={() => setConfirm(null)}
      onConfirm={() => mutate('/keys/' + confirm.id, 'DELETE', undefined, state.refresh, notice, 'Key 已撤销')} />}
  </>;
}
