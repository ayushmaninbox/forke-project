'use client'

import React from 'react'
import { useAuthModal } from './AuthContext'
import { Button } from '@/components/ui/Button'
import { signInWithGoogle } from '@/lib/auth-actions'

export default function SignInModal() {
  const { isSignInModalOpen, closeSignInModal } = useAuthModal()

  if (!isSignInModalOpen) return null

  const handleSignIn = async (role: 'developer' | 'client') => {
    // Trigger OAuth with role
    await signInWithGoogle(role)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
        onClick={closeSignInModal}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-8 transform transition-transform duration-300 scale-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className="font-serif text-4xl text-white">
              Join Forke
            </h2>
            <p className="text-muted text-sm font-light">Select your path to get started</p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4">
            <button
              onClick={() => handleSignIn('developer')}
              className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <span className="text-xl font-bold text-white mb-1">I want to earn</span>
              <span className="text-xs text-muted font-light">Claim micro-tasks and get paid</span>
            </button>

            <button
              onClick={() => handleSignIn('client')}
              className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <span className="text-xl font-bold text-white mb-1">I want to hire</span>
              <span className="text-xs text-muted font-light">Post tasks and ship faster</span>
            </button>
          </div>

          <button 
            onClick={closeSignInModal}
            className="text-xs text-muted hover:text-white uppercase tracking-widest font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
