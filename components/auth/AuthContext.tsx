'use client'

import React, { createContext, useContext, useState } from 'react'

interface AuthContextType {
  isSignInModalOpen: boolean
  openSignInModal: () => void
  closeSignInModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const openSignInModal = () => setIsSignInModalOpen(true)
  const closeSignInModal = () => setIsSignInModalOpen(false)

  return (
    <AuthContext.Provider
      value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthProvider')
  }
  return context
}
