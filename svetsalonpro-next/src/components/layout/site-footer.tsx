import Link from 'next/link';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/common/container';
import { Button } from '@/components/ui/button';
import { resolveAppRoute } from '@/lib/utils';

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/60 bg-white/70 pt-16 pb-10 backdrop-blur-xl">
      <Container className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-6">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">SvetSalonPro</span>
            <p className="mt-3 text-lg text-neutral-600">
              Салон красоты премиум-класса в Геленджике. Команда стилистов, косметологов и визажистов подберёт решения под ваш стиль и образ жизни.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-500">
              <Send className="h-4 w-4" />
              {siteConfig.contact.telegram.replace('https://', '')}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-500">
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Навигация</h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={resolveAppRoute(item.href)} className="transition hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="transition hover:text-primary">
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4 text-sm text-neutral-600">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Контакты</h3>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {siteConfig.address.street}, {siteConfig.address.city}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, '')}`} className="hover:text-primary">
              {siteConfig.contact.phone}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary">
              {siteConfig.contact.email}
            </a>
          </p>
          <div className="space-y-1">
            {siteConfig.workingHours.map((item) => (
              <p key={item.day} className="text-neutral-500">
                <span className="font-medium text-neutral-600">{item.day}:</span> {item.time}
              </p>
            ))}
          </div>
          <Button asChild variant="primary" className="mt-4">
            <Link href={resolveAppRoute('#booking')}>Записаться</Link>
          </Button>
        </div>
      </Container>
      <div className="mt-12 border-t border-white/70 pt-6">
        <Container className="flex flex-col gap-2 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SvetSalonPro. Все права защищены.</p>
          <p>Сайт разработан с акцентом на доступность и производительность.</p>
        </Container>
      </div>
    </footer>
  );
}
