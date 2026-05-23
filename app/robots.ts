import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/', '/onboarding/', '/auth-error'],
    },
    sitemap: 'https://www.forke.space/sitemap.xml',
  }
}
