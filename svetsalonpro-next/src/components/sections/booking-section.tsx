'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { CalendarIcon, ShieldCheck, Sparkle } from 'lucide-react';
import { SectionShell } from '@/components/common/section-shell';
import { SectionHeading } from '@/components/common/section-heading';
import { FadeIn } from '@/components/common/fade-in';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { bookingServices, bookingMasters, bookingTimeSlots } from '@/data/booking';
import { serviceCategories } from '@/data/services';
import { toast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import { bookingFormSchema, type BookingFormValues } from '@/lib/validators/booking';

export function BookingSection() {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      categoryId: '',
      serviceId: '',
      masterId: '',
      date: undefined,
      time: '',
      name: '',
      phone: '',
      comment: '',
      honeypot: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const categoryId = form.watch('categoryId');
  const selectedCategory = React.useMemo(() => serviceCategories.find((category) => category.id === categoryId), [categoryId]);

  const availableServices = React.useMemo(() => {
    if (!selectedCategory) return [];
    return selectedCategory.services;
  }, [selectedCategory]);

  const availableMasters = React.useMemo(() => {
    if (!categoryId) return [];
    return bookingMasters.filter((master) => master.categories.includes(categoryId));
  }, [categoryId]);

  React.useEffect(() => {
    if (!selectedCategory) {
      form.setValue('serviceId', '');
    } else if (!availableServices.some((service) => service.id === form.getValues('serviceId'))) {
      form.setValue('serviceId', '');
    }
  }, [selectedCategory, availableServices, form]);

  React.useEffect(() => {
    if (!categoryId) {
      form.setValue('masterId', '');
      return;
    }

    if (!availableMasters.some((master) => master.value === form.getValues('masterId'))) {
      form.setValue('masterId', '');
    }
  }, [availableMasters, categoryId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (values.honeypot) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        date: values.date?.toISOString() ?? '',
        comment: values.comment ?? ''
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Не удалось отправить заявку');
      }

      form.reset();
      toast({
        title: 'Заявка отправлена',
        description: 'Администратор свяжется с вами в течение 10 минут для подтверждения записи.',
        variant: 'success'
      });
    } catch (error) {
      console.error('[booking:client-error]', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке. Попробуйте позже или позвоните администратору.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const minDate = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  return (
    <SectionShell id="booking" className="bg-white/90">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeIn>
          <SectionHeading
            eyebrow="Онлайн-запись"
            title="Резервируем удобное время в пару кликов"
            description="После отправки заявки мы подтвердим детали по телефону или в мессенджере. Данные защищены и не передаются третьим лицам."
          />
          <div className="mt-8 space-y-6 text-sm text-neutral-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
              <p>Используем двукратную стерилизацию инструментов, сертифицированные расходники и ведём историю посещений.</p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkle className="mt-1 h-5 w-5 text-primary" />
              <p>Beauty-консьерж подберёт напитки и музыку, а также поможет продлить эффект процедур домашним уходом.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-neutral-900">Предпочитаете голосом?</p>
              <p className="text-sm text-neutral-500">
                Позвоните по номеру{' '}
                <a href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, '')}`} className="font-semibold text-primary">
                  {siteConfig.contact.phone}
                </a>{' '}
                или напишите в{' '}
                <a href={siteConfig.contact.whatsapp} className="font-semibold text-primary">
                  WhatsApp
                </a>
                .
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-lg backdrop-blur">
            <Form {...form}>
              <form className="space-y-6" onSubmit={onSubmit}>
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Направление</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите направление" />
                          </SelectTrigger>
                          <SelectContent>
                            {bookingServices.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Услуга</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Сначала выберите направление" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableServices.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="masterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Мастер</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!categoryId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите мастера" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMasters.map((master) => (
                              <SelectItem key={master.value} value={master.value}>
                                {master.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Дата</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-12 justify-between"
                              >
                                {field.value ? format(field.value, 'd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
                                <CalendarIcon className="h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="p-4">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < minDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Время</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!form.getValues('date')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите время" />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingTimeSlots.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder="Как к вам обращаться" autoComplete="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="+7 (___) ___-__-__" autoComplete="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Комментарий (по желанию)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Расскажите, чего хотите достичь, или добавьте ссылку на референс" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="honeypot"
                  render={({ field }) => (
                    <Input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...field} />
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
                </Button>

                <p className="text-xs text-neutral-400">
                  Нажимая «Отправить заявку», вы соглашаетесь с{' '}
                  <a href="/privacy" className="text-primary underline">
                    Политикой конфиденциальности
                  </a>
                  .
                </p>
              </form>
            </Form>
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
