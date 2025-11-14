'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'rounded-full bg-white/80 p-2 text-neutral-400 transition hover:bg-white hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-primary/60',
        className
      )}
      aria-label="Закрыть уведомление"
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
);
ToastClose.displayName = 'ToastClose';
