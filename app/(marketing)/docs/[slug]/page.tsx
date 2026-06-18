import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import DocsShell from '../DocsShell'
import DocToc from '../DocToc'
import { auth } from '@/auth'
import { ALL_ARTICLES, getArticleContext, getArticleMarkdown } from '../content'

export function generateStaticParams() {
  return ALL_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ctx = getArticleContext(slug)
  if (!ctx) return { title: 'Forke Docs' }
  const { article, section } = ctx

  // A fuller, self-contained description for search/social: the article summary,
  // grounded in its section and the Forke product, plus the topics it covers.
  const topics = article.toc.map((t) => t.label).slice(0, 4).join(', ')
  const description = `${article.description} Part of the "${section.label}" section of the Forke developer bounty marketplace documentation${
    topics ? `. Covers: ${topics}.` : '.'
  }`

  return {
    // Flows through the docs layout template -> "<Title> - Forke Docs".
    title: article.title,
    description,
    keywords: [
      `forke ${article.title.toLowerCase()}`,
      'forke docs',
      section.label.toLowerCase(),
      'developer bounty marketplace',
    ],
    alternates: { canonical: `/docs/${article.slug}` },
    openGraph: {
      title: `${article.title} - Forke Docs`,
      description,
      url: `https://www.forke.space/docs/${article.slug}`,
      siteName: 'Forke',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} - Forke Docs`,
      description,
    },
  }
}

export default async function DocArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ctx = getArticleContext(slug)
  if (!ctx) notFound()
  const { article, section, prev, next } = ctx
  const markdown = getArticleMarkdown(slug) ?? ''
  const session = await auth()

  return (
    <DocsShell
      breadcrumb={[{ label: section.label }, { label: article.title }]}
      copy={{ markdown, viewHref: `/docs/${article.slug}/raw` }}
      isLoggedIn={Boolean(session?.user)}
    >
      <div className="mx-auto flex max-w-6xl gap-12 px-5 py-12 md:px-10 md:py-16">
        {/* Article */}
        <article className="min-w-0 flex-1">
          <header className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent/70">
              {section.label}
            </p>
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-white md:text-[2.6rem] md:leading-[1.1]">
              {article.title}
            </h1>
          </header>

          {article.body}

          {/* Prev / next */}
          <nav className="mt-16 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="group flex flex-col rounded-xl border border-white/[0.08] p-4 transition-colors hover:border-white/[0.18] hover:bg-white/[0.02]"
              >
                <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-white/35">
                  <ArrowLeft className="h-3 w-3" /> Previous
                </span>
                <span className="mt-1 text-[15px] font-medium text-white/80 group-hover:text-white">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="group flex flex-col items-end rounded-xl border border-white/[0.08] p-4 text-right transition-colors hover:border-white/[0.18] hover:bg-white/[0.02]"
              >
                <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-white/35">
                  Next <ArrowRight className="h-3 w-3" />
                </span>
                <span className="mt-1 text-[15px] font-medium text-white/80 group-hover:text-white">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        {/* Right rail TOC */}
        <aside className="hidden w-56 shrink-0 xl:block">
          <DocToc items={article.toc} />
        </aside>
      </div>
    </DocsShell>
  )
}
