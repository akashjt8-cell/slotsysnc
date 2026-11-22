
import { AppShell } from '@/components/app-shell';

const customers = [
  { name: 'Maya Sharma', email: 'maya@example.com', bookings: 8, status: 'Active' },
  { name: 'Arjun Rao', email: 'arjun@example.com', bookings: 5, status: 'Active' },
  { name: 'Ishita Nair', email: 'ishita@example.com', bookings: 3, status: 'Active' },
  { name: 'Rohan Mehta', email: 'rohan@example.com', bookings: 6, status: 'Active' },
  { name: 'Diya Kapoor', email: 'diya@example.com', bookings: 2, status: 'Active' },
];

export default function CustomersPage() {
  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">WORKSPACE / CUSTOMERS</div>
          <h1>Customers</h1>
          <p>Manage your workspace customers.</p>
        </div>
      </div>

      <div className="demo-notice">
        <strong>Demo data</strong>
        <span>Sample customer records for exploring SlotSync.</span>
      </div>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <h2>All customers</h2>
            <p>{customers.length} sample customers</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>EMAIL</th>
                <th>TOTAL BOOKINGS</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.email}</td>
                  <td>{customer.bookings}</td>
                  <td>
                    <span className="status-pill confirmed">
                      <i />{customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
