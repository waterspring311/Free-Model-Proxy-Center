import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck, CheckCircle2, Coins, ExternalLink, FileJson, KeyRound, LoaderCircle, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, Upload, UserRound } from 'lucide-react';
import { api, date, number, provider } from './api.js';
import { Alert, Button, Confirm, Empty, Field, IconButton, LoadState, Modal, PageHeader, ProviderMark, Segments, Status, Toggle, mutate, useData, useNotice } from './ui.jsx';

function AddAccount({ onClose, onSaved }) {
  const [type, setType] = useState('opencode'), [mode, setMode] = useState('oauth'), [realm, setRealm] = useState('intl');
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [oauth, setOAuth] = useState(null);
  const [document, setDocument] = useState(''), [report, setReport] = useState(null);
  const flow = useRef(null), notice = useNotice();
  useEffect(() => () => {
    if (flow.current) api('/accounts/oauth/cancel', { method: 'POST', body: { state: flow.current } }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!oauth?.state || oauth.status !== 'pending') return;
    let stopped = false, timer;
    async function poll() {
      try {
        const result = await api('/accounts/oauth/poll?state=' + encodeURIComponent(oauth.state));
        if (stopped) return;
        if (result.status === 'ok') {
          flow.current = null; setOAuth(current => ({ ...current, status: 'ok' })); notice('账号授权完成'); await onSaved(); return;
        }
        if (result.status !== 'pending') { flow.current = null; setOAuth(current => ({ ...current, status: result.status })); setError(result.message || '授权已过期，请重新发起。'); return; }
      } catch (error) { if (!stopped) setError(error.message); }
      if (!stopped) timer = setTimeout(poll, 2500);
    }
    timer = setTimeout(poll, 1500);
    return () => { stopped = true; clearTimeout(timer); };
  }, [oauth?.state, oauth?.status]);
  async function startOAuth() {
    setBusy(true); setError('');
    try {
      if (flow.current) await api('/accounts/oauth/cancel', { method: 'POST', body: { state: flow.current } });
      const result = await api('/accounts/oauth/start', { method: 'POST', body: { realm } });
      flow.current = result.state; setOAuth({ ...result, status: 'pending' });
    } catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setReport(null);
    try {
      if (type === 'opencode') {
        const form = Object.fromEntries(new FormData(event.currentTarget));
        const keys = [...new Set(form.keys.split(/\r?\n/).map(key => key.trim()).filter(Boolean))];
        if (!keys.length || keys.length > 100) throw new Error('请输入 1-100 个 Key。');
        let added = 0, failures = [];
        for (const [index, key] of keys.entries()) {
          try {
            const result = await api('/accounts', { method: 'POST', body: { kind: form.kind, name: form.name ? form.name + (keys.length > 1 ? ' ' + (index + 1) : '') : undefined, key } });
            if (result.warning) failures.push(result.warning); added++;
          } catch (error) { failures.push('第 ' + (index + 1) + ' 行：' + error.message); }
        }
        await onSaved(); notice('已添加 ' + added + ' 个 Key');
        if (failures.length) { setError(failures.join('；')); setBusy(false); return; }
        onClose();
      } else {
        let parsed;
        try { parsed = JSON.parse(document); } catch { throw new Error('账号文件不是有效的 JSON。'); }
        const result = await api('/accounts/import', { method: 'POST', body: { realm, data: parsed } });
        setDocument(''); setReport(result.result); await onSaved(); notice('账号导入完成');
      }
    } catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  async function file(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) { setError('账号文件超过 16 MB。'); return; }
    setDocument(await file.text()); setError('');
  }
  return <Modal title="添加账号" onClose={onClose}><div className="modal-body">
    <Segments label="账号平台" options={[{ value: 'opencode', label: 'OpenCode' }, { value: 'workbuddy', label: 'WorkBuddy / CodeBuddy' }]}
      value={type} onChange={value => { if (!flow.current) { setType(value); setError(''); } }} />
    {error && <Alert tone="red">{error}</Alert>}
    {type === 'opencode' ? <form id="add-account" onSubmit={save} className="form-stack">
      <Field label="Key 类型"><select name="kind"><option value="zen">Zen</option><option value="go">Go</option></select></Field>
      <Field label="账号名称"><input name="name" placeholder="可选" maxLength={90} /></Field>
      <Field label="上游 Key（每行一个）"><textarea name="keys" className="secret-input" rows={6} required autoComplete="off" spellCheck={false} placeholder="sk-..." /></Field>
    </form> : <div className="form-stack">
      <Field label="账号区域"><select value={realm} onChange={event => setRealm(event.target.value)} disabled={!!flow.current}>
        <option value="intl">WorkBuddy 国际版</option><option value="cn">CodeBuddy 国内版</option></select></Field>
      <Segments label="接入方式" options={[{ value: 'oauth', label: 'OAuth 授权' }, { value: 'import', label: 'JSON 导入' }]} value={mode}
        onChange={value => { if (!flow.current) { setMode(value); setError(''); } }} />
      {mode === 'oauth' ? <div className="oauth-state">
        {oauth?.status === 'ok' ? <><CheckCircle2 size={36} className="text-green" /><strong>账号已加入工作空间</strong></>
          : oauth?.status === 'pending' ? <><LoaderCircle size={30} className="spin text-green" /><strong>等待完成授权</strong>
            <a className="button primary" href={oauth.authUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />打开授权页</a></>
          : <><ShieldCheck size={38} strokeWidth={1.5} /><Button icon={ExternalLink} loading={busy} onClick={startOAuth}>获取授权链接</Button></>}
      </div> : <form id="add-account" onSubmit={save} className="form-stack">
        <label className="file-upload"><Upload size={18} /><span>选择账号 JSON 文件</span><input type="file" accept=".json,application/json" onChange={file} /></label>
        <Field label="账号 JSON"><textarea value={document} onChange={event => setDocument(event.target.value)} required rows={7} autoComplete="off" spellCheck={false} placeholder={'{"accounts": [...]}'} /></Field>
        {report && <div className="import-report"><span>新增 {report.added?.length || 0}</span><span>跳过 {report.skipped?.length || 0}</span><span>无效 {report.invalid?.length || 0}</span>
          {!!report.invalid?.length && <Alert tone="red">{report.invalid.map(row => row.error || row.reason || '账号数据不完整').join('；')}</Alert>}</div>}
      </form>}
    </div>}
  </div><footer><Button variant="secondary" onClick={onClose} disabled={busy}>{oauth?.status === 'ok' ? '完成' : '关闭'}</Button>
    {(type === 'opencode' || mode === 'import') && <Button type="submit" form="add-account" icon={type === 'opencode' ? KeyRound : FileJson} loading={busy}>{type === 'opencode' ? '添加 Key' : '导入账号'}</Button>}</footer></Modal>;
}

function RenameAccount({ row, onClose, onSaved }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), notice = useNotice();
  return <Modal title="编辑账号" onClose={onClose}><form onSubmit={async event => {
    event.preventDefault(); setBusy(true);
    try { await mutate('/accounts/' + encodeURIComponent(row.id), 'PATCH', { name: new FormData(event.currentTarget).get('name') }, onSaved, notice); onClose(); }
    catch (error) { setError(error.message); setBusy(false); }
  }}><div className="modal-body">{error && <Alert tone="red">{error}</Alert>}<Field label="账号名称"><input name="name" defaultValue={row.name} required maxLength={100} autoFocus /></Field></div>
    <footer><Button variant="secondary" onClick={onClose}>取消</Button><Button type="submit" loading={busy}>保存</Button></footer></form></Modal>;
}

