import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SmartYatra | AI-Powered Personalized Tourism Platform',
  description:
    'Discover authentic destinations across India, explore verified history and specialities, calculate realistic budgets, and plan AI-powered trips with full privacy controls.',
  keywords: [
    'SmartYatra',
    'India Tourism',
    'Travel Planner',
    'AI Travel Itinerary',
    'Budget Calculator',
    'Jaipur',
    'Varanasi',
    'Munnar',
    'Ladakh',
    'Hampi',
    'Rishikesh',
  ],
  authors: [{ name: 'SmartYatra Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
