import { ArrowRight, Clock3, Sparkles } from 'lucide-react';
import { serviceCategories } from '@/data/services';
import { SectionShell } from '@/components/common/section-shell';
import { SectionHeading } from '@/components/common/section-heading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/common/fade-in';

export function ServicesSection() {
  return (
    <SectionShell id="services" className="overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white via-white/80 to-transparent" aria-hidden />
      <SectionHeading
        eyebrow="Услуги"
        title="Beauty-сервисы, собранные в одном пространстве"
        description="Комбинируйте парикмахерские услуги, маникюр, косметологию и макияж в один визит. Персональный консультант составит план, учитывая ваш образ жизни."
        align="center"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {serviceCategories.map((category, index) => (
          <FadeIn key={category.id} delay={index * 0.05}>
            <Card className="h-full overflow-hidden border-white/80 bg-white/70">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  {category.highlight}
                </div>
                <CardTitle className="text-2xl text-neutral-900">{category.title}</CardTitle>
                <CardDescription className="text-base text-neutral-500">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {category.services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-neutral-900">{service.name}</p>
                        <p className="text-sm text-neutral-500">{service.description}</p>
                      </div>
                      <div className="text-right text-sm font-semibold text-neutral-900">
                        от {service.priceFrom.toLocaleString('ru-RU')} ₽
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs font-medium text-neutral-400">
                          <Clock3 className="h-3.5 w-3.5" /> {service.duration} мин
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-between pt-4">
                <span className="text-sm font-medium text-neutral-500">Работаем с премиальными брендами и инструментами</span>
                <Button asChild variant="ghost" className="group text-sm font-semibold text-primary">
                  <a href="#booking" aria-label={`Записаться на услугу ${category.title}`}>
                    Выбрать услугу
                    <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
