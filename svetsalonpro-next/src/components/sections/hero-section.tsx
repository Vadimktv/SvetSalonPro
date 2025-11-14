"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { averageRating } from '@/data/reviews';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { FadeIn } from '@/components/common/fade-in';
import { resolveAppRoute } from '@/lib/utils';

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden pb-12 pt-24 sm:pt-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-radial" aria-hidden />
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-neutral-600 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              Премиальный салон в центре Геленджика
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
              Красота, созданная командой мастеров международного уровня
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-neutral-600 sm:text-xl">
              Мы работаем с волосами, кожей и стилем комплексно: сложное окрашивание, маникюр, glow-уходы и макияж для особых событий. Всё в одном пространстве.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href={resolveAppRoute('#booking')}>Записаться онлайн</Link>
              </Button>
              <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-neutral-900">{averageRating.toFixed(1)}</span>
                  <span className="text-xs uppercase tracking-wide text-neutral-400">рейтинг на платформах</span>
                </div>
                <div className="h-10 w-px bg-neutral-200" aria-hidden />
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-neutral-900">2014</span>
                  <span className="text-xs uppercase tracking-wide text-neutral-400">год основания</span>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div className="grid gap-4 text-sm text-neutral-600 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
                <h3 className="text-base font-semibold text-neutral-900">Сервис класса lounge</h3>
                <p>Персональный beauty-консьерж, напитки, музыка, приватные зоны для гостей.</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
                <h3 className="text-base font-semibold text-neutral-900">Сильная команда</h3>
                <p>Мастера с опытом съёмок, обучений и побед в конкурсах. Регулярно стажируемся у лидеров индустрии.</p>
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -left-10 -top-10 hidden h-32 w-32 rounded-full bg-rose-200/50 blur-3xl lg:block" aria-hidden />
            <Image
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80"
              alt="Команда мастеров SvetSalonPro"
              width={960}
              height={1200}
              priority
              className="glass-panel h-full w-full rounded-[36px] object-cover"
            />
            <div className="absolute bottom-6 left-6 flex w-[min(320px,70%)] flex-col gap-3 rounded-3xl bg-white/80 p-4 text-sm text-neutral-700 shadow-lg backdrop-blur">
              <p className="font-semibold text-neutral-900">Индивидуальные beauty-планы</p>
              <p className="text-xs text-neutral-500">
                Комбинируем услуги под ваши цели: сияющая кожа, идеальный блонд или свадебный total look.
              </p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                {siteConfig.contact.phone}
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </Container>
    </section>
  );
}
