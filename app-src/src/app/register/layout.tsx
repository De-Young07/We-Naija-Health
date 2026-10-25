import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — WeNaijaHealth',
  description: 'Register with WeNaijaHealth to explore health insurance options for informal workers in Nigeria.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
