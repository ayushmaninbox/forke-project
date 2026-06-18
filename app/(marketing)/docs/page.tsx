import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { auth } from '@/auth'
import DocsShell from './DocsShell'
import { SECTIONS, POPULAR_ARTICLES, getDocsIndexMarkdown, type Article } from './content'

// Absolute so the docs home tab reads exactly "Forke Docs" (not wrapped by the
// root "%s | Forke" template). Other metadata is inherited from docs/layout.tsx.
export const metadata: Metadata = {
  title: { absolute: 'Forke Docs' },
}

function ArticleCard({ article }: { article: Article }) {
  const Icon = article.icon
  return (
    <Link
      href={`/docs/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-white/[0.08] bg-[#0a0a0c] p-6 transition-colors hover:border-white/[0.16] hover:bg-[#0d0d10]"
    >
      {/* Icon tile — framed, softly orange-tinted (image 3); brightens on hover */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/[0.12] to-accent/[0.04] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 group-hover:border-accent/40 group-hover:from-accent/[0.2] group-hover:to-accent/[0.06]">
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
      </div>
      <h3 className="mt-5 text-[15px] font-medium tracking-[-0.01em] text-white">
        {article.title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">{article.description}</p>
    </Link>
  )
}

export default async function DocsHome() {
  const session = await auth()
  return (
    <DocsShell
      copy={{ markdown: getDocsIndexMarkdown(), viewHref: '/docs/raw' }}
      isLoggedIn={Boolean(session?.user)}
    >
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-10 md:py-16">
        {/* Hero */}
        <div className="max-w-2xl">
          <h1 className="text-4xl font-medium tracking-[-0.035em] text-white md:text-5xl">
            Forke <span className="text-accent">Docs</span>
          </h1>
          <p className="mt-4 text-lg font-light leading-relaxed text-white/55">
            Everything about shipping bounties, getting paid, and the systems that keep the
            marketplace fair — for developers and founders alike.
          </p>
        </div>

        {/* Popular */}
        <section className="mt-14">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
            Popular
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_ARTICLES.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        {/* All sections */}
        {SECTIONS.map((section) => (
          <section key={section.id} className="mt-14">
            <div className="flex items-end justify-between">
              <h2 className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/40">
                {section.label}
              </h2>
              <Link
                href={`/docs/${section.articles[0].slug}`}
                className="group inline-flex items-center gap-1 font-mono text-[12px] text-white/35 transition-colors hover:text-white"
              >
                start
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {section.articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        ))}

        {/* Help footer */}
        <section className="mt-16 rounded-2xl border border-white/[0.08] bg-[#0a0a0c] p-8 text-center">
          <h2 className="text-xl font-medium tracking-[-0.02em] text-white">Still stuck?</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-white/50">
            If the docs don&apos;t answer your question, the team is a message away.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/support"
              className="rounded-full bg-accent px-5 py-2 text-[13px] font-semibold tracking-tight text-[#0a0a0a] transition-colors hover:bg-accent-hover"
            >
              Contact support
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/[0.12] px-5 py-2 text-[13px] font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </DocsShell>
  )
}
