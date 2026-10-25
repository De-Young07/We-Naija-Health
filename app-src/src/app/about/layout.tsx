import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — WeNaijaHealth',
  description: 'Learn about WeNaijaHealth, our mission, FAQs, and how to contact us for help with health insurance registration.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
