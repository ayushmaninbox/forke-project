import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import TableOfContents from '@/components/shared/TableOfContents'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy',
  description: 'Understand the terms of task cancellation, bounty refunds, and payout processing timelines on the Forke platform.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Cancellation & Refund Policy | Forke',
    description: 'Bounty cancellation rules, refund eligibility, and payment processing details.',
    url: 'https://www.forke.space/refund',
  },
}

const TOC_ITEMS = [
  { id: 'cancellation', label: 'Task Cancellation Rules' },
  { id: 'eligibility', label: 'Refund Eligibility & Dispatched Payouts' },
  { id: 'disputes', label: 'Disputes & Admin Arbitration' },
  { id: 'processing', label: 'Processing & Credit Windows' },
  { id: 'gateway-fees', label: 'Transaction Gateway Fees' },
]

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/80 selection:bg-accent/20 selection:text-accent">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 xl:grid xl:grid-cols-[1fr_240px] xl:gap-16 items-start pb-24">
        {/* Left Column: Header + Main Content */}
        <div className="max-w-3xl w-full">
          {/* Header */}
          <header className="pt-32 md:pt-40 pb-16">
            <p className="ui-eyebrow lowercase mb-4">
              Financial & Compliance Policies
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-white mb-4">
              Cancellation & <span className="font-serif italic font-normal text-accent">Refunds</span>
            </h1>
            <p className="text-sm text-white/30 font-mono">
              Last Updated: June 2026 · Effective Globally
            </p>
          </header>

          {/* Content */}
          <main className="space-y-12">
            {/* Intro */}
            <div className="border-l-2 border-accent/20 pl-6">
              <p className="text-base text-white/60 leading-relaxed">
                Forke acts as an intermediary platform connecting task posters with developers. When a paid task is posted, funds are held by our payment partner and released according to platform rules. This Cancellation & Refund Policy outlines the terms governing bounty cancellations, refund eligibility, and settlement processing timelines.
              </p>
            </div>

            {/* 01. Cancellation of Tasks */}
            <section id="cancellation" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
                <span className="text-accent/40 text-sm font-mono">01</span>
                Task Cancellation Rules
              </h2>
              <div className="space-y-3 text-sm text-white/50 pl-4 border-l border-white/[0.06]">
                <p>
                  <strong>1.1 Unclaimed Tasks:</strong> A Task Poster may cancel a posted bounty task at any time <em>before</em> it is claimed by a developer. Upon cancellation, 100% of the deposited bounty will be refunded to the Task Poster&apos;s original payment method.
                </p>
                <p>
                  <strong>1.2 Active Claims (In-Progress):</strong> Once a task has been claimed by a contributor, the Task Poster cannot cancel the task or request a refund until the specified task deadline expires. This is to protect the developer&apos;s time and effort spent working on the solution.
                </p>
                <p>
                  <strong>1.3 Claim Expirations:</strong> If a developer claims a task but fails to submit a solution before the deadline, the claim terminates automatically. The Task Poster then has the option to release the task back to the marketplace or request a full refund of the deposited bounty.
                </p>
              </div>
            </section>

            {/* 02. Refund Eligibility */}
            <section id="eligibility" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
                <span className="text-accent/40 text-sm font-mono">02</span>
                Refund Eligibility & Dispatched Payouts
              </h2>
              <ul className="space-y-3 text-sm text-white/50 pl-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                  <span>
                    <strong>Defective Submissions:</strong> If a submitted task does not meet the requirements defined in the description, or contains plagiarized or copyrighted code, the Task Poster may reject the submission. If the developer fails to resolve the issue within the revision period, the Task Poster is eligible to request a refund of the deposited funds.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                  <span>
                    <strong>Approved Submissions:</strong> Once the Task Poster approves a developer&apos;s submission and releases the bounty payout, the transaction is considered final. <strong>Under no circumstances will refunds be issued after payout release has been executed.</strong>
                  </span>
                </li>
              </ul>
            </section>

            {/* 03. Disputes & Escrow Arbitration */}
            <section id="disputes" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
                <span className="text-accent/40 text-sm font-mono">03</span>
                Disputes & Admin Arbitration
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                If a Task Poster and Contributor disagree on the quality or completion status of a deliverable, either party may raise a dispute. Forke support staff will arbitrate the dispute by inspecting the code, requirements, and logs. Forke&apos;s decision regarding the allocation or refund of platform-held funds shall be final for purposes of platform operations and payout distribution.
              </p>
            </section>

            {/* 04. Refund Processing Timelines */}
            <section id="processing" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
                <span className="text-accent/40 text-sm font-mono">04</span>
                Processing & Credit Windows
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Once a refund is approved by our compliance team or through arbitration:
              </p>
              <ul className="space-y-2 text-sm text-white/50 pl-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                  <span>The refund will be processed via our payment partner, Razorpay.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                  <span>Funds are returned back to the original source payment method (UPI, Bank Account, or Cards).</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                  <span>The standard processing window is <strong>5 to 7 business days</strong>, depending on bank processing cycles.</span>
                </li>
              </ul>
            </section>

            {/* 05. Gateway Fees & Charges */}
            <section id="gateway-fees" className="scroll-mt-28 space-y-4">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
                <span className="text-accent/40 text-sm font-mono">05</span>
                Transaction Gateway Fees
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Please note that processing fees charged by the payment gateway (Razorpay) or banking network for handling the initial deposit and reverse transfer may be non-refundable. Any such fees will be deducted from the final refunded amount, and the net balance will be credited to your account.
              </p>
            </section>

            {/* Contact */}
            <div className="pt-8 border-t border-white/[0.06] space-y-4 text-center">
              <p className="text-sm text-white/40">For cancellation requests or refund dispute inquiries:</p>
              <a
                href="mailto:support@forke.space"
                className="inline-block px-6 py-3 bg-accent text-[#0A0A0A] text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-glow"
              >
                support@forke.space
              </a>
            </div>
          </main>
        </div>

        {/* Right Column: Sticky Table of Contents */}
        <aside className="hidden xl:block pt-32 md:pt-40">
          <TableOfContents items={TOC_ITEMS} />
        </aside>
      </div>

      <Footer />
    </div>
  )
}