export function Accounts() {
  const state = useData(() => api('/accounts'));
  const [filter, setFilter] = useState('all'), [search, setSearch] = useState(''), [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(null), [editing, setEditing] = useState(null), [busy, setBusy] = useState(new Set());
  const [checking, setChecking] = useState(false);
  const notice = useNotice(), accounts = state.data?.accounts || [];
  const visible = accounts.filter(row => (filter === 'all' || row.provider === filter || row.kind === filter)
    && (row.name + ' ' + row.display).toLowerCase().includes(search.toLowerCase()));
  async function action(row, method, body, suffix = '') {
    setBusy(value => new Set(value).add(row.id));
    try {
      const result = await api('/accounts/' + encodeURIComponent(row.id) + suffix, { method, body });
      await state.refresh();
      if (result.warning) notice(result.warning, 'error');
      else if (result.ok === false) notice(result.results?.find(row => !row.ok)?.error || '账号操作失败，请检查账号状态。', 'error');
      else notice(suffix === '/credits' ? '额度已刷新' : suffix === '/refresh' ? '凭据已刷新' : '账号已更新');
    } catch (error) { notice(error.message, 'error'); }
    finally { setBusy(value => { const next = new Set(value); next.delete(row.id); return next; }); }
  }
  // Triggers the engine's growth tasks (daily check-in, cat travel, keepalive)
  // and reports the last log line once the run settles.
  async function runCheckin() {
    setChecking(true);
    try {
      const started = await api('/accounts/checkin', { method: 'POST', body: {} });
      if (started.ok === false) throw new Error(started.msg || '签到触发失败。');
      notice('已开始自动签到，正在执行…');
      let last = '', previous = '', stable = 0;
      for (let attempt = 0; attempt < 20; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const status = await api('/accounts/checkin');
        const logs = status.logs || [];
        last = logs[logs.length - 1] || '';
        if (/巡检完成|跳过本次|无可用/.test(last)) break;
        stable = last === previous ? stable + 1 : 0;
        previous = last;
        if (stable >= 3) break;   // the cycle settled without a completion line
      }
      const text = last.replace(/^\[[^\]]+\]\s*/, '');
      if (text) notice(text, /失败|错误|!/.test(text) ? 'error' : 'success');
      await state.refresh();
    } catch (error) { notice(error.message, 'error'); }
    finally { setChecking(false); }
  }
  return <><PageHeader title="账号管理" subtitle={`${accounts.filter(row => row.kind !== 'anonymous').length} 个账号 · ${accounts.filter(row => row.enabled && row.kind !== 'anonymous').length} 个启用`}>
    <Button variant="secondary" icon={CalendarCheck} loading={checking} onClick={runCheckin}
      title="为所有 WorkBuddy / CodeBuddy 账号执行每日签到、猫猫旅行与凭据保活">自动签到</Button>
    <Button variant="secondary" icon={RefreshCw} loading={state.loading} onClick={async () => { await api('/accounts?refresh=1').then(() => state.refresh()).catch(error => notice(error.message, 'error')); }}>刷新</Button>
    <Button icon={Plus} onClick={() => setAdding(true)}>添加账号</Button></PageHeader>
    <div className="toolbar"><Segments label="平台筛选" value={filter} onChange={setFilter} options={[
      { value: 'all', label: '全部账号' }, { value: 'opencode', label: 'OpenCode' }, { value: 'intl', label: 'WorkBuddy' }, { value: 'cn', label: 'CodeBuddy' }]} />
      <div className="search"><Search size={16} /><input placeholder="搜索账号" aria-label="搜索账号" value={search} onChange={event => setSearch(event.target.value)} /></div></div>
    <LoadState {...state} hasData={state.data} retry={state.refresh}>{state.data?.workbuddy_error && <Alert>{state.data.workbuddy_error}</Alert>}
      {!visible.length ? <Empty title={search || filter !== 'all' ? '没有匹配的账号' : '暂无账号'} action={<Button icon={Plus} onClick={() => setAdding(true)}>添加账号</Button>} />
        : <div className="table-scroll"><table className="accounts-table"><thead><tr><th>账号</th><th>类型</th><th>状态</th><th>剩余额度</th><th>凭据到期</th><th>启用</th><th className="right">操作</th></tr></thead>
          <tbody>{visible.map(row => <tr key={row.id}><td><div className="identity"><ProviderMark kind={row.provider === 'opencode' ? row.provider : row.kind} /><div>
            <strong>{row.name || row.display}</strong><small className="mono">{row.display}</small></div></div></td>
            <td><span className="tag">{provider(row.kind)}</span></td><td><Status value={row.status} /></td><td className="tabular">{row.credits == null ? '-' : number(row.credits)}</td>
            <td className="muted nowrap">{date(row.expires_at)}</td><td><Toggle checked={row.enabled} label={(row.enabled ? '停用 ' : '启用 ') + row.name}
              disabled={busy.has(row.id)} onChange={enabled => action(row, 'PATCH', { enabled })} /></td>
            <td><div className="row-actions">{row.provider === 'workbuddy' && <>
              <IconButton icon={Coins} title={'刷新额度 ' + row.name} disabled={busy.has(row.id)} onClick={() => action(row, 'POST', {}, '/credits')} />
              <IconButton icon={RefreshCw} title={'刷新凭据 ' + row.name} disabled={busy.has(row.id) || !row.refreshable} onClick={() => action(row, 'POST', {}, '/refresh')} /></>}
              {row.provider === 'opencode' && row.id !== 'public' && <IconButton icon={Pencil} title={'编辑 ' + row.name} onClick={() => setEditing(row)} />}
              {row.id !== 'public' && <IconButton icon={Trash2} title={'删除 ' + row.name} className="danger-icon" onClick={() => setConfirm(row)} />}</div></td></tr>)}</tbody></table></div>}
    </LoadState>
    {adding && <AddAccount onClose={() => setAdding(false)} onSaved={state.refresh} />}
    {editing && <RenameAccount row={editing} onClose={() => setEditing(null)} onSaved={state.refresh} />}
    {confirm && <Confirm title="删除账号" detail={`确定删除「${confirm.name}」？账号将从本地池中移除。`} onClose={() => setConfirm(null)}
      onConfirm={() => mutate('/accounts/' + encodeURIComponent(confirm.id), 'DELETE', undefined, state.refresh, notice, '账号已删除')} />}
  </>;
}
