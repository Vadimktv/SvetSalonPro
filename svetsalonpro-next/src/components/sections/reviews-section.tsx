'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { reviews, averageRating } from '@/data/reviews';
import { SectionShell } from '@/components/common/section-shell';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';

export function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false });

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [emblaApi]);

  return (
    <SectionShell id="reviews" className="bg-white/60">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
        <SectionHeading
          eyebrow="Отзывы"
          title="Нас выбирают за качество и сервис"
          description={`Средняя оценка ${averageRating.toFixed(1)} на Яндекс.Картах, 2ГИС и Google. Мы прозрачно собираем обратную связь, чтобы усиливать сервис.`}
        />
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/80 bg-white/70 px-6 py-4 text-sm text-neutral-600 shadow-sm">
          <div className="flex items-center gap-2 text-2xl font-semibold text-neutral-900">
            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            {averageRating.toFixed(1)}
          </div>
          <span className="text-xs uppercase tracking-wide text-neutral-400">средний рейтинг</span>
          <span className="text-xs text-neutral-400">{reviews.length} отзывов</span>
        </div>
      </div>

      <div className="relative mt-12">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-6 flex">
            {reviews.map((review) => (
              <div key={review.id} className="min-w-0 flex-[0_0_85%] pl-6 md:flex-[0_0_50%] xl:flex-[0_0_33.333%]">
                <article className="flex h-full flex-col gap-4 rounded-[28px] border border-white/80 bg-white/80 p-6 text-sm text-neutral-600 shadow-sm backdrop-blur">
                  <Quote className="h-6 w-6 text-rose-300" />
                  <p className="text-base text-neutral-700">{review.text}</p>
                  <div className="mt-auto pt-4">
                    <p className="font-semibold text-neutral-900">{review.author}</p>
                    <p className="text-xs text-neutral-400">{review.source} • {new Date(review.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/90 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/90 to-transparent" aria-hidden />
        <div className="absolute -bottom-12 left-1/2 flex translate-x-[-50%] items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Предыдущий отзыв"
            className="pointer-events-auto"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Следующий отзыв"
            className="pointer-events-auto"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
