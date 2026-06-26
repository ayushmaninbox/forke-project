import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { buildOpenGraph, buildTwitter } from '@/lib/utils/og'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for using the Forke platform. Understand our rules for task posting, completion, and community conduct.',
  alternates: { canonical: '/terms' },
  openGraph: buildOpenGraph({
    title: 'Terms of Service | Forke',
    description: 'The rules for task posting, completion, payouts, and community conduct on Forke.',
    url: 'https://www.forke.space/terms',
  }),
  twitter: buildTwitter({
    title: 'Terms of Service | Forke',
    description: 'The rules for task posting, completion, payouts, and community conduct on Forke.',
  }),
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/80 selection:bg-accent/20 selection:text-accent">
      <Navbar />

      {/* Header */}
      <header className="pt-32 md:pt-40 pb-16 px-6 max-w-3xl mx-auto">
        <p className="ui-eyebrow lowercase mb-4">
          Legal Documentation
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-white mb-4">
          Terms of <span className="font-serif italic font-normal text-accent">Service</span>
        </h1>
        <p className="text-sm text-white/30 font-mono">
          Last Updated: June 2026 · Effective Globally
        </p>
      </header>

      {/* Content */}
      <main className="px-6 max-w-3xl mx-auto pb-24 space-y-12">

        {/* Intro */}
        <div className="border-l-2 border-accent/20 pl-6 space-y-3">
          <p className="text-base text-white/60 leading-relaxed">
            Welcome to Forke. Forke is a developer-focused micro-task marketplace where users can post tasks, complete bounties, collaborate on software work, and earn rewards or payments.
          </p>
          <p className="text-sm text-white/40 leading-relaxed">
            By accessing or using Forke, you agree to these Terms of Service. If you do not agree with these Terms, please do not use the platform.
          </p>
        </div>

        {/* 01. Acceptance of Terms */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">01</span>
            Acceptance of Terms
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            By creating an account, accessing the platform, or using any Forke services, you confirm that:
          </p>
          <ul className="space-y-2 text-sm text-white/50 pl-4">
            {[
              'You can legally enter into binding agreements.',
              'You will comply with these Terms, our Privacy Policy, and all applicable local, national, and international laws.',
              'All registration and profile details you provide are accurate, current, and truthful.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/30">
            Forke may update these Terms from time to time. We will notify you of any material updates by updating the date at the top of this page. Continued use of the platform after changes means you accept the updated Terms.
          </p>
        </section>

        {/* 02. What Forke Is */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">02</span>
            What Forke Is & Platform Role
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Forke is a marketplace platform that facilitates connections between:
          </p>
          <ul className="space-y-2 text-sm text-white/50 pl-4">
            {[
              'Developers (Contributors) looking to build experience and earn through technical micro-tasks or bounties.',
              'Individuals or organizations (Task Posters) seeking to hire independent talent for software development, debugging, design, or documentation tasks.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 space-y-2">
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Independent Contractors</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Forke acts strictly as an intermediary platform. Contributors are independent contractors, not employees, partners, agents, or joint venturers of Forke or the Task Poster. Forke is not responsible for the tax filings, labor compliance, or benefits of any contributor.
            </p>
          </div>
        </section>

        {/* 03. Eligibility & Minor Representation */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">03</span>
            Eligibility & Minors
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            You must be at least 13 years old to use Forke. If you are under the age of 18 (a &quot;Minor&quot;):
          </p>
          <ul className="space-y-2 text-sm text-white/50 pl-4">
            {[
              'You must have permission from your parent or legal guardian to create an account and participate in tasks.',
              'Your parent or legal guardian must review and agree to these Terms on your behalf.',
              'Any payouts, payment registrations, or banking details linked to your account must belong to, or be authorized by, your parent or legal guardian.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/30 italic">
            Forke reserves the right to suspend accounts if we detect they are operated by minors without guardian consent.
          </p>
        </section>

        {/* 04. User Accounts */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">04</span>
            User Accounts & Security
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            To participate in bounties or post tasks, you must create an account, which can be linked to your GitHub or Google credentials. You are responsible for keeping your login credentials confidential and for all activities that occur under your account.
          </p>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 space-y-2">
            <p className="text-[10px] text-red-400/70 font-mono uppercase tracking-widest">Strictly Prohibited</p>
            <p className="text-sm text-white/50">
              Account sharing, creating duplicate accounts to bypass bans, impersonation of other developers or organizations, using fraudulent payment methods, or using automated scripts to claim tasks.
            </p>
          </div>
        </section>

        {/* 05. Bounties, Tasks & Payments */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">05</span>
            Bounties, Tasks & Payments
          </h2>

          <div className="space-y-4">
            <div className="space-y-2 pl-4 border-l border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/60">5.1 Task Posting & Payout Deposits</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Task Posters must provide clear, complete descriptions and code guidelines. When posting a paid task, the required bounty amount is deposited in advance. These funds are held by our payment partner and released according to platform rules once the task is successfully completed, verified, and approved, or until a dispute is settled.
              </p>
            </div>

            <div className="space-y-2 pl-4 border-l border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/60">5.2 Claiming & Time Limits</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Contributors may claim open tasks suited to their level. Once claimed, tasks must be submitted within the specified timeframe. If the deadline expires without submission, the task is released back to the marketplace, and the claim is terminated.
              </p>
            </div>

            <div className="space-y-2 pl-4 border-l border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/60">5.3 Payments, Commissions & Taxes</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Bounty payouts are made via Razorpay or direct UPI links upon the Task Poster&apos;s approval of the deliverable. Forke may deduct a platform fee or transaction commission, which will be disclosed prior to payment. Contributors are solely responsible for paying any applicable direct or indirect taxes (including GST/income tax) on their earnings.
              </p>
            </div>
          </div>
        </section>

        {/* 06. Task Completion & AI Disclosure */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">06</span>
            Task Completion & AI Code Usage
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Contributors must submit original work. Submitting plagiarized work, malware, or low-effort spam will result in a permanent ban.
          </p>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/40">AI-Generated Code Policy</h4>
            <p className="text-xs text-white/40 leading-relaxed">
              While we encourage the helper use of AI developer tools (e.g., GitHub Copilot, ChatGPT), Contributors must disclose submissions where AI-generated code constitutes a substantial portion of the final deliverable. Developers warrant that any AI-assisted code submitted does not infringe upon any third-party intellectual property rights or open-source copyleft licenses (e.g., GPL licenses requiring open derivation).
            </p>
          </div>
        </section>

        {/* 07. Intellectual Property & Code Ownership */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">07</span>
            Intellectual Property & Code Ownership
          </h2>
          <div className="space-y-4 text-sm text-white/50 leading-relaxed">
            <p>
              This section governs who owns the code and files produced through Forke:
            </p>
            <div className="space-y-3 pl-4 border-l border-accent/20">
              <p className="text-white/60 font-medium">
                7.1 Ownership Transfer upon Payment:
              </p>
              <p className="text-xs">
                Upon successful approval of a submission and release of the payment bounty, all intellectual property rights, copyright, title, and interest in the submitted code and assets transfer entirely to the <strong>Task Poster</strong>. The Contributor relinquishes all ownership claims to the completed work.
              </p>
              <p className="text-white/60 font-medium pt-2">
                7.2 Developer Portfolio License:
              </p>
              <p className="text-xs">
                Notwithstanding the transfer of ownership, the Contributor is granted a non-exclusive, royalty-free, perpetual, worldwide, non-transferable license to show the work in public repositories (e.g., GitHub) and personal portfolios for educational and employment showcase purposes, <strong>unless</strong> the Task Poster and Contributor have signed a separate Non-Disclosure Agreement (NDA) or confidentiality contract that forbids such public disclosure.
              </p>
            </div>
          </div>
        </section>

        {/* 08. Confidentiality & Non-Disclosure */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">08</span>
            Confidentiality
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            While completing tasks, Contributors may receive access to private source repositories, database samples, api credentials, business roadmaps, or customer data belonging to the Task Poster. 
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            Contributors agree to hold all such information in strict confidence and shall not disclose, replicate, distribute, or use it for any purpose outside the scope of completing the designated task. This obligation survives the termination of any task or account.
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            Task Posters are responsible for ensuring they have the legal right to share any materials, code, assets, or data provided to Contributors.
          </p>
        </section>

        {/* 09. Dispute Resolution & Platform Arbitration */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">09</span>
            Dispute Resolution & Platform Arbitration
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            If a dispute arises (e.g., a Task Poster asserts a submission does not meet requirements, or a Contributor claims their completed work was unfairly rejected), the following protocol applies:
          </p>
          <div className="space-y-3 pl-4 border-l border-white/[0.06] text-sm text-white/50">
            <p>
              <strong>9.1 Review Window:</strong> Users may flag a task for dispute within 5 calendar days of submission.
            </p>
            <p>
              <strong>9.2 Forke Arbitration:</strong> Forke administrators will review the task description, submission code, activity logs, and chat messages. By using Forke, you agree that <strong>Forke&apos;s decision regarding platform-held funds shall be final for purposes of platform operations and payout distribution</strong>.
            </p>
            <p>
              <strong>9.3 External Disputes:</strong> Forke only resolves the release or return of deposited task funds on the platform. Forke shall not be responsible for disputes arising directly between users outside of platform-managed escrow transactions.
            </p>
          </div>
        </section>

        {/* 10. XP, Reputation & Gamification */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">10</span>
            XP, Reputation & Gamification
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Forke includes XP systems, streaks, levels, and leaderboards designed for engagement and reputation purposes.
          </p>
          <p className="text-sm text-white/50 leading-relaxed bg-accent/5 border border-accent/10 rounded-xl p-5">
            XP, virtual titles, and rewards are promotional badges. They have no real-world monetary value, are non-transferable, and may not be sold or traded outside the platform. Forke reserves the right to recalculate or revoke XP in cases of profile gaming or abuse.
          </p>
        </section>

        {/* 11. Prohibited Conduct */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">11</span>
            Prohibited Activities
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            You agree not to exploit bugs, use automated bots to claim tasks, scrape user data, upload malicious files/worms, bypass verification barriers, or manipulate task ratings. Forke reserves the right to investigate and suspend/ban accounts immediately for violations.
          </p>
        </section>

        {/* 12. Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">12</span>
            Disclaimers & Limitation of Liability
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            THE FORKE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE DISCLAIM ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            IN NO EVENT SHALL FORKE, ITS FOUNDERS, OR OFFICERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR PROJECT FAILURES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
          </p>
        </section>

        {/* 13. Governing Law & Jurisdiction */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">13</span>
            Governing Law & Jurisdiction
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Forke is available globally where legally permitted, but these Terms shall be governed by and interpreted in accordance with the laws of India.
          </p>
          <div className="space-y-3 pl-4 border-l border-white/[0.06] text-sm text-white/50">
            <p>
              <strong>13.1 Informal Resolution:</strong> Users agree to first attempt to resolve disputes through good-faith discussions with Forke support.
            </p>
            <p>
              <strong>13.2 Exclusive Jurisdiction:</strong> If a dispute cannot be resolved informally, any legal actions, claims, or controversies arising out of or relating to these Terms or the use of the Forke platform shall be subject to the exclusive jurisdiction of the competent courts of India.
            </p>
          </div>
        </section>

        {/* Contact */}
        <div className="pt-8 border-t border-white/[0.06] space-y-4 text-center">
          <p className="text-sm text-white/40">For questions regarding these Terms or legal inquiries:</p>
          <a
            href="mailto:support@forke.space"
            className="inline-block px-6 py-3 bg-accent text-[#0A0A0A] text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-glow"
          >
            support@forke.space
          </a>
        </div>

      </main>

      <Footer />
    </div>
  )
}
