'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface TechStackItem {
  name: string;
  color: string;
  logo: React.ReactNode;
}

const TECH_STACKS: TechStackItem[] = [
  {
    name: "React",
    color: "#61DAFB",
    logo: (
      <svg className="w-5 h-5" viewBox="-11.5 -10.23 23 20.47" fill="none" stroke="currentColor" strokeWidth="1.2" xmlns="http://www.w3.org/2000/svg">
        <circle r="2.05" fill="currentColor" stroke="none"/>
        <g stroke="currentColor">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    )
  },
  {
    name: "Next.js",
    color: "#FFFFFF",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.2 14.8l-5.6-7.2h-1v6h-1.2v-7.8h1.8l5 6.4V7.8h1.2v9h-.2z" />
      </svg>
    )
  },
  {
    name: "HTML/CSS",
    color: "#E34F26",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 2l1.6 18 7.4 2 7.4-2L21 2H3zm13.2 7.1h-5.6l-.2-2.3h5.9l.2-2.3H6.9l.6 6.8h5.9l-.3 3-2.7.8-2.7-.8-.2-1.7H5.2l.3 3.6 6.5 1.8 6.5-1.8.7-7.4z" />
      </svg>
    )
  },
  {
    name: "Python",
    color: "#3776AB",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg>
    )
  },
  {
    name: "PHP",
    color: "#777BB4",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 13h-3v-6h3c1.1 0 2 .9 2 2s-.9 2-2 2zm-1.5-3v-2h1.5c.28 0 .5.22.5.5s-.22.5-.5.5zm8.5 3h-3v-6h3c1.1 0 2 .9 2 2s-.9 2-2 2zm-1.5-3v-2h1.5c.28 0 .5.22.5.5s-.22.5-.5.5zM7.5 15h-3v-6h3c1.1 0 2 .9 2 2s-.9 2-2 2zm-1.5-3v-2h1.5c.28 0 .5.22.5.5s-.22.5-.5.5z" />
      </svg>
    )
  },
  {
    name: "Go (Golang)",
    color: "#00ADD8",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.07 9.87c.22-.6.54-1.12.95-1.57.42-.45.92-.81 1.5-1.07.57-.26 1.22-.39 1.93-.39.68 0 1.3.12 1.85.35.55.23 1.02.57 1.41.99.39.42.69.94.9 1.55a6.45 6.45 0 0 1-.03 4.2c-.22.6-.54 1.13-.96 1.58-.42.45-.92.8-1.5 1.06a5.77 5.77 0 0 1-3.79-.04 5.3 5.3 0 0 1-1.42-.99 5.16 5.16 0 0 1-.9-1.55 6.48 6.48 0 0 1 .07-4.17zM1.3 12.38c0-.75.14-1.45.42-2.1.29-.65.69-1.2 1.2-1.66.5-.47 1.1-.82 1.78-1.07a6.6 6.6 0 0 1 4.54.08c.67.26 1.25.62 1.74 1.08l-1.65 1.62c-.31-.28-.67-.5-1.08-.65a3.42 3.42 0 0 0-2.4-.04c-.38.14-.7.34-.94.6-.25.26-.43.57-.55.93-.12.35-.18.73-.18 1.14 0 .42.06.8.18 1.15.12.36.3.67.55.93.24.26.56.46.94.6.38.14.78.21 1.2.21.49 0 .93-.1 1.32-.29a2.76 2.76 0 0 0 .98-.82H8.38v-2.24h4.86v4.95h-1.68l-.48-.96c-.4.36-.88.64-1.44.84a5.55 5.55 0 0 1-3.79-.06 4.9 4.9 0 0 1-1.74-1.08c-.51-.47-.9-1.03-1.19-1.68a5.5 5.5 0 0 1-.42-2.1z" />
      </svg>
    )
  },
  {
    name: "Rust",
    color: "#E05D44",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm-3.5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg>
    )
  },
  {
    name: "Nuxt.js",
    color: "#00DC82",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.18 5.45L6.36 15.5l1.64 2.85h13.1l-1.64-2.85L12.18 5.45zM8.36 15.5l3.82-6.63 3.82 6.63H8.36zM3.45 20.35h17.1L12.00 4.1 3.45 20.35z" />
      </svg>
    )
  },
  {
    name: "Vue.js",
    color: "#41B883",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 21.15L3.45 6.35h4.91L12.00 12.6l3.64-6.25h4.91L12.00 21.15zM7.18 6.35h3.09L12.00 9.2l1.73-2.85h3.09L12.00 16.2 7.18 6.35z" />
      </svg>
    )
  },
  {
    name: "Vite",
    color: "#646CFF",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 1.5L4.09 5.27v13.46l7.91 3.77 7.91-3.77V5.27L12.00 1.5zm6.41 15.73l-6.41 3.05-6.41-3.05V6.73l6.41-3.05 6.41 3.05v10.5zM12.00 5.25L7.75 9.5h8.5L12.00 5.25zm0 13.5l4.25-4.25h-8.5l4.25 4.25z" />
      </svg>
    )
  },
  {
    name: "Svelte",
    color: "#FF3E00",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.8 15.2c-1.38.69-2.92.31-3.8-1-1.04-1.55-.42-3.41 1.2-4.14 1.38-.69 2.92-.31 3.8 1 1.04 1.55.42 3.41-1.2 4.14z" />
      </svg>
    )
  },
  {
    name: "Spring Boot",
    color: "#6DB33F",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 2.25L2.25 12.00l9.75 9.75 9.75-9.75-9.75-9.75-9.75-9.75zm0 15.00a5.25 5.25 0 1 1 5.25-5.25 5.25 5.25 0 0 1-5.25 5.25z" />
      </svg>
    )
  },
  {
    name: "Ruby",
    color: "#CC342D",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 2.25L3.45 10.8l8.55 10.95 8.55-10.95L12.00 2.25zm0 3.3L17.7 10.8l-5.7 7.2-5.7-7.2 5.7-5.25z" />
      </svg>
    )
  },
  {
    name: "Laravel v2",
    color: "#FF2D20",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 2.25l9.75 5.25v9l-9.75 5.25-9.75-5.25v-9l9.75-5.25zm0 2.25L4.5 8.25v7.5l7.5 4.05 7.5-4.05v-7.5L12.00 4.5z" />
      </svg>
    )
  },
  {
    name: "NestJS",
    color: "#E0234E",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 2.25a9.75 9.75 0 1 0 9.75 9.75 9.75 9.75 0 0 0-9.75-9.75zm0 15a5.25 5.25 0 1 1 5.25-5.25 5.25 5.25 0 0 1-5.25 5.25z" />
      </svg>
    )
  },
  {
    name: "Lua",
    color: "#4E72F8",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 2.25a9.75 9.75 0 1 0 9.75 9.75 9.75 9.75 0 0 0-9.75-9.75zm0 14.25a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5z" />
      </svg>
    )
  },
  {
    name: "Laravel v1",
    color: "#FF2D20",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.00 2.25l9.75 5.25v9l-9.75 5.25-9.75-5.25v-9l9.75-5.25zm0 2.25L4.5 8.25v7.5l7.5 4.05 7.5-4.05v-7.5L12.00 4.5z" />
      </svg>
    )
  },
  {
    name: "Astro",
    color: "#FF5D01",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l8 8-8 8-8-8 8-8zm0 3.3L7.7 10l4.3 4.3 4.3-4.3L12 5.3z" />
      </svg>
    )
  },
  {
    name: "Flask",
    color: "#C4C4C4",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
      </svg>
    )
  },
  {
    name: "C++",
    color: "#00599C",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm3.3-5.3l-1.4 1.4-2.8-2.8 2.8-2.8 1.4 1.4-1.4 1.4 1.4 1.4z" />
      </svg>
    )
  },
  {
    name: "C#",
    color: "#239120",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v5z" />
      </svg>
    )
  },
  {
    name: "C",
    color: "#A8B9CC",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H8v-8h5v2h-3v4h3v2z" />
      </svg>
    )
  },
  {
    name: "Angular",
    color: "#DD0031",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5L21.75 6l-1.5 12L12 21.5 3.75 18l-1.5-12L12 2.5zm0 3L6.5 16.5h2.2l1.1-2.8h4.4l1.1 2.8h2.2L12 5.5zm-1.6 6l1.6-4.1 1.6 4.1h-3.2z" />
      </svg>
    )
  }
];

