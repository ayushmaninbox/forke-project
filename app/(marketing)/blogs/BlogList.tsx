'use client'

/**
 * Public blog index — editorial layout.
 *
 * The newest post runs as a full-width feature; the rest sit in a three-column
 * grid below. Pagination applies to the grid (9 per page on desktop, 5 on
 * mobile); the feature only shows on page one.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react'
import { instrumentSerif } from '@/app/fonts'

export interface BlogCard {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  authorName: string | null
  readingMinutes: number
  publishedAt: string | null
  viewCount?: number
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CoverImage({ post, className = '' }: { post: BlogCard; className?: string }) {
  return post.coverImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={post.coverImage}
      alt={post.title}
      className={`block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${className}`}
    />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-white/[0.02] ${className}`}>
      <span className={`${instrumentSerif.className} text-5xl text-white/10`}>F</span>
    </div>
  )
}

export default function BlogList({ posts }: { posts: BlogCard[] }) {
  const [perPage, setPerPage] = useState(9)
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)
  // Desktop pulls the newest post out as a full-width feature. On mobile we skip
  // that treatment so it reads as a normal card and the grid is just 5/page.
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    setMounted(true)
    const apply = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches
      // Tablet = the sm breakpoint and up, but below desktop (2-col grid).
      const tablet = window.matchMedia('(min-width: 640px)').matches && !desktop
      setIsDesktop(desktop)
      // Desktop (3-col): 9 per page. Tablet (2-col): 6 per page. Mobile: 5.
      setPerPage(desktop ? 9 : tablet ? 6 : 5)
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

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

  // Desktop: newest post becomes the feature, the remainder fills the grid.
  // Mobile: no feature — every post (including the newest) flows into the grid.
  const [featured, ...rest] = posts
  const showFeatured = isDesktop
  const gridPosts = showFeatured ? rest : posts
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / perPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * perPage
  const visible = gridPosts.slice(start, start + perPage)

  return (
    <div>
      {/* ── Featured story — desktop only, page one only ───────────────────── */}
      {showFeatured && safePage === 1 && (
        <Link
          href={`/blogs/${featured.slug}`}
          className="group mb-14 grid overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] transition-colors hover:border-white/20 lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="aspect-[16/9] overflow-hidden lg:order-2 lg:aspect-auto lg:min-h-[340px]">
            <CoverImage post={featured} />
          </div>
          <div className="flex flex-col p-6 sm:p-8 lg:order-1 lg:p-11">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-white/35">
              <span className="text-accent">featured</span>
              {featured.publishedAt && (
                <>
                  <span className="text-white/15">·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                </>
              )}
              <span className="text-white/15">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {featured.readingMinutes} min read
              </span>
              {(featured.viewCount ?? 0) > 0 && (
                <>
                  <span className="text-white/15">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {(featured.viewCount ?? 0).toLocaleString()}
                  </span>
                </>
              )}
            </div>
            <h2 className={`${instrumentSerif.className} mt-5 text-3xl leading-[1.12] text-white transition-colors group-hover:text-accent sm:text-4xl lg:text-[2.6rem]`}>
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mt-4 line-clamp-3 text-[15px] font-light leading-relaxed text-white/50">
                {featured.excerpt}
              </p>
            )}
            <div className="mt-auto flex items-center justify-between gap-4 pt-8">
              {featured.authorName && (
                <span className="truncate text-[13px] text-white/45">{featured.authorName}</span>
              )}
              <span className="inline-flex shrink-0 items-center gap-2 text-[13.5px] font-medium text-white/75 transition-colors group-hover:text-white">
                Read story
                <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* ── The rest of the archive ────────────────────────────────────────── */}
      {visible.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
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
                  {(post.viewCount ?? 0) > 0 && (
                    <>
                      <span className="text-white/15">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {(post.viewCount ?? 0).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                <h2 className={`${instrumentSerif.className} mt-3 text-xl leading-snug text-white transition-colors group-hover:text-accent`}>
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {post.excerpt}
                  </p>
                )}
                {/* Spacer pushes the footer down without stretching the clamped
                    excerpt, so the … always lands at the true end of line 2. */}
                <div className="flex-grow" />
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3.5">
                  <span className="truncate text-[11.5px] text-white/40">{post.authorName}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-white/70">
            {String(safePage).padStart(2, '0')} <span className="text-white/25">/ {String(totalPages).padStart(2, '0')}</span>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-white/20 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
