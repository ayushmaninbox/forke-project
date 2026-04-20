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
        className="fixed inset-0 bg-black/50 transition-opacity duration-300" 
        onClick={closeSignInModal}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition-transform duration-300 scale-100">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-[var(--color-text-primary)]">
              Join Fork<span className="text-accent">e</span>
            </h2>
            <p className="text-muted text-sm">Select your path to get started</p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4">
            <button
              onClick={() => handleSignIn('developer')}
              className="flex flex-col items-center justify-center p-6 border-2 border-[var(--color-border)] rounded-xl hover:border-accent hover:bg-accent-light transition-all group"
            >
              <span className="text-lg font-medium text-[var(--color-text-primary)]">I want to earn</span>
              <span className="text-xs text-muted">Claim micro-tasks and get paid</span>
            </button>

            <button
              onClick={() => handleSignIn('client')}
              className="flex flex-col items-center justify-center p-6 border-2 border-[var(--color-border)] rounded-xl hover:border-accent hover:bg-accent-light transition-all group"
            >
              <span className="text-lg font-medium text-[var(--color-text-primary)]">I want to hire</span>
              <span className="text-xs text-muted">Post tasks and ship faster</span>
            </button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeSignInModal}
            className="text-xs decoration-none hover:bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
