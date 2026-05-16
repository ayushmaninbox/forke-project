'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { submitEnquiry } from '@/lib/actions/support-actions'
import { Info, ArrowLeft, Send, CheckCircle2, ShieldX, AlertTriangle, UserX } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorType = searchParams.get('error')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    contactEmail: '',
    message: '',
    relevantLinks: ''
  })
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // Ensure they are fully signed out when hitting this page if they had a bad session
  useEffect(() => {
    // Check if the cookie was set by the auth flow
    const hasAuthCookie = document.cookie.includes('forke_auth_error=1')
    
    if (!errorType || !hasAuthCookie) {
      router.push('/')
      return
    }

    setIsValid(true)

    // Clear the cookie so they can't refresh
    document.cookie = "forke_auth_error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (errorType === 'AccessDenied' || errorType === 'GitHubIdentityMismatch') {
       signOut({ redirect: false })
    }
  }, [errorType, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await submitEnquiry({ ...formData, errorType })
    
    if (result.success) {
      setSuccess(true)
    } else {
      setSubmitError(result.error || 'Failed to submit enquiry.')
    }
    setIsSubmitting(false)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  let title = 'Authentication Error'
  let description = 'Something went wrong during the authentication process. Please try again or contact support.'
  let ErrorIcon = AlertTriangle
  let iconColor = 'text-accent'
  let bgColor = 'bg-accent/10'
  let titleColor = 'text-white'

  if (errorType === 'AccessDenied') {
    title = 'Access Denied'
    description = 'Your account may have been suspended or you do not have permission to access this platform. If you believe this is a mistake, please submit an appeal below.'
    ErrorIcon = ShieldX
    iconColor = 'text-red-500'
    bgColor = 'bg-red-500/10'
    titleColor = 'text-red-400'
  } else if (errorType === 'GitHubIdentityMismatch') {
    title = 'Identity Conflict'
    description = 'The GitHub profile you are trying to link does not match the one registered to your account. This action was blocked to protect your identity. Please contact support to resolve this.'
    ErrorIcon = GithubIcon as any
    iconColor = 'text-accent'
    bgColor = 'bg-accent/10'
    titleColor = 'text-accent'
  } else if (errorType) {
    description = `An error occurred: ${errorType}. Please contact support.`
  }

  if (!isValid) return null

  return (
    <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col justify-center h-full">
      
      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-4 group w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="flex flex-col items-center mb-6 text-center">
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mb-3`}>
          <ErrorIcon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h1 className={`text-2xl font-serif tracking-tight ${titleColor}`}>{title}</h1>
        <p className="text-xs text-white/60 mt-2 max-w-[400px] font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {success ? (
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-3 glass">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-white">Message Received</h2>
          <p className="text-xs text-white/60">We have received your enquiry and will get back to you shortly via the provided email.</p>
          <Button onClick={() => signOut({ callbackUrl: '/' })} className="mt-4 w-full h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">
            Return to Home
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 glass">
          <div className="text-center pb-3 border-b border-white/5">
            <h2 className="text-xs font-black uppercase tracking-widest text-white">Contact Support</h2>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <Info className="w-3 h-3 text-red-400 shrink-0" />
              <p className="text-[10px] text-red-400 font-medium">{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">First Name</label>
              <input required value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} type="text" className="w-full h-9 bg-black/40 border border-white/5 rounded-xl px-3 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">Last Name</label>
              <input required value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} type="text" className="w-full h-9 bg-black/40 border border-white/5 rounded-xl px-3 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">Email Address</label>
              <input required value={formData.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} type="email" className="w-full h-9 bg-black/40 border border-white/5 rounded-xl px-3 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">Contact Number</label>
              <input required value={formData.contactNumber} onChange={e => updateField('contactNumber', e.target.value)} type="tel" className="w-full h-9 bg-black/40 border border-white/5 rounded-xl px-3 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1">Message</label>
            <textarea required value={formData.message} onChange={e => updateField('message', e.target.value)} className="w-full h-16 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all resize-none" placeholder="Please describe your issue..." />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1 flex justify-between">
              Relevant Links <span className="text-[8px] lowercase opacity-50">optional</span>
            </label>
            <input value={formData.relevantLinks} onChange={e => updateField('relevantLinks', e.target.value)} type="text" className="w-full h-9 bg-black/40 border border-white/5 rounded-xl px-3 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" placeholder="GitHub profile, portfolio, etc." />
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 text-[10px] font-black uppercase tracking-widest rounded-xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 disabled:opacity-30 disabled:pointer-events-none transition-all mt-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Submit Enquiry <Send className="w-3 h-3" />
              </div>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <Suspense fallback={<Loader text="LOADING ERROR DETAILS" />}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
