'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Locale, DEFAULT_LOCALE, TranslationDictionary, getDictionary } from '@/lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: TranslationDictionary;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  dict: getDictionary(DEFAULT_LOCALE),
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [dict, setDict] = useState<TranslationDictionary>(getDictionary(DEFAULT_LOCALE));

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wenaija-locale') as Locale | null;
    if (saved && ['en', 'pcm', 'yo', 'ha', 'ig'].includes(saved)) {
      setLocaleState(saved);
      setDict(getDictionary(saved));
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setDict(getDictionary(newLocale));
    localStorage.setItem('wenaija-locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
