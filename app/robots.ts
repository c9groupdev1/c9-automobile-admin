import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/app/'],
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://c9x.thec9group.com/sitemap.xml',
  };
}
