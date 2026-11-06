import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/app/'],
      disallow: [
        '/api/',
        '/admin/',
        '/secured-admin/',
        '/account/',
        '/favorites',
        '/my-listings',
        '/messages',
        '/notifications',
        '/report-issue',
        '/blocked-users',
        '/kyc',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
