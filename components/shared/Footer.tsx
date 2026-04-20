import React from 'react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--color-border)] bg-white px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="font-serif text-xl text-[var(--color-text-primary)]">
          Fork<span className="text-accent">e</span>
        </div>

        {/* Tagline */}
        <p className="text-muted text-sm text-center md:text-left">
          Built for India&apos;s developers
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/ayushmaninbox/forke" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted hover:text-[var(--color-text-primary)] transition-colors text-sm"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
