'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { adminLogin } from '@/lib/admin-actions'
import { useRouter } from 'next/navigation'
import { Lock, User, Terminal, ShieldAlert, KeyRound } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await adminLogin(formData)

    if (result.success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(result.error || 'Failed to authenticate')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* High-End Technical Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />
        
        {/* Premium ambient orange glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-[140px]" />
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-accent/[0.015] rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-accent/[0.015] rounded-full blur-[100px]" />

        {/* Technical HUD borders */}
        <div className="absolute left-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
        <div className="absolute right-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
        <div className="absolute top-8 left-8 right-8 h-[1px] bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
        <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
      </div>

      <div className="w-full max-w-[390px] space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Logo and Terminal Identity */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center h-14 relative mb-2">
            <div className="w-12 h-12 relative">
              <Image 
                src="/forke-assets/forke_logo.png" 
                alt="Logo" 
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(255,122,0,0.25)] select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-white tracking-wide leading-tight">
              Forke <span className="text-accent italic font-normal">Admin Panel</span>
            </h1>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] font-mono">
              Secure Operations Interface
            </p>
          </div>
        </div>

        {/* Auth Console Card */}
        <form 
          onSubmit={handleSubmit} 
          className="p-8 rounded-3xl bg-[#0a0a0a]/80 border border-white/[0.06] space-y-6 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-3xl relative overflow-hidden group text-left"
        >
          {/* Subtle top edge glow border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />

          {/* Secure Access Badge */}
          <div className="flex items-center gap-2 bg-accent/[0.03] border border-accent/15 rounded-full px-3 py-1 w-fit">
            <Terminal className="w-3 h-3 text-accent animate-pulse" />
            <span className="text-[8px] text-accent font-black uppercase tracking-[0.18em] font-mono">Secure Node Access</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 text-red-400 text-[10px] font-bold font-mono text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
              <ShieldAlert className="w-4 h-4 shrink-0 opacity-70" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest ml-1 font-mono">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  name="username"
                  required 
                  type="text" 
                  autoComplete="off"
                  className="w-full h-11 bg-[#050505] border border-white/[0.08] rounded-xl pl-11 pr-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/20 transition-all font-sans font-medium" 
                  placeholder="username" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest ml-1 font-mono">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input 
                  name="password"
                  required 
                  type="password" 
                  className="w-full h-11 bg-[#050505] border border-white/[0.08] rounded-xl pl-11 pr-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/20 transition-all font-sans font-medium" 
                  placeholder="password" 
                />
              </div>
            </div>
          </div>

          {/* Authenticate Button */}
          <Button 
            disabled={isLoading}
            className="w-full h-12 text-[11px] font-black uppercase tracking-[0.18em] rounded-xl bg-accent hover:bg-accent-hover text-white shadow-xl shadow-accent/5 transition-all duration-300 active:scale-[0.98] relative z-10"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Decrypting Token...</span>
              </div>
            ) : (
              'Authenticate Access'
            )}
          </Button>

          {/* Institutional Disclaimer */}
          <div className="pt-5 border-t border-white/[0.04] text-center space-y-1.5">
            <p className="text-[8px] text-white/20 font-mono tracking-widest uppercase flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-red-500/30" /> Classified Environment
            </p>
            <p className="text-[7.5px] text-white/15 font-mono leading-normal max-w-[280px] mx-auto select-none">
              All interactions on this console are encrypted and recorded under system telemetry. Unauthorized entries are strictly prohibited.
            </p>
          </div>

        </form>



      </div>
    </div>
  )
}
