import React from 'react'
import Image from 'next/image'
import { Clock, ShieldCheck, ScrollText } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Services',
  description: 'Read the Terms of Services for using the Forke platform. Understand our rules for task posting, completion, and community conduct.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/80 selection:bg-accent selection:text-white">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/forke-assets/dot-grid.png')] opacity-[0.03]" />
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-24 md:pt-32 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 mb-8">
           <ScrollText className="w-4 h-4 text-accent" />
           <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Legal Documentation</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
          Terms of <span className="text-accent italic">Services</span>
        </h1>
        <div className="flex items-center justify-center gap-6 text-[11px] text-white/30 font-bold uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Last Updated: May 2026</span>
           </div>
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              <span>Effective Globally</span>
           </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="relative z-10 mt-20 px-6 max-w-3xl mx-auto">
        <div className="prose prose-invert prose-orange max-w-none space-y-12 text-white/70 leading-relaxed font-sans pb-24">
          
          <section className="bg-white/[0.01] border border-white/[0.03] p-8 md:p-10 rounded-3xl backdrop-blur-sm">
            <p className="text-lg md:text-xl text-white font-serif leading-relaxed italic opacity-90">
              "Welcome to Forke. Forke is a developer-focused micro-task marketplace where users can post tasks, complete bounties, collaborate on software work, and earn rewards or payments."
            </p>
            <p className="mt-6 text-sm">
              By accessing or using Forke, you agree to these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use the platform.
            </p>
          </section>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">01.</span> Acceptance of Terms
            </h2>
            <p>By creating an account, accessing the platform, or using any Forke services, you confirm that:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              {[
                "You are at least 13 years old.",
                "You can legally enter into binding agreements.",
                "You will comply with these Terms and all applicable laws."
              ].map((item, idx) => (
                <li key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-white/40">Forke may update these Terms from time to time. Continued use of the platform after changes means you accept the updated Terms.</p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">02.</span> What Forke Is
            </h2>
            <p>Forke is a platform that connects:</p>
            <div className="space-y-3">
              {[
                "Developers looking to earn through real-world tasks.",
                "Individuals or organizations posting development-related work.",
                "Contributors collaborating on projects, bug fixes, UI improvements, documentation, automation, and related technical work."
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border-l-2 border-accent/20">
                  <p className="text-sm font-medium text-white/80">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-white/40 italic">Forke does not directly employ users completing tasks unless explicitly stated otherwise.</p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">03.</span> User Accounts
            </h2>
            <p>To use certain features, you must create an account. You are responsible for:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {["Maintaining account security.", "Keeping credentials confidential.", "All activity under your account."].map((item, idx) => (
                 <div key={idx} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center space-y-2">
                    <p className="text-xs font-bold text-white/80">{item}</p>
                 </div>
               ))}
            </div>
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3 mt-4">
              <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Strictly Prohibited</p>
              <p className="text-sm">Impersonation, fake identities, shared accounts, fraudulent activity, or attempting to bypass platform restrictions.</p>
            </div>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">04.</span> Bounties, Tasks & Payments
            </h2>
            
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white/90">4.1 Task Posting</h3>
              <p className="text-sm">Users posting tasks must provide accurate descriptions, clearly define requirements, avoid misleading requests, and ensure they have the right to distribute shared assets.</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white/90">4.2 Task Completion</h3>
              <p className="text-sm">Contributors are responsible for delivering original work and following task requirements. Plagiarism, AI-generated spam, or low-effort abuse may result in permanent bans.</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white/90">4.3 Payments</h3>
              <p className="text-sm">Payments depend on task approval, verification of completed work, and fraud detection. Forke reserves the right to hold payments for investigation or reverse fraudulent transactions.</p>
            </div>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">05.</span> XP, Reputation & Gamification
            </h2>
            <p>Forke includes XP systems, streaks, levels, and leaderboards designed for engagement and reputation purposes.</p>
            <div className="bg-accent/5 border border-accent/10 p-6 rounded-2xl space-y-2">
              <p className="text-sm font-medium text-white/90">XP and virtual rewards have no real-world monetary value, are non-transferable, and may not be sold outside the platform.</p>
            </div>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">06.</span> Intellectual Property
            </h2>
            <p>Users retain ownership of content they create unless otherwise agreed. By uploading to Forke, you grant us a limited license to display and promote your work.</p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">07.</span> Open Source
            </h2>
            <p>Users are responsible for understanding the licenses and contribution rules of repositories they work on. Forke is not responsible for repository disputes.</p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">08.</span> Prohibited Activities
            </h2>
            <p className="text-sm leading-relaxed">
              Cheat XP systems, exploit bugs, upload malware, abuse APIs, harass users, or artificial rankings manipulation. 
              Forke may investigate and take action against violations, including permanent bans.
            </p>
          </article>

          <article className="pt-12 border-t border-white/5 space-y-8">
             <div className="text-center space-y-4">
                <h2 className="text-3xl font-serif text-white italic">Contact</h2>
                <p className="text-sm">For questions regarding these Terms or legal inquiries:</p>
                <a href="mailto:support@forke.dev" className="inline-block px-8 py-4 bg-accent text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-accent/20 hover:scale-105 transition-all">
                  support@forke.dev
                </a>
             </div>

             <div className="bg-white/[0.02] p-10 rounded-[40px] text-center space-y-6 border border-white/5 mt-12">
                <Image src="/forke-assets/forke_logo.png" alt="Forke Logo" width={60} height={60} className="mx-auto opacity-20 grayscale" />
                <p className="text-lg font-serif text-white/40 leading-relaxed">
                   "Forke exists to make developer work feel meaningful, rewarding, and fun.<br/>
                   <span className="text-white/60">Build cool things. Ship often. Avoid production bugs."</span>
                </p>
             </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
