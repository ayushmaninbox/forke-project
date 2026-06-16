import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Crosses, Rails } from '@/components/landing/primitives'
import { getChangelog, getCommitCount, type ChangeKind } from '@/lib/changelog'
import ChangelogList from './ChangelogList'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'What we shipped on Forke — every feature, fix, and polish pass, pulled straight from the commit history.',
  alternates: { canonical: '/changelog' },
  openGraph: {
    title: 'Changelog | Forke',
    description: 'Every feature, fix, and polish pass — pulled straight from git.',
    url: 'https://www.forke.space/changelog',
  },
}

// Re-read git history at most every 10 minutes.
export const revalidate = 600

export default function ChangelogPage() {
  const days = getChangelog()
  const commitCount = getCommitCount()

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <Rails fadeBottom>

      {/* Header */}
      <header className="pt-36 md:pt-44 pb-16 px-6 max-w-4xl mx-auto">
        <p className="ui-eyebrow mb-5">{'//'} changelog</p>
        <h1 className="text-4xl md:text-6xl font-medium tracking-[-0.03em] leading-[1.08] text-white">
          What we shipped. <br className="hidden sm:block" />
          Pulled straight from <span className="font-serif italic font-normal text-accent">git.</span>
        </h1>
        <p className="mt-6 text-white/50 text-base md:text-lg font-light leading-relaxed max-w-xl">
          Forke ships daily. This page is generated from the repo&apos;s commit history — every
          feature, fix, and polish pass that lands on main shows up here automatically. No
          marketing edits, no summaries. If it&apos;s listed, it&apos;s merged.
        </p>
      </header>

      {/* Entries */}
      <main className="relative border-t border-white/[0.06] px-6 pt-4 pb-10">
        <Crosses />
        <div className="max-w-4xl mx-auto">
        {days.length === 0 ? (
          <div className="border-t border-white/[0.06] py-16">
            <p className="font-mono text-sm text-white/35">
              {'//'} git history unavailable in this environment — check back soon
            </p>
          </div>
        ) : (
          <ChangelogList days={days} />
        )}

        {commitCount !== null && days.length > 0 && (
          <div className="border-t border-white/[0.06] py-10">
            <p className="font-mono text-[12px] text-white/30">
              $ git rev-list --count HEAD →{' '}
              <span className="text-accent">{commitCount.toLocaleString('en-IN')}</span> commits and
              counting
            </p>
          </div>
        )}
        </div>
      </main>

      {/* Pre-footer CTA strip */}
      <section className="px-6 max-w-4xl mx-auto pb-24">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] px-7 py-7 md:px-9 md:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-medium tracking-[-0.02em] text-white">
              Ship something worth <span className="font-serif italic font-normal text-accent">logging.</span>
            </h2>
            <p className="mt-1.5 font-mono text-[12px] text-white/35">
              {'//'} your merged PRs could be earning you money
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center justify-center h-11 px-6 rounded-lg bg-accent hover:bg-accent-hover text-[#0a0a0a] text-[14px] font-semibold tracking-tight transition-colors"
          >
            Start earning →
          </Link>
        </div>
      </section>

      </Rails>

      <Footer />
    </div>
  )
}
