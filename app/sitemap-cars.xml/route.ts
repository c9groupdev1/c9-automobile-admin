import { NextResponse } from 'next/server';
import { NIGERIAN_CAR_PRICE_GUIDES } from '@/lib/seo/price-guides';
import { SITE_URL } from '@/lib/seo/config';

export const revalidate = 3600; // 1-hour cache

export async function GET() {
  const baseUrl = SITE_URL;
  const uniqueMakes = new Set<string>();
  const topYears = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  const today = new Date().toISOString().split('T')[0];

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

  for (const item of NIGERIAN_CAR_PRICE_GUIDES) {
    const makeSlug = item.make.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const modelSlug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    uniqueMakes.add(makeSlug);

    // Make + Model (e.g., /cars/toyota/camry)
    urls.push({
      loc: `${baseUrl}/cars/${makeSlug}/${modelSlug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.85',
    });

    // Make + Model + Year (e.g., /cars/toyota/camry/2024, /cars/toyota/camry/2020)
    for (const yr of topYears) {
      urls.push({
        loc: `${baseUrl}/cars/${makeSlug}/${modelSlug}/${yr}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.80',
      });
    }
  }

  // All Makes (e.g., /cars/toyota, /cars/lexus)
  for (const make of uniqueMakes) {
    urls.push({
      loc: `${baseUrl}/cars/${make}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.85',
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

