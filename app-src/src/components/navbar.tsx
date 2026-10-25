'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { LOCALE_LIST } from '@/lib/i18n';
import { LanguageModal } from './language-modal';

export function Navbar() {
  const { locale, dict } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);

  const currentLang = LOCALE_LIST.find(l => l.code === locale);

  return (
    <>
      <nav className="navbar" id="main-nav">
        <div className="container-wn navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo" id="nav-logo">
            <span className="logo-icon">💚</span>
            <span className="logo-text">{dict.siteName}</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            <Link href="/" className="nav-link" id="nav-home">{dict.navHome}</Link>
            <Link href="/register" className="nav-link" id="nav-register">{dict.navRegister}</Link>
            <Link href="/schemes" className="nav-link" id="nav-schemes">{dict.navSchemes}</Link>
            <Link href="/about" className="nav-link" id="nav-about">{dict.navAbout}</Link>
          </div>

          {/* Right side */}
          <div className="navbar-actions">
            <button
              className="lang-toggle"
              onClick={() => setLangModalOpen(true)}
              id="nav-lang-toggle"
              aria-label="Change language"
            >
              🌐 {currentLang?.name || 'Language'}
            </button>
            <Link href="/register" className="btn-primary navbar-cta" id="nav-cta">
              {dict.btnGetStarted}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              id="nav-mobile-toggle"
            >
              <span className={`hamburger ${mobileOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu animate-fade-in" id="mobile-menu">
            <Link href="/" className="mobile-link" onClick={() => setMobileOpen(false)}>{dict.navHome}</Link>
            <Link href="/register" className="mobile-link" onClick={() => setMobileOpen(false)}>{dict.navRegister}</Link>
            <Link href="/schemes" className="mobile-link" onClick={() => setMobileOpen(false)}>{dict.navSchemes}</Link>
            <Link href="/about" className="mobile-link" onClick={() => setMobileOpen(false)}>{dict.navAbout}</Link>
            <button className="mobile-link lang-mobile" onClick={() => { setLangModalOpen(true); setMobileOpen(false); }}>
              🌐 {dict.navLanguage}
            </button>
          </div>
        )}
      </nav>

      <LanguageModal open={langModalOpen} onClose={() => setLangModalOpen(false)} />

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--color-primary);
        }
        .logo-icon {
          font-size: 1.5rem;
        }
        .logo-text {
          letter-spacing: -0.02em;
        }
        .navbar-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: color var(--transition-fast);
          position: relative;
        }
        .nav-link:hover {
          color: var(--color-primary);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .lang-toggle {
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--color-border);
          background: transparent;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--color-text);
        }
        .lang-toggle:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }
        .navbar-cta {
          padding: 0.5rem 1.25rem;
          font-size: 0.875rem;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 20px;
        }
        .hamburger span {
          display: block;
          height: 2px;
          background: var(--color-text);
          border-radius: 1px;
          transition: all var(--transition-fast);
        }
        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 1rem;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface);
        }
        .mobile-link {
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          width: 100%;
        }
        .mobile-link:hover {
          background: var(--color-primary-light);
        }

        @media (max-width: 768px) {
          .navbar-links,
          .navbar-cta,
          .lang-toggle {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-menu {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
