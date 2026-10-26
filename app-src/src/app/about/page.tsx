'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/locale-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const FAQS = [
  {
    q: 'Is WeNaijaHealth a government agency?',
    a: 'No. WeNaijaHealth is an independent access and navigation platform. We are not a government agency, insurance provider, or financial institution. We help connect informal workers with official registration pathways.',
  },
  {
    q: 'Does registering on WeNaijaHealth mean I have insurance?',
    a: 'No. Registration on WeNaijaHealth expresses your interest and helps us connect you with the right programme. Official insurance coverage is activated only by the relevant scheme authority after their own verification and enrollment process.',
  },
  {
    q: 'Is this free?',
    a: 'Yes. Using WeNaijaHealth is completely free. There are no hidden charges. The health insurance schemes themselves may have their own contribution costs, which we clearly display.',
  },
  {
    q: 'What languages are supported?',
    a: 'WeNaijaHealth is available in 5 languages: English, Nigerian Pidgin (Naija), Yorùbá, Hausa, and Igbo. You can switch languages at any time using the 🌐 button.',
  },
  {
    q: 'How is my data protected?',
    a: 'We follow data protection principles consistent with the Nigeria Data Protection Act (NDPA). Your information is encrypted, stored securely, and only shared with the specific scheme you choose to register for.',
  },
  {
    q: 'Can I get financial assistance with my premium?',
    a: 'Some programmes offer subsidised rates for qualifying individuals. WeNaijaHealth can also explore whether reimbursement or financial assistance options are available. All assistance is subject to eligibility and approval — it is never guaranteed.',
  },
  {
    q: 'I don\'t have a smartphone. Can I still register?',
    a: 'Yes! Our trained field agents at market locations can help you register using their devices. You can also call our helpline for phone-assisted registration.',
  },
];

export default function AboutPage() {
  const { dict } = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="about-main" id="about-page">
        {/* Mission Section */}
        <section className="about-hero" id="about-mission">
          <div className="container-wn">
            <h1 className="about-headline animate-fade-in-up">{dict.navAbout} {dict.siteName}</h1>
            <p className="about-subtext animate-fade-in-up stagger-1">
              WeNaijaHealth exists because we believe that every Nigerian — whether you sell in a market, 
              drive a taxi, or work from your own shop — deserves to understand and access quality healthcare 
              without confusion or financial ruin.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="section" id="what-we-do">
          <div className="container-wn">
            <h2 className="section-title">What We Do</h2>
            <div className="about-grid">
              <div className="card about-card">
                <div className="about-icon">🔍</div>
                <h3>Navigate</h3>
                <p>We simplify the complex landscape of Nigerian health insurance, helping you find the right programme for your situation.</p>
              </div>
              <div className="card about-card">
                <div className="about-icon">📋</div>
                <h3>Register</h3>
                <p>Our guided registration process collects the right information and connects you with the appropriate official enrollment channels.</p>
              </div>
              <div className="card about-card">
                <div className="about-icon">🤝</div>
                <h3>Support</h3>
                <p>From in-market field agents to multi-language support, we walk alongside you through every step of the process.</p>
              </div>
              <div className="card about-card">
                <div className="about-icon">💰</div>
                <h3>Assist</h3>
                <p>Where available, we help you explore financial assistance and reimbursement options to make insurance contributions more manageable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-alt" id="faq">
          <div className="container-wn">
            <h2 className="section-title">{dict.sectionFAQ}</h2>
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className="faq-item" id={`faq-${i}`}>
                  <button
                    className={`faq-question ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-chevron">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="faq-answer animate-fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section" id="contact">
          <div className="container-wn">
            <h2 className="section-title">{dict.sectionContact}</h2>
            <p className="section-subtitle">We&apos;re here to help. Reach us through any of these channels.</p>

            <div className="contact-grid">
              <div className="card contact-card">
                <div className="contact-icon">📞</div>
                <h3>Phone / WhatsApp</h3>
                <a href="tel:+2348179969112" className="contact-detail">+234 817 996 9112</a>
                <p className="contact-note">Mon–Sat, 8am–6pm</p>
              </div>
              <div className="card contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <a href="mailto:Team.wenaijahealth@gmail.com" className="contact-detail">Team.wenaijahealth@gmail.com</a>
                <p className="contact-note">We respond within 24 hours</p>
              </div>
              <div className="card contact-card">
                <div className="contact-icon">📍</div>
                <h3>Market Agents</h3>
                <p className="contact-detail">Find us at partner markets</p>
                <p className="contact-note">Kwara State pilot locations</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .about-main { flex: 1; }
        .about-hero {
          background: var(--wn-green-800); color: white;
          padding: 4rem 0; text-align: center; position: relative;
        }
        .about-hero::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
          background: var(--wn-gold-400);
        }
        .about-headline { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 900; margin-bottom: 1rem; }
        .about-subtext { font-size: 1.1rem; max-width: 650px; margin: 0 auto; line-height: 1.7; opacity: 0.92; }

        .about-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .about-card { text-align: center; }
        .about-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .about-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .about-card p { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; }

        /* FAQ */
        .faq-list { max-width: 700px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid var(--color-border); }
        .faq-question {
          display: flex; align-items: center; justify-content: space-between; width: 100%;
          padding: 1.25rem 0; background: none; border: none; cursor: pointer;
          font-size: 1rem; font-weight: 600; color: var(--color-text); text-align: left;
          transition: color var(--transition-fast); gap: 1rem;
        }
        .faq-question:hover { color: var(--color-primary); }
        .faq-question.open { color: var(--color-primary); }
        .faq-chevron { font-size: 1.5rem; font-weight: 300; flex-shrink: 0; }
        .faq-answer { padding: 0 0 1.25rem; }
        .faq-answer p { font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.7; margin: 0; }

        /* Contact */
        .contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 800px; margin: 0 auto; }
        .contact-card { text-align: center; }
        .contact-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .contact-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .contact-detail { display: block; font-size: 1rem; font-weight: 600; color: var(--color-primary); margin-bottom: 0.25rem; text-decoration: none; transition: opacity 0.2s; }
        .contact-detail:hover { opacity: 0.75; text-decoration: underline; }
        .contact-note { font-size: 0.8rem; color: var(--color-text-muted); }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr 1fr; }
          .contact-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .about-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
