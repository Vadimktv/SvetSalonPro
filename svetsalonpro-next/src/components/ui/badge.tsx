import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-primary/15 text-primary',
        neutral: 'border-transparent bg-neutral-900 text-white',
        outline: 'border-neutral-200 bg-white text-neutral-800'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
