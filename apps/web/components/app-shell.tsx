'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, ArrowUpRight, Bell, Building2, CalendarCheck, CalendarDays,
  CheckCheck, ChevronDown, Clock3, Command, Grid2X2, HelpCircle,
  LayoutDashboard, Moon, Search, Settings2, ShieldCheck, Sun, Users,
  Wallet, Zap, X, ChevronRight, CircleHelp, Mail, UserRound
} from 'lucide-react';
import { useTheme } from './theme-provider';

const navigation = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays, count: '12' },
  { label: 'Resources', href: '/dashboard/resources', icon: Grid2X2 },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Payments', href: '/dashboard/payments', icon: Wallet }
];

/* Every page, used by the breadcrumb quick-switch menu */
const allPages = [
  ...navigation,
  { label: 'Team & permissions', href: '/dashboard/team', icon: ShieldCheck },
  { label: 'Analytics', href: '/dashboard/analytics', icon: Activity },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings2 },
];

const initialNotifications = [
  {
    id: 1,
    title: 'New booking received',
    detail: 'Maya Sharma booked Badminton Court 01.',
    time: 'Just now',
    read: false,
    icon: CalendarCheck,
  },
  {
    id: 2,
    title: 'Awaiting approval',
    detail: 'Arjun Rao\'s booking for Meeting Room A needs approval.',
    time: '1 hour ago',
    read: false,
    icon: Clock3,
  },
  {
    id: 3,
    title: 'Workspace is ready',
    detail: 'Your SlotSync Sports Hub workspace is set up.',
    time: 'Yesterday',
    read: true,
    icon: Building2,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [supportOpen, setSupportOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [topProfileOpen, setTopProfileOpen] = useState(false);
  const [crumbMenuOpen, setCrumbMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const topProfileRef = useRef<HTMLDivElement>(null);
  const crumbRef = useRef<HTMLDivElement>(null);
  const sideProfileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const currentPage = allPages.find(
    p =>
      pathname === p.href ||
      (p.href !== '/dashboard' && pathname.startsWith(p.href))
  );

  const pageLabel =
    currentPage?.label ??
    (pathname === '/dashboard'
      ? 'Overview'
      : pathname.split('/').pop()?.replaceAll('-', ' ') ?? 'Overview');

  function markAllRead() {
    setNotifications(items => items.map(n => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications(items =>
      items.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function closeAllMenus() {
    setWorkspaceMenuOpen(false);
    setNotificationsOpen(false);
    setTopProfileOpen(false);
    setCrumbMenuOpen(false);
    setProfileMenuOpen(false);
  }

  /* Close dropdowns when navigating to another page */
  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  /* Close dropdowns on outside click or Escape */
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;

      if (workspaceRef.current && !workspaceRef.current.contains(target)) {
        setWorkspaceMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (topProfileRef.current && !topProfileRef.current.contains(target)) {
        setTopProfileOpen(false);
      }
      if (crumbRef.current && !crumbRef.current.contains(target)) {
        setCrumbMenuOpen(false);
      }
      if (sideProfileRef.current && !sideProfileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeAllMenus();
        setSupportOpen(false);
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="app-shell">
      <style>{`
        .shell-pop-item:hover { background: rgba(140,140,160,0.14); }
      `}</style>

      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark"><Command size={19} strokeWidth={2.2} /></span>
          <span>SlotSync</span>
          <span className="brand-period">.</span>
        </Link>

        {/* Workspace switcher (now functional) */}
        <div ref={workspaceRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="workspace-switch"
            aria-expanded={workspaceMenuOpen}
            onClick={() => {
              setWorkspaceMenuOpen(open => !open);
              setNotificationsOpen(false);
              setTopProfileOpen(false);
              setCrumbMenuOpen(false);
            }}
          >
            <span className="workspace-avatar">S</span>
            <span className="workspace-copy">
              <strong>SlotSync Sports Hub</strong>
              <small>Workspace</small>
            </span>
            <ChevronDown
              size={15}
              style={{
                transition: 'transform .2s',
                transform: workspaceMenuOpen ? 'rotate(180deg)' : 'none',
              }}
            />
          </button>

          {workspaceMenuOpen && (
            <div
              style={{
                ...popoverStyle,
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
              }}
            >
              <div style={popoverHeaderStyle}>
                <span style={mutedLabelStyle}>CURRENT WORKSPACE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  <span className="workspace-avatar">S</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: 13 }}>
                      SlotSync Sports Hub
                    </strong>
                    <small style={{ opacity: 0.65 }}>Owner · Active workspace</small>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="shell-pop-item"
                style={popoverItemStyle}
                onClick={() => setWorkspaceMenuOpen(false)}
              >
                <LayoutDashboard size={16} />
                Workspace overview
              </Link>

              <Link
                href="/dashboard/team"
                className="shell-pop-item"
                style={popoverItemStyle}
                onClick={() => setWorkspaceMenuOpen(false)}
              >
                <ShieldCheck size={16} />
                Team &amp; permissions
              </Link>

              <Link
                href="/dashboard/settings"
                className="shell-pop-item"
                style={popoverItemStyle}
                onClick={() => setWorkspaceMenuOpen(false)}
              >
                <Settings2 size={16} />
                Manage workspace
              </Link>
            </div>
          )}
        </div>

        <div className="side-label">WORKSPACE</div>

        <nav className="side-nav">
          {navigation.map(item => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.count && <span className="nav-count">{item.count}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="side-label side-label-spaced">MANAGE</div>

        <nav className="side-nav">
          <Link href="/dashboard/team" className={`nav-item ${pathname.startsWith('/dashboard/team') ? 'active' : ''}`}>
            <ShieldCheck size={17} />
            <span>Team & permissions</span>
          </Link>

          <Link href="/dashboard/analytics" className={`nav-item ${pathname.startsWith('/dashboard/analytics') ? 'active' : ''}`}>
            <Activity size={17} />
            <span>Analytics</span>
          </Link>

          <Link href="/dashboard/settings" className={`nav-item ${pathname.startsWith('/dashboard/settings') ? 'active' : ''}`}>
            <Settings2 size={17} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Zap size={15} /></div>
            <strong>Make more room.</strong>
            <p>Explore everything SlotSync can do for your organisation.</p>
            <Link href="/#features">
              Explore features <ArrowUpRight size={13} />
            </Link>
          </div>

          <button
            className="nav-item help-link"
            onClick={() => setSupportOpen(true)}
          >
            <HelpCircle size={17} />
            <span>Help & support</span>
            <ChevronRight size={15} style={{ marginLeft: 'auto' }} />
          </button>

          <div className="profile-row" ref={sideProfileRef}>
            <button
              type="button"
              className="profile-main"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="profile-avatar">AK</div>
              <div className="profile-copy">
                <strong>Akash JT</strong>
                <small>Owner account</small>
              </div>
            </button>

            <button
              className="icon-button small"
              aria-label="Open account menu"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <span className="more-dots">•••</span>
            </button>

            {profileMenuOpen && (
              <div className="profile-menu">
                <button
                  onClick={() => {
                    setAccountOpen(true);
                    setProfileMenuOpen(false);
                  }}
                >
                  <UserRound size={16} />
                  View Akash JT Account
                </button>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <Settings2 size={16} />
                  Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          {/* Breadcrumb (now functional) */}
          <div className="breadcrumbs">
            <span>
              <Link
                href="/dashboard"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Workspace
              </Link>
            </span>
            <span className="crumb-slash">/</span>

            <div ref={crumbRef} style={{ position: 'relative' }}>
              <strong>
                <button
                  type="button"
                  aria-expanded={crumbMenuOpen}
                  onClick={() => {
                    setCrumbMenuOpen(open => !open);
                    setWorkspaceMenuOpen(false);
                    setNotificationsOpen(false);
                    setTopProfileOpen(false);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    font: 'inherit',
                    padding: 0,
                    cursor: 'pointer',
                    textTransform: 'inherit',
                  }}
                >
                  {pageLabel}
                  <ChevronDown
                    size={14}
                    style={{
                      opacity: 0.6,
                      transition: 'transform .2s',
                      transform: crumbMenuOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </button>
              </strong>

              {crumbMenuOpen && (
                <div
                  style={{
                    ...popoverStyle,
                    top: 'calc(100% + 12px)',
                    left: 0,
                    width: 230,
                  }}
                >
                  <div style={popoverHeaderStyle}>
                    <span style={mutedLabelStyle}>GO TO</span>
                  </div>

                  {allPages.map(page => {
                    const Icon = page.icon;
                    const isCurrent = currentPage?.href === page.href;

                    return (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="shell-pop-item"
                        onClick={() => setCrumbMenuOpen(false)}
                        style={{
                          ...popoverItemStyle,
                          fontWeight: isCurrent ? 600 : 400,
                          background: isCurrent
                            ? 'rgba(120,103,237,0.16)'
                            : 'transparent',
                        }}
                      >
                        <Icon size={16} />
                        {page.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="topbar-actions">
            <button className="search-trigger">
              <Search size={15} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>

            <button
              className="icon-button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications (now functional) */}
            <div ref={notificationsRef} style={{ position: 'relative' }}>
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen(open => !open);
                  setTopProfileOpen(false);
                  setWorkspaceMenuOpen(false);
                  setCrumbMenuOpen(false);
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && <i />}
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    ...popoverStyle,
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: 360,
                    maxWidth: '88vw',
                  }}
                >
                  <div
                    style={{
                      ...popoverHeaderStyle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 14 }}>Notifications</strong>
                      <small style={{ display: 'block', opacity: 0.6, marginTop: 2 }}>
                        {unreadCount > 0
                          ? `${unreadCount} unread`
                          : 'You\'re all caught up'}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={markAllRead}
                      disabled={unreadCount === 0}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 12,
                        background: 'transparent',
                        border: 'none',
                        color: '#a99cff',
                        cursor: unreadCount === 0 ? 'default' : 'pointer',
                        opacity: unreadCount === 0 ? 0.4 : 1,
                        fontFamily: 'inherit',
                      }}
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  </div>

                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifications.map(item => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="shell-pop-item"
                          onClick={() => markRead(item.id)}
                          style={{
                            ...popoverItemStyle,
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '13px 16px',
                            borderBottom:
                              '1px solid var(--border, rgba(150,150,170,0.18))',
                            background: item.read
                              ? 'transparent'
                              : 'rgba(120,103,237,0.09)',
                          }}
                        >
                          <span
                            style={{
                              width: 32,
                              height: 32,
                              flexShrink: 0,
                              display: 'grid',
                              placeItems: 'center',
                              borderRadius: 9,
                              background: 'rgba(120,103,237,0.16)',
                              color: '#a99cff',
                            }}
                          >
                            <Icon size={16} />
                          </span>

                          <span style={{ flex: 1 }}>
                            <strong style={{ display: 'block', fontSize: 13 }}>
                              {item.title}
                            </strong>
                            <span
                              style={{
                                display: 'block',
                                fontSize: 12,
                                opacity: 0.7,
                                marginTop: 2,
                              }}
                            >
                              {item.detail}
                            </span>
                            <small style={{ opacity: 0.5 }}>{item.time}</small>
                          </span>

                          {!item.read && (
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#7867ed',
                                marginTop: 6,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <Link
                    href="/dashboard/bookings"
                    className="shell-pop-item"
                    onClick={() => setNotificationsOpen(false)}
                    style={{
                      ...popoverItemStyle,
                      justifyContent: 'center',
                      color: '#a99cff',
                      fontWeight: 600,
                    }}
                  >
                    View all bookings
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            <div className="topbar-divider" />

            {/* Top-right avatar (now functional) */}
            <div ref={topProfileRef} style={{ position: 'relative' }}>
              <div
                className="topbar-avatar"
                role="button"
                tabIndex={0}
                aria-label="Open profile menu"
                aria-expanded={topProfileOpen}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setTopProfileOpen(open => !open);
                  setNotificationsOpen(false);
                  setWorkspaceMenuOpen(false);
                  setCrumbMenuOpen(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setTopProfileOpen(open => !open);
                  }
                }}
              >
                AK
              </div>

              {topProfileOpen && (
                <div
                  style={{
                    ...popoverStyle,
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: 240,
                  }}
                >
                  <div style={popoverHeaderStyle}>
                    <strong style={{ display: 'block', fontSize: 14 }}>
                      Akash JT
                    </strong>
                    <small style={{ opacity: 0.65 }}>admin@slotsync.demo</small>
                  </div>

                  <button
                    type="button"
                    className="shell-pop-item"
                    style={popoverItemStyle}
                    onClick={() => {
                      setAccountOpen(true);
                      setTopProfileOpen(false);
                    }}
                  >
                    <UserRound size={16} />
                    View account
                  </button>

                  <Link
                    href="/dashboard/team"
                    className="shell-pop-item"
                    style={popoverItemStyle}
                    onClick={() => setTopProfileOpen(false)}
                  >
                    <ShieldCheck size={16} />
                    Team &amp; permissions
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="shell-pop-item"
                    style={popoverItemStyle}
                    onClick={() => setTopProfileOpen(false)}
                  >
                    <Settings2 size={16} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    className="shell-pop-item"
                    style={{
                      ...popoverItemStyle,
                      borderTop:
                        '1px solid var(--border, rgba(150,150,170,0.2))',
                    }}
                    onClick={() => {
                      toggleTheme();
                      setTopProfileOpen(false);
                    }}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>

      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          style={overlayStyle}
        >
          <section
            onClick={(e) => e.stopPropagation()}
            style={modalStyle}
          >
            <div style={modalHeaderStyle}>
              <div>
                <div style={modalIconStyle}><CircleHelp size={21} /></div>
                <h2>Help & Support</h2>
                <p>How can we help you today?</p>
              </div>
              <button style={closeButtonStyle} onClick={() => setSupportOpen(false)}>
                <X size={19} />
              </button>
            </div>

            <div style={supportItemStyle}>
              <strong>How do I create a booking?</strong>
              <p>Open Bookings from the sidebar and select New Booking to create a reservation.</p>
            </div>

            <div style={supportItemStyle}>
              <strong>How do I manage resources?</strong>
              <p>Visit Resources to view and manage the resources available in your workspace.</p>
            </div>

            <div style={supportItemStyle}>
              <strong>How do I manage my team?</strong>
              <p>Open Team & Permissions to manage members and their workspace roles.</p>
            </div>

            <div style={{ ...supportItemStyle, borderBottom: 'none' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} />
                <strong>Need more help?</strong>
              </div>
              <p>Contact your workspace administrator for further assistance.</p>
            </div>

            <button style={primaryButtonStyle} onClick={() => setSupportOpen(false)}>
              Got it
            </button>
          </section>
        </div>
      )}

      {accountOpen && (
        <div
          onClick={() => setAccountOpen(false)}
          style={overlayStyle}
        >
          <section
            onClick={(e) => e.stopPropagation()}
            style={modalStyle}
          >
            <div style={modalHeaderStyle}>
              <div>
                <div style={modalIconStyle}><UserRound size={21} /></div>
                <h2>Account</h2>
                <p>View your account information.</p>
              </div>
              <button style={closeButtonStyle} onClick={() => setAccountOpen(false)}>
                <X size={19} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 0' }}>
              <div style={accountAvatarStyle}>AK</div>
              <div>
                <h3 style={{ margin: 0 }}>Akash JT</h3>
                <p style={{ margin: '5px 0 0', opacity: 0.65, fontSize: '13px' }}>Owner account</p>
              </div>
            </div>

            <div style={supportItemStyle}>
              <span style={mutedLabelStyle}>WORKSPACE</span>
              <strong>SlotSync Sports Hub</strong>
            </div>

            <div style={supportItemStyle}>
              <span style={mutedLabelStyle}>ROLE</span>
              <strong>Owner</strong>
            </div>

            <Link
              href="/dashboard/settings"
              onClick={() => setAccountOpen(false)}
              style={accountSettingsLinkStyle}
            >
              <Settings2 size={17} />
              Manage settings
              <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}

/* ---------- Dropdown styles ---------- */
const popoverStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 80,
  background: 'var(--panel, #242633)',
  color: 'var(--text, #fff)',
  border: '1px solid var(--border, rgba(150,150,170,0.25))',
  borderRadius: '14px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  overflow: 'hidden',
  textAlign: 'left',
};

const popoverHeaderStyle: React.CSSProperties = {
  padding: '13px 16px',
  borderBottom: '1px solid var(--border, rgba(150,150,170,0.2))',
};

const popoverItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '11px 16px',
  fontSize: '13px',
  color: 'inherit',
  textDecoration: 'none',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

/* ---------- Modal styles (unchanged) ---------- */
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(0,0,0,0.58)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  backdropFilter: 'blur(5px)',
};

const modalStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '460px',
  maxHeight: '85vh',
  overflowY: 'auto',
  background: 'var(--panel, #242633)',
  color: 'var(--text, #fff)',
  border: '1px solid var(--border, rgba(150,150,170,0.25))',
  borderRadius: '18px',
  padding: '24px',
  boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '20px',
};

const modalIconStyle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '12px',
  background: 'rgba(120,103,237,0.18)',
  color: '#a99cff',
  marginBottom: '14px',
};

const closeButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'rgba(140,140,160,0.12)',
  color: 'inherit',
  borderRadius: '9px',
  padding: '8px',
  cursor: 'pointer',
};

const supportItemStyle: React.CSSProperties = {
  padding: '15px 0',
  borderBottom: '1px solid var(--border, rgba(150,150,170,0.2))',
  display: 'grid',
  gap: '7px',
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  background: '#7867ed',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '18px',
};

const accountAvatarStyle: React.CSSProperties = {
  width: '54px',
  height: '54px',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: '#e8dfd4',
  color: '#554b43',
  fontWeight: 700,
  fontSize: '17px',
};

const mutedLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '1px',
  opacity: 0.55,
};

const accountSettingsLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '15px 0 3px',
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 600,
};