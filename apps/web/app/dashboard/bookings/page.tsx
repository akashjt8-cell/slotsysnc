'use client';

import { AppShell } from '@/components/app-shell';
import { bookings as sampleBookings } from '@/lib/demo-data';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Plus, Search, X,
  CalendarDays, Clock, CheckCircle2
} from 'lucide-react';

const resources = [
  { name: 'Badminton Court 01', category: 'Sports', price: 300 },
  { name: 'Badminton Court 02', category: 'Sports', price: 300 },
  { name: 'Meeting Room A', category: 'Workspace', price: 0 },
  { name: 'Camera Kit 01', category: 'Equipment', price: 500 },
  { name: 'Study Room 03', category: 'Study space', price: 0 },
];

/* Shared form styles to fix alignment */
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>(sampleBookings);
  const [ready, setReady] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [customer, setCustomer] = useState('');
  const [resource, setResource] = useState(resources[0].name);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');

  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('slotsync-bookings');

    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch {
        setBookings(sampleBookings);
      }
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem('slotsync-bookings', JSON.stringify(bookings));
    }
  }, [bookings, ready]);

  const selectedResource = resources.find(r => r.name === resource)!;
  const price = selectedResource.price;

  function createBooking(e: React.FormEvent) {
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

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(
      'en-US',
      { month: 'short', day: 'numeric', year: 'numeric' }
    );

    const conflict = bookings.some(b =>
      b.resource === resource &&
      b.date === formattedDate &&
      b.time === `${startTime} – ${endTime}` &&
      !['Cancelled', 'Completed'].includes(b.status)
    );

    if (conflict) {
      setMessage('This resource already has a booking at that time.');
      return;
    }

    const newBooking = {
      id: `SS-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: customer.trim(),
      resource,
      category: selectedResource.category,
      date: formattedDate,
      time: `${startTime} – ${endTime}`,
      amount: price === 0 ? 'Free' : `₹${price}`,
      status: 'Confirmed',
    };

    setBookings(previous => [newBooking, ...previous]);

    setCustomer('');
    setDate('');
    setStartTime('10:00');
    setEndTime('11:00');
    setMessage('');
    setShowForm(false);
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = `${b.customer} ${b.resource} ${b.id}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === 'All' || b.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">WORKSPACE / BOOKINGS</div>
          <h1>Bookings</h1>
          <p>Manage reservations across all your resources.</p>
        </div>

        <button
          className="button button-primary"
          onClick={() => {
            setMessage('');
            setShowForm(true);
          }}
        >
          <Plus size={16} /> New booking
        </button>
      </div>

      <div className="demo-notice">
        <strong>Demo data</strong>
        <span>Sample reservations for exploring the SlotSync experience.</span>
      </div>

      <section className="panel booking-panel full-panel">
        <div className="panel-heading">
          <div>
            <h2>All reservations</h2>
            <p>{filteredBookings.length} reservations in this preview.</p>
          </div>

          <div className="table-tools">
            <label className="search-trigger">
              <Search size={14} />
              <input
                placeholder="Search bookings"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'inherit',
                  width: '125px'
                }}
              />
            </label>

            <select
              className="button button-secondary"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Awaiting approval">Awaiting approval</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>BOOKING</th>
                <th>RESOURCE</th>
                <th>DATE &amp; TIME</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.customer}</strong>
                    <small className="cell-sub">{b.id}</small>
                  </td>

                  <td>
                    <strong>{b.resource}</strong>
                    <small className="cell-sub">{b.category}</small>
                  </td>

                  <td>
                    <strong>{b.date}</strong>
                    <small className="cell-sub">{b.time}</small>
                  </td>

                  <td><strong>{b.amount}</strong></td>

                  <td>
                    <span
                      className={`status-pill ${
                        b.status === 'Confirmed'
                          ? 'confirmed'
                          : b.status === 'Completed'
                          ? 'completed'
                          : 'pending'
                      }`}
                    >
                      <i /> {b.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 35 }}>
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backdropFilter: 'blur(5px)'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--card, #1e222b)',
              color: 'var(--text, #fff)',
              border: '1px solid var(--border, #343946)',
              borderRadius: 18,
              padding: 28,
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(0,0,0,.35)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 22
              }}
            >
              <div>
                <h2 style={{ fontSize: 22, margin: 0 }}>New booking</h2>
                <p style={{ opacity: 0.65, marginTop: 6, marginBottom: 0 }}>
                  Create a demo reservation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex'
                }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={createBooking}>
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
                <select
                  style={inputStyle}
                  value={resource}
                  onChange={e => setResource(e.target.value)}
                >
                  {resources.map(r => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  <CalendarDays size={14} /> Booking date
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  ...fieldStyle
                }}
              >
                <div>
                  <label style={labelStyle}>
                    <Clock size={14} /> Start time
                  </label>
                  <input
                    style={inputStyle}
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Clock size={14} /> End time
                  </label>
                  <input
                    style={inputStyle}
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                  />
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
                  justifyContent: 'space-between'
                }}
              >
                <span>Booking amount</span>
                <strong>{price === 0 ? 'Free' : `₹${price}`}</strong>
              </div>

              {message && (
                <p style={{ color: '#ef7777', fontSize: 13, marginTop: 0 }}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="button button-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <CheckCircle2 size={16} />
                Confirm demo booking
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
