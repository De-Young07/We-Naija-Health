'use client';

import { ReactNode } from 'react';
import { LocaleProvider } from '@/lib/locale-context';

export function ClientProviders({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
