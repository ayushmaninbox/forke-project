'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function FirstMerge() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shadowHostRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // 1. Lazy loading observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px', // Lazy-load 200px before the video enters the viewport
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 2. Mount video inside a closed Shadow DOM when visible to hide it from browser extensions
  useEffect(() => {
    if (!isVisible || !shadowHostRef.current) return

    // Clean up any existing content
    shadowHostRef.current.innerHTML = ''

    // Attach a closed shadow root to completely hide it from DOM selectors
    const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'closed' })

    // Create the video element
    const video = document.createElement('video')
    video.autoplay = true
    video.loop = true
    video.muted = true
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.preload = 'metadata'
    
    // Style encapsulation inside the shadow DOM
    video.style.width = '100%'
    video.style.height = 'auto'
    video.style.display = 'block'
    video.style.objectFit = 'cover'

    // Create video sources
    const sourceWebM = document.createElement('source')
    sourceWebM.src = '/forke-assets/landing-assets/the first merge.webm'
    sourceWebM.type = 'video/webm'

    const sourceMP4 = document.createElement('source')
    sourceMP4.src = '/forke-assets/landing-assets/the first merge.mp4'
    sourceMP4.type = 'video/mp4'

    video.appendChild(sourceWebM)
    video.appendChild(sourceMP4)

    // Append video to the closed shadow root
    shadowRoot.appendChild(video)
  }, [isVisible])

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden bg-bg">
      {/* Edge blending overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_30px_rgba(5,5,5,1)] md:shadow-[inset_0_0_80px_rgba(5,5,5,1)]" />
      <div className="absolute top-0 left-0 right-0 h-8 md:h-28 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-8 md:h-28 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 left-0 w-3 md:w-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-3 md:w-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10" />

      {/* Video Content */}
      <div className="w-full flex items-center justify-center">
        {isVisible ? (
          <div ref={shadowHostRef} className="w-full" />
        ) : (
          /* Placeholder to maintain height during lazy load */
          <div className="w-full aspect-[1280/302] bg-[#050505]" />
        )}
      </div>
    </div>
  )
}
