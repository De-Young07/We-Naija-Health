'use client';

import Image from 'next/image';
import { useLocale } from '@/lib/locale-context';

export function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="footer" id="main-footer">
      <div className="container-wn">
        {/* Disclaimer Banner */}
        <div className="footer-disclaimer">
          <p>{dict.footerDisclaimer}</p>
        </div>

        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Image
              src="/wenaijahealth-logo.jpeg"
              alt={dict.siteName}
              width={300}
              height={94}
              className="footer-logo"
            />
            <p className="footer-tagline">{dict.tagline}</p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="/register">{dict.navRegister}</a>
            <a href="/schemes">{dict.navSchemes}</a>
            <a href="/about">{dict.navAbout}</a>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <a href="/about#faq">{dict.sectionFAQ}</a>
            <a href="/about#contact">{dict.sectionContact}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 {dict.siteName}. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/privacy">{dict.footerPrivacy}</a>
            <a href="/terms">{dict.footerTerms}</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--wn-green-900);
          color: rgba(255, 255, 255, 0.85);
          padding-top: 0;
          margin-top: auto;
        }
        .footer-disclaimer {
          background: #063d2d;
          padding: 1rem 1.5rem;
          margin: 0 calc(-1 * var(--space-lg));
          margin-bottom: 2rem;
          font-size: 0.8rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-disclaimer p {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          padding: 0.75rem 0 2.5rem;
        }
        .footer-logo {
          display: block;
          width: min(15rem, 100%);
          height: auto;
          margin-bottom: 0.75rem;
          border-radius: var(--radius-sm);
        }
        .footer-tagline {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 300px;
        }
        .footer-col h4 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1rem;
        }
        .footer-col a {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 0.3rem 0;
          transition: color var(--transition-fast);
        }
        .footer-col a:hover {
          color: var(--wn-green-300);
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .footer-legal {
          display: flex;
          gap: 1.5rem;
        }
        .footer-legal a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-legal a:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
