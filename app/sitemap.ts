import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.forke.space'

  // Define static routes
  const routes = [
    '',
    '/waitlist',
    '/signin',
    '/register',
    '/terms',
    '/privacy',
  ]

  // Map to sitemap format
  const sitemapRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...sitemapRoutes]
}
