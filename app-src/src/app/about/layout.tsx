import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — HealthSure Connect',
  description: 'Learn about HealthSure Connect, our mission, FAQs, and how to contact us for help with health insurance registration.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
