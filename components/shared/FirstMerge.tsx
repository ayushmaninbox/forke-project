'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function FirstMerge() {
  const containerRef = useRef<HTMLDivElement>(null)
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
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto block object-cover"
          >
            <source src="/forke-assets/landing-assets/the first merge.webm" type="video/webm" />
            <source src="/forke-assets/landing-assets/the first merge.mp4" type="video/mp4" />
          </video>
        ) : (
          /* Placeholder to maintain height during lazy load */
          <div className="w-full aspect-[1280/302] bg-[#050505]" />
        )}
      </div>
    </div>
  )
}
