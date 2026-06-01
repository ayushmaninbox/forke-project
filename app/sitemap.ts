import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.forke.space'
  const now = new Date()

  // Only public, indexable marketing & legal pages belong here.
  // Individual user profiles (/<username>) and authenticated app pages are
  // intentionally excluded from the sitemap.
  const entries: {
    path: string
    priority: number
    changeFrequency: 'daily' | 'weekly' | 'monthly'
  }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/whats-forke', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/levels', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/register', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/signin', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/waitlist', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  ]

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
