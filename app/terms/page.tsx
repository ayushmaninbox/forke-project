import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Terms of Services',
  description: 'Read the Terms of Services for using the Forke platform. Understand our rules for task posting, completion, and community conduct.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/80 selection:bg-accent selection:text-white">
      <Navbar />

      {/* Header */}
      <header className="pt-32 md:pt-40 pb-16 px-6 max-w-3xl mx-auto">
        <p className="text-[11px] text-white/30 font-mono uppercase tracking-widest mb-4">
          Legal Documentation
        </p>
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">
          Terms of <span className="text-accent italic">Services</span>
        </h1>
        <p className="text-sm text-white/30 font-mono">
          Last Updated: May 2026 · Effective Globally
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
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">01</span>
            Acceptance of Terms
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            By creating an account, accessing the platform, or using any Forke services, you confirm that:
          </p>
          <ul className="space-y-2 text-sm text-white/50 pl-4">
            {[
              'You are at least 13 years old.',
              'You can legally enter into binding agreements.',
              'You will comply with these Terms and all applicable laws.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-accent/40 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/30">
            Forke may update these Terms from time to time. Continued use of the platform after changes means you accept the updated Terms.
          </p>
        </section>

        {/* 02. What Forke Is */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">02</span>
            What Forke Is
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">Forke is a platform that connects:</p>
          <ul className="space-y-2 text-sm text-white/50 pl-4">
            {[
              'Developers looking to earn through real-world tasks.',
              'Individuals or organizations posting development-related work.',
              'Contributors collaborating on projects, bug fixes, UI improvements, documentation, automation, and related technical work.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-accent/40 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/30 italic">
            Forke does not directly employ users completing tasks unless explicitly stated otherwise.
          </p>
        </section>

        {/* 03. User Accounts */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">03</span>
            User Accounts
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            To use certain features, you must create an account. You are responsible for maintaining account security, keeping credentials confidential, and all activity under your account.
          </p>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 space-y-2">
            <p className="text-[10px] text-red-400/70 font-mono uppercase tracking-widest">Strictly Prohibited</p>
            <p className="text-sm text-white/50">
              Impersonation, fake identities, shared accounts, fraudulent activity, or attempting to bypass platform restrictions.
            </p>
          </div>
        </section>

        {/* 04. Bounties, Tasks & Payments */}
        <section className="space-y-6">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">04</span>
            Bounties, Tasks & Payments
          </h2>

          {[
            { sub: '4.1 Task Posting', text: 'Users posting tasks must provide accurate descriptions, clearly define requirements, avoid misleading requests, and ensure they have the right to distribute shared assets.' },
            { sub: '4.2 Task Completion', text: 'Contributors are responsible for delivering original work and following task requirements. Plagiarism, AI-generated spam, or low-effort abuse may result in permanent bans.' },
            { sub: '4.3 Payments', text: 'Payments depend on task approval, verification of completed work, and fraud detection. Forke reserves the right to hold payments for investigation or reverse fraudulent transactions.' },
          ].map((item) => (
            <div key={item.sub} className="space-y-2 pl-4 border-l border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/60">{item.sub}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

        {/* 05. XP, Reputation & Gamification */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">05</span>
            XP, Reputation & Gamification
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Forke includes XP systems, streaks, levels, and leaderboards designed for engagement and reputation purposes.
          </p>
          <p className="text-sm text-white/50 leading-relaxed bg-accent/5 border border-accent/10 rounded-xl p-5">
            XP and virtual rewards have no real-world monetary value, are non-transferable, and may not be sold outside the platform.
          </p>
        </section>

        {/* 06. Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">06</span>
            Intellectual Property
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Users retain ownership of content they create unless otherwise agreed. By uploading to Forke, you grant us a limited license to display and promote your work.
          </p>
        </section>

        {/* 07. Open Source */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">07</span>
            Open Source
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Users are responsible for understanding the licenses and contribution rules of repositories they work on. Forke is not responsible for repository disputes.
          </p>
        </section>

        {/* 08. Prohibited Activities */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">08</span>
            Prohibited Activities
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Cheat XP systems, exploit bugs, upload malware, abuse APIs, harass users, or artificial rankings manipulation. Forke may investigate and take action against violations, including permanent bans.
          </p>
        </section>

        {/* Contact */}
        <div className="pt-8 border-t border-white/[0.06] space-y-4 text-center">
          <p className="text-sm text-white/40">For questions regarding these Terms or legal inquiries:</p>
          <a
            href="mailto:support@forke.space"
            className="inline-block px-6 py-3 bg-accent text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all"
          >
            support@forke.space
          </a>
        </div>

      </main>

      <Footer />
    </div>
  )
}
