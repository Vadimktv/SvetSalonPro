import { MapPin, Phone, MessageSquareText, Clock3 } from 'lucide-react';
import { SectionShell } from '@/components/common/section-shell';
import { SectionHeading } from '@/components/common/section-heading';
import { FadeIn } from '@/components/common/fade-in';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';

export function ContactsSection() {
  return (
    <SectionShell id="contacts" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <FadeIn>
          <SectionHeading
            eyebrow="Контакты"
            title="Приезжайте на чашку авторского латте"
            description="Мы находимся в тихом квартале Геленджика. Для гостей доступна парковка, гардероб и зона ожидания."
          />
          <div className="mt-8 space-y-4 text-sm text-neutral-600">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <p>
                {siteConfig.address.street}, {siteConfig.address.city}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-primary" />
              <div>
                <a href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, '')}`} className="font-semibold text-neutral-900">
                  {siteConfig.contact.phone}
                </a>
                <p className="text-xs text-neutral-400">Звонки и мессенджеры</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquareText className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-neutral-900">Мессенджеры</p>
                <p className="text-sm text-neutral-500">
                  <a href={siteConfig.contact.telegram} className="text-primary">
                    Telegram
                  </a>{' '}
                  •{' '}
                  <a href={siteConfig.contact.whatsapp} className="text-primary">
                    WhatsApp
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 h-5 w-5 text-primary" />
              <div>
                {siteConfig.workingHours.map((item) => (
                  <p key={item.day} className="text-sm text-neutral-500">
                    <span className="font-medium text-neutral-700">{item.day}:</span> {item.time}
                  </p>
                ))}
              </div>
            </div>
            <Button asChild className="mt-6">
              <a href="#booking">Записаться онлайн</a>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-[32px] border border-white/80 shadow-lg">
            <iframe
              title="SvetSalonPro на карте"
              src={`https://yandex.ru/map-widget/v1/?um=constructor%3A3a57c8b3210b5a5b12019cffd022b35a1e6a96db0fcb05dcca851c82b1f34570&source=constructor`}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
