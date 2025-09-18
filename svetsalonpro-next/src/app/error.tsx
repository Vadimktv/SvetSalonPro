'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center bg-white/80">
      <Container className="space-y-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">500</p>
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Что-то пошло не так</h1>
        <p className="text-neutral-600">
          Мы уже работаем над устранением проблемы. Попробуйте обновить страницу или вернуться на главную.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Обновить</Button>
          <Button asChild variant="outline">
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
