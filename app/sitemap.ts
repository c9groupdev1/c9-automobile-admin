import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://c9x.thec9group.com';
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
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
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fetch listings to populate sitemap dynamically
    const res = await fetch(`${backendUrl}/listings?perPage=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return staticPages;

    const responseData = await res.json();
    const listings = responseData?.data?.data || [];

    const dynamicPages = listings.map((listing: any) => ({
      url: `${baseUrl}/marketplace/${listing.slug || listing.id}`,
      lastModified: new Date(listing.updated_at || new Date()),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    return staticPages;
  }
}
