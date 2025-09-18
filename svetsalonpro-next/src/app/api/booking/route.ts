import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rate-limit';
import { sanitizeBookingPayload } from '@/lib/validators/booking';

const submissions: { id: string; createdAt: Date; data: ReturnType<typeof sanitizeBookingPayload> }[] = [];

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Слишком много запросов. Попробуйте через минуту.' },
      { status: 429, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let raw: unknown;

  try {
    raw = await request.json();
  } catch (error) {
    console.warn('[booking:parse-error]', error);
    return NextResponse.json({ error: 'Некорректное тело запроса' }, { status: 400 });
  }

  try {
    const payload = sanitizeBookingPayload(raw);

    const submission = {
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      data: payload
    };

    submissions.push(submission);

    console.info('[booking]', submission);

    return NextResponse.json(
      {
        success: true,
        message: 'Бронирование зарегистрировано',
        data: {
          ...payload,
          date: payload.date.toISOString()
        }
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[booking:error]', error);
    return NextResponse.json({ error: 'Не удалось обработать запись' }, { status: 400 });
  }
}
