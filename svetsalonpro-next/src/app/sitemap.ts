import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ];
}
