import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — WeNaijaHealth',
  description: 'Terms and conditions governing the use of WeNaijaHealth health insurance discovery and navigation services.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

