import { MetadataRoute } from 'next'
import { getPublishedBlogSlugs } from '@/lib/blog-actions'

// Regenerate so newly published posts appear without a redeploy.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { path: '/blogs', priority: 0.8, changeFrequency: 'daily' },
    { path: '/changelog', priority: 0.6, changeFrequency: 'daily' },
    { path: '/register', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/signin', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/waitlist', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  ]

  const staticEntries: MetadataRoute.Sitemap = entries.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  )

  // Append every published blog post, keyed by its title-derived slug.
  let postEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await getPublishedBlogSlugs()
    postEntries = posts.map((p) => ({
      url: `${baseUrl}/blogs/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  } catch {
    // If the DB is briefly unreachable, still return the static sitemap.
  }

  return [...staticEntries, ...postEntries]
}
