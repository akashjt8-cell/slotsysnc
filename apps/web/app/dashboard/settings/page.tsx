
'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';

export default function SettingsPage() {
  const [workspace, setWorkspace] = useState('SlotSync Sports Hub');
  const [email, setEmail] = useState('admin@slotsync.demo');
  const [theme, setTheme] = useState('Dark');
  const [notifications, setNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('slotsync-settings');
    if (stored) {
      const settings = JSON.parse(stored);
      setWorkspace(settings.workspace ?? 'SlotSync Sports Hub');
      setEmail(settings.email ?? 'admin@slotsync.demo');
      setTheme(settings.theme ?? 'Dark');
      setNotifications(settings.notifications ?? true);
      setBookingAlerts(settings.bookingAlerts ?? true);
      setReminders(settings.reminders ?? false);
    }
  }, []);

  function saveSettings() {
    localStorage.setItem('slotsync-settings', JSON.stringify({
      workspace,
      email,
      theme,
      notifications,
      bookingAlerts,
      reminders,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    borderRadius: '9px',
    border: '1px solid rgba(150,150,170,0.3)',
    background: 'rgba(130,130,150,0.08)',
    color: 'inherit',
    outline: 'none',
  } as const;

  const settingRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 0',
    borderBottom: '1px solid rgba(150,150,170,0.15)',
  } as const;

  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">WORKSPACE / SETTINGS</div>
          <h1>Settings</h1>
          <p>Manage your workspace preferences.</p>
        </div>
      </div>

      <div className="demo-notice">
        <strong>Demo settings</strong>
        <span>Preferences are saved locally in this browser. Account and workspace changes are not connected to a live backend.</span>
      </div>

      <section className="panel full-panel" style={{ marginBottom: '20px' }}>
        <div className="panel-heading">
          <div>
            <h2>Workspace profile</h2>
            <p>Basic information about your organisation</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', padding: '12px 0' }}>
          <label>
            <strong>Workspace name</strong>
            <input style={inputStyle} value={workspace} onChange={(e) => setWorkspace(e.target.value)} />
          </label>
          <label>
            <strong>Admin email</strong>
            <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="panel full-panel" style={{ marginBottom: '20px' }}>
        <div className="panel-heading">
          <div>
            <h2>Appearance</h2>
            <p>Choose your preferred dashboard appearance</p>
          </div>
        </div>

        <div style={{ padding: '12px 0' }}>
          <label>
            <strong>Dashboard theme</strong>
            <select style={inputStyle} value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
              <option value="System">System default</option>
            </select>
          </label>
          <p style={{ fontSize: '12px', opacity: 0.65, marginTop: '10px' }}>
            Theme preference is saved for the demo. Global theme switching will be connected later.
          </p>
        </div>
      </section>

      <section className="panel full-panel" style={{ marginBottom: '20px' }}>
        <div className="panel-heading">
          <div>
            <h2>Notifications</h2>
            <p>Control your demo notification preferences</p>
          </div>
        </div>

        <div style={settingRow}>
          <div>
            <strong>Enable notifications</strong>
            <p style={{ fontSize: '13px', opacity: 0.65 }}>Master notification preference</p>
          </div>
          <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
        </div>

        <div style={settingRow}>
          <div>
            <strong>Booking alerts</strong>
            <p style={{ fontSize: '13px', opacity: 0.65 }}>Get notified about new bookings</p>
          </div>
          <input type="checkbox" checked={bookingAlerts} onChange={(e) => setBookingAlerts(e.target.checked)} disabled={!notifications} />
        </div>

        <div style={settingRow}>
          <div>
            <strong>Booking reminders</strong>
            <p style={{ fontSize: '13px', opacity: 0.65 }}>Enable upcoming booking reminders</p>
          </div>
          <input type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} disabled={!notifications} />
        </div>
      </section>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={saveSettings}
          style={{ padding: '12px 24px', borderRadius: '9px', border: 'none', background: '#7867ed', color: 'white', fontWeight: 600, cursor: 'pointer' }}
        >
          Save changes
        </button>
        {saved && <span style={{ color: '#36bd91', fontWeight: 600 }}>✓ Settings saved successfully</span>}
      </div>
    </AppShell>
  );
}
