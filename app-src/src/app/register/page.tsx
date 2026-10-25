'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/lib/locale-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

// ━━━ Types ━━━
interface FormData {
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  community: string;
  preferredContact: string;
  // Step 2
  workType: string;
  // Step 3
  hasInsurance: string;
  // Step 4
  coverageFor: string;
  // Step 5
  consentData: boolean;
  consentSharing: boolean;
  consentReimbursement: boolean;
  consentComms: boolean;
}

const INITIAL_DATA: FormData = {
  fullName: '', phone: '', email: '', state: '', lga: '', community: '', preferredContact: 'sms',
  workType: '',
  hasInsurance: '',
  coverageFor: '',
  consentData: false, consentSharing: false, consentReimbursement: false, consentComms: false,
};

const TOTAL_STEPS = 5;

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
];

// ━━━ Auto-save draft ━━━
function useDraft(data: FormData, step: number) {
  useEffect(() => {
    try {
      localStorage.setItem('wenaija-draft', JSON.stringify({ data, step, ts: Date.now() }));
    } catch { /* silently fail — storage may be full */ }
  }, [data, step]);
}

function loadDraft(): { data: FormData; step: number } | null {
  try {
    const raw = localStorage.getItem('wenaija-draft');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Expire after 24h
    if (Date.now() - parsed.ts > 86400000) {
      localStorage.removeItem('wenaija-draft');
      return null;
    }
    return { data: parsed.data, step: parsed.step };
  } catch {
    return null;
  }
}