export default function TechStackTicker({ isHeroEmbedded = false }: { isHeroEmbedded?: boolean }) {
  const displayItems = [...TECH_STACKS, ...TECH_STACKS, ...TECH_STACKS] // Triple for seamless looping
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null)

  return (
    <section className={cn(
      "left-0 w-full h-14 bg-black border-t border-white/10 flex items-center overflow-hidden z-40",
      isHeroEmbedded ? "absolute bottom-0" : "fixed bottom-0"
    )}>
      <div className="absolute left-0 top-0 h-full bg-black z-10 px-8 flex items-center gap-3 border-r border-white/10 select-none">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase whitespace-nowrap font-mono">
          Supported Tech Stacks
        </span>
      </div>

      <div className="flex animate-ticker whitespace-nowrap pl-[260px] select-none">
        {displayItems.map((item, index) => {
          const isHovered = hoveredIdx === index
          return (
            <div 
              key={index} 
              className="flex items-center gap-3 mx-8 group cursor-default"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span 
                style={{ color: isHovered ? item.color : '#FF7A00' }} 
                className="flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,122,0,0.15)] group-hover:scale-110 transition-all duration-300"
              >
                {item.logo}
              </span>
              <span 
                style={{ color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)' }}
                className="text-sm font-semibold font-mono transition-colors duration-300"
              >
                {item.name}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
