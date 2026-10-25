'use client';

import { useLocale } from '@/lib/locale-context';
import { LOCALE_LIST, Locale } from '@/lib/i18n';

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

export function LanguageModal({ open, onClose }: LanguageModalProps) {
  const { locale, setLocale } = useLocale();

  if (!open) return null;

  const handleSelect = (code: Locale) => {
    setLocale(code);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="lang-modal-overlay">
      <div
        className="modal-content animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Select language"
        id="lang-modal"
      >
        <div className="modal-header">
          <h2 className="modal-title">🌐 Select Your Language</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close" id="lang-modal-close">
            ✕
          </button>
        </div>

        <div className="lang-grid">
          {LOCALE_LIST.map((lang) => (
            <button
              key={lang.code}
              className={`lang-card ${locale === lang.code ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.code)}
              id={`lang-option-${lang.code}`}
            >
              <span className="lang-name">{lang.name}</span>
              <span className="lang-prompt">{lang.nativePrompt}</span>
              {locale === lang.code && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }
        .modal-content {
          background: var(--color-surface);
          border-radius: var(--radius-2xl);
          max-width: 440px;
          width: 100%;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .modal-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
        }
        .modal-close {
          width: 2rem;
          height: 2rem;
          border-radius: var(--radius-full);
          border: none;
          background: var(--color-surface-secondary);
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }
        .modal-close:hover {
          background: var(--color-border);
        }
        .lang-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 1.5rem 1.5rem;
        }
        .lang-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-border);
          background: var(--color-surface);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          position: relative;
        }
        .lang-card:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }
        .lang-card.selected {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }
        .lang-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--color-text);
          min-width: 120px;
        }
        .lang-prompt {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          flex: 1;
        }
        .lang-check {
          color: var(--color-primary);
          font-weight: 700;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
}
