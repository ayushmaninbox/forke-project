import { MetadataRoute } from 'next'
import { getPublishedBlogSlugs } from '@/lib/blog-actions'
import { ALL_ARTICLES } from '@/app/(marketing)/docs/content'
import { isWaitlistEnabled } from '@/lib/db/settings'

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
    { path: '/docs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/levels', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/blogs', priority: 0.8, changeFrequency: 'daily' },
    { path: '/changelog', priority: 0.6, changeFrequency: 'daily' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/refund', priority: 0.3, changeFrequency: 'monthly' },
  ]

  // These routes flip with the waitlist lock, so only list whichever ones are
  // actually live to avoid advertising URLs that 404:
  //  - lock ON  → /waitlist exists; /register and /signin 404
  //  - lock OFF → /register and /signin exist; /waitlist 404s
  try {
    if (await isWaitlistEnabled()) {
      entries.push({ path: '/waitlist', priority: 0.5, changeFrequency: 'monthly' })
    } else {
      entries.push({ path: '/register', priority: 0.7, changeFrequency: 'monthly' })
      entries.push({ path: '/signin', priority: 0.5, changeFrequency: 'monthly' })
    }
  } catch {
    // If the setting is briefly unreadable, omit all three rather than risk
    // listing a URL that may 404.
  }

  const staticEntries: MetadataRoute.Sitemap = entries.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  )

  // Every docs article, keyed by its slug.
  const docsEntries: MetadataRoute.Sitemap = ALL_ARTICLES.map((a) => ({
    url: `${baseUrl}/docs/${a.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

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

  return [...staticEntries, ...docsEntries, ...postEntries]
}
