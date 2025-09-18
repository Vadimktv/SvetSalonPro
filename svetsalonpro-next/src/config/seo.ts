import type { DefaultSeoProps } from 'next-seo';
import { siteConfig } from './site';

export const defaultSeo: DefaultSeoProps = {
  titleTemplate: '%s — СветSalон Pro',
  defaultTitle: `${siteConfig.name} — салон красоты в Геленджике`,
  description: siteConfig.description,
  canonical: siteConfig.url,
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — салон красоты в Геленджике`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/api/og`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — салон красоты`
      }
    ]
  },
  twitter: {
    handle: '@svetsalonpro',
    site: '@svetsalonpro',
    cardType: 'summary_large_image'
  },
  additionalMetaTags: [
    {
      name: 'theme-color',
      content: '#ec4899'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/icon.svg',
      type: 'image/svg+xml'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/api/icon/apple'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous'
    }
  ]
};
