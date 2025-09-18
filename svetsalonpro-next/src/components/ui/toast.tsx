'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ToastClose } from './toast-close';

export type ToastActionElement = React.ReactElement<typeof ToastClose>;

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-neutral-100 bg-white/90 p-4 shadow-[0_20px_35px_-25px_rgba(236,72,153,0.65)] backdrop-blur-xl transition',
  {
    variants: {
      variant: {
        default: 'text-neutral-900',
        success: 'border-emerald-100 bg-emerald-50 text-emerald-900',
        destructive: 'border-rose-100 bg-rose-50 text-rose-900'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

type ToastElementProps = React.ComponentPropsWithoutRef<'div'>;

export interface ToastProps extends Omit<ToastElementProps, 'title'>, VariantProps<typeof toastVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}

const ToastContext = React.createContext<ToastProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => children;

export function Toast({ className, variant, title, description, action, ...props }: ToastProps) {
  return (
    <ToastContext.Provider value={{ variant }}>
      <div className={cn(toastVariants({ variant }), className)} role="status" {...props}>
        <div className="flex flex-1 flex-col gap-1">
          {title ? <div className="text-sm font-semibold">{title}</div> : null}
          {description ? <div className="text-xs text-neutral-500">{description}</div> : null}
        </div>
        {action}
        <ToastClose />
      </div>
    </ToastContext.Provider>
  );
}

export function ToastAction({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('rounded-full bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('fixed bottom-6 right-6 z-[100] flex max-h-screen w-full flex-col gap-3', className)}
      {...props}
    />
  );
}

export { ToastClose };
