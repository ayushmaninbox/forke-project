import React from 'react'
import SandboxWorkspace from '@/components/sandbox/SandboxWorkspace'

export const metadata = {
  title: 'Post a Task | Forke Sandbox',
}

export default function SandboxPostTaskPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white">
      <SandboxWorkspace presetRole="owner" />
    </div>
  )
}
