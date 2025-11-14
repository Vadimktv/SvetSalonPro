'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = SheetPrimitive.Overlay;

const SheetContent = ({ className, children, side = 'right', ...props }: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
    <SheetPrimitive.Content
      className={cn(
        'fixed z-[60] flex h-full w-[85vw] max-w-sm flex-col bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition ease-in-out',
        side === 'right' ? 'right-0 top-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right' : '',
        className
      )}
      {...props}
    >
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-neutral-500 shadow hover:bg-white">
        <X className="h-4 w-4" />
        <span className="sr-only">Закрыть меню</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  side?: 'left' | 'right';
};

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetTitle = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title className={cn('text-lg font-semibold text-neutral-900', className)} {...props} />
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
