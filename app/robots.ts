import { MetadataRoute } from 'next';

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
    sitemap: 'https://c9x.thec9group.com/sitemap.xml',
  };
}
