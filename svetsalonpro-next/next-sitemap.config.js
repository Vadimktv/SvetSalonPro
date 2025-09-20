/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.svetsalonpro.ru',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  priority: 0.7,
  changefreq: 'monthly',
  exclude: ['/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://www.svetsalonpro.ru/sitemap.xml']
  }
};
