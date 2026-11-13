import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — HealthSure Connect',
  description: 'Register with HealthSure Connect to explore health insurance options for informal workers in Nigeria.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
