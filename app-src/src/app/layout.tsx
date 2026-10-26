import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";

export const metadata: Metadata = {
  title: "WeNaijaHealth — Your Work Shouldn't Cost You Your Health",
  description:
    "WeNaijaHealth helps informal workers across Nigeria explore health insurance options, find official registration pathways, and get support through the process. Available in English, Pidgin, Yorùbá, Hausa, and Igbo.",
  keywords: [
    "WeNaijaHealth",
    "health insurance Nigeria",
    "informal workers",
    "market traders",
    "KwaraCare",
    "NHIA",
    "NHIS",
    "health coverage Nigeria",
  ],
  openGraph: {
    title: "WeNaijaHealth — Your Work Shouldn't Cost You Your Health",
    description:
      "Helping informal workers discover, understand, and access health insurance in Nigeria.",
    type: "website",
    locale: "en_NG",
    images: [{ url: "/wenaijahealth-logo.jpeg", width: 1280, height: 440, alt: "WeNaijaHealth" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/wenaijahealth-logo.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="theme-color" content="#008751" />
        {/* Load Inter font via Google Fonts CDN — gracefully degrades to system fonts if offline */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
