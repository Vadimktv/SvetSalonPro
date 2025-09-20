import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/privacy'],
      disallow: ['/api', '/api/*']
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
