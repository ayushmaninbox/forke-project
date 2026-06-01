import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.forke.space'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block authenticated app pages, internal tooling and transactional flows.
        // Public profiles (/<username>) and marketing pages remain crawlable.
        disallow: [
          '/admin/',
          '/api/',
          '/auth-error',
          '/checkout',
          '/dashboard',
          '/onboarding',
          '/post-task',
          '/tasks',
          '/submissions',
          '/developers',
          '/escrow',
          '/analytics',
          '/messages',
          '/settings',
          '/earnings',
          '/support',
          '/profile',
          '/notifications',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
