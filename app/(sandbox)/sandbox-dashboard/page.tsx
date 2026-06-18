import React from 'react'
import SandboxWorkspace from '@/components/sandbox/SandboxWorkspace'

export const metadata = {
  title: 'Developer Dashboard | Forke Sandbox',
}

export default function SandboxDashboardPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white">
      <SandboxWorkspace presetRole="developer" />
    </div>
  )
}
