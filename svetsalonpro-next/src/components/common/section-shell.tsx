import { cn } from '@/lib/utils';
import { Container } from './container';

interface SectionShellProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  padding?: 'default' | 'compact';
}

export function SectionShell({ id, className, children, padding = 'default' }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 sm:py-20 lg:py-24',
        padding === 'compact' && 'py-12 sm:py-16 lg:py-20',
        className
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
