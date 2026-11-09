import { NextResponse } from 'next/server';
import { getAllLocationSlugs } from '@/lib/seo/locations';
import { SITE_URL } from '@/lib/seo/config';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = SITE_URL;
  const slugs = getAllLocationSlugs();
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs
  .map(
    (slug) => `  <url>
    <loc>${baseUrl}/cars-in/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
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

