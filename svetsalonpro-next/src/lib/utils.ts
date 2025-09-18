import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Route } from 'next';
import type { UrlObject } from 'url';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string) {
  return phone.replace(/[^+\d]/g, '');
}

export function chunkArray<T>(items: T[], size: number) {
  return items.reduce<T[][]>((acc, item, index) => {
    if (index % size === 0) {
      acc.push([item]);
    } else {
      acc[acc.length - 1]?.push(item);
    }

    return acc;
  }, []);
}

export function resolveAppRoute(href: string): Route | UrlObject {
  if (href.startsWith('#')) {
    return { hash: href.slice(1) } satisfies UrlObject;
  }

  return href as Route;
}
