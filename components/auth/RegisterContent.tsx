'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import { signInWithGoogle, signInWithGitHub } from '@/lib/auth-actions'
import { Eye, EyeOff, ArrowLeft, Zap, Plus, Info, CheckCircle2, ShieldCheck, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { submitClientApplication } from '@/lib/client-actions'
import { useSession, signIn, signOut } from 'next-auth/react'

function RegisterContentInner() {
  const { data: session, status: sessionStatus } = useSession()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<'developer' | 'client' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [lastUsed, setLastUsed] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    contactEmail: '',
    companyName: '',
    companyWebsite: '',
    personalLinkedIn: '',
    companyLinkedIn: '',
    designation: '',
    otherLinks: '',
    message: ''
  })

  // Auto-verify if session exists
  const isGoogleAuthenticated = sessionStatus === 'authenticated'
  const isAlreadyDeveloper = session?.user?.role === 'developer'

  // Load persisted data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('forke_client_app_draft')
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData))
      } catch (e) {
        console.error('Failed to parse form draft')
      }
    }
  }, [])

  // Persist data whenever it changes
  const updateField = (name: string, value: string) => {
    const newDraft = { ...formData, [name]: value }
    setFormData(newDraft)
    localStorage.setItem('forke_client_app_draft', JSON.stringify(newDraft))
  }

  useEffect(() => {
    const saved = localStorage.getItem('forke_last_auth')
    if (saved) setLastUsed(saved)

    const roleParam = searchParams.get('role') as 'developer' | 'client' | null
    if (roleParam === 'developer' || roleParam === 'client') {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleSocialClick = async (provider: 'google' | 'github') => {
    if (!role) return
    localStorage.setItem('forke_last_auth', provider)
    
    // For clients, we want to redirect back here to finish the form
    const redirectTo = role === 'client' ? '/register?role=client' : '/dashboard'
    
    if (provider === 'google') {
      await signInWithGoogle(role, redirectTo)
    } else {
      await signInWithGitHub(role, redirectTo)
    }
  }

  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isGoogleAuthenticated) return
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      contactNumber: formData.get('contactNumber'),
      contactEmail: formData.get('contactEmail'),
      companyName: formData.get('companyName'),
      companyWebsite: formData.get('companyWebsite'),
      personalLinkedIn: formData.get('personalLinkedIn'),
      companyLinkedIn: formData.get('companyLinkedIn'),
      designation: formData.get('designation'),
      otherLinks: formData.get('otherLinks'),
      message: formData.get('message'),
    }

    const result = await submitClientApplication(data)
    if (result.success) {
      setIsSubmitted(true)
      localStorage.removeItem('forke_client_app_draft') // Clear on success
    } else {
      alert(result.error || 'Submission failed')
    }
    setIsSubmitting(false)
  }

  // Success View Component
  const SuccessView = () => (
    <div className="w-full max-w-[500px] space-y-8 relative z-10 my-auto animate-in fade-in zoom-in duration-700 text-center">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent relative">
          <CheckCircle2 className="w-12 h-12" />
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-serif text-white tracking-tight">Application <span className="text-accent italic">Received</span></h2>
        <div className="space-y-6 text-white/50 leading-relaxed max-w-[400px] mx-auto text-sm">
          <p>
            Thank you for your interest in Forke. Our team will review your application to ensure the highest quality of projects on the platform.
          </p>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <p className="text-white/80 font-bold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-accent" /> Approval Timeline
            </p>
            <p className="text-[12px]">Approval will be done in <span className="text-white font-bold">24-48 hours</span>.</p>
          </div>
          <p className="flex items-center justify-center gap-2 text-accent/80 font-medium">
            <Mail className="w-4 h-4" /> You will receive an email shortly.
          </p>
        </div>
      </div>

      <div className="pt-8">
        <Link href="/">
          <Button variant="outline" className="rounded-full px-8 py-3 border-white/10 text-white/40 hover:text-white transition-all uppercase tracking-widest text-[10px] font-black">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="h-screen w-full bg-[#0A0A0A] flex flex-col md:flex-row overflow-hidden selection:bg-accent selection:text-white fixed inset-0">
      
      {/* Left Panel: Manga Artwork */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-full bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/forke-assets/auth-assets/manga-panel-desktop.png"
            alt="Manga Artwork"
            fill
            className="object-contain object-top opacity-95 transition-all duration-700 hover:scale-[1.02]"
            priority
          />
        </div>
        
        {/* Reduced Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]/40 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent md:hidden" />
      </div>

      {/* Right Panel: Elegant Orangish Auth */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-between relative bg-[#0A0A0A] px-6 py-8 md:py-12 overflow-y-auto overflow-x-hidden">
        
        {/* Back to Site Button */}
        {!isSubmitted && (
          <Link 
            href="/" 
            className="absolute top-8 right-8 z-20 flex items-center gap-2 text-[10px] text-white/20 hover:text-accent font-black uppercase tracking-[0.2em] transition-all group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Back to site
          </Link>
        )}

        {/* Subtle Ambient Orbs */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-48 h-48 bg-accent/5 blur-[80px] rounded-full" />

        {isSubmitted ? (
          <SuccessView />
        ) : !role ? (
          <div className="w-full max-w-[500px] space-y-8 relative z-10 my-auto animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Choose your <span className="text-accent italic">Path</span></h1>
              <p className="text-[11px] md:text-[13px] text-white/40 font-medium tracking-wide uppercase">How would you like to join Forke?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setRole('client')}
                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-accent/40 hover:bg-accent/[0.02] transition-all text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                   <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Post Tasks</h3>
                  <p className="text-xs text-white/40 leading-relaxed">I have projects and need developers to ship features.</p>
                </div>
              </button>

              <button 
                onClick={() => setRole('developer')}
                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-accent/40 hover:bg-accent/[0.02] transition-all text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                   <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Do Tasks</h3>
                  <p className="text-xs text-white/40 leading-relaxed">I'm a developer looking to earn by shipping code.</p>
                </div>
              </button>
            </div>
            
            <div className="text-center pt-8 border-t border-white/5">
               <p className="text-sm text-white/30 font-medium">
                Already have an account? <Link href="/signin" className="text-white hover:text-accent transition-colors font-bold underline underline-offset-8 decoration-white/10 hover:decoration-accent/40">Sign in to your account</Link>
              </p>
            </div>
          </div>
        ) : role === 'client' ? (
          /* Client Application Form */
          <div className="w-full max-w-[600px] space-y-8 relative z-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <button 
                onClick={() => setRole(null)}
                className="text-[10px] text-white/20 hover:text-accent font-black uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Change Path
              </button>
              <h1 className="text-4xl font-serif text-white tracking-tight">Post Tasks <span className="text-accent italic">Application</span></h1>
              <p className="text-xs text-white/40 font-medium tracking-wide uppercase">Tell us about yourself and your company</p>
            </div>

            <form onSubmit={handleClientSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} type="text" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="John" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} type="text" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Contact Number</label>
                  <input required name="contactNumber" value={formData.contactNumber} onChange={(e) => updateField('contactNumber', e.target.value)} type="tel" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="+91 00000 00000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Contact Email</label>
                  <input required name="contactEmail" value={formData.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} type="email" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="john@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Company Name</label>
                  <input required name="companyName" value={formData.companyName} onChange={(e) => updateField('companyName', e.target.value)} type="text" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="Acme Inc." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    Company Website <span className="text-[9px] lowercase opacity-50 font-medium">(optional)</span>
                  </label>
                  <input name="companyWebsite" value={formData.companyWebsite} onChange={(e) => updateField('companyWebsite', e.target.value)} type="url" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="https://acme.com" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Personal LinkedIn Page Link</label>
                  <input required name="personalLinkedIn" value={formData.personalLinkedIn} onChange={(e) => updateField('personalLinkedIn', e.target.value)} type="url" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Company LinkedIn Page Link</label>
                  <input required name="companyLinkedIn" value={formData.companyLinkedIn} onChange={(e) => updateField('companyLinkedIn', e.target.value)} type="url" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="linkedin.com/company/acme" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Designation</label>
                  <input required name="designation" value={formData.designation} onChange={(e) => updateField('designation', e.target.value)} type="text" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="CTO / Founder / Engineering Manager" />
                </div>
                <div className="space-y-1.5 group relative">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                    Other Relevant Links <span className="text-[9px] lowercase opacity-50 font-medium">(optional)</span>
                    <div className="relative group">
                      <Info className="w-3 h-3 cursor-help text-accent/60 hover:text-accent transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl bg-accent text-[10px] text-bg font-bold leading-tight opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                        Please provide URLs that help verify your company's professional standing, such as portfolio sites, case studies, or press coverage.
                      </div>
                    </div>
                  </label>
                  <input name="otherLinks" value={formData.otherLinks} onChange={(e) => updateField('otherLinks', e.target.value)} type="text" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="Portfolio, GitHub Org, Press releases..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Message <span className="text-[9px] lowercase opacity-50 font-medium">(optional)</span></label>
                  <textarea name="message" value={formData.message} onChange={(e) => updateField('message', e.target.value)} className="w-full h-24 bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all resize-none" placeholder="Tell us about the tasks you plan to post..." />
                </div>
              </div>

              {/* Compulsory Google Authentication */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-accent" /> Identity Verification
                    </h4>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">
                      {sessionStatus === 'loading' ? 'Checking for connection...' : 
                       sessionStatus === 'authenticated' ? 'Identity confirmed via Google' :
                       'Connect your Google account to proceed'}
                    </p>
                  </div>
                  {isGoogleAuthenticated && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase animate-in fade-in zoom-in duration-500">
                      <CheckCircle2 className="w-3 h-3" /> Identity Verified
                    </div>
                  )}
                </div>

                {isAlreadyDeveloper ? (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-red-400">
                      <ShieldCheck className="w-4 h-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">Access Denied</p>
                    </div>
                    <p className="text-[11px] text-red-200/60 leading-relaxed">
                      This account is already registered as a <span className="text-white font-bold">Developer</span>. You cannot apply for Owner status with this account. Please use a different Google account.
                    </p>
                    <button 
                      type="button" 
                      onClick={() => signOut({ callbackUrl: '/register?role=client' })} 
                      className="text-[10px] text-red-400 font-bold hover:underline"
                    >
                      Sign out & switch account
                    </button>
                  </div>
                ) : isGoogleAuthenticated ? (
                  <div className="p-4 rounded-2xl bg-accent/[0.03] border border-accent/20 flex items-center justify-between group animate-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center bg-accent/10">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Connected Identity</p>
                        <p className="text-xs text-white font-bold">{session?.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">Verified</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => signOut({ callbackUrl: '/register?role=client' })} 
                        className="text-[9px] text-white/20 hover:text-white transition-colors uppercase font-black hover:underline"
                      >
                        Switch Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      type="button"
                      variant="outline"
                      disabled={sessionStatus === 'loading'}
                      onClick={() => {
                        document.cookie = "forke_role=client; path=/; max-age=3600";
                        signIn('google', { callbackUrl: '/register?role=client' });
                      }}
                      className="w-full h-12 gap-3 border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent/40 rounded-2xl text-xs font-bold transition-all group disabled:opacity-50"
                    >
                      {sessionStatus === 'loading' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                          </svg>
                          Verify with Google
                        </>
                      )}
                    </Button>
                    <p className="text-[9px] text-center text-white/20 font-medium">
                      Already signed in on Google? <button type="button" onClick={() => window.location.reload()} className="text-accent hover:underline">Refresh Page</button>
                    </p>
                  </div>
                )}
              </div>

              <Button 
                type="submit"
                disabled={!isGoogleAuthenticated || isAlreadyDeveloper || isSubmitting}
                className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : 'Submit Application'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-[400px] space-y-6 relative z-10 my-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Brand Header */}
            <div className="flex flex-col items-center">
               <div className="h-[90px] flex items-center justify-center relative mb-4">
                  <Link href="/" className="group relative z-10">
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                    <Image 
                      src="/forke-assets/forke_logo.png" 
                      alt="Forke Logo" 
                      width={140} 
                      height={140} 
                      className="relative z-10 drop-shadow-[0_0_25px_rgba(255,122,0,0.6)] transition-transform group-hover:rotate-12"
                    />
                  </Link>
               </div>
               <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">Join the <span className="text-accent italic">Movement</span></h1>
                  <p className="text-[11px] md:text-[13px] text-white/40 font-medium tracking-wide uppercase">
                    Registering as a <span className="text-accent font-black">{role}</span>. 
                    <button onClick={() => setRole(null)} className="ml-2 text-white/20 hover:text-white underline underline-offset-2">Change</button>
                  </p>
               </div>
            </div>

            <div className="space-y-4">
              {/* Social Logins */}
              <div className="grid grid-cols-1 gap-3">
                <div className="relative group">
                  {lastUsed === 'google' && (
                    <div className="absolute -top-2.5 right-4 z-20">
                      <span className="bg-accent text-[9px] text-white px-3 py-0.5 rounded-full font-black tracking-tighter uppercase shadow-lg shadow-accent/20 border border-white/10">Last Used</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full h-11 md:h-13 gap-4 border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent/40 text-sm font-bold rounded-2xl transition-all text-white/80 hover:text-white group"
                    onClick={() => handleSocialClick('google')}
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Sign up with Google
                  </Button>
                </div>

                <div className="relative group">
                  {lastUsed === 'github' && (
                    <div className="absolute -top-2.5 right-4 z-20">
                      <span className="bg-accent text-[9px] text-white px-3 py-0.5 rounded-full font-black tracking-tighter uppercase shadow-lg shadow-accent/20 border border-white/10">Last Used</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full h-11 md:h-13 gap-4 border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent/40 text-sm font-bold rounded-2xl transition-all text-white/80 hover:text-white group"
                    onClick={() => handleSocialClick('github')}
                  >
                    <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    Sign up with GitHub
                  </Button>
                </div>
              </div>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0A0A0A] px-4 text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">or credentials</span>
                </div>
              </div>

              {/* Elegant Form Fields */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full h-11 md:h-13 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full h-11 md:h-13 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full h-11 md:h-13 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button className="w-full h-11 md:h-13 text-sm font-black uppercase tracking-widest rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 active:scale-[0.98] transition-all">
                Create Account
              </Button>
            </div>

            <div className="text-center pt-2">
               <p className="text-sm text-white/30 font-medium">
                Already have an account? <Link href="/signin" className="text-white hover:text-accent transition-colors font-bold underline underline-offset-8 decoration-white/10 hover:decoration-accent/40">Log in to dashboard</Link>
               </p>
            </div>
          </div>
        )}

        {/* Brand Legal Footer */}
        <div className="w-full max-w-[500px] text-center relative z-10 pt-6">
          <p className="text-[9px] md:text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none whitespace-nowrap overflow-visible">
            By using Forke, you are agreeing to the <Link href="/terms" className="text-white/40 hover:text-accent transition-colors underline underline-offset-4 decoration-white/5 hover:decoration-accent/40">Terms of Services</Link> and <Link href="/privacy" className="text-white/40 hover:text-accent transition-colors underline underline-offset-4 decoration-white/5 hover:decoration-accent/40">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterContent() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#0A0A0A] flex items-center justify-center text-white/20 uppercase font-black tracking-widest">Loading...</div>}>
      <RegisterContentInner />
    </Suspense>
  )
}
