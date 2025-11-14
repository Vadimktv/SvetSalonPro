import { siteConfig } from '@/config/site';
import { serviceCategories } from '@/data/services';
import { averageRating, reviews } from '@/data/reviews';

export function buildLocalBusinessSchema() {
  const aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: averageRating.toFixed(1),
    reviewCount: reviews.length
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: siteConfig.name,
    description: siteConfig.description,
    image: `${siteConfig.url}/api/og`,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: '$$-$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.address.lat,
      longitude: siteConfig.address.lng
    },
    sameAs: siteConfig.social.map((item) => item.url),
    openingHoursSpecification: siteConfig.workingHours.map((item) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: item.day,
      opens: item.time.split('–')[0]?.trim(),
      closes: item.time.split('–')[1]?.trim()
    })),
    makesOffer: serviceCategories.flatMap((category) =>
      category.services.map((service) => ({
        '@type': 'Offer',
        name: service.name,
        description: service.description,
        price: service.priceFrom,
        priceCurrency: 'RUB',
        category: category.title
      }))
    ),
    aggregateRating,
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: review.author,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating
      },
      reviewBody: review.text,
      datePublished: review.date,
      publisher: {
        '@type': 'Organization',
        name: review.source
      }
    }))
  };
}
