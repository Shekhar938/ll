import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/blog/*', '/consult', '/portal'],
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
  };
}
