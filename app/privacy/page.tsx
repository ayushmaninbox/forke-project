import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Forke Privacy Policy to understand how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/80 selection:bg-accent selection:text-white">
      <Navbar />

      {/* Header */}
      <header className="pt-32 md:pt-40 pb-16 px-6 max-w-3xl mx-auto">
        <p className="text-[11px] text-white/30 font-mono uppercase tracking-widest mb-4">
          Privacy & Data Protection
        </p>
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">
          Privacy <span className="text-accent italic">Policy</span>
        </h1>
        <p className="text-sm text-white/30 font-mono">
          Effective 16 May 2025 · v1.0.0
        </p>
      </header>

      {/* Content */}
      <main className="px-6 max-w-3xl mx-auto pb-24 space-y-12">

        {/* Intro */}
        <div className="border-l-2 border-accent/20 pl-6">
          <p className="text-base text-white/60 leading-relaxed">
            At Forke, your privacy matters. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Forke platform.
          </p>
        </div>

        {/* 01. Introduction */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">01</span>
            Introduction
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Forke operates a developer micro-task and bounty platform that connects builders with real-world coding tasks. This policy covers what data we collect, how we use it, and your rights.
          </p>
        </section>

        {/* 02. Information We Collect */}
        <section className="space-y-6">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">02</span>
            Information We Collect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40">Personal Data</h3>
              <ul className="space-y-2 text-sm text-white/50">
                {['Name or Username', 'Email Address', 'GitHub Profile Information', 'Payment details (UPI/Payout)', 'Profile Avatar & Bio'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40">Usage Info</h3>
              <ul className="space-y-2 text-sm text-white/50">
                {['Browser & Device type', 'IP Address', 'Pages visited & time spent', 'Click interactions & logs'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 03. How We Use Information */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">03</span>
            How We Use Information
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            We use collected information to operate the platform, match developers with tasks, process payouts, prevent fraud, and improve user experience.{' '}
            <span className="text-accent font-medium">We do not sell your personal data.</span>
          </p>
        </section>

        {/* 04. Cookies */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">04</span>
            Cookies & Tracking
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Forke uses cookies to keep you signed in, remember preferences, analyze traffic, and improve performance. You can disable cookies in your browser settings.
          </p>
        </section>

        {/* 05. Data Security */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">05</span>
            Data Security
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            We implement industry-standard security measures to protect your data. However, no internet service is completely secure. Users are responsible for maintaining account password security.
          </p>
        </section>

        {/* 06. Your Rights */}
        <section className="space-y-4">
          <h2 className="text-lg font-serif text-white flex items-baseline gap-3">
            <span className="text-accent/40 text-sm font-mono">06</span>
            Your Rights
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            You may request to access your personal data, correct inaccurate information, delete your account, or request data removal. Contact support for any requests.
          </p>
        </section>

        {/* Contact */}
        <div className="pt-8 border-t border-white/[0.06] space-y-4 text-center">
          <p className="text-sm text-white/40">For any privacy-related questions or data requests:</p>
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
