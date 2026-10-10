export const DEFAULT_BASE_URL = 'https://supermarche.com';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Kim's Store",
    legalName: "Kim's Store Ltd",
    url: DEFAULT_BASE_URL,
    logo: `${DEFAULT_BASE_URL}/favicon.svg`,
    description: 'Online Supermarket & Express Department Store in Cameroon',
    sameAs: [
      'https://facebook.com/kimsstore',
      'https://twitter.com/kimsstore',
      'https://instagram.com/kimsstore',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+237670000000',
      contactType: 'customer service',
      areaServed: ['CM', 'Worldwide'],
      availableLanguage: ['English', 'French'],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Kim's Store",
    url: DEFAULT_BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${DEFAULT_BASE_URL}/services?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: "Kim's Store Online Supermarket & Express Store",
    image: `${DEFAULT_BASE_URL}/images/hero_banner.png`,
    url: DEFAULT_BASE_URL,
    telephone: '+237670000000',
    priceRange: 'XAF 1000 - 85000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bastos & Omnisports Hub',
      addressLocality: 'Yaoundé',
      addressRegion: 'Centre',
      addressCountry: 'CM',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 3.848,
      longitude: 11.5021,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: [
      'Yaoundé',
      'Douala',
      'Buea',
      'Bamenda',
      'Cameroon',
      'Worldwide',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
    },
  };
}

export function getServiceSchema(serviceName: string, description: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Supermarche',
      url: DEFAULT_BASE_URL,
    },
    areaServed: ['Yaoundé', 'Douala', 'Buea', 'Bamenda', 'Cameroon'],
    image: image ? (image.startsWith('http') ? image : `${DEFAULT_BASE_URL}${image}`) : `${DEFAULT_BASE_URL}/images/hero_banner.png`,
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${DEFAULT_BASE_URL}${item.path}`,
    })),
  };
}
