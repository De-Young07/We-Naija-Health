// WeNaijaHealth — i18n index
// Exports all dictionaries and provides the translation hook

import { en } from './en';
import { pcm } from './pcm';
import { yo } from './yo';
import { ha } from './ha';
import { ig } from './ig';
import { Locale, TranslationDictionary, LOCALE_LIST, DEFAULT_LOCALE, LOCALE_NAMES } from './types';

export type { Locale, TranslationDictionary };
export { LOCALE_LIST, DEFAULT_LOCALE, LOCALE_NAMES };

const dictionaries: Record<Locale, TranslationDictionary> = {
  en,
  pcm,
  yo,
  ha,
  ig,
};

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

export function t(locale: Locale, key: keyof TranslationDictionary, replacements?: Record<string, string>): string {
  let value = getDictionary(locale)[key];
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, v);
    });
  }
  return value;
}
