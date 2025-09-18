import Link from 'next/link';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { resolveAppRoute } from '@/lib/utils';
import { MobileNav } from './mobile-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link href={resolveAppRoute('#hero')} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-200 via-rose-100 to-indigo-100 text-lg font-bold text-rose-600 shadow-inner">
            SS
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">SvetSalonPro</span>
            <p className="text-sm font-medium text-neutral-700">Красота класса премиум</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={resolveAppRoute(item.href)} className="nav-link text-sm font-medium">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, '')}`}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.contact.phone}
          </a>
          <Button asChild variant="primary">
            <Link href={resolveAppRoute('#booking')}>Онлайн-запись</Link>
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
