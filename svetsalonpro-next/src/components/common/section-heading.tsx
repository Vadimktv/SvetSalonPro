import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-2xl space-y-4', align === 'center' && 'text-center')}>
      {eyebrow ? <Badge className="inline-flex bg-primary/10 text-primary" variant="primary">{eyebrow}</Badge> : null}
      <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="text-lg text-neutral-500">{description}</p> : null}
    </div>
  );
}
