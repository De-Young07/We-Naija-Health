'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

// ━━━ Scheme Data ━━━
interface Scheme {
  id: string;
  name: string;
  provider: string;
  state: string;
  verified: boolean;
  cost: string;
  costDetail: string;
  eligibility: string[];
  plans?: Array<{
    name: string;
    contribution: string;
    description: string;
  }>;
  benefits: string[];
  exclusions?: string[];
  coverageNote?: string;
  facilities: string;
  registrationSteps: string[];
  contact?: string[];
  officialUrl?: string;
  subsidyAvailable: boolean;
  tag: string;
}

const SCHEMES: Scheme[] = [
  {
    id: 'kwaracare',
    name: 'KwaraCare',
    provider: 'Kwara State Health Insurance Agency',
    state: 'Kwara',
    verified: true,
    cost: 'From ₦15,500 per year',
    costDetail: 'Premiums are paid annually. Family cover includes the principal enrollee, spouse and up to 4 children under 18.',
    eligibility: [
      'Resident of Kwara State',
      'Informal plan: self-employed people, artisans, farmers and small businesses',
      'Formal plan: civil servants, local government employees and eligible private-sector employees',
      'Equity plan: eligible low-income and vulnerable residents',
    ],
    plans: [
      {
        name: 'Informal Health Plan',
        contribution: '₦15,500 per person annually',
        description: 'For self-employed people, artisans, farmers and other informal-sector residents. Family option: ₦75,000 for up to 6 members.',
      },
      {
        name: 'Formal Health Plan',
        contribution: '₦18,000 per person annually',
        description: 'For civil servants, local government employees and eligible private-sector employees. Family option: ₦87,000 for up to 6 members.',
      },
      {
        name: 'Equity Health Plan',
        contribution: 'Subsidised, subject to eligibility',
        description: 'For eligible low-income households and vulnerable residents under the scheme rules.',
      },
    ],
    benefits: [
      'General and specialist consultations',
      'Selected tests, plain X-rays and approved medicines',
      'Treatment for common illnesses, hypertension and type 2 diabetes',
      'Minor and intermediate surgery, including hernia repair and appendectomy',
      'Emergency, maternal, child and selected eye-care services',
      'Hospital admission for up to 5 nights; longer stays need authorisation',
    ],
    exclusions: [
      'Brain surgery, kidney transplant and cancer treatment',
      'IVF, hormone replacement therapy and prostheses',
      'Congenital abnormalities, self-inflicted injuries and drug-addiction treatment',
    ],
    coverageNote: 'Coverage depends on the applicable benefit package. Confirm current limits for procedures, tests and medicines before enrolling.',
    facilities: 'Choose one empanelled public or private provider for routine care. Emergency care is available at the nearest contracted provider, subject to scheme rules.',
    registrationSteps: [
      'Review the current package and confirm that your preferred hospital is empanelled',
      'Confirm any expected treatment, referral requirement, waiting period or co-payment with KWHIA',
      'Contact KwaraCare or visit the official package page to enrol',
    ],
    contact: [
      'Toll-free: 0800 100 1001',
      'WhatsApp: +234 916 998 9038',
      'Email: healthinsurance@kwarastate.gov.ng',
      'House 27B, Ahmadu Bello Way, G.R.A., Ilorin, Kwara State',
    ],
    officialUrl: 'https://kwaracare.com.ng/packages/',
    subsidyAvailable: true,
    tag: 'State SHIS',
  },
  {
    id: 'nhia-bhcpf',
    name: 'NHIA Basic Healthcare Provision Fund',
    provider: 'National Health Insurance Authority',
    state: 'Nationwide',
    verified: true,
    cost: 'FREE (100% Government-funded)',
    costDetail: 'No contribution required. Funded from the Federal Basic Healthcare Provision Fund (1% CRF allocation).',
    eligibility: [
      'Nigerian citizen',
      'Vulnerable and underserved populations',
      'Pregnant women, children under 5, elderly (65+)',
      'People living with disabilities',
      'Informal workers earning below minimum wage',
    ],
    benefits: [
      'Essential primary healthcare package',
      'Emergency medical treatment',
      'Maternal and child health services',
      'Basic diagnostic services',
      'Essential medicines from the National Essential Drug List',
    ],
    facilities: 'Over 10,000 accredited PHCs and General Hospitals nationwide through NHIA network',
    registrationSteps: [
      'Visit the nearest enrolled Primary Healthcare Centre',
      'Present valid ID (NIN preferred)',
      'Complete enrollment at the facility',
      'Biometric capture on-site',
      'Immediate activation — no waiting period for emergency care',
    ],
    subsidyAvailable: false,
    tag: 'Federal',
  },
  {
    id: 'nhia-informal',
    name: 'NHIA Informal Sector Social Health Insurance',
    provider: 'National Health Insurance Authority',
    state: 'Nationwide',
    verified: true,
    cost: '₦1,700/month (Individual)',
    costDetail: 'Individual: ₦1,700/month • Household: ₦4,800/month (enrollee + 4 dependants)',
    eligibility: [
      'Self-employed Nigerian citizen',
      'Informal sector worker',
      'Not covered under formal NHIA programme',
      'Must enroll through accredited Health Maintenance Organisation (HMO)',
    ],
    benefits: [
      'Outpatient care and consultations',
      'In-patient hospitalisation (up to 15 days per illness)',
      'Pharmaceutical supplies',
      'Maternity care for up to 4 live births',
      'Preventive care (immunisation, health education)',
      'Eye and dental care (basic)',
      'Mental health consultation',
    ],
    facilities: 'Nationwide through accredited HMOs and their provider networks (2,000+ facilities)',
    registrationSteps: [
      'Choose an accredited HMO from the NHIA list',
      'Contact the HMO or visit their office',
      'Submit enrollment form with valid ID and passport photo',
      'Select a Primary Healthcare Provider from HMO network',
      'Make premium payment (monthly, quarterly, or annually)',
      'Receive HMO membership card — coverage starts after 30-day waiting period',
    ],
    subsidyAvailable: true,
    tag: 'Federal',
  },
];

