import { MetadataRoute } from 'next';
import { getAllLocationSlugs } from '@/lib/seo/locations';
import { NIGERIAN_CAR_PRICE_GUIDES } from '@/lib/seo/price-guides';
import { SITE_URL } from '@/lib/seo/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const candidateBases = [
    process.env.API_SECRET_URL,
    process.env.NEXT_PUBLIC_API_URL,
    'https://c9x.ng/app/api',
    'https://c9x.thec9group.com/api',
    'https://c9x.thec9group.com/app/api',
  ].filter(Boolean) as string[];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/guidelines`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Generate Programmatic Location Routes for all Nigerian States (Abuja, Lagos, etc.)
  const locationSlugs = getAllLocationSlugs();
  const locationPages: MetadataRoute.Sitemap = locationSlugs.map((slug) => ({
    url: `${baseUrl}/cars-in/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Generate Programmatic Make & Model Pages for High-Volume Search Queries (Camry, Corolla, RX 350, C300, etc.)
  const catalogPages: MetadataRoute.Sitemap = [];
  const uniqueMakes = new Set<string>();
  const topYears = ['2024', '2023', '2022', '2020'];

  for (const item of NIGERIAN_CAR_PRICE_GUIDES) {
    const makeSlug = item.make.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const modelSlug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    uniqueMakes.add(makeSlug);

    // /cars/toyota/camry
    catalogPages.push({
      url: `${baseUrl}/cars/${makeSlug}/${modelSlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    });

    // /cars/toyota/camry/2024, 2023, etc.
    for (const yr of topYears) {
      catalogPages.push({
        url: `${baseUrl}/cars/${makeSlug}/${modelSlug}/${yr}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  // /cars/toyota, /cars/lexus, /cars/mercedes-benz
  for (const make of uniqueMakes) {
    catalogPages.push({
      url: `${baseUrl}/cars/${make}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    });
  }

  let dynamicListingPages: MetadataRoute.Sitemap = [];

  for (const base of candidateBases) {
    try {
      const cleanBase = base.replace(/\/+$/, '');
      const res = await fetch(`${cleanBase}/listings?perPage=100`, {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const responseData = await res.json();
        const listings = responseData?.data?.data || responseData?.data || [];
        if (Array.isArray(listings) && listings.length > 0) {
          dynamicListingPages = listings.map((listing: any) => ({
            url: `${baseUrl}/marketplace/${listing.slug || listing.id}`,
            lastModified: new Date(listing.updated_at || listing.updatedAt || new Date()),
            changeFrequency: 'daily',
            priority: 0.8,
          }));
          break;
        }
      }
    } catch (e) {
      // try next candidate
    }
  }

  return [...staticPages, ...locationPages, ...catalogPages, ...dynamicListingPages];
}
