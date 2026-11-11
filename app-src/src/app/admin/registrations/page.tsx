'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface RegistrationItem {
  id: string;
  referenceNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  state: string;
  lga?: string;
  workerType: string;
  status: string;
  coveragePreference: string;
  createdAt: string;
  followUps?: Array<{
    outcome: string;
    notes: string;
    createdAt: string;
  }>;
}

export default function RegistrationsListPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [total, setTotal] = useState(0);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.set('status', statusFilter);
      if (stateFilter) query.set('state', stateFilter);
      if (search) query.set('search', search);
      query.set('limit', '50');

      const res = await fetch(`/api/registrations?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, stateFilter, search]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      NEW: { label: 'New / Pending', bg: '#fef3c7', color: '#b45309' },
      CONTACTED: { label: 'Contacted', bg: '#e0f2fe', color: '#0369a1' },
      IN_PROGRESS: { label: 'In Progress', bg: '#f3e8ff', color: '#7e22ce' },
      DOCUMENTS_READY: { label: 'Docs Ready', bg: '#fef9c3', color: '#854d0e' },
      ENROLLMENT_SCHEDULED: { label: 'Scheduled', bg: '#dcfce7', color: '#15803d' },
      ENROLLED: { label: 'Enrolled 🎉', bg: '#bbf7d0', color: '#166534' },
      DROPPED: { label: 'Dropped', bg: '#fee2e2', color: '#b91c1c' },
    };
    const s = map[status] || { label: status, bg: '#f1f5f9', color: '#475569' };
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'inline-block',
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div className="list-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Registrations Pipeline</h1>
          <p className="page-subtitle">
            Showing {total} informal worker participant records in system.
          </p>
        </div>
        <Link href="/register" target="_blank" className="btn-add">
          + New Registration Form
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="filters-card">
        <div className="filter-group search-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name, phone (080...), or ref number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New (Requires Contact)</option>
            <option value="CONTACTED">Contacted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DOCUMENTS_READY">Documents Ready</option>
            <option value="ENROLLMENT_SCHEDULED">Enrollment Scheduled</option>
            <option value="ENROLLED">Enrolled</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>

        <div className="filter-group">
          <label>State</label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All States</option>
            <option value="Kwara">Kwara (Pilot Base)</option>
            <option value="Lagos">Lagos</option>
            <option value="Oyo">Oyo</option>
            <option value="FCT">FCT Abuja</option>
            <option value="Kano">Kano</option>
          </select>
        </div>

        <button onClick={fetchRegistrations} className="btn-filter">
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Participant</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Worker Category</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Loading registrations...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No participant records matching your current filter.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const cleanPhone = reg.phone.replace(/\D/g, '');
                  const intlPhone = cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : cleanPhone;
                  const waText = encodeURIComponent(
                    `Hello ${reg.fullName}, this is WeNaijaHealth regarding your health insurance registration (${reg.referenceNumber}). How can we assist with your KwaraCare/NHIA enrollment today?`
                  );

                  return (
                    <tr key={reg.id}>
                      <td>
                        <code className="ref-code">{reg.referenceNumber}</code>
                      </td>
                      <td>
                        <strong className="name-cell">{reg.fullName}</strong>
                      </td>
                      <td>
                        <a href={`tel:${reg.phone}`} className="phone-cell">
                          {reg.phone}
                        </a>
                      </td>
                      <td>
                        {reg.state}
                        {reg.lga ? ` • ${reg.lga}` : ''}
                      </td>
                      <td>{reg.workerType.replace('_', ' ')}</td>
                      <td>
                        <span className="cov-pill">
                          {reg.coveragePreference === 'FAMILY' ? 'Family' : 'Self'}
                        </span>
                      </td>
                      <td>{getStatusBadge(reg.status)}</td>
                      <td className="date-cell">
                        {new Date(reg.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td>
                        <div className="action-button-group">
                          <a
                            href={`https://wa.me/${intlPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-wa"
                            title="Open WhatsApp chat with prefilled greeting"
                          >
                            💬 WA
                          </a>
                          <Link href={`/admin/registrations/${reg.id}`} className="btn-open">
                            Manage →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .list-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0.25rem 0 0;
        }

        .btn-add {
          background: #008751;
          color: white;
          padding: 0.55rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }

        .filters-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .search-group {
          flex: 1;
          min-width: 260px;
        }

        .filter-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .input-field {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
          outline: none;
        }

        .input-field:focus {
          border-color: #008751;
        }

        .btn-filter {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-filter:hover {
          background: #e2e8f0;
        }

        .table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .data-table th {
          background: #f8fafc;
          padding: 0.75rem 1rem;
          color: #475569;
          font-weight: 700;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .ref-code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 700;
          color: #008751;
        }

        .name-cell {
          color: #0f172a;
        }

        .phone-cell {
          color: #0284c7;
          text-decoration: none;
          font-weight: 600;
        }

        .cov-pill {
          background: #f1f5f9;
          color: #475569;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .date-cell {
          color: #64748b;
          font-size: 0.78rem;
        }

        .action-button-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-wa {
          background: #25d366;
          color: white;
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .btn-open {
          background: #f1f5f9;
          color: #0f172a;
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .btn-open:hover {
          background: #008751;
          color: white;
        }
      `}</style>
    </div>
  );
}

