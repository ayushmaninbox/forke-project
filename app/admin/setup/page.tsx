'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { validateInviteToken, setupAdminCredentials } from '@/lib/admin-dashboard-actions'
import { Button } from '@/components/ui/Button'
import { Lock, User, Terminal, ShieldAlert, KeyRound, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'

function SetupFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isValidating, setIsValidating] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [inviteDetails, setInviteDetails] = useState<{ email: string; name: string } | null>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setValidationError('Invitation token is missing in the URL.')
      setIsValidating(false)
      return
    }

    async function checkToken() {
      try {
        const res = await validateInviteToken(token!)
        if (res.success) {
          setInviteDetails({ email: res.email!, name: res.name! })
        } else {
          setValidationError(res.error || 'Invalid or expired invitation token.')
        }
      } catch (err) {
        console.error('Validation error:', err)
        setValidationError('Failed to verify token. Please try again.')
      } finally {
        setIsValidating(false)
      }
    }

    checkToken()
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (!token) return

    if (!username.trim() || username.length < 3) {
      setSubmitError('Username must be at least 3 characters long.')
      return
    }

    if (password.length < 8) {
      setSubmitError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await setupAdminCredentials(token, username.trim(), password)
      if (res.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/admin/login')
        }, 3000)
      } else {
        setSubmitError(res.error || 'Failed to complete credentials setup.')
      }
    } catch (err) {
      console.error('Setup error:', err)
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-xs text-white/40 font-mono tracking-widest uppercase">Verifying Invitation Token...</p>
      </div>
    )
  }

  if (validationError) {
    return (
      <div className="p-8 rounded-3xl bg-[#0a0a0a]/80 border border-red-500/10 space-y-6 text-center shadow-[0_24px_64px_rgba(0,0,0,0.85)] max-w-md w-full">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif text-white tracking-wide">Verification Failed</h2>
          <p className="text-xs text-white/40 leading-relaxed font-light font-sans">{validationError}</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/login')}
          className="w-full h-11 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
        >
          Return to Login
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="p-8 rounded-3xl bg-[#0a0a0a]/80 border border-emerald-500/15 space-y-6 text-center shadow-[0_24px_64px_rgba(0,0,0,0.85)] max-w-md w-full animate-in zoom-in-95 duration-500">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Check className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif text-emerald-400 tracking-wide font-bold">Setup Completed!</h2>
          <p className="text-xs text-white/50 leading-relaxed font-light font-sans">
            Your administrator account credentials have been successfully configured. Redirecting you to the control login terminal...
          </p>
        </div>
      </div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 rounded-3xl bg-[#0a0a0a]/80 border border-white/[0.06] space-y-6 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-3xl relative overflow-hidden group text-left max-w-md w-full"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <span className="text-[8px] text-accent font-black uppercase tracking-[0.18em] font-mono block">Setup Terminal</span>
          <h2 className="text-lg font-serif text-white tracking-wide mt-1">Activate Admin Credentials</h2>
        </div>
        <Terminal className="w-5 h-5 text-accent/60" />
      </div>

      <div className="p-3.5 rounded-xl bg-accent/[0.02] border border-accent/10 space-y-1">
        <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest font-bold">Invited User</p>
        <p className="text-sm font-semibold text-white leading-tight">{inviteDetails?.name}</p>
        <p className="text-xs text-white/30 font-mono leading-none">{inviteDetails?.email}</p>
      </div>

      {submitError && (
        <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 text-red-400 text-[10px] font-bold font-mono text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0 opacity-70" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest ml-1 font-mono">
            Choose Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
              <User className="w-4 h-4" />
            </span>
            <input 
              required 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              autoComplete="off"
              className="w-full h-11 bg-[#050505] border border-white/[0.08] rounded-xl pl-11 pr-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/20 transition-all font-sans font-medium" 
              placeholder="e.g. your_name_123" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest ml-1 font-mono">
            Choose Password (min 8 chars)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
              <KeyRound className="w-4 h-4" />
            </span>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-[#050505] border border-white/[0.08] rounded-xl pl-11 pr-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/20 transition-all font-sans font-medium" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest ml-1 font-mono">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
              <KeyRound className="w-4 h-4" />
            </span>
            <input 
              required 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 bg-[#050505] border border-white/[0.08] rounded-xl pl-11 pr-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/20 transition-all font-sans font-medium" 
              placeholder="••••••••" 
            />
          </div>
        </div>
      </div>

      <Button 
        disabled={isSubmitting}
        className="w-full h-12 text-[11px] font-black uppercase tracking-[0.18em] rounded-xl bg-accent hover:bg-accent-hover text-white shadow-xl shadow-accent/5 transition-all duration-300 active:scale-[0.98] relative z-10"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Hashing & Syncing...</span>
          </div>
        ) : (
          'Activate Admin Account'
        )}
      </Button>
    </form>
  )
}

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* High-End Technical Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-[140px]" />
        
        {/* Technical HUD borders */}
        <div className="absolute left-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
        <div className="absolute right-8 top-8 bottom-8 w-[1px] bg-gradient-to-b from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
        <div className="absolute top-8 left-8 right-8 h-[1px] bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
        <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-white/[0.03]" />
      </div>

      <div className="w-full max-w-[440px] space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center">
        
        {/* Logo and Terminal Identity */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center h-20 relative mb-2">
            <div className="w-20 h-20 relative">
              <Image 
                src="/forke-assets/forke_logo.png" 
                alt="Logo" 
                fill
                className="object-contain drop-shadow-[0_0_18px_rgba(255,122,0,0.3)] select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-white tracking-wide leading-tight">
              Forke <span className="text-accent italic font-normal">Onboarding</span>
            </h1>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] font-mono">
              Secure Operations Access System
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase">Loading Setup Form...</p>
          </div>
        }>
          <SetupFormContent />
        </Suspense>

      </div>
    </div>
  )
}
