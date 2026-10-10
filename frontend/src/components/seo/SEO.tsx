import { Helmet } from 'react-helmet-async';
import { DEFAULT_BASE_URL } from './schemas';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string[];
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'Supermarche | On-Demand Express Delivery & Everyday Services in Cameroon';
const DEFAULT_DESCRIPTION =
  'Order fast cooking gas refills, fresh market shopping, and home services in Yaoundé & Douala with Supermarche. Reliable on-demand express delivery & concierge platform.';
const DEFAULT_OG_IMAGE = `${DEFAULT_BASE_URL}/images/hero_banner.png`;
const DEFAULT_KEYWORDS = [
  'Supermarche',
  'Express Delivery Cameroon',
  'Cooking Gas Refill Yaounde',
  'Fresh Market Shopping Douala',
  'Home Cleaning Buea',
  'On-demand errand service',
  'Cameroon concierge service',
  'Africa diaspora errand app',
  'Yaoundé hub express',
  'Douala hub express',
];

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  keywords = DEFAULT_KEYWORDS,
  jsonLd,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | Supermarche Cameroon & Worldwide`
    : DEFAULT_TITLE;

  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${DEFAULT_BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${DEFAULT_BASE_URL}${ogImage}`;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Supermarche" />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang Multilingual / Global Tags */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Supermarche" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_FR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
