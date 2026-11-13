import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — HealthSure Connect',
  description: 'How HealthSure Connect collects, protects, and handles participant health insurance navigation data in compliance with the Nigeria Data Protection Act (NDPA).',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

