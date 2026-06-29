import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DotField from '@/components/shared/DotField'
import { getPublishedBlogs, getPublishedBlogViewCounts } from '@/lib/blog-actions'
import BlogList, { type BlogCard } from './BlogList'

// Always reflect the latest published posts.
export const dynamic = 'force-dynamic'

export default async function BlogsIndexPage() {
  const [rows, viewCounts] = await Promise.all([
    getPublishedBlogs(),
    getPublishedBlogViewCounts(),
  ])
  const posts: BlogCard[] = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverImage: r.coverImage,
    authorName: r.authorName,
    readingMinutes: r.readingMinutes,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    viewCount: viewCounts[r.slug] ?? 0,
  }))

  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar />

      {/* --- HERO (matches the Levels page header) --- */}
      <div className="relative w-full overflow-hidden">
        {/* Ambient dotted background with radial mask */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-50"
          style={{
            maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 45%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 45%)',
          }}
        >
          <DotField
            dotRadius={1.2}
            dotSpacing={22}
            bulgeStrength={45}
            glowRadius={150}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={350}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#FF7A00"
            gradientTo="#E66E00"
            glowColor="#050505"
          />
        </div>

        <section className="relative z-10 px-6 pb-16 pt-40 text-center md:pb-20 md:pt-48">
          <div className="relative z-30 mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="ui-eyebrow">{'//'} from the team</span>
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              The Forke <span className="font-serif italic font-normal text-accent">blogs.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/50 md:text-xl">
              Stories, updates, and ideas from the Forke team — product deep-dives, engineering
              notes, and what we&apos;re building next.
            </p>
          </div>
        </section>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <BlogList posts={posts} />
      </main>
      <Footer />
    </div>
  )
}
