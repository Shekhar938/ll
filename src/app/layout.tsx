import type { Metadata, Viewport } from 'next';
import './globals.css';
import DisclaimerModal from '@/components/DisclaimerModal';
import ChatWidget from '@/components/ChatWidget';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'ClientFlow – Modern Client Management & Consultation Platform',
  description:
    'Secure, private, and streamlined client engagement, appointment scheduling, and portal management for modern businesses.',
  keywords: 'client management, consultation booking, client portal, CRM, business consulting, appointment scheduling',
  authors: [{ name: 'ClientFlow' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ClientFlow',
  },
  openGraph: {
    title: 'ClientFlow – Modern Client Management & Consultation Platform',
    description: 'Streamlined client intake, consultations, secure document sharing, and client portal for modern businesses.',
    type: 'website',
    locale: 'en_US',
    url: 'https://clientflow.app',
    siteName: 'ClientFlow – Client Management Platform',
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
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
