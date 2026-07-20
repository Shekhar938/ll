import type { Metadata, Viewport } from 'next';
import './globals.css';
import DisclaimerModal from '@/components/DisclaimerModal';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'Nyaya Aastha – Legal Guidance You Can Trust',
  description:
    'Connect with Advocate Aastha. Secure, private, and transparent legal guidance at your fingertips.',
  keywords: 'legal consultation India, advocate, lawyer, legal advice, Aastha',
  authors: [{ name: 'Advocate Aastha' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nyaya Aastha',
  },
  openGraph: {
    title: 'Nyaya Aastha – Legal Guidance You Can Trust',
    description: 'Secure, private, and transparent legal guidance by Advocate Aastha.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://nyayaaastha.in',
    siteName: 'Nyaya Aastha – Legal Guidance You Can Trust',
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
      <body>
        <LanguageProvider>
          <DisclaimerModal />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
