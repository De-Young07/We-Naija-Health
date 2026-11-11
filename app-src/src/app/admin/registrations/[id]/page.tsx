'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface FollowUpItem {
  id: string;
  type: string;
  outcome: string;
  notes: string;
  nextActionDate?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface RegistrationDetail {
  id: string;
  referenceNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  state: string;
  lga?: string;
  community?: string;
  preferredContact: string;
  workerType: string;
  workerTypeOther?: string;
  currentInsurance: string;
  coveragePreference: string;
  consentDataUsage: boolean;
  consentSharing: boolean;
  status: string;
  notes?: string;
  locale: string;
  createdAt: string;
  followUps?: FollowUpItem[];
}

export default function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [reg, setReg] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // New follow-up form state
  const [fType, setFType] = useState('PHONE_CALL');
  const [fOutcome, setFOutcome] = useState('REACHED');
  const [fNotes, setFNotes] = useState('');
  const [fNextDate, setFNextDate] = useState('');
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);
  const [followUpSuccess, setFollowUpSuccess] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/registrations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReg(data);
      }
    } catch (err) {
      console.error('Failed to load participant detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fNotes.trim()) return;

    setSubmittingFollowUp(true);
    setFollowUpSuccess(false);

    try {
      const res = await fetch('/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: id,
          type: fType,
          outcome: fOutcome,
          notes: fNotes.trim(),
          nextActionDate: fNextDate ? new Date(fNextDate).toISOString() : undefined,
        }),
      });

      if (res.ok) {
        setFNotes('');
        setFNextDate('');
        setFollowUpSuccess(true);
        setTimeout(() => setFollowUpSuccess(false), 3000);
        await loadData();
      }
    } catch (err) {
      console.error('Failed to log follow-up:', err);
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        Loading participant profile...
      </div>
    );
  }

  if (!reg) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Registration Not Found</h2>
        <Link href="/admin/registrations" style={{ color: '#008751', fontWeight: 600 }}>
          ← Back to Registrations Pipeline
        </Link>
      </div>
    );
  }

  const cleanPhone = reg.phone.replace(/\D/g, '');
  const intlPhone = cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : cleanPhone;

  // Pre-formatted messages for WhatsApp quick outreach
  const waIntroEnglish = encodeURIComponent(
    `Hello ${reg.fullName}, thank you for registering on WeNaijaHealth! Your reference code is ${reg.referenceNumber}. I'm reaching out to help connect you with KwaraCare / NHIA health coverage near ${reg.lga || reg.state}. When is a good time for a quick 2-minute phone call?`
  );

  const waIntroPidgin = encodeURIComponent(
    `Kóóyo ${reg.fullName}! Thank you as you register on WeNaijaHealth (Ref: ${reg.referenceNumber}). We dey reach out to help you get KwaraCare / NHIA health insurance make hospital bills no choke your business. When you go free make we give you short 2-minute call?`
  );

  const waChecklist = encodeURIComponent(
    `📋 Document Checklist for ${reg.fullName} (Ref: ${reg.referenceNumber}):\n1. 11-digit NIN (Card or slip)\n2. 1 Passport photo (or our agent will snap you)\n3. Contribution (₦1,500/month or ₦15,500/year for KwaraCare)\nNearest Clinic: Contact our care line for directions.`
  );

  return (
    <div className="detail-container">
      {/* Breadcrumb & Navigation */}
      <div className="breadcrumb-nav">
        <Link href="/admin/registrations" className="back-link">
          ← Registrations Pipeline
        </Link>
        <span className="ref-pill">Ref: {reg.referenceNumber}</span>
      </div>

      {/* Main Grid: Left Profile + Right Triage Console */}
      <div className="content-grid">
        {/* Left Column: Participant Profile */}
        <div className="profile-col">
          <div className="card profile-card">
            <div className="profile-header">
              <div>
                <h1 className="participant-name">{reg.fullName}</h1>
                <p className="participant-category">
                  {reg.workerType.replace('_', ' ')} • {reg.state}
                  {reg.lga ? `, ${reg.lga}` : ''}
                </p>
              </div>
              <div className="status-selector-box">
                <label className="selector-label">STATUS</label>
                <select
                  value={reg.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="status-dropdown"
                >
                  <option value="NEW">New (Requires Contact)</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DOCUMENTS_READY">Documents Ready</option>
                  <option value="ENROLLMENT_SCHEDULED">Enrollment Scheduled</option>
                  <option value="ENROLLED">Enrolled 🎉</option>
                  <option value="DROPPED">Dropped</option>
                </select>
              </div>
            </div>

            {/* Quick Action Dialers */}
            <div className="actions-dialer">
              <a href={`tel:${reg.phone}`} className="dialer-btn phone">
                📞 Call ({reg.phone})
              </a>
              <a
                href={`https://wa.me/${intlPhone}?text=${waIntroEnglish}`}
                target="_blank"
                rel="noopener noreferrer"
                className="dialer-btn wa"
              >
                💬 WhatsApp (English)
              </a>
              <a
                href={`https://wa.me/${intlPhone}?text=${waIntroPidgin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="dialer-btn wa-pidgin"
              >
                💬 WhatsApp (Pidgin)
              </a>
            </div>

            {/* Detail Spec */}
            <div className="spec-section">
              <h3 className="section-title">Registration Details</h3>
              <dl className="spec-list">
                <div className="spec-row">
                  <dt>Phone Number</dt>
                  <dd>
                    <a href={`tel:${reg.phone}`} style={{ color: '#0284c7', fontWeight: 700 }}>
                      {reg.phone}
                    </a>
                  </dd>
                </div>
                {reg.email && (
                  <div className="spec-row">
                    <dt>Email</dt>
                    <dd>{reg.email}</dd>
                  </div>
                )}
                <div className="spec-row">
                  <dt>Location</dt>
                  <dd>
                    {reg.state}
                    {reg.lga ? ` (LGA: ${reg.lga})` : ''}
                    {reg.community ? ` • ${reg.community}` : ''}
                  </dd>
                </div>
                <div className="spec-row">
                  <dt>Work Category</dt>
                  <dd>
                    {reg.workerType.replace('_', ' ')}
                    {reg.workerTypeOther ? ` (${reg.workerTypeOther})` : ''}
                  </dd>
                </div>
                <div className="spec-row">
                  <dt>Current Insurance</dt>
                  <dd>{reg.currentInsurance}</dd>
                </div>
                <div className="spec-row">
                  <dt>Coverage Desired</dt>
                  <dd>
                    <span className="cov-badge">
                      {reg.coveragePreference === 'FAMILY' ? 'Family (Household)' : 'Individual'}
                    </span>
                  </dd>
                </div>
                <div className="spec-row">
                  <dt>Preferred Contact</dt>
                  <dd>{reg.preferredContact.toUpperCase()}</dd>
                </div>
                <div className="spec-row">
                  <dt>Registered Date</dt>
                  <dd>
                    {new Date(reg.createdAt).toLocaleString('en-GB', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick Scripts Accordion */}
            <div className="scripts-box">
              <h4 className="scripts-box-title">📋 One-Click WhatsApp Templates</h4>
              <div className="script-buttons">
                <a
                  href={`https://wa.me/${intlPhone}?text=${waChecklist}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="script-btn"
                >
                  Send Document Preparation Checklist →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Follow-Up Action Logging + History */}
        <div className="workflow-col">
          {/* New Follow-up Form */}
          <div className="card log-card">
            <h2 className="log-title">Log Follow-Up Interaction</h2>
            <p className="log-desc">
              Every contact attempt is recorded in the permanent audit trail to maintain our 24h SLA.
            </p>

            <form onSubmit={handleAddFollowUp} className="log-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Channel</label>
                  <select
                    value={fType}
                    onChange={(e) => setFType(e.target.value)}
                    className="form-input"
                  >
                    <option value="PHONE_CALL">📞 Phone Call</option>
                    <option value="WHATSAPP">💬 WhatsApp</option>
                    <option value="IN_PERSON">🤝 In-Person (Market Visit)</option>
                    <option value="SMS">📱 SMS</option>
                    <option value="INTERNAL_NOTE">📝 Internal Note Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Call / Interaction Outcome</label>
                  <select
                    value={fOutcome}
                    onChange={(e) => setFOutcome(e.target.value)}
                    className="form-input"
                  >
                    <option value="REACHED">Reached — In Discussion</option>
                    <option value="NOT_REACHED">Not Reached (No Answer/Switched Off)</option>
                    <option value="CALLBACK_REQUESTED">Callback Requested by Participant</option>
                    <option value="DOCUMENTS_SHARED">Documents Checklist Sent</option>
                    <option value="ENROLLMENT_SCHEDULED">Enrollment Appointment Fixed</option>
                    <option value="ENROLLED">Enrolled Verified (Card Issued)</option>
                    <option value="DROPPED">Dropped / Not Interested</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Call Summary & Notes *</label>
                <textarea
                  rows={3}
                  value={fNotes}
                  onChange={(e) => setFNotes(e.target.value)}
                  placeholder="e.g. Spoke with participant in Yoruba. Confirmed she has NIN slip. Suggested KwaraCare at Unity Road PHC. Agreed to meet market agent on Thursday."
                  className="form-input textarea"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Next Action Date (Optional)</label>
                  <input
                    type="date"
                    value={fNextDate}
                    onChange={(e) => setFNextDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group submit-col">
                  <button
                    type="submit"
                    disabled={submittingFollowUp || !fNotes.trim()}
                    className="btn-submit-followup"
                  >
                    {submittingFollowUp ? 'Saving...' : 'Save Follow-Up Entry ✓'}
                  </button>
                </div>
              </div>

              {followUpSuccess && (
                <div className="alert-success">
                  ✓ Follow-up logged successfully and status updated!
                </div>
              )}
            </form>
          </div>

          {/* Follow-Up Timeline */}
          <div className="card timeline-card">
            <h3 className="timeline-title">
              Audit Trail & Contact History ({reg.followUps?.length || 0})
            </h3>

            {(!reg.followUps || reg.followUps.length === 0) ? (
              <p className="empty-timeline">
                No follow-up logged yet. Reach out via Call or WhatsApp above, then log the conversation outcome.
              </p>
            ) : (
              <div className="timeline-list">
                {reg.followUps.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-header">
                      <span className="outcome-tag">{item.outcome.replace('_', ' ')}</span>
                      <span className="channel-tag">{item.type.replace('_', ' ')}</span>
                      <span className="timestamp">
                        {new Date(item.createdAt).toLocaleString('en-GB', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    <p className="timeline-notes">{item.notes}</p>
                    {item.nextActionDate && (
                      <p className="next-action">
                        📅 Next follow-up due: {new Date(item.nextActionDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-link {
          color: #008751;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
        }

        .ref-pill {
          background: #e2e8f0;
          color: #334155;
          font-family: monospace;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .profile-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1rem;
        }

        .participant-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .participant-category {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0.2rem 0 0;
        }

        .status-selector-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .selector-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .status-dropdown {
          flex: 1;
          padding: 0.45rem 0.65rem;
          border: 2px solid #008751;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          color: #008751;
          background: #ffffff;
          outline: none;
        }

        .actions-dialer {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dialer-btn {
          display: block;
          text-align: center;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: transform 0.1s;
        }

        .dialer-btn:active {
          transform: scale(0.98);
        }

        .dialer-btn.phone {
          background: #008751;
          color: white;
        }

        .dialer-btn.wa {
          background: #25d366;
          color: white;
        }

        .dialer-btn.wa-pidgin {
          background: #128c7e;
          color: white;
        }

        .spec-section {
          border-top: 1px solid #f1f5f9;
          padding-top: 1rem;
        }

        .section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.75rem;
        }

        .spec-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.85rem;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #f1f5f9;
          padding-bottom: 0.35rem;
        }

        .spec-row dt {
          color: #64748b;
        }

        .spec-row dd {
          font-weight: 600;
          color: #0f172a;
          margin: 0;
          text-align: right;
        }

        .cov-badge {
          background: #f1f5f9;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .scripts-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.85rem;
        }

        .scripts-box-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          margin: 0 0 0.5rem;
        }

        .script-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .script-btn {
          font-size: 0.78rem;
          color: #008751;
          font-weight: 700;
          text-decoration: underline;
        }

        .workflow-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .log-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }

        .log-desc {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0 0 1rem;
        }

        .log-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
        }

        .form-input {
          padding: 0.55rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
          outline: none;
        }

        .form-input:focus {
          border-color: #008751;
        }

        .textarea {
          resize: vertical;
          font-family: inherit;
        }

        .submit-col {
          justify-content: flex-end;
        }

        .btn-submit-followup {
          background: #008751;
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-submit-followup:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          padding: 0.65rem 0.85rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .timeline-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 1rem;
          color: #0f172a;
        }

        .empty-timeline {
          font-size: 0.85rem;
          color: #94a3b8;
          font-style: italic;
          margin: 0;
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .timeline-item {
          background: #f8fafc;
          border-left: 3px solid #008751;
          border-radius: 0 8px 8px 0;
          padding: 0.85rem;
        }

        .timeline-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.35rem;
        }

        .outcome-tag {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .channel-tag {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .timestamp {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-left: auto;
        }

        .timeline-notes {
          font-size: 0.82rem;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        .next-action {
          font-size: 0.75rem;
          color: #b45309;
          font-weight: 600;
          margin: 0.4rem 0 0;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

