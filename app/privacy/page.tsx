import React from 'react'
import Image from 'next/image'
import { Shield, Eye, Lock, Database } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Forke Privacy Policy to understand how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/80 selection:bg-accent selection:text-white">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/forke-assets/dot-grid.png')] opacity-[0.03]" />
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-24 md:pt-32 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 mb-8">
           <Shield className="w-4 h-4 text-accent" />
           <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Privacy & Data Protection</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
          Privacy <span className="text-accent italic">Policy</span>
        </h1>
        <div className="flex items-center justify-center gap-6 text-[11px] text-white/30 font-bold uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <span>Effective: 16 May 2025</span>
           </div>
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           <span>v1.0.0</span>
        </div>
      </header>

      {/* Content Section */}
      <main className="relative z-10 mt-20 px-6 max-w-3xl mx-auto">
        <div className="prose prose-invert prose-orange max-w-none space-y-16 text-white/70 leading-relaxed font-sans pb-24">
          
          <section className="bg-white/[0.01] border border-white/[0.03] p-8 md:p-10 rounded-3xl backdrop-blur-sm">
            <p className="text-lg md:text-xl text-white font-serif leading-relaxed italic opacity-90">
              "At Forke, your privacy matters. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Forke platform."
            </p>
          </section>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">01.</span> Introduction
            </h2>
            <p>Forke operates a developer micro-task and bounty platform that connects builders with real-world coding tasks. This policy covers what data we collect, how we use it, and your rights.</p>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">02.</span> Information We Collect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Personal Data</h3>
                  <ul className="text-sm space-y-2 opacity-80 list-none p-0">
                    <li>Name or Username</li>
                    <li>Email Address</li>
                    <li>GitHub Profile Information</li>
                    <li>Payment details (UPI/Payout)</li>
                    <li>Profile Avatar & Bio</li>
                  </ul>
               </div>

               <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Usage Info</h3>
                  <ul className="text-sm space-y-2 opacity-80 list-none p-0">
                    <li>Browser & Device type</li>
                    <li>IP Address</li>
                    <li>Pages visited & time spent</li>
                    <li>Click interactions & logs</li>
                  </ul>
               </div>
            </div>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">03.</span> How We Use Information
            </h2>
            <p>We use collected information to operate the platform, match developers with tasks, process payouts, prevent fraud, and improve user experience. <span className="text-accent font-bold">We do not sell your personal data.</span></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Operate Platform", "Match Tasks", "Process Rewards"].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs font-black uppercase tracking-widest text-white/60">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">04.</span> Cookies & Tracking
            </h2>
            <p>Forke uses cookies to keep you signed in, remember preferences, analyze traffic, and improve performance. You can disable cookies in your browser settings.</p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">05.</span> Data Security
            </h2>
            <div className="relative group p-10 rounded-[40px] bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lock className="w-24 h-24 text-accent" />
               </div>
               <div className="relative z-10 space-y-4">
                  <p className="text-lg md:text-xl text-white font-serif italic">"We implement industry-standard security measures to protect your data."</p>
                  <p className="text-sm opacity-70">However, no internet service is completely secure. Users are responsible for maintaining account password security.</p>
               </div>
            </div>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl font-serif text-white flex items-center gap-4">
              <span className="text-accent italic">06.</span> Your Rights
            </h2>
            <p>You may request to access your personal data, correct inaccurate information, delete your account, or request data removal. Contact support for any requests.</p>
          </article>

          <article className="pt-12 border-t border-white/5 space-y-8">
             <div className="text-center space-y-4">
                <h2 className="text-3xl font-serif text-white italic">Privacy Concerns?</h2>
                <p className="text-sm">For any privacy-related questions or data requests:</p>
                <a href="mailto:support@forke.dev" className="inline-block px-8 py-4 bg-accent text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-accent/20 hover:scale-105 transition-all">
                  support@forke.dev
                </a>
             </div>

             <div className="bg-white/[0.02] p-10 rounded-[40px] text-center space-y-6 border border-white/5 mt-12">
                <Image src="/forke-assets/forke_logo.png" alt="Forke Logo" width={60} height={60} className="mx-auto opacity-20 grayscale" />
                <p className="text-lg font-serif text-white/40 leading-relaxed italic">
                   "We believe privacy, transparency, and trust are essential for building a strong creator ecosystem."
                </p>
             </div>
          </article>

        </div>
      </main>

      <Footer />
    </div>
  )
}