export default function SchemesPage() {
  const { dict } = useLocale();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main className="schemes-main" id="schemes-page">
        <div className="container-wn">
          {/* Header */}
          <div className="schemes-header animate-fade-in-up">
            <h1 className="section-title">{dict.schemeDirectoryTitle}</h1>
            <p className="section-subtitle">
              Verified, up-to-date information on health insurance programmes available for informal workers in Nigeria.
            </p>
          </div>

          {/* Scheme Cards */}
          <div className="schemes-list">
            {SCHEMES.map((scheme, i) => (
              <div
                key={scheme.id}
                className={`scheme-card card animate-fade-in-up stagger-${i + 1}`}
                id={`scheme-${scheme.id}`}
              >
                {/* Card Header */}
                <div className="scheme-header">
                  <div className="scheme-meta">
                    <span className="scheme-tag">{scheme.tag}</span>
                    {scheme.verified && <span className="scheme-verified">✓ {dict.schemeVerified}</span>}
                    {scheme.subsidyAvailable && <span className="scheme-subsidy">💰 Subsidy Available</span>}
                  </div>
                  <h2 className="scheme-name">{scheme.name}</h2>
                  <p className="scheme-provider">{scheme.provider} • {scheme.state}</p>
                </div>

                {/* Cost highlight */}
                <div className="scheme-cost-box">
                  <span className="scheme-cost-label">{dict.schemeCost}</span>
                  <span className="scheme-cost-value">{scheme.cost}</span>
                  <span className="scheme-cost-detail">{scheme.costDetail}</span>
                </div>

                {/* Expandable details */}
                <button
                  className="scheme-expand-btn"
                  onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                  id={`expand-${scheme.id}`}
                >
                  {expandedId === scheme.id ? 'Hide Details ▲' : 'View Full Details ▼'}
                </button>

                {expandedId === scheme.id && (
                  <div className="scheme-details animate-fade-in">
                    {/* Eligibility */}
                    <div className="detail-section">
                      <h3 className="detail-title">👥 {dict.schemeEligibility}</h3>
                      <ul className="detail-list">
                        {scheme.eligibility.map((item, j) => <li key={j}>{item}</li>)}
                      </ul>
                    </div>

                    {scheme.plans && (
                      <div className="detail-section">
                        <h3 className="detail-title">📋 Available plans</h3>
                        <div className="plan-list">
                          {scheme.plans.map((plan) => (
                            <div className="plan-item" key={plan.name}>
                              <strong>{plan.name}</strong>
                              <span>{plan.contribution}</span>
                              <p>{plan.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    <div className="detail-section">
                      <h3 className="detail-title">✅ {dict.schemeBenefits}</h3>
                      <ul className="detail-list">
                        {scheme.benefits.map((item, j) => <li key={j}>{item}</li>)}
                      </ul>
                      {scheme.coverageNote && <p className="coverage-note">{scheme.coverageNote}</p>}
                    </div>

                    {scheme.exclusions && (
                      <div className="detail-section">
                        <h3 className="detail-title">⚠️ Important exclusions</h3>
                        <ul className="detail-list">
                          {scheme.exclusions.map((item, j) => <li key={j}>{item}</li>)}
                        </ul>
                        <p className="coverage-note">These exclusions are from the published benefit document. Confirm the latest approved schedule before enrolling.</p>
                      </div>
                    )}

                    {/* Facilities */}
                    <div className="detail-section">
                      <h3 className="detail-title">🏥 {dict.schemeFacilities}</h3>
                      <p className="detail-text">{scheme.facilities}</p>
                    </div>

                    {scheme.contact && (
                      <div className="detail-section">
                        <h3 className="detail-title">☎️ Contact KwaraCare</h3>
                        <ul className="detail-list">
                          {scheme.contact.map((item, j) => <li key={j}>{item}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Registration Steps */}
                    <div className="detail-section">
                      <h3 className="detail-title">📝 {dict.schemeRegister}</h3>
                      <ol className="detail-steps">
                        {scheme.registrationSteps.map((step, j) => (
                          <li key={j}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="scheme-cta">
                  {scheme.officialUrl ? (
                    <a
                      href={scheme.officialUrl}
                      className="btn-primary"
                      id={`scheme-register-${scheme.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View official package details ↗
                    </a>
                  ) : (
                    <Link href="/register" className="btn-primary" id={`scheme-register-${scheme.id}`}>
                      {dict.btnGetStarted} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="schemes-disclaimer">
            <p>⚠️ Information is sourced from official government publications and verified periodically. Costs and eligibility may change. Always confirm with the scheme provider before enrolling.</p>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .schemes-main { padding: 2rem 0 3rem; flex: 1; background: var(--color-surface-secondary); }
        .schemes-header { text-align: center; margin-bottom: 2rem; }
        .schemes-list { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; margin: 0 auto; }

        .scheme-card { padding: 0; overflow: hidden; }
        .scheme-header { padding: 1.5rem 2rem 0; }
        .scheme-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
        .scheme-tag {
          display: inline-block; padding: 0.25rem 0.75rem;
          background: var(--wn-green-100); color: var(--color-primary);
          border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .scheme-verified {
          display: inline-flex; align-items: center; gap: 0.25rem;
          padding: 0.25rem 0.75rem; background: var(--wn-green-500); color: white;
          border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;
        }
        .scheme-subsidy {
          display: inline-block; padding: 0.25rem 0.75rem;
          background: var(--wn-gold-100); color: var(--wn-gold-500);
          border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;
        }
        .scheme-name { font-size: 1.375rem; font-weight: 800; color: var(--color-text); margin-bottom: 0.25rem; }
        .scheme-provider { font-size: 0.9rem; color: var(--color-text-muted); }

        .scheme-cost-box {
          margin: 1.25rem 2rem; padding: 1rem 1.25rem;
          background: var(--color-primary-light); border-radius: var(--radius-lg);
          border-left: 4px solid var(--color-primary);
        }
        .scheme-cost-label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 0.25rem; }
        .scheme-cost-value { display: block; font-size: 1.25rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0.25rem; }
        .scheme-cost-detail { display: block; font-size: 0.8rem; color: var(--color-text-muted); }

        .scheme-expand-btn {
          display: block; width: 100%; padding: 0.75rem;
          background: none; border: none; border-top: 1px solid var(--color-border);
          font-size: 0.875rem; font-weight: 600; color: var(--color-primary);
          cursor: pointer; transition: background var(--transition-fast);
        }
        .scheme-expand-btn:hover { background: var(--color-primary-light); }

        .scheme-details { padding: 0 2rem 1rem; }
        .detail-section { margin-bottom: 1.5rem; }
        .detail-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-text); }
        .detail-list { padding-left: 1.25rem; list-style-type: disc; }
        .detail-list li { font-size: 0.9rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 0.25rem; }
        .plan-list { display: grid; gap: 0.75rem; }
        .plan-item { padding: 0.875rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); }
        .plan-item strong, .plan-item span { display: block; }
        .plan-item strong { color: var(--color-text); font-size: 0.9rem; }
        .plan-item span { color: var(--color-primary); font-weight: 700; font-size: 0.85rem; margin-top: 0.125rem; }
        .plan-item p, .coverage-note { color: var(--color-text-muted); font-size: 0.85rem; line-height: 1.55; margin: 0.4rem 0 0; }
        .coverage-note { margin-top: 0.75rem; }
        .detail-steps { padding-left: 1.25rem; }
        .detail-steps li { font-size: 0.9rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 0.5rem; }
        .detail-text { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; }

        .scheme-cta { padding: 1rem 2rem 1.5rem; text-align: center; }

        .schemes-disclaimer {
          max-width: 800px; margin: 2rem auto 0;
          padding: 1rem 1.5rem; background: var(--wn-gold-50);
          border-radius: var(--radius-lg); border: 1px solid var(--wn-gold-200);
        }
        .schemes-disclaimer p { font-size: 0.8rem; color: var(--wn-gold-500); margin: 0; line-height: 1.5; }

        @media (max-width: 768px) {
          .scheme-header { padding: 1.25rem 1.25rem 0; }
          .scheme-cost-box { margin: 1rem 1.25rem; }
          .scheme-details { padding: 0 1.25rem 1rem; }
          .scheme-cta { padding: 1rem 1.25rem 1.25rem; }
        }
      `}</style>
    </>
  );
}
