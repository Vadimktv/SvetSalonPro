'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { resolveAppRoute } from '@/lib/utils';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Открыть меню">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pt-12">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-lg font-semibold text-neutral-900">
            Навигация
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-4">
          {siteConfig.nav.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={resolveAppRoute(item.href)}
                className="block rounded-xl px-3 py-2 text-lg font-semibold text-neutral-700 hover:bg-rose-50"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-8 space-y-3">
          <Button asChild className="w-full justify-between">
            <a href="tel:+79284288887">
              Позвонить
              <Phone className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
            <Link href={resolveAppRoute('#booking')}>Записаться онлайн</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
