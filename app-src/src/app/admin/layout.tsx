'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: '📊 Overview' },
    { href: '/admin/registrations', label: '👥 Registrations' },
    { href: '/schemes', label: '🏥 Schemes Directory', external: true },
    { href: '/', label: '🌐 Public Site', external: true },
  ];

  return (
    <div className="admin-shell">
      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <Link href="/admin" className="admin-logo-link">
              <span className="logo-badge">HSC</span>
              <div>
                <strong className="brand-title">HealthSure Connect</strong>
                <span className="brand-subtitle">Operations & Triage Desk</span>
              </div>
            </Link>
          </div>

          <div className="admin-header-actions">
            <span className="pulse-indicator">
              <span className="pulse-dot" />
              Pilot Live
            </span>
            <div className="user-profile">
              <span className="user-avatar">👤</span>
              <span className="user-email">team.accesscare@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="admin-body">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <div className="nav-group-title">TRIAGE & WORKFLOW</div>
            {navLinks.map((link) => {
              const isActive = !link.external && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  target={link.external ? '_blank' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-support">
            <p className="support-title">24h Follow-up SLA</p>
            <p className="support-desc">
              Every newly registered participant must be reached within 24 hours to guide their enrollment.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-main">{children}</main>
      </div>

      <style jsx>{`
        .admin-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-header {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .admin-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-logo-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }

        .logo-badge {
          background: #008751;
          color: white;
          font-weight: 800;
          font-size: 0.85rem;
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
        }

        .brand-title {
          font-size: 1.1rem;
          font-weight: 800;
          display: block;
          color: #0f172a;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          display: block;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .pulse-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #008751;
          background: #ecfdf5;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid #a7f3d0;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #475569;
        }

        .user-avatar {
          font-size: 1.1rem;
        }

        .admin-body {
          display: flex;
          flex: 1;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .admin-sidebar {
          width: 240px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .nav-group-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
          padding: 0 0.75rem 0.5rem;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .admin-nav-item {
          display: block;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .admin-nav-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .admin-nav-item.active {
          background: #008751;
          color: #ffffff;
        }

        .sidebar-support {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.85rem;
        }

        .support-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #008751;
          margin: 0 0 0.25rem;
        }

        .support-desc {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        .admin-main {
          flex: 1;
          padding: 2rem 2.5rem;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .admin-body {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }
          .admin-main {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

