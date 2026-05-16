import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Protect sensitive routes from crawling
    },
    sitemap: 'https://forke.dev/sitemap.xml',
  }
}
