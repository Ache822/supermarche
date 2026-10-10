const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://supermarche.com';
const currentDate = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/services', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'weekly' },
  { path: '/help', priority: '0.8', changefreq: 'weekly' },
  { path: '/become-a-provider', priority: '0.8', changefreq: 'weekly' },
  { path: '/become-a-pro', priority: '0.8', changefreq: 'weekly' },
  { path: '/download', priority: '0.7', changefreq: 'monthly' },
];

function generateSitemap() {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${route.path}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}${route.path}" />
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf8');
  console.log(`[SEO] Sitemap successfully generated at ${outputPath}`);
}

generateSitemap();
