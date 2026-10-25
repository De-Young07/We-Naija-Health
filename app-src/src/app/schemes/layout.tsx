import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Insurance Schemes — WeNaijaHealth',
  description: 'Explore verified health insurance schemes available for informal workers in Nigeria. Compare eligibility, costs, and benefits.',
};

export default function SchemesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
