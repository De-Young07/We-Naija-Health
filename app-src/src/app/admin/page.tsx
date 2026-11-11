'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalRegistrations: number;
  newCount: number;
  contactedCount: number;
  enrolledCount: number;
  droppedCount: number;
  todayCount: number;
  weekCount: number;
  conversionRate: string;
}

interface RecentRegistration {
  id: string;
  referenceNumber: string;
  fullName: string;
  phone: string;
  state: string;
  lga?: string;
  workerType: string;
  status: string;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, listRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/registrations?limit=8'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (listRes.ok) {
          const listData = await listRes.json();
          setRecent(listData.registrations || []);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
    <div className="overview-container">
      {/* Top Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Command Center</h1>
          <p className="page-subtitle">
            Pilot participant triage, 24h contact tracking, and official scheme handoff.
          </p>
        </div>
        <div className="header-actions">
          <Link href="/admin/registrations" className="btn-solid">
            View All Registrations →
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <span className="kpi-label">🚨 Action Required (New)</span>
          <div className="kpi-value">{loading ? '...' : stats?.newCount ?? 0}</div>
          <span className="kpi-sub">Awaiting initial call within 24h</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Total Registered</span>
          <div className="kpi-value">{loading ? '...' : stats?.totalRegistrations ?? 0}</div>
          <span className="kpi-sub">
            {stats?.todayCount ?? 0} registered today • {stats?.weekCount ?? 0} this week
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">In Contact Pipeline</span>
          <div className="kpi-value">{loading ? '...' : stats?.contactedCount ?? 0}</div>
          <span className="kpi-sub">Engaged via call or WhatsApp</span>
        </div>

        <div className="kpi-card success">
          <span className="kpi-label">Verified Enrolled</span>
          <div className="kpi-value">{loading ? '...' : stats?.enrolledCount ?? 0}</div>
          <span className="kpi-sub">
            {stats?.conversionRate ?? '0.0'}% end-to-end conversion
          </span>
        </div>
      </div>

      {/* Team Fast Actions Bar */}
      <div className="quick-guide-card">
        <div className="guide-icon">💡</div>
        <div className="guide-content">
          <strong>Daily Triage Protocol:</strong> Click on any record in the table below to trigger a pre-filled WhatsApp greeting or log voice call results into the audit trail.
        </div>
        <Link href="/register" target="_blank" className="guide-link">
          + Enter In-Person Paper Form
        </Link>
      </div>

      {/* Recent Registrations Table */}
      <div className="table-card">
        <div className="table-header">
          <h2 className="table-title">Recent Registrations</h2>
          <Link href="/admin/registrations" className="table-view-all">
            See all ({stats?.totalRegistrations ?? 0})
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Participant</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Work Category</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Loading participant database...
                  </td>
                </tr>
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No registrations in database yet. Submit the registration form to see live entries!
                  </td>
                </tr>
              ) : (
                recent.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <code className="ref-code">{reg.referenceNumber}</code>
                    </td>
                    <td>
                      <strong className="participant-name">{reg.fullName}</strong>
                    </td>
                    <td>
                      <a href={`tel:${reg.phone}`} className="phone-link">
                        {reg.phone}
                      </a>
                    </td>
                    <td>
                      {reg.state}
                      {reg.lga ? ` (${reg.lga})` : ''}
                    </td>
                    <td>{reg.workerType.replace('_', ' ')}</td>
                    <td>{getStatusBadge(reg.status)}</td>
                    <td className="time-col">
                      {new Date(reg.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <Link href={`/admin/registrations/${reg.id}`} className="row-action-btn">
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .overview-container {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
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

        .btn-solid {
          background: #008751;
          color: white;
          padding: 0.6rem 1.1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s;
        }

        .btn-solid:hover {
          background: #007043;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .kpi-card.highlight {
          border-left: 4px solid #f59e0b;
          background: #fffdfa;
        }

        .kpi-card.success {
          border-left: 4px solid #10b981;
          background: #fbfdfc;
        }

        .kpi-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          display: block;
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0.4rem 0 0.2rem;
        }

        .kpi-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          display: block;
        }

        .quick-guide-card {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.85rem;
        }

        .guide-icon {
          font-size: 1.4rem;
        }

        .guide-content {
          flex: 1;
          color: #166534;
        }

        .guide-link {
          color: #008751;
          font-weight: 700;
          text-decoration: underline;
          white-space: nowrap;
        }

        .table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .table-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
          color: #0f172a;
        }

        .table-view-all {
          font-size: 0.85rem;
          color: #008751;
          font-weight: 600;
          text-decoration: none;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .data-table th {
          background: #f8fafc;
          padding: 0.75rem 1rem;
          font-weight: 700;
          color: #475569;
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

        .participant-name {
          color: #0f172a;
        }

        .phone-link {
          color: #0284c7;
          text-decoration: none;
          font-weight: 600;
        }

        .time-col {
          color: #64748b;
          font-size: 0.75rem;
        }

        .row-action-btn {
          display: inline-block;
          background: #f1f5f9;
          color: #0f172a;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.75rem;
          transition: background 0.15s;
        }

        .row-action-btn:hover {
          background: #008751;
          color: white;
        }

        @media (max-width: 1024px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