export default function RegisterPage() {
  const { dict } = useLocale();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData(draft.data);
      setStep(draft.step);
    }
  }, []);

  // Auto-save
  useDraft(data, step);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  // ━━━ Validation ━━━
  const validateStep = (s: number): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};

    if (s === 1) {
      if (!data.fullName.trim()) errs.fullName = dict.required;
      if (!data.phone.trim()) errs.phone = dict.required;
      else if (!/^0[789]\d{9}$/.test(data.phone.replace(/\s/g, ''))) errs.phone = dict.phoneFormat;
      if (!data.state) errs.state = dict.required;
    }
    if (s === 2) {
      if (!data.workType) errs.workType = dict.required;
    }
    if (s === 3) {
      if (!data.hasInsurance) errs.hasInsurance = dict.required;
    }
    if (s === 4) {
      if (!data.coverageFor) errs.coverageFor = dict.required;
    }
    if (s === 5) {
      if (!data.consentData) errs.consentData = dict.required;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    // Generate reference number
    const ref = `WNH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setRefNumber(ref);
    setSubmitted(true);

    // Clear draft
    localStorage.removeItem('wenaija-draft');

    // In production: POST to /api/register
    console.log('Registration submitted:', { ...data, ref });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ━━━ Confirmation Screen ━━━
  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="register-main">
          <div className="container-wn">
            <div className="confirm-card card animate-fade-in-up" id="confirmation">
              <div className="confirm-icon">✅</div>
              <h1 className="confirm-title">{dict.confirmTitle}</h1>
              <p className="confirm-msg">{dict.confirmMessage}</p>

              <div className="ref-box">
                <span className="ref-label">{dict.confirmRefLabel}</span>
                <span className="ref-number" id="ref-number">{refNumber}</span>
              </div>

              <div className="confirm-disclaimer">
                <p>{dict.confirmDisclaimer}</p>
              </div>

              <div className="confirm-actions">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I just registered with WeNaijaHealth! My reference: ${refNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  id="btn-share-whatsapp"
                >
                  📱 {dict.btnShareWhatsApp}
                </a>
                <a href="/" className="btn-secondary" id="btn-back-home">
                  {dict.btnBackHome}
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .register-main { padding: 3rem 0; flex: 1; }
          .confirm-card { max-width: 560px; margin: 0 auto; text-align: center; padding: 3rem 2rem; }
          .confirm-icon { font-size: 4rem; margin-bottom: 1rem; }
          .confirm-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--color-primary); }
          .confirm-msg { font-size: 1.05rem; color: var(--color-text-muted); margin-bottom: 2rem; line-height: 1.6; }
          .ref-box { background: var(--color-primary-light); border: 2px solid var(--color-primary); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; }
          .ref-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
          .ref-number { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); letter-spacing: 0.05em; font-family: monospace; }
          .confirm-disclaimer { background: var(--color-surface-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 2rem; }
          .confirm-disclaimer p { font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.5; margin: 0; }
          .confirm-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        `}</style>
      </>
    );
  }

  // ━━━ Step Labels ━━━
  const stepLabels = [dict.regStep1Title, dict.regStep2Title, dict.regStep3Title, dict.regStep4Title, dict.regStep5Title];

  return (
    <>
      <Navbar />
      <main className="register-main" id="register-page">
        <div className="container-wn">
          <div className="reg-wrapper">
            {/* Header */}
            <div className="reg-header animate-fade-in-up">
              <h1 className="reg-title">{dict.regTitle}</h1>
              <p className="reg-step-label">
                {dict.regStepOf.replace('{current}', String(step)).replace('{total}', String(TOTAL_STEPS))} — {stepLabels[step - 1]}
              </p>
            </div>

            {/* Stepper */}
            <div className="stepper" id="stepper">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`step-dot ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  {i < TOTAL_STEPS - 1 && <div className={`step-line ${i + 1 < step ? 'completed' : ''}`} />}
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="card reg-card animate-fade-in" key={step}>
              {/* ━━━ Step 1: About You ━━━ */}
              {step === 1 && (
                <div id="step-1">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">{dict.fieldFullName} *</label>
                    <input
                      type="text"
                      id="fullName"
                      className={`form-input ${errors.fullName ? 'error' : ''}`}
                      value={data.fullName}
                      onChange={e => updateField('fullName', e.target.value)}
                      placeholder="e.g. Aisha Ibrahim"
                    />
                    {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">{dict.fieldPhone} *</label>
                    <input
                      type="tel"
                      id="phone"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      value={data.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      placeholder="08012345678"
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">{dict.fieldEmailOptional}</label>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      value={data.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="optional@email.com"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="state">{dict.fieldState} *</label>
                      <select
                        id="state"
                        className={`form-input ${errors.state ? 'error' : ''}`}
                        value={data.state}
                        onChange={e => updateField('state', e.target.value)}
                      >
                        <option value="">— Select —</option>
                        {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <span className="form-error">{errors.state}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="lga">{dict.fieldLGA}</label>
                      <input
                        type="text"
                        id="lga"
                        className="form-input"
                        value={data.lga}
                        onChange={e => updateField('lga', e.target.value)}
                        placeholder="e.g. Ilorin West"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="community">{dict.fieldCommunity}</label>
                    <input
                      type="text"
                      id="community"
                      className="form-input"
                      value={data.community}
                      onChange={e => updateField('community', e.target.value)}
                      placeholder="e.g. Unity Road Market"
                    />
                  </div>
                </div>
              )}

              {/* ━━━ Step 2: Work Type ━━━ */}
              {step === 2 && (
                <div id="step-2">
                  <h3 className="step-question">{dict.fieldWorkType}</h3>
                  <div className="option-grid">
                    {([
                      { key: 'market_trader', label: dict.workMarketTrader, emoji: '🏪' },
                      { key: 'shop_owner', label: dict.workShopOwner, emoji: '🏬' },
                      { key: 'petty_trader', label: dict.workPettyTrader, emoji: '🛍️' },
                      { key: 'artisan', label: dict.workArtisan, emoji: '✂️' },
                      { key: 'farmer', label: dict.workFarmer, emoji: '🌾' },
                      { key: 'food_seller', label: dict.workFoodSeller, emoji: '🍲' },
                      { key: 'transport', label: dict.workTransport, emoji: '🚗' },
                      { key: 'self_employed', label: dict.workSelfEmployed, emoji: '💼' },
                      { key: 'other', label: dict.workOther, emoji: '📦' },
                    ] as const).map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`option-btn ${data.workType === opt.key ? 'selected' : ''}`}
                        onClick={() => updateField('workType', opt.key)}
                        id={`work-${opt.key}`}
                      >
                        <span className="option-emoji">{opt.emoji}</span>
                        <span className="option-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.workType && <span className="form-error center-error">{errors.workType}</span>}
                </div>
              )}

              {/* ━━━ Step 3: Insurance Status ━━━ */}
              {step === 3 && (
                <div id="step-3">
                  <h3 className="step-question">{dict.fieldHasInsurance}</h3>
                  <div className="choice-list">
                    {([
                      { key: 'yes', label: dict.optionYes, emoji: '✅' },
                      { key: 'no', label: dict.optionNo, emoji: '❌' },
                      { key: 'not_sure', label: dict.optionNotSure, emoji: '🤔' },
                    ] as const).map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`choice-btn ${data.hasInsurance === opt.key ? 'selected' : ''}`}
                        onClick={() => updateField('hasInsurance', opt.key)}
                        id={`insurance-${opt.key}`}
                      >
                        <span className="choice-emoji">{opt.emoji}</span>
                        <span className="choice-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.hasInsurance && <span className="form-error center-error">{errors.hasInsurance}</span>}
                </div>
              )}

              {/* ━━━ Step 4: Coverage ━━━ */}
              {step === 4 && (
                <div id="step-4">
                  <h3 className="step-question">{dict.fieldCoverageFor}</h3>
                  <div className="choice-list">
                    {([
                      { key: 'self', label: dict.coverageSelf, emoji: '🧑' },
                      { key: 'family', label: dict.coverageFamily, emoji: '👨‍👩‍👧‍👦' },
                    ] as const).map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`choice-btn ${data.coverageFor === opt.key ? 'selected' : ''}`}
                        onClick={() => updateField('coverageFor', opt.key)}
                        id={`coverage-${opt.key}`}
                      >
                        <span className="choice-emoji">{opt.emoji}</span>
                        <span className="choice-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.coverageFor && <span className="form-error center-error">{errors.coverageFor}</span>}
                </div>
              )}

              {/* ━━━ Step 5: Consent ━━━ */}
              {step === 5 && (
                <div id="step-5">
                  <h3 className="step-question">{dict.consentTitle}</h3>

                  {/* Summary */}
                  <div className="review-summary">
                    <div className="review-row"><strong>{dict.fieldFullName}:</strong> {data.fullName}</div>
                    <div className="review-row"><strong>{dict.fieldPhone}:</strong> {data.phone}</div>
                    <div className="review-row"><strong>{dict.fieldState}:</strong> {data.state} {data.lga && `/ ${data.lga}`}</div>
                    <div className="review-row"><strong>{dict.fieldWorkType}:</strong> {data.workType}</div>
                    <div className="review-row"><strong>{dict.fieldCoverageFor}:</strong> {data.coverageFor}</div>
                  </div>

                  <div className="consent-list">
                    <label className="consent-item" id="consent-data">
                      <input type="checkbox" checked={data.consentData} onChange={e => updateField('consentData', e.target.checked)} />
                      <span>{dict.consentDataCollection}</span>
                    </label>
                    <label className="consent-item" id="consent-sharing">
                      <input type="checkbox" checked={data.consentSharing} onChange={e => updateField('consentSharing', e.target.checked)} />
                      <span>{dict.consentDataSharing}</span>
                    </label>
                    <label className="consent-item" id="consent-reimburse">
                      <input type="checkbox" checked={data.consentReimbursement} onChange={e => updateField('consentReimbursement', e.target.checked)} />
                      <span>{dict.consentReimbursement}</span>
                    </label>
                    <label className="consent-item" id="consent-comms">
                      <input type="checkbox" checked={data.consentComms} onChange={e => updateField('consentComms', e.target.checked)} />
                      <span>{dict.consentCommunications}</span>
                    </label>
                  </div>
                  {errors.consentData && <span className="form-error center-error">{errors.consentData}</span>}
                </div>
              )}

              {/* ━━━ Navigation ━━━ */}
              <div className="form-nav">
                {step > 1 && (
                  <button type="button" className="btn-secondary" onClick={handleBack} id="btn-back">
                    ← {dict.btnBack}
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {step < TOTAL_STEPS ? (
                  <button type="button" className="btn-primary" onClick={handleNext} id="btn-next">
                    {dict.btnNext} →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary submit-btn"
                    onClick={handleSubmit}
                    disabled={!data.consentData}
                    id="btn-submit"
                  >
                    {dict.btnSubmit} ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .register-main { padding: 2rem 0 3rem; flex: 1; background: var(--color-surface-secondary); }
        .reg-wrapper { max-width: 640px; margin: 0 auto; }
        .reg-header { text-align: center; margin-bottom: 1.5rem; }
        .reg-title { font-size: 1.5rem; font-weight: 800; color: var(--color-text); }
        .reg-step-label { font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.25rem; }
        .reg-card { padding: 2rem; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-error { display: block; font-size: 0.8rem; color: var(--color-error); margin-top: 0.25rem; }
        .center-error { text-align: center; margin-top: 1rem; }

        .step-question { font-size: 1.25rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem; }

        /* Option grid for work types */
        .option-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .option-btn {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          padding: 1rem 0.75rem; border-radius: var(--radius-lg);
          border: 2px solid var(--color-border); background: var(--color-surface);
          cursor: pointer; transition: all var(--transition-fast); text-align: center;
        }
        .option-btn:hover { border-color: var(--color-primary); background: var(--color-primary-light); }
        .option-btn.selected { border-color: var(--color-primary); background: var(--color-primary-light); box-shadow: var(--shadow-glow); }
        .option-emoji { font-size: 1.75rem; }
        .option-label { font-size: 0.8rem; font-weight: 600; color: var(--color-text); }

        /* Choice list for yes/no */
        .choice-list { display: flex; flex-direction: column; gap: 0.75rem; max-width: 400px; margin: 0 auto; }
        .choice-btn {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.25rem; border-radius: var(--radius-lg);
          border: 2px solid var(--color-border); background: var(--color-surface);
          cursor: pointer; transition: all var(--transition-fast); text-align: left;
          width: 100%;
        }
        .choice-btn:hover { border-color: var(--color-primary); background: var(--color-primary-light); }
        .choice-btn.selected { border-color: var(--color-primary); background: var(--color-primary-light); box-shadow: var(--shadow-glow); }
        .choice-emoji { font-size: 1.5rem; }
        .choice-label { font-size: 1rem; font-weight: 600; }

        /* Review summary */
        .review-summary {
          background: var(--color-surface-secondary); border-radius: var(--radius-lg);
          padding: 1.25rem; margin-bottom: 1.5rem;
        }
        .review-row { padding: 0.4rem 0; font-size: 0.9rem; border-bottom: 1px solid var(--color-border); }
        .review-row:last-child { border-bottom: none; }

        /* Consent checkboxes */
        .consent-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .consent-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.75rem; border-radius: var(--radius-md);
          cursor: pointer; transition: background var(--transition-fast);
        }
        .consent-item:hover { background: var(--color-surface-secondary); }
        .consent-item input[type="checkbox"] {
          width: 1.25rem; height: 1.25rem; margin-top: 0.125rem;
          accent-color: var(--color-primary); cursor: pointer; flex-shrink: 0;
        }
        .consent-item span { font-size: 0.9rem; line-height: 1.5; color: var(--color-text); }

        /* Navigation */
        .form-nav { display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        @media (max-width: 768px) {
          .option-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row { grid-template-columns: 1fr; }
          .reg-card { padding: 1.5rem; }
        }
      `}</style>
    </>
  );
}
