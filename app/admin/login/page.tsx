'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { adminLogin } from '@/lib/admin-actions'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Lock, User } from 'lucide-react'

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
      setError(result.error || 'Failed to login')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-serif text-white tracking-tight">Admin <span className="text-accent italic">Nexus</span></h1>
          <p className="text-xs text-white/40 font-black uppercase tracking-widest">Restricted Access Area</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Username
              </label>
              <input 
                name="username"
                required 
                type="text" 
                className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" 
                placeholder="admin_id" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input 
                name="password"
                required 
                type="password" 
                className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <Button 
            disabled={isLoading}
            className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 transition-all active:scale-[0.98]"
          >
            {isLoading ? 'Decrypting...' : 'Enter Nexus'}
          </Button>
        </form>
      </div>
    </div>
  )
}
