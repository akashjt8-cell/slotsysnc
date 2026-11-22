'use client';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Activity, ArrowDownRight, ArrowUpRight, CalendarDays, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, Download, MoreHorizontal, Plus, Search, Users, Wallet, X, Zap } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { bookings as sampleBookings, resources } from '@/lib/demo-data';

/* Bookable resources (same list and prices as the Bookings page) */
const bookableResources = [
  { name: 'Badminton Court 01', category: 'Sports', price: 300 },
  { name: 'Badminton Court 02', category: 'Sports', price: 300 },
  { name: 'Meeting Room A', category: 'Workspace', price: 0 },
  { name: 'Camera Kit 01', category: 'Equipment', price: 500 },
  { name: 'Study Room 03', category: 'Study space', price: 0 },
];

/* Reuse the avatar colour classes that already exist in the demo data */
const avatarPalette: string[] = Array.from(
  new Set(sampleBookings.map((b: any) => b.color).filter(Boolean))
) as string[];

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?'
  );
}

/* ---------- Overlap helpers ---------- */
function toMinutes(hours: number, minutes: number, meridiem?: string) {
  let h = hours;
  if (meridiem === 'AM') h = hours % 12;
  if (meridiem === 'PM') h = (hours % 12) + 12;
  return h * 60 + minutes;
}

/* Reads "10:00 – 11:00" (24h) and demo-data styles like "11:30 – 12:30 PM" */
function parseTimeRange(range: string): [number, number] | null {
  const parts = String(range).split(/\s*[–—-]\s*/);
  if (parts.length !== 2) return null;

  const pattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
  const a = parts[0].trim().match(pattern);
  const b = parts[1].trim().match(pattern);
  if (!a || !b) return null;

  const endMeridiem = b[3]?.toUpperCase();
  const startMeridiem = a[3]?.toUpperCase();
  const end = toMinutes(+b[1], +b[2], endMeridiem);

  let start: number;
  if (startMeridiem) {
    start = toMinutes(+a[1], +a[2], startMeridiem);
  } else if (endMeridiem) {
    // e.g. "11:30 – 12:30 PM" → start is 11:30 AM
    start = toMinutes(+a[1], +a[2], endMeridiem);
    if (start > end) {
      start = toMinutes(+a[1], +a[2], endMeridiem === 'PM' ? 'AM' : 'PM');
    }
  } else {
    start = toMinutes(+a[1], +a[2]);
  }

  return [start, end];
}

function formatBookingDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* Demo data uses "Today" / "Tomorrow"; turn those into real dates */
function resolveBookingDate(value: string) {
  const lower = String(value).trim().toLowerCase();
  if (lower === 'today') return formatBookingDate(new Date());
  if (lower === 'tomorrow') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatBookingDate(d);
  }
  return value;
}

