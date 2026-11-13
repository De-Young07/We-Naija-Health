'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="legal-main">
        <div className="container-wn">
          <div className="legal-card card animate-fade-in-up">
            <span className="legal-tag">Regulatory & Data Protection Disclosure</span>
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-date">Last updated: November 2026 • Compliant with Nigeria Data Protection Act (NDPA 2023)</p>

            <div className="legal-section">
              <h2>1. Our Role & Data Commitment</h2>
              <p>
                <strong>HealthSure Connect</strong> is an independent digital health navigation and warm handoff platform operated by AccessCare Initiative. 
                We are <strong>not</strong> an insurance provider, underwriter, or healthcare facility. 
                Our mission is to help informal workers, artisans, market traders, and everyday Nigerians navigate, understand, and register for official government and accredited state health insurance schemes (such as KwaraCARE and the National Health Insurance Authority — NHIA).
              </p>
              <p>
                We process your personal information strictly based on your explicit consent when you request assistance or submit a registration form.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Information We Collect</h2>
              <p>To assist your enrollment with official healthcare authorities, we collect:</p>
              <ul>
                <li><strong>Contact Demographics:</strong> Full name, verified Nigerian telephone number, email address (optional), state of residence, Local Government Area (LGA), and market/community location.</li>
                <li><strong>Work Category:</strong> Your occupation (e.g., market trader, transport worker, artisan, farmer) to determine eligibility for subsidized informal sector health programs.</li>
                <li><strong>Coverage Preferences:</strong> Individual or household/family coverage preferences, and preferred language of communication (English, Pidgin, Yorùbá, Hausa, or Igbo).</li>
                <li><strong>Audit & Interaction Logs:</strong> Records of telephone calls, WhatsApp triage messages, and referral notes logged by our community triage agents to maintain our 24-hour response service commitment.</li>
              </ul>
              <p className="note-box">
                🔒 <strong>Note on NIN & Biometrics:</strong> HealthSure Connect <em>never</em> captures, stores, or processes your fingerprint biometrics, banking PINs, or BVNs on this website. Biometric capturing is conducted exclusively in person at accredited primary health centers or official agency desks.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. How We Use Your Data</h2>
              <p>We use your information solely to:</p>
              <ul>
                <li>Match you with accredited health schemes and primary health centers near your stall or home.</li>
                <li>Contact you via phone call, SMS, or WhatsApp within 24 hours of your inquiry.</li>
                <li>Provide you with an actionable document checklist (e.g., NIN requirement, contribution fees).</li>
                <li>Facilitate a warm handoff to accredited health insurance field enrollment officers.</li>
                <li>Compile anonymized aggregate statistics (e.g., percentage of market traders seeking health coverage) to advocate for informal sector healthcare subsidies.</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>4. Data Sharing & Third Parties</h2>
              <p>
                We do <strong>not</strong> sell, rent, or monetize your personal information to third-party advertisers. 
                Data is shared strictly with:
              </p>
              <ul>
                <li>Accredited state health insurance agencies (e.g., Kwara State Health Insurance Agency — KWHIA) and NHIA empaneled providers whom you explicitly choose to register with.</li>
                <li>Direct technical delivery partners (e.g., transactional SMS/Email relays like Resend) bound by strict confidentiality agreements.</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>5. Security & Retention</h2>
              <p>
                All data transmitted through HealthSure Connect is encrypted using industry-standard Transport Layer Security (TLS 1.3). 
                Data at rest is stored in secure, encrypted cloud databases adhering to international ISO 27001 standards. 
                We retain your records for the duration of your enrollment guidance, after which you may request complete deletion at any time.
              </p>
            </div>

            <div className="legal-section">
              <h2>6. Your Rights Under the NDPA</h2>
              <p>Under the Nigeria Data Protection Act, you have the right to:</p>
              <ul>
                <li>Request a copy of the personal information we hold about you.</li>
                <li>Request immediate correction of inaccurate phone numbers or demographic data.</li>
                <li>Withdraw your consent and request full deletion of your record from our triage pipeline.</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>7. Contact Our Data Protection Officer</h2>
              <p>
                For data privacy inquiries, corrections, or deletion requests, reach out directly to our team:
              </p>
              <div className="contact-callout">
                <p><strong>AccessCare / HealthSure Connect Operations</strong></p>
                <p>Email: <a href="mailto:team.accesscare@gmail.com">team.accesscare@gmail.com</a></p>
                <p>Telephone: +234 (0) 800 100 1001</p>
                <p>Location: Ilorin, Kwara State, Nigeria</p>
              </div>
            </div>

            <div className="legal-footer">
              <Link href="/register" className="btn-primary">
                Back to Registration →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .legal-main {
          padding: 2.5rem 0 4rem;
          flex: 1;
          background: var(--color-surface-secondary);
        }

        .legal-card {
          max-width: 820px;
          margin: 0 auto;
          padding: 3rem 2.5rem;
          background: #ffffff;
        }

        .legal-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.5rem;
        }

        .legal-title {
          font-size: 2.25rem;
          font-weight: 900;
          color: var(--color-text);
          margin: 0 0 0.5rem;
        }

        .legal-date {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .legal-section {
          margin-bottom: 2rem;
        }

        .legal-section h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0 0 0.75rem;
        }

        .legal-section p, .legal-section li {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #334155;
        }

        .legal-section ul {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }

        .legal-section li {
          margin-bottom: 0.5rem;
        }

        .note-box {
          background: #f0fdf4;
          border-left: 4px solid #008751;
          padding: 0.85rem 1.2rem;
          border-radius: 0 8px 8px 0;
          font-size: 0.9rem !important;
          color: #166534 !important;
          margin-top: 1rem;
        }

        .contact-callout {
          background: var(--color-surface-secondary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.25rem;
          margin-top: 0.75rem;
        }

        .contact-callout p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .contact-callout a {
          color: var(--color-primary);
          font-weight: 600;
        }

        .legal-footer {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
          text-align: center;
        }

        @media (max-width: 768px) {
          .legal-card {
            padding: 2rem 1.5rem;
          }
          .legal-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
}

