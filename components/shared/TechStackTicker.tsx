'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface TechStackItem {
  name: string;
  slug: string;
  hoverFilter?: string;
}

const TECH_STACKS: TechStackItem[] = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs", hoverFilter: "brightness(0) invert(1)" },
  { name: "HTML5", slug: "html5" },
  { name: "CSS3", slug: "css3" },
  { name: "Python", slug: "python" },
  { name: "PHP", slug: "php" },
  { name: "Go (Golang)", slug: "go" },
  { name: "Rust", slug: "rust" },
  { name: "Nuxt.js", slug: "nuxt" },
  { name: "Vue.js", slug: "vuedotjs" },
  { name: "Vite", slug: "vite" },
  { name: "Svelte", slug: "svelte" },
  { name: "Spring Boot", slug: "springboot" },
  { name: "Ruby", slug: "ruby" },
  { name: "Laravel v2", slug: "laravel" },
  { name: "NestJS", slug: "nestjs" },
  { name: "Lua", slug: "lua" },
  { name: "Laravel v1", slug: "laravel" },
  { name: "Astro", slug: "astro" },
  { name: "Flask", slug: "flask", hoverFilter: "brightness(0) invert(1)" },
  { name: "C++", slug: "cplusplus" },
  { name: "C#", slug: "csharp" },
  { name: "C", slug: "c" },
  { name: "Angular", slug: "angular" }
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
              <div 
                className="w-5 h-5 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110"
                style={{
                  filter: isHovered 
                    ? (item.hoverFilter ?? 'none') 
                    : 'brightness(0) saturate(100%) invert(52%) sepia(85%) saturate(2318%) hue-rotate(357deg) brightness(101%) contrast(106%)'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${item.slug}.svg`}
                  alt={item.name}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>
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
