import Image from 'next/image';
import { Sparkle } from 'lucide-react';
import { masters } from '@/data/masters';
import { SectionShell } from '@/components/common/section-shell';
import { SectionHeading } from '@/components/common/section-heading';
import { FadeIn } from '@/components/common/fade-in';
import { Badge } from '@/components/ui/badge';

export function MastersSection() {
  return (
    <SectionShell id="masters" className="bg-white/60">
      <SectionHeading
        eyebrow="Команда"
        title="Мастера, которым доверяют сложные задачи"
        description="Каждый специалист проходит авторские обучения и стажировки. Мы синхронизируемся как команда, чтобы создавать цельные образы."
        align="center"
      />
      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {masters.map((master, index) => (
          <FadeIn key={master.id} delay={index * 0.08}>
            <article className="group flex h-full flex-col rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative overflow-hidden rounded-3xl">
                <Image
                  src={master.image.src}
                  alt={master.name}
                  width={master.image.width}
                  height={master.image.height}
                  className="h-80 w-full rounded-3xl object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Sparkle className="h-3.5 w-3.5" />
                  {master.experience}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">{master.name}</h3>
                  <p className="text-sm text-neutral-500">{master.role}</p>
                </div>
                <p className="text-sm text-neutral-600">{master.description}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {master.specialties.map((item) => (
                    <Badge key={item} variant="outline" className="border-rose-100 bg-rose-50 text-rose-500">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
