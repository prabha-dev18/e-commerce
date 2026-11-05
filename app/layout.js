import { Instrument_Serif, DM_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Providers from '@/components/Providers';
import Storefront from '@/components/layout/Storefront';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata = {
  metadataBase: new URL(site),
  title: { default: 'Lumière | Premium Cosmetics', template: '%s | Lumière' },
  description: 'Authentic skincare, makeup, hair care and fragrance. Free shipping above ₹999.',
  openGraph: { type: 'website', siteName: 'Lumière', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};
export const viewport = { themeColor: '#F8F5F0', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>
          <Storefront>{children}</Storefront>
        </Providers>
        <Toaster position="top-center" toastOptions={{ style: { background: '#2A211D', color: '#F8F5F0', borderRadius: '999px' } }} />
      </body>
    </html>
  );
}
