/**
 * "You may also like these" — recent posts shown at the foot of a single blog
 * post, above the footer. Mirrors the card styling from the blog index grid.
 */

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { instrumentSerif } from '@/app/fonts'

export interface RelatedCard {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  authorName: string | null
  readingMinutes: number
  publishedAt: string | null
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CoverImage({ post }: { post: RelatedCard }) {
  return post.coverImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={post.coverImage}
      alt={post.title}
      className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-white/[0.02]">
      <span className={`${instrumentSerif.className} text-5xl text-white/10`}>F</span>
    </div>
  )
}

export default function RelatedArticles({ posts }: { posts: RelatedCard[] }) {
  if (posts.length === 0) return null

  return (
    <section className="border-t border-white/[0.06] bg-white/[0.012]">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="ui-eyebrow text-white/40">related articles</span>
          <h2
            className={`${instrumentSerif.className} mt-3 text-3xl text-white sm:text-4xl`}
          >
            You may also like these
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-white/[0.018] transition-colors hover:border-white/20"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-white/[0.02]">
                <CoverImage post={post} />
              </div>
              <div className="flex flex-grow flex-col p-5">
                <div className="flex items-center gap-2.5 font-mono text-[10.5px] text-white/30">
                  {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                  <span className="text-white/15">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readingMinutes} min
                  </span>
                </div>
                <h3
                  className={`${instrumentSerif.className} mt-3 text-xl leading-snug text-white transition-colors group-hover:text-accent`}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 flex-grow text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {post.excerpt}
                  </p>
                )}
                {post.authorName && (
                  <div className="mt-4 border-t border-white/[0.05] pt-3.5">
                    <span className="truncate text-[11.5px] text-white/40">
                      {post.authorName}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
