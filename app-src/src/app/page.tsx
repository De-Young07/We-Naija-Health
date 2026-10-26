'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const WORKER_TYPES = [
  { emoji: '🏪', key: 'workMarketTrader' as const },
  { emoji: '✂️', key: 'workArtisan' as const },
  { emoji: '🌾', key: 'workFarmer' as const },
  { emoji: '🍲', key: 'workFoodSeller' as const },
  { emoji: '🚗', key: 'workTransport' as const },
  { emoji: '🛍️', key: 'workPettyTrader' as const },
];

export default function HomePage() {
  const { dict } = useLocale();

  return (
    <>
      <Navbar />

      {/* ━━━ Hero ━━━ */}
      <section className="hero" id="hero">
        <div className="container-wn hero-content">
          <h1 className="hero-headline animate-fade-in-up">{dict.heroHeadline}</h1>
          <p className="hero-subtext animate-fade-in-up stagger-1">{dict.heroSubtext}</p>
          <div className="hero-actions animate-fade-in-up stagger-2">
            <Link href="/register" className="btn-primary hero-btn" id="hero-cta-register">
              {dict.btnGetStarted} →
            </Link>
            <Link href="/schemes" className="btn-secondary hero-btn-secondary" id="hero-cta-schemes">
              {dict.btnFindInsurance}
            </Link>
          </div>
          {/* Trust signal */}
          <div className="hero-trust animate-fade-in-up stagger-3">
            <span className="trust-badge">🔒 Free • No Login Required • 5 Languages</span>
          </div>
        </div>
      </section>

      {/* ━━━ How It Works ━━━ */}
      <section className="section" id="how-it-works">
        <div className="container-wn">
          <h2 className="section-title">{dict.sectionHowItWorks}</h2>
          <p className="section-subtitle">Three simple steps to explore your health insurance options</p>

          <div className="steps-grid">
            {[
              { num: '1', title: dict.step1Title, desc: dict.step1Desc, icon: '📋' },
              { num: '2', title: dict.step2Title, desc: dict.step2Desc, icon: '🔍' },
              { num: '3', title: dict.step3Title, desc: dict.step3Desc, icon: '🤝' },
            ].map((step, i) => (
              <div key={step.num} className={`step-card card animate-fade-in-up stagger-${i + 1}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Who We Help ━━━ */}
      <section className="section-alt" id="who-we-help">
        <div className="container-wn">
          <h2 className="section-title">{dict.sectionWhoWeHelp}</h2>
          <p className="section-subtitle">Designed for hardworking Nigerians in the informal economy</p>

          <div className="workers-grid">
            {WORKER_TYPES.map((w, i) => (
              <div key={w.key} className={`worker-chip animate-fade-in-up stagger-${i + 1}`}>
                <span className="worker-emoji">{w.emoji}</span>
                <span className="worker-label">{dict[w.key]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Understanding Insurance ━━━ */}
      <section className="section" id="understand-insurance">
        <div className="container-wn">
          <h2 className="section-title">{dict.sectionUnderstandInsurance}</h2>
          <p className="section-subtitle">Simple answers to help you make informed decisions</p>

          <div className="info-cards">
            <div className="card info-card">
              <div className="info-icon">🏥</div>
              <h3>What is Health Insurance?</h3>
              <p>Health insurance helps you pay for medical care when you need it. You contribute a small, regular amount, and when you get sick or need treatment, the scheme covers most of the cost.</p>
            </div>
            <div className="card info-card">
              <div className="info-icon">💰</div>
              <h3>How Much Does It Cost?</h3>
              <p>Costs vary by scheme. Some programmes offer heavily subsidised rates for informal workers — some as low as ₦500 per month. We&apos;ll help you find the best option for your budget.</p>
            </div>
            <div className="card info-card">
              <div className="info-icon">📍</div>
              <h3>Where Can I Get Treatment?</h3>
              <p>Each scheme has a network of hospitals, clinics, and primary healthcare centres. We&apos;ll help you find facilities near your community or workplace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CTA Banner ━━━ */}
      <section className="cta-banner" id="cta-section">
        <div className="container-wn cta-inner">
          <h2 className="cta-headline">{dict.sectionGetHelp}</h2>
          <p className="cta-subtext">Our trained agents are ready to walk you through the process, in your language.</p>
          <div className="cta-actions">
            <Link href="/register" className="btn-accent cta-btn" id="cta-register">
              {dict.btnGetStarted} →
            </Link>
            <Link href="/schemes" className="btn-secondary cta-btn-alt" id="cta-schemes">
              {dict.btnFindInsurance}
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .hero-content {
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .hero-headline {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.25rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          letter-spacing: -0.03em;
        }
        .hero-subtext {
          font-size: clamp(1rem, 2.5vw, 1.125rem);
          line-height: 1.7;
          max-width: 620px;
          margin: 0 auto 2rem;
          opacity: 0.92;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-btn {
          padding: 1rem 2.25rem;
          font-size: 1.1rem;
          border-radius: var(--radius-md);
        }
        .hero-btn-secondary {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.4);
          color: white;
          padding: 1rem 2.25rem;
          font-size: 1.1rem;
          border-radius: var(--radius-md);
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.25);
        }
        .hero-trust {
          margin-top: 1.5rem;
        }
        .trust-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.12);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .step-card {
          text-align: center;
          position: relative;
          padding-top: 2.5rem;
        }
        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .step-number {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: var(--radius-full);
          background: var(--color-primary-light);
          color: var(--color-primary);
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .step-desc {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* Workers */
        .workers-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        .worker-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--color-surface);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
        }
        .worker-chip:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
          border-color: var(--color-primary);
        }
        .worker-emoji {
          font-size: 1.5rem;
        }
        .worker-label {
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* Info cards */
        .info-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .info-card {
          text-align: center;
        }
        .info-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .info-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .info-card p {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* CTA Banner */
        .cta-banner {
          background: var(--wn-green-800);
          padding: 4rem 0;
        }
        .cta-inner {
          text-align: center;
          color: white;
        }
        .cta-headline {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
        }
        .cta-subtext {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-btn {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }
        .cta-btn-alt {
          border-color: rgba(255,255,255,0.4);
          color: white;
          background: transparent;
        }
        .cta-btn-alt:hover {
          background: rgba(255,255,255,0.15);
        }

        @media (max-width: 768px) {
          .steps-grid,
          .info-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
