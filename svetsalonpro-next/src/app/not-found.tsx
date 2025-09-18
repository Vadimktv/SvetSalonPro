import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center bg-white/80">
      <Container className="space-y-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Страница не найдена</h1>
        <p className="text-neutral-600">
          Возможно, страница была перемещена или удалена. Вернитесь на главную или воспользуйтесь меню.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
