'use client'

import React, { createContext, useContext, useState } from 'react'

interface DashboardContextType {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <DashboardContext.Provider 
      value={{ 
        isMobileOpen, 
        setIsMobileOpen, 
        isCollapsed, 
        setIsCollapsed 
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
