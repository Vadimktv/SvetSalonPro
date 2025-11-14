'use client';

import { DefaultSeo } from 'next-seo';
import { defaultSeo } from '@/config/seo';

export function DefaultSeoProvider() {
  if (typeof window === 'undefined') {
    return null;
  }

  return <DefaultSeo {...defaultSeo} />;
}
