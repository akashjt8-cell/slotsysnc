
import { AppShell } from '@/components/app-shell';

const payments = [
  { id: 'PAY-2048', customer: 'Maya Sharma', resource: 'Badminton Court 01', amount: '₹300', status: 'Recorded' },
  { id: 'PAY-2046', customer: 'Ishita Nair', resource: 'Camera Kit 01', amount: '₹500', status: 'Deposit' },
  { id: 'PAY-2044', customer: 'Diya Kapoor', resource: 'Badminton Court 02', amount: '₹300', status: 'Recorded' },
];

export default function PaymentsPage() {
  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">WORKSPACE / PAYMENTS</div>
          <h1>Payments</h1>
          <p>View booking charges and payment records.</p>
        </div>
      </div>

      <div className="demo-notice">
        <strong>Demo mode</strong>
        <span>Illustrative payment records only. Online payment integration will be added later.</span>
      </div>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <h2>Payment records</h2>
            <p>{payments.length} sample records</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>PAYMENT ID</th>
                <th>CUSTOMER</th>
                <th>RESOURCE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td><strong>{payment.id}</strong></td>
                  <td>{payment.customer}</td>
                  <td>{payment.resource}</td>
                  <td><strong>{payment.amount}</strong></td>
                  <td>
                    <span className="status-pill confirmed">
                      <i />{payment.status}
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