function exportBookingsCsv(rows: any[]) {
  const header = ['Booking ID', 'Customer', 'Resource', 'Category', 'Date', 'Time', 'Amount', 'Status'];
  const esc = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const lines = [
    header.map(esc).join(','),
    ...rows.map(b =>
      [b.id, b.customer, b.resource, b.category, b.date, b.time, b.amount, b.status]
        .map(esc)
        .join(',')
    ),
  ];

  // BOM so Excel reads the ₹ symbol correctly
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `slotsync-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>(sampleBookings);
  const [ready, setReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  /* Load bookings saved from the Bookings page / this page */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('slotsync-bookings');
      if (saved) setBookings(JSON.parse(saved));
    } catch {
      setBookings(sampleBookings);
    }
    setReady(true);
  }, []);

  /* Keep localStorage in sync (only after the first load) */
  useEffect(() => {
    if (ready) {
      localStorage.setItem('slotsync-bookings', JSON.stringify(bookings));
    }
  }, [bookings, ready]);

  /* Auto-hide the confirmation toast */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleExport() {
    exportBookingsCsv(bookings);
    setToast(`Exported ${bookings.length} bookings to CSV`);
  }

  function handleCreate(newBooking: any) {
    setBookings(previous => [newBooking, ...previous]);
    setShowForm(false);
    setToast(`Booking ${newBooking.id} confirmed for ${newBooking.customer}`);
  }

  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">SUNDAY, 22 NOVEMBER 2026</div>
          <h1>Good afternoon, Akash <span>✳</span></h1>
          <p>Here's what's happening across your workspace today.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-secondary" onClick={handleExport}>
            <Download size={15} /> Export
          </button>
          <button className="button button-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New booking
          </button>
        </div>
      </div>

      <div className="demo-notice">
        <span className="demo-spark"><Zap size={14} /></span>
        <span><strong>You're exploring demo data.</strong> These sample bookings and metrics are illustrative and don't represent real customers or payments.</span>
        <button aria-label="Dismiss demo notice"><MoreHorizontal size={17} /></button>
      </div>

      <section className="metric-grid">
        <Metric label="Total bookings" value="248" change="12.8%" icon={<CalendarDays size={17} />} note="vs. previous month" />
        <Metric label="Resource utilisation" value="78.4%" change="8.2%" icon={<Activity size={17} />} note="vs. previous month" />
        <Metric label="Revenue this month" value="₹84,250" change="16.4%" icon={<Wallet size={17} />} note="vs. previous month" />
        <Metric label="Active customers" value="186" change="6.7%" icon={<Users size={17} />} note="vs. previous month" />
      </section>

      <div className="dashboard-columns">
        <section className="panel booking-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent bookings</h2>
              <p>A live look at reservations across your resources.</p>
            </div>
            <Link href="/dashboard/bookings" className="panel-link">View all <ArrowUpRight size={14} /></Link>
          </div>

          <div className="table-wrap">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>BOOKING</th>
                  <th>RESOURCE</th>
                  <th>DATE & TIME</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 4).map((booking, index) => {
                  const initials = booking.initials ?? getInitials(booking.customer);
                  const color =
                    booking.color ??
                    (avatarPalette.length ? avatarPalette[index % avatarPalette.length] : '');

                  return (
                    <tr key={booking.id}>
                      <td>
                        <div className="customer-cell">
                          <span className={`customer-avatar ${color}`}>{initials}</span>
                          <span>
                            <strong>{booking.customer}</strong>
                            <small>{booking.id}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong>{booking.resource}</strong>
                        <small className="cell-sub">{booking.category}</small>
                      </td>
                      <td>
                        <strong>{booking.date}</strong>
                        <small className="cell-sub">{booking.time}</small>
                      </td>
                      <td><strong>{booking.amount}</strong></td>
                      <td>
                        <span className={`status-pill ${booking.status === 'Confirmed' ? 'confirmed' : booking.status === 'Completed' ? 'completed' : 'pending'}`}>
                          <i />{booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="panel-footer">
            <span>Showing 4 of 248 sample bookings</span>
            <Link href="/dashboard/bookings">Browse bookings <ArrowUpRight size={13} /></Link>
          </div>
        </section>

        <section className="panel resource-panel">
          <div className="panel-heading">
            <div>
              <h2>Resource status</h2>
              <p>Availability across your workspace.</p>
            </div>
            <button className="icon-button subtle" aria-label="More resource options"><MoreHorizontal size={17} /></button>
          </div>

          <div className="resource-list">
            {resources.map((resource, i) => (
              <div className="resource-row" key={resource.name}>
                <div className={`resource-icon resource-${i}`}>
                  {i === 0 ? <Activity size={17} /> : i === 1 ? <Users size={17} /> : i === 2 ? <Command size={17} /> : <CircleHelp size={17} />}
                </div>
                <div className="resource-info">
                  <strong>{resource.name}</strong>
                  <small>{resource.type}</small>
                  <span className={`resource-state ${resource.state}`}><i />{resource.availability}</span>
                </div>
                <button className="icon-button tiny" aria-label={`More options for ${resource.name}`}><MoreHorizontal size={16} /></button>
              </div>
            ))}
          </div>

          <div className="panel-footer">
            <span>4 resources in this demo</span>
            <Link href="/dashboard/resources">Manage resources <ArrowUpRight size={13} /></Link>
          </div>
        </section>
      </div>

      <div className="bottom-insight-grid">
        <section className="panel insight-panel">
          <div className="panel-heading">
            <div>
              <h2>Booking activity</h2>
              <p>Reservation volume over the last 7 days.</p>
            </div>
            <button className="select-button">This week <ChevronDown size={14} /></button>
          </div>

          <div className="activity-chart">
            <div className="chart-y-labels"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
            <div className="activity-chart-main">
              <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
              <div className="activity-bars">
                {[{ d: 'MON', v: 44 }, { d: 'TUE', v: 66 }, { d: 'WED', v: 53 }, { d: 'THU', v: 82 }, { d: 'FRI', v: 71 }, { d: 'SAT', v: 95 }, { d: 'SUN', v: 62 }].map((item, i) => (
                  <div className="activity-bar-wrap" key={item.d}>
                    <div className="activity-bar" style={{ height: `${item.v}%` }} />
                    <span>{item.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick actions</h2>
              <p>Common workspace tasks.</p>
            </div>
          </div>
          <div className="quick-actions">
            <button><span><Plus size={16} /></span><strong>Add a resource</strong><ArrowUpRight size={14} /></button>
            <button><span><Users size={16} /></span><strong>Invite a team member</strong><ArrowUpRight size={14} /></button>
            <button><span><Clock3 size={16} /></span><strong>Set availability</strong><ArrowUpRight size={14} /></button>
          </div>
        </section>
      </div>

      <div className="dashboard-footnote">
        <span><span className="live-dot" /> Demo workspace</span>
        <span>Sample data · No real payments or notifications are sent</span>
      </div>

      {showForm && (
        <NewBookingModal
          existingBookings={bookings}
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}

      {toast && (
        <div style={toastStyle} role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </AppShell>
  );
}

function Metric({ label, value, change, icon, note }: { label: string; value: string; change: string; icon: React.ReactNode; note: string }) {
  return (
    <div className="metric-card">
      <div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div>
      <div className="metric-value">{value}</div>
      <div className="metric-change"><span><ArrowUpRight size={13} />{change}</span><small>{note}</small></div>
    </div>
  );
}

/* ---------- New booking modal ---------- */
function NewBookingModal({
  existingBookings,
  onClose,
  onCreate,
}: {
  existingBookings: any[];
  onClose: () => void;
  onCreate: (booking: any) => void;
}) {
  const [customer, setCustomer] = useState('');
  const [resource, setResource] = useState(bookableResources[0].name);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [message, setMessage] = useState('');

  const selectedResource = bookableResources.find(r => r.name === resource)!;
  const price = selectedResource.price;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!customer.trim() || !date || !startTime || !endTime) {
      setMessage('Please complete all fields.');
      return;
    }

    if (endTime <= startTime) {
      setMessage('End time must be after start time.');
      return;
    }

    if (date < new Date().toLocaleDateString('en-CA')) {
      setMessage('Please choose a future date.');
      return;
    }

    const formattedDate = formatBookingDate(new Date(date + 'T00:00:00'));

    const newStart = toMinutes(+startTime.slice(0, 2), +startTime.slice(3, 5));
    const newEnd = toMinutes(+endTime.slice(0, 2), +endTime.slice(3, 5));

    // Two bookings overlap when each one starts before the other ends.
    // Back-to-back bookings (11:00 end, 11:00 start) are allowed.
    const conflictingBooking = existingBookings.find(b => {
      if (b.resource !== resource) return false;
      if (['Cancelled', 'Completed'].includes(b.status)) return false;
      if (resolveBookingDate(b.date) !== formattedDate) return false;

      const range = parseTimeRange(b.time);
      if (!range) return b.time === `${startTime} – ${endTime}`;

      const [existingStart, existingEnd] = range;
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflictingBooking) {
      setMessage(
        `This resource is already booked ${conflictingBooking.time} on that date.`
      );
      return;
    }

    onCreate({
      id: `SS-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: customer.trim(),
      initials: getInitials(customer.trim()),
      resource,
      category: selectedResource.category,
      date: formattedDate,
      time: `${startTime} – ${endTime}`,
      amount: price === 0 ? 'Free' : `₹${price}`,
      status: 'Confirmed',
    });
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={e => e.stopPropagation()} style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <h2 style={{ fontSize: 22, margin: 0 }}>New booking</h2>
            <p style={{ opacity: 0.65, marginTop: 6, marginBottom: 0 }}>Create a demo reservation.</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Customer name</label>
            <input
              style={inputStyle}
              placeholder="Enter customer name"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Select resource</label>
            <select style={inputStyle} value={resource} onChange={e => setResource(e.target.value)}>
              {bookableResources.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}><CalendarDays size={14} /> Booking date</label>
            <input
              style={inputStyle}
              type="date"
              min={new Date().toLocaleDateString('en-CA')}
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...fieldStyle }}>
            <div>
              <label style={labelStyle}><Clock3 size={14} /> Start time</label>
              <input style={inputStyle} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}><Clock3 size={14} /> End time</label>
              <input style={inputStyle} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div
            style={{
              padding: 15,
              marginTop: 6,
              marginBottom: 18,
              borderRadius: 10,
              background: 'rgba(120,120,150,.12)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Booking amount</span>
            <strong>{price === 0 ? 'Free' : `₹${price}`}</strong>
          </div>

          {message && <p style={{ color: '#ef7777', fontSize: 13, marginTop: 0 }}>{message}</p>}

          <button type="submit" className="button button-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <CheckCircle2 size={16} />
            Confirm demo booking
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(0,0,0,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  backdropFilter: 'blur(5px)',
};

const modalStyle: CSSProperties = {
  background: 'var(--panel, #1e222b)',
  color: 'var(--text, #fff)',
  border: '1px solid var(--border, #343946)',
  borderRadius: 18,
  padding: 28,
  width: '100%',
  maxWidth: 480,
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 25px 80px rgba(0,0,0,.35)',
};

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 8,
  opacity: 0.85,
};

const inputStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 14px',
  borderRadius: 10,
  border: '1px solid var(--border, #343946)',
  background: 'rgba(120,120,150,.10)',
  color: 'inherit',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  colorScheme: 'dark',
};

const fieldStyle: CSSProperties = {
  marginBottom: 16,
};

const toastStyle: CSSProperties = {
  position: 'fixed',
  right: 24,
  bottom: 24,
  zIndex: 1100,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '13px 18px',
  borderRadius: 12,
  fontSize: 14,
  background: 'var(--panel, #242633)',
  color: 'var(--text, #fff)',
  border: '1px solid var(--border, rgba(150,150,170,0.25))',
  boxShadow: '0 18px 50px rgba(0,0,0,0.4)',
};