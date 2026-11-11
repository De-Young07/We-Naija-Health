'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <>
      <Navbar />
      <main className="legal-main">
        <div className="container-wn">
          <div className="legal-card card animate-fade-in-up">
            <span className="legal-tag">Terms of Service</span>
            <h1 className="legal-title">Terms of Use</h1>
            <p className="legal-date">Last updated: November 2026</p>

            <div className="legal-section">
              <h2>1. Agreement & Platform Purpose</h2>
              <p>
                By using <strong>WeNaijaHealth</strong>, you agree to these Terms of Use. 
                WeNaijaHealth is a free civic and community health technology service designed to simplify the discovery of, and connection to, official government-regulated health insurance schemes in Nigeria.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Important Legal Disclaimers</h2>
              <div className="warning-callout">
                <p>
                  ⚠️ <strong>Not an Insurance Company:</strong> WeNaijaHealth is not an insurer, Health Maintenance Organisation (HMO), broker, or hospital. Registering on this platform expresses your interest in enrolling and authorizes our team to assist you. <strong>It does not automatically grant you active health insurance coverage.</strong>
                </p>
                <p>
                  ⚠️ <strong>Official Policy Activation:</strong> Official insurance coverage, biometric identification cards, and hospital access codes are issued exclusively by the respective scheme authority (e.g., Kwara State Health Insurance Agency or the National Health Insurance Authority) upon verification of your credentials and payment of official statutory contributions where applicable.
                </p>
              </div>
            </div>

            <div className="legal-section">
              <h2>3. Free Service Guarantee</h2>
              <p>
                Accessing WeNaijaHealth, using our online scheme directory, and receiving phone/WhatsApp guidance from our triage agents is <strong>100% free of charge</strong>. 
                Our team members and field agents will <strong>never</strong> ask you to transfer personal registration fees to any individual bank account. 
                All scheme premium contributions (e.g., ₦1,500/month for KwaraCare) are paid directly through official government revenue platforms (such as Remita or designated agency bank collection counters).
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Accuracy of Information</h2>
              <p>
                We strive to keep all scheme contribution figures, accredited clinic locations, and benefit schedules up to date based on gazetted government publications. However, official statutory bodies reserve the right to revise provider empanelments and tariffs. We recommend confirming final coverage specifics directly with the scheme during your biometric onboarding.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Participant Responsibilities</h2>
              <p>When using our platform, you agree to:</p>
              <ul>
                <li>Provide accurate contact information so our care officers can reach you.</li>
                <li>Present genuine identification documents (such as your 11-digit NIN) when attending in-person clinic appointments.</li>
                <li>Treat our community triage agents with mutual respect during advisory calls.</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>6. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Federal Republic of Nigeria, including the National Health Insurance Authority Act (2022) and the Nigeria Data Protection Act (2023).
              </p>
            </div>

            <div className="legal-footer">
              <Link href="/register" className="btn-primary">
                I Understand — Proceed to Registration →
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

        .warning-callout {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          border-radius: 0 8px 8px 0;
          padding: 1.25rem;
          margin: 1rem 0;
        }

        .warning-callout p {
          color: #92400e !important;
          font-size: 0.9rem !important;
          margin: 0.5rem 0;
        }

        .warning-callout p:first-child {
          margin-top: 0;
        }

        .warning-callout p:last-child {
          margin-bottom: 0;
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

