'use client'

import React, { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Loader } from '@/components/ui/Loader'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const [showLoader, setShowLoader] = useState(true)
  const pathname = usePathname()

  const isBypassed = pathname === '/waitlist' || pathname === '/checkout'

  useGSAP(() => {
    if (isBypassed) {
      setShowLoader(false)
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setShowLoader(false)
        // Clear transform inline styling so that fixed elements (like Navbar) correctly reference the global viewport
        gsap.set(containerRef.current, { clearProps: 'transform' })
      }
    })

    // 1. Initial State: Page content is hidden, Loader is fully opaque
    tl.set(containerRef.current, { opacity: 0, y: 12 })
    
    // 2. Play the Loader slide up and fade out after a brief premium delay
    tl.to(loaderRef.current, {
      opacity: 0,
      y: -40,
      duration: 0.55,
      ease: 'power3.inOut',
      delay: 0.35 // Delicate delay so the user can enjoy the floating mascot loader
    })

    // 3. Simultaneously reveal page content with a premium fade and slide
    .to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out'
    }, '-=0.25') // Overlap slightly with loader exit for a seamless reveal
  }, { scope: containerRef, dependencies: [isBypassed] })

  if (isBypassed) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Loader Gate */}
      {showLoader && (
        <div 
          ref={loaderRef}
          className="fixed inset-0 z-[9999] bg-[#050505]"
        >
          <Loader fullScreen text="LOADING FORKE..." />
        </div>
      )}

      {/* Main Page Content */}
      <div ref={containerRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </div>
  )
}
