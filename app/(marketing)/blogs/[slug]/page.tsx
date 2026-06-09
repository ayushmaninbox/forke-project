import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Clock } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { getPublishedBlogBySlug } from '@/lib/blog-actions'
import { instrumentSerif } from '@/app/fonts'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogBySlug(slug)
  if (!post) return { title: 'Post not found' }
  const url = `https://www.forke.space/blogs/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getPublishedBlogBySlug(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <Link
          href="/blogs"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <article>
          <h1 className={`${instrumentSerif.className} text-4xl leading-tight text-white sm:text-5xl`}>
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
            {post.authorName && <span>{post.authorName}</span>}
            <span className="inline-flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3" /> {post.readingMinutes} min read
            </span>
            {post.publishedAt && (
              <span className="font-mono">
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="block h-auto w-full" />
            </div>
          )}

          {/* Stored Tiptap HTML — same .blog-prose styles as the editor. */}
          <div
            className="blog-prose mt-10"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </article>
      </main>
      <Footer />
    </div>
  )
}
