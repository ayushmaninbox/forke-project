'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface TechStackItem {
  name: string;
  path: string;
  hoverFilter?: string;
}

const TECH_STACKS: TechStackItem[] = [
  { name: "React", path: "react/react-original" },
  { name: "Next.js", path: "nextjs/nextjs-original", hoverFilter: "brightness(0) invert(1)" },
  { name: "HTML5", path: "html5/html5-original" },
  { name: "CSS3", path: "css3/css3-original" },
  { name: "JavaScript", path: "javascript/javascript-original" },
  { name: "TypeScript", path: "typescript/typescript-original" },
  { name: "Python", path: "python/python-original" },
  { name: "PHP", path: "php/php-original" },
  { name: "Go (Golang)", path: "go/go-original" },
  { name: "Rust", path: "rust/rust-original" },
  { name: "Nuxt.js", path: "nuxtjs/nuxtjs-original" },
  { name: "Vue.js", path: "vuejs/vuejs-original" },
  { name: "Vite", path: "vitejs/vitejs-original" },
  { name: "Svelte", path: "svelte/svelte-original" },
  { name: "Spring Boot", path: "spring/spring-original" },
  { name: "Ruby", path: "ruby/ruby-original" },
  { name: "Laravel v2", path: "laravel/laravel-original" },
  { name: "NestJS", path: "nestjs/nestjs-original" },
  { name: "Lua", path: "lua/lua-original" },
  { name: "Laravel v1", path: "laravel/laravel-original" },
  { name: "Astro", path: "astro/astro-original" },
  { name: "Flask", path: "flask/flask-original", hoverFilter: "brightness(0) invert(1)" },
  { name: "C++", path: "cplusplus/cplusplus-original" },
  { name: "C#", path: "csharp/csharp-original" },
  { name: "C", path: "c/c-original" },
  { name: "Angular", path: "angular/angular-original" }
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
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${item.path}.svg`}
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
