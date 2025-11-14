'use client';

import * as React from 'react';
import Image from 'next/image';
import { SlidersHorizontal } from 'lucide-react';
import { portfolioCategories, portfolioItems } from '@/data/portfolio';
import { SectionShell } from '@/components/common/section-shell';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FadeIn } from '@/components/common/fade-in';

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [previewItem, setPreviewItem] = React.useState<typeof portfolioItems[number] | null>(null);

  const filteredItems = React.useMemo(() => {
    if (activeFilter === 'all') return portfolioItems;
    return portfolioItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <SectionShell id="portfolio" className="bg-white">
      <SectionHeading
        eyebrow="Портфолио"
        title="Сотни образов для повседневной жизни и событий"
        description="Все фотографии — работы нашей команды. Галерея пополняется каждую неделю, а оригиналы хранятся в облачном архиве."
        align="center"
      />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {portfolioCategories.map((category) => (
          <Button
            key={category.value}
            variant={activeFilter === category.value ? 'primary' : 'outline'}
            onClick={() => setActiveFilter(category.value)}
            className="rounded-full"
            aria-pressed={activeFilter === category.value}
          >
            {category.label}
          </Button>
        ))}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.05}>
            <button
              type="button"
              className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring focus-visible:ring-primary/60"
              onClick={() => setPreviewItem(item)}
            >
              <Image
                src={item.image.src}
                alt={item.title}
                width={item.image.width}
                height={item.image.height}
                className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-white/90 p-4 text-left text-sm text-neutral-700 shadow-lg">
                <p className="text-base font-semibold text-neutral-900">{item.title}</p>
                <p>{item.description}</p>
                <span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                  Смотрите детали
                </span>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-3xl bg-white/95 p-6">
          {previewItem ? (
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <Image
                src={previewItem.image.src}
                alt={previewItem.title}
                width={previewItem.image.width}
                height={previewItem.image.height}
                className="h-full max-h-[540px] w-full rounded-3xl object-cover"
                priority
              />
              <div className="space-y-3 text-sm text-neutral-600">
                <h3 className="text-xl font-semibold text-neutral-900">{previewItem.title}</h3>
                <p>{previewItem.description}</p>
                <p className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Категория: {portfolioCategories.find((cat) => cat.value === previewItem.category)?.label}
                </p>
                <p>
                  Советы по уходу и поддержанию образа вы получите сразу после процедуры. Наш администратор пришлёт рекомендации в WhatsApp.
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}
