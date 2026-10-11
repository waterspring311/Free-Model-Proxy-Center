import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, BarChart3, Blocks, ChevronRight, CircleHelp, HeartPulse, KeyRound, LayoutDashboard,
  Menu, Network, RefreshCw, Settings2, ShieldCheck, Users, X } from 'lucide-react';
import { api } from './api.js';
import { IconButton, NoticeContext, Notices } from './ui.jsx';
import { Accounts, ChannelStatus, Channels, Keys, Models, Overview, Requests, Settings, Tokens } from './pages.jsx';
import './styles.css';

const navigation = [
  ['overview', '总览', LayoutDashboard, Overview], ['status', '渠道状态', HeartPulse, ChannelStatus],
  ['tokens', 'Token 看板', BarChart3, Tokens],
  ['accounts', '账号管理', Users, Accounts], ['channels', '渠道管理', Network, Channels],
  ['models', '模型管理', Blocks, Models], ['keys', 'API Keys', KeyRound, Keys],
  ['requests', '请求日志', Activity, Requests], ['settings', '设置', Settings2, Settings],
];

function Brand({ compact = false }) {
  return <div className={'brand ' + (compact ? 'compact' : '')}><span className="brand-icon"><Network size={23} strokeWidth={2.2} /></span>
    <div><strong>OneHub<span className="brand-dot">.</span></strong>{!compact && <small>API WORKSPACE</small>}</div></div>;
}

function App() {
  const [workspace, setWorkspace] = useState({ username: 'admin' });
  const [page, setPage] = useState(() => navigation.some(row => row[0] === location.hash.slice(1)) ? location.hash.slice(1) : 'overview');
  const [sidebar, setSidebar] = useState(false), [revision, setRevision] = useState(0);
  const [notices, setNotices] = useState([]);
  const notice = useCallback((text, tone = 'success') => {
    const id = crypto.randomUUID();
    setNotices(rows => [...rows.slice(-3), { id, text, tone }]);
    setTimeout(() => setNotices(rows => rows.filter(row => row.id !== id)), 5500);
  }, []);
  useEffect(() => {
    // The console has no login; this only fetches the workspace display name.
    api('/auth/session').then(setWorkspace).catch(() => {});
    const changed = () => { const hash = location.hash.slice(1); setPage(navigation.some(row => row[0] === hash) ? hash : 'overview'); setSidebar(false); };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  const current = navigation.find(row => row[0] === page), Component = current[3];
  return <NoticeContext.Provider value={notice}><div className="app">
    {sidebar && <div className="sidebar-shade" onClick={() => setSidebar(false)} />}
    <aside className={'sidebar ' + (sidebar ? 'visible' : '')}><div className="sidebar-brand"><Brand />
      <IconButton icon={X} title="关闭导航" className="mobile-only" onClick={() => setSidebar(false)} /></div>
      <div className="workspace-label"><span className="workspace-avatar">L</span><div><strong>本地工作空间</strong><small>LOCAL / ADMIN</small></div><ChevronRight size={15} /></div>
      <span className="nav-label">工作空间</span><nav>{navigation.filter(([id]) => id !== 'settings').map(([id, name, Icon]) =>
        <a href={'#' + id} key={id} className={page === id ? 'active' : ''} aria-current={page === id ? 'page' : undefined}><Icon size={18} /><span>{name}</span>
          {page === id && <span className="nav-indicator" />}</a>)}</nav>
      <span className="nav-label secondary-label">系统</span><nav><a href="#settings" className={page === 'settings' ? 'active' : ''}><Settings2 size={18} /><span>设置</span></a></nav>
      <div className="sidebar-bottom"><div className="local-status"><i />网关运行中<span>v0.1.0</span></div>
        <div className="user"><span className="avatar">{workspace.username?.slice(0, 1).toUpperCase()}</span>
          <div><strong>{workspace.username}</strong><small>本机管理员</small></div>
          <span className="user-local" title="仅监听 127.0.0.1，无需登录"><ShieldCheck size={16} /></span></div></div>
    </aside>
    <div className="main-shell"><header className="topbar"><div><IconButton icon={Menu} title="打开导航" className="mobile-only" onClick={() => setSidebar(true)} />
      <span className="breadcrumb-parent">工作空间</span><ChevronRight size={14} /><span>{current[1]}</span></div>
      <div className="topbar-actions"><span className="instance-pill"><ShieldCheck size={14} />本机实例 · 免登录</span>
        <IconButton icon={RefreshCw} title="刷新当前页" onClick={() => setRevision(value => value + 1)} />
        <IconButton icon={CircleHelp} title="系统信息" onClick={() => { location.hash = 'settings'; }} />
        <span className="avatar small">{workspace.username?.slice(0, 1).toUpperCase()}</span></div></header>
      <main className="main-content"><Component key={page + revision} session={workspace} /></main>
      <footer className="workspace-footer"><span>OneHub<span className="footer-divider">/</span>本地工作空间</span><span>Asia/Shanghai</span></footer>
    </div></div><Notices notices={notices} /></NoticeContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App />);
