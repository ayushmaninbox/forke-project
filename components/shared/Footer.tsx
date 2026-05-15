import React from 'react'

import { GitFork, Bird, Camera, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-24 border-t border-border bg-bg px-4 mb-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="/forke-assets/forke_logo.png" 
              alt="Forke Logo" 
              className="w-8 h-8 object-contain"
            />
            <div className="font-serif text-3xl text-white">
              Forke
            </div>
          </div>
          <p className="text-muted text-sm font-light leading-relaxed max-w-xs">
            Built for India&apos;s developers. <br />
            The micro-task marketplace to ship real work and get paid instantly.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
          <ul className="space-y-4">
            <li><a href="#how-it-works" className="text-muted hover:text-white transition-colors text-sm font-light">How it works</a></li>
            <li><a href="/bounties" className="text-muted hover:text-white transition-colors text-sm font-light">Bounties</a></li>
            <li><a href="/levels" className="text-muted hover:text-white transition-colors text-sm font-light">Levels</a></li>
            <li><a href="/leaderboard" className="text-muted hover:text-white transition-colors text-sm font-light">Leaderboards</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
          <ul className="space-y-4">
            <li><a href="/blog" className="text-muted hover:text-white transition-colors text-sm font-light">Blog</a></li>
            <li><a href="#" className="text-muted hover:text-white transition-colors text-sm font-light">Docs</a></li>
            <li><a href="#" className="text-muted hover:text-white transition-colors text-sm font-light">Help Center</a></li>
            <li><a href="#" className="text-muted hover:text-white transition-colors text-sm font-light">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Connect</h4>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/10"><Bird className="w-4 h-4" /></a>
            <a href="#" className="text-muted hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/10"><MessageCircle className="w-4 h-4" /></a>
            <a href="https://github.com/ayushmaninbox/forke" target="_blank" className="text-muted hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/10"><GitFork className="w-4 h-4" /></a>
            <a href="#" className="text-muted hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/10"><Camera className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted text-xs uppercase tracking-widest font-bold">© 2026 Forke. All rights reserved.</p>
        <p className="text-muted text-xs font-light">Made with <span className="text-red-500">❤️</span> and late nights.</p>
      </div>
    </footer>
  )
}
