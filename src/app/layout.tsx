import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NyayaConnect – Legal Guidance You Can Trust',
  description:
    'Describe your legal issue securely and receive professional consultation from experienced Indian advocates. Confidential, transparent, and fast response.',
  keywords: 'legal consultation India, advocate, lawyer, legal advice, NyayaConnect',
  authors: [{ name: 'NyayaConnect' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NyayaConnect',
  },
  openGraph: {
    title: 'NyayaConnect – Legal Guidance You Can Trust',
    description: 'Describe your legal issue securely and receive professional consultation.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
