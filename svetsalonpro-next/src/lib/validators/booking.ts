import { z } from 'zod';

const baseSchema = {
  categoryId: z.string().min(1, 'Выберите направление'),
  serviceId: z.string().min(1, 'Выберите услугу'),
  masterId: z.string().min(1, 'Укажите мастера'),
  time: z.string().min(1, 'Укажите время'),
  name: z.string().min(2, 'Введите имя').max(60),
  phone: z
    .string()
    .min(10, 'Введите номер телефона')
    .regex(/^[+\d\s()-]{10,}$/i, 'Допустимы только цифры и символы + - ( )'),
  comment: z.string().max(300, 'Максимум 300 символов').optional().or(z.literal('')),
  honeypot: z.string().max(0, 'Форма заполнена некорректно').optional()
};

export const bookingFormSchema = z.object({
  ...baseSchema,
  date: z.date({ required_error: 'Выберите дату визита' })
});

export const bookingApiSchema = z.object({
  ...baseSchema,
  date: z
    .string()
    .min(1, 'Выберите дату визита')
    .transform((value) => new Date(value))
    .refine((date) => !Number.isNaN(date.getTime()), 'Неверный формат даты')
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type BookingPayload = z.infer<typeof bookingApiSchema> & { date: Date };

export function sanitizeBookingPayload(payload: unknown) {
  const formatted = bookingApiSchema.parse(payload);
  const safe = (({ honeypot, ...rest }) => {
    void honeypot;
    return rest;
  })(formatted);
  return {
    ...safe,
    date: formatted.date,
    phone: formatted.phone.replace(/[^+\d]/g, ''),
    comment: formatted.comment?.trim() ?? ''
  } satisfies BookingPayload;
}
