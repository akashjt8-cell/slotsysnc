
'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';

const initialMembers = [
  { id: 1, name: 'Akash JT', email: 'admin@slotsync.demo', role: 'Owner', status: 'Active' },
  { id: 2, name: 'Maya Sharma', email: 'maya@example.com', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Arjun Rao', email: 'arjun@example.com', role: 'Staff', status: 'Active' },
  { id: 4, name: 'Ishita Nair', email: 'ishita@example.com', role: 'Staff', status: 'Invited' },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [message, setMessage] = useState('');

  function addMember() {
    if (!name.trim() || !email.trim()) {
      setMessage('Please enter both a name and email.');
      return;
    }

    if (members.some((member) => member.email.toLowerCase() === email.trim().toLowerCase())) {
      setMessage('A team member with this email already exists.');
      return;
    }

    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role,
        status: 'Invited',
      },
    ]);

    setName('');
    setEmail('');
    setRole('Staff');
    setMessage('Demo invitation added successfully.');
    setShowForm(false);
  }

  function updateRole(id: number, newRole: string) {
    setMembers((current) =>
      current.map((member) =>
        member.id === id && member.role !== 'Owner'
          ? { ...member, role: newRole }
          : member
      )
    );
  }

  function removeMember(id: number) {
    setMembers((current) =>
      current.filter((member) => member.id !== id || member.role === 'Owner')
    );
  }

  const cardStyle = {
    padding: '18px',
    border: '1px solid rgba(150,150,170,0.2)',
    borderRadius: '12px',
    background: 'rgba(130,130,150,0.06)',
  } as const;

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    borderRadius: '9px',
    border: '1px solid rgba(150,150,170,0.3)',
    background: 'rgba(130,130,150,0.08)',
    color: 'inherit',
  } as const;

  return (
    <AppShell>
      <div className="dashboard-heading">
        <div>
          <div className="eyebrow">WORKSPACE / TEAM & PERMISSIONS</div>
          <h1>Team & Permissions</h1>
          <p>Manage your team members and their workspace roles.</p>
        </div>
      </div>

      <div className="demo-notice">
        <strong>Demo mode</strong>
        <span>Team members and invitations are simulated in this browser. No real emails or invitations are sent.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div className="stat-card">
          <span>Total members</span>
          <h2>{members.length}</h2>
          <p>Including owner</p>
        </div>
        <div className="stat-card">
          <span>Active members</span>
          <h2>{members.filter((member) => member.status === 'Active').length}</h2>
          <p>Currently active in demo</p>
        </div>
        <div className="stat-card">
          <span>Pending invitations</span>
          <h2>{members.filter((member) => member.status === 'Invited').length}</h2>
          <p>Simulated invitations</p>
        </div>
      </div>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <h2>Team members</h2>
            <p>Manage access and responsibilities</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setMessage('');
            }}
            style={{ padding: '10px 16px', border: 'none', borderRadius: '9px', background: '#7867ed', color: 'white', cursor: 'pointer', fontWeight: 600 }}
          >
            {showForm ? 'Close' : '+ Add member'}
          </button>
        </div>

        {showForm && (
          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>Add team member</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <label>
                <strong>Name</strong>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" />
              </label>
              <label>
                <strong>Email</strong>
                <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
              </label>
              <label>
                <strong>Role</strong>
                <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </label>
            </div>
            {message && <p style={{ color: '#a69aff', fontSize: '13px' }}>{message}</p>}
            <button onClick={addMember} style={{ marginTop: '16px', padding: '11px 18px', border: 'none', borderRadius: '9px', background: '#7867ed', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
              Add demo member
            </button>
          </div>
        )}

        {message && !showForm && <p style={{ color: '#36bd91', fontSize: '13px' }}>{message}</p>}

        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>TEAM MEMBER</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.email}</td>
                  <td>
                    {member.role === 'Owner' ? (
                      <strong>Owner</strong>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value)}
                        style={{ padding: '7px', borderRadius: '7px', background: 'rgba(130,130,150,0.12)', color: 'inherit', border: '1px solid rgba(150,150,170,0.25)' }}
                      >
                        <option>Manager</option>
                        <option>Staff</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <span className="status-pill confirmed">
                      <i />{member.status}
                    </span>
                  </td>
                  <td>
                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => removeMember(member.id)}
                        style={{ padding: '7px 10px', borderRadius: '7px', border: '1px solid rgba(230,100,100,0.35)', background: 'transparent', color: '#e58b8b', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel full-panel" style={{ marginTop: '20px' }}>
        <div className="panel-heading">
          <div>
            <h2>Role permissions</h2>
            <p>Overview of demo access levels</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={cardStyle}>
            <h3>Owner</h3>
            <p>Full workspace access, team management and settings.</p>
          </div>
          <div style={cardStyle}>
            <h3>Manager</h3>
            <p>Manage bookings, resources and customer records.</p>
          </div>
          <div style={cardStyle}>
            <h3>Staff</h3>
            <p>View assigned resources and assist with bookings.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
