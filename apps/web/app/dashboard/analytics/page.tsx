
import { AppShell } from '@/components/app-shell';

const weeklyBookings = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 58 },
  { day: 'Wed', value: 46 },
  { day: 'Thu', value: 76 },
  { day: 'Fri', value: 64 },
  { day: 'Sat', value: 92 },
  { day: 'Sun', value: 71 },
];

const resources = [
  { name: 'Badminton Court 01', bookings: 86, percent: 86 },
  { name: 'Meeting Room A', bookings: 72, percent: 72 },
  { name: 'Camera Kit 01', bookings: 64, percent: 64 },
  { name: 'Badminton Court 02', bookings: 53, percent: 53 },
];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">WORKSPACE / ANALYTICS</div>
          <h1>Analytics</h1>
          <p>Understand your workspace performance.</p>
        </div>
      </div>

      <div className="demo-notice">
        <strong>Demo analytics</strong>
        <span>Illustrative sample metrics. Live analytics will be connected to booking data later.</span>
      </div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '20px' }}>        <section className="stat-card">
          <span>Total bookings</span>
          <h2>248</h2>
          <p>Across all resources</p>
        </section>
        <section className="stat-card">
          <span>Revenue</span>
          <h2>₹48,650</h2>
          <p>Illustrative demo value</p>
        </section>
        <section className="stat-card">
          <span>Utilisation</span>
          <h2>78.4%</h2>
          <p>Average resource usage</p>
        </section>
        <section className="stat-card">
          <span>Customers</span>
          <h2>126</h2>
          <p>Sample customer count</p>
        </section>
      </div>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <h2>Weekly booking activity</h2>
            <p>Bookings throughout the week</p>
          </div>
          <span className="status-pill confirmed">This week</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '16px', alignItems: 'end', height: '230px', padding: '20px 8px 0' }}>
          {weeklyBookings.map((item) => (
            <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '10px' }}>
              <strong style={{ fontSize: '12px' }}>{item.value}</strong>
              <div style={{ width: '100%', maxWidth: '52px', height: `${item.value * 1.5}px`, minHeight: '12px', borderRadius: '8px 8px 3px 3px', background: 'linear-gradient(180deg, #9b8cff, #6653d9)' }} />
              <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel full-panel" style={{ marginTop: '20px' }}>
        <div className="panel-heading">
          <div>
            <h2>Resource performance</h2>
            <p>Booking activity by resource</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '22px', padding: '12px 0' }}>
          {resources.map((resource) => (
            <div key={resource.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '9px' }}>
                <strong>{resource.name}</strong>
                <span>{resource.bookings} bookings</span>
              </div>
              <div style={{ height: '9px', background: 'rgba(140,140,160,0.18)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ width: `${resource.percent}%`, height: '100%', background: 'linear-gradient(90deg, #7665ec, #a69aff)', borderRadius: '20px' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
