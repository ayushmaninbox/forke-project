'use client'

/**
 * Client-side responsive paginator for the public blog index.
 *
 * Page size adapts to viewport: 9 per page on desktop (3-col grid), 5 on mobile.
 * Posts are passed in from the server component already sorted newest-first.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { instrumentSerif } from '@/app/fonts'

export interface BlogCard {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  authorName: string | null
  readingMinutes: number
  publishedAt: string | null
}

export default function BlogList({ posts }: { posts: BlogCard[] }) {
  // 9 on desktop, 5 on mobile — recomputed on resize.
  const [perPage, setPerPage] = useState(9)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const apply = () => setPerPage(window.matchMedia('(min-width: 1024px)').matches ? 9 : 5)
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  // Keep the current page valid when perPage changes.
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const start = (page - 1) * perPage
  const visible = posts.slice(start, start + perPage)

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-base font-medium text-white">No posts yet</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Check back soon — we&apos;re writing.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-white/[0.018] transition-colors hover:border-white/20"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-white/[0.02]">
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className={`${instrumentSerif.className} text-4xl text-white/10`}>F</span>
                </div>
              )}
            </div>
            <div className="flex flex-grow flex-col p-5">
              <h2 className={`${instrumentSerif.className} text-xl leading-snug text-white group-hover:text-accent`}>
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 line-clamp-2 flex-grow text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
                {post.authorName && <span className="truncate">{post.authorName}</span>}
                <span className="inline-flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" /> {post.readingMinutes} min
                </span>
                {post.publishedAt && (
                  <span className="font-mono">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-white">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
