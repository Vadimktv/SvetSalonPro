import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { AnalyticsScripts } from '@/components/layout/analytics-scripts';
import { StructuredData } from '@/components/layout/structured-data';
import { Toaster } from '@/components/ui/toaster';
import { DefaultSeoProvider } from '@/components/layout/default-seo-provider';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — салон красоты в Геленджике`,
    template: '%s — SvetSalonPro'
  },
  description: siteConfig.description,
  keywords: [
    'салон красоты',
    'Геленджик',
    'парикмахерские услуги',
    'маникюр',
    'макияж',
    'косметология',
    'запись онлайн'
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Beauty',
  alternates: {
    canonical: '/' 
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/api/icon/apple', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: `${siteConfig.name} — салон красоты в Геленджике`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/api/og`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — салон красоты`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image'
  }
};

export const viewport: Viewport = {
  themeColor: '#ec4899',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body
        className={cn(
          'relative min-h-screen bg-gradient-to-b from-slate-50/90 via-white to-rose-50/80 text-slate-900 antialiased',
          manrope.variable
        )}
      >
        <DefaultSeoProvider />
        <a
          href="#main"
          className="absolute left-4 top-4 z-[100] -translate-y-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white focus:translate-y-0 focus:outline-none"
        >
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main" className="flex min-h-screen flex-col">
          {children}
        </main>
        <SiteFooter />
        <Toaster />
        <StructuredData />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
