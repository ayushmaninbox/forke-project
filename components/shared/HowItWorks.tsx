'use client'

import React, { useRef } from 'react'
import { Zap, Flame, Check } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [boxPatterns, setBoxPatterns] = React.useState<number[]>([1, 2, 3, 5])

  React.useEffect(() => {
    const organicPatterns = [1, 2, 3, 5]
    const randoms = Array.from({ length: 4 }, () => organicPatterns[Math.floor(Math.random() * organicPatterns.length)])
    setBoxPatterns(randoms)
  }, [])

  useGSAP(() => {
    // Reveal header elements
    gsap.fromTo('.gsap-how-title',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gsap-how-header',
          start: 'top 85%',
        }
      }
    )

    gsap.fromTo('.gsap-how-desc',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: '.gsap-how-header',
          start: 'top 85%',
        }
      }
    )

    // Stagger show each card step block
    gsap.fromTo('.gsap-how-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-how-grid',
          start: 'top 75%',
        }
      }
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 sm:py-32 lg:py-40 px-4 bg-bg relative overflow-hidden border-t border-white/[0.04]">
      {/* GPU-Accelerated slow-breathing floating card keyframes */}
      <style>{`
        @keyframes floatLeft {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50% { transform: translateY(-12px) rotate(1.5deg); }
        }
        @keyframes floatRight {
          0%, 100% { transform: translateY(0px) rotate(1.5deg); }
          50% { transform: translateY(12px) rotate(-1.5deg); }
        }
        @keyframes floatCenter {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-0.5deg); }
        }
        @keyframes floatRandom1 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(8px, -12px) rotate(12deg); }
        }
        @keyframes floatRandom2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-10px, 10px) rotate(-15deg); }
        }
        .animate-float-left {
          animation: floatLeft 6s ease-in-out infinite;
        }
        .animate-float-right {
          animation: floatRight 6.5s ease-in-out infinite;
        }
        .animate-float-center {
          animation: floatCenter 5.5s ease-in-out infinite;
        }
        .animate-float-random-1 {
          animation: floatRandom1 5s ease-in-out infinite;
        }
        .animate-float-random-2 {
          animation: floatRandom2 5.5s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header section designed exactly like the 3rd image */}
        <div className="gsap-how-header flex flex-col lg:flex-row justify-between items-start gap-6 mb-16 sm:mb-24">
          <h2 className="gsap-how-title font-serif text-4xl md:text-6xl text-white tracking-tight leading-none opacity-0">
            How it <span className="text-accent italic font-normal text-glow">works.</span>
          </h2>
          <p className="gsap-how-desc max-w-lg text-white/50 text-base md:text-lg font-light leading-relaxed lg:text-right opacity-0">
            Forke bridges engineering demand with verified developer skill. Two workflows, one unified pipeline. Clear task scopes, zero-latency code reviews, and instant automated payouts.
          </p>
        </div>

        {/* 2x2 Grid Container with rounded-3xl corners (rectangular squircle) */}
        <div className="gsap-how-grid grid grid-cols-1 md:grid-cols-2 border border-white/[0.08] rounded-3xl bg-[#0A0A0A] overflow-hidden">
          
          {/* STEP 1: OWNER SIDE - POST TASK */}
          <div className="gsap-how-card group flex flex-col border-b border-white/[0.08] md:border-r border-white/[0.08] opacity-0">
            {/* Visual Header Panel with multiple floating tasks */}
            <div className="p-8 flex items-center justify-center bg-[#050505] bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] min-h-[380px] relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,122,0,0.04)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Dots Pattern Background Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-screen bg-repeat bg-center opacity-15"
                style={{
                  backgroundImage: `url('/patterns/pattern_${boxPatterns[0]}.svg')`,
                  backgroundSize: '320px',
                  filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(12deg)',
                }}
              />
              
              {/* Swarm of Floating Code Symbols & Tech Badges */}
              <div className="absolute left-6 top-6 z-0 w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-blue-400/60 text-xs shadow-glow animate-float-random-1">TS</div>
              <div className="absolute right-12 top-8 z-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400/60 text-[10px] shadow-glow animate-float-random-2">JSX</div>
              <div className="absolute left-1/3 top-10 z-0 text-white/10 font-mono text-xs animate-float-random-2">{"{"}</div>
              <div className="absolute right-1/3 top-6 z-0 text-white/10 font-mono text-xs animate-float-random-1">{"}"}</div>
              <div className="absolute left-16 bottom-20 z-0 w-8 h-8 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-red-400/60 text-[9px] shadow-glow animate-float-random-2">GIT</div>
              <div className="absolute right-16 bottom-24 z-0 text-white/10 font-mono text-[9px] uppercase tracking-wider animate-float-random-1">// TODO: test</div>
              <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-0 text-white/5 font-mono text-[10px] animate-float-random-2">const key = process.env</div>
              <div className="absolute right-8 bottom-8 z-0 text-accent/20 font-mono text-sm animate-float-random-1">=&gt;</div>
              <div className="absolute left-10 top-1/2 z-0 text-white/10 font-mono text-xs animate-float-random-1">()</div>

              {/* Background Card 1 (setup-firebase.ts) */}
              <div className="absolute left-4 top-6 z-0 w-[44%] animate-float-left" style={{ animationDelay: '-0.7s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-accent/25 rounded-xl p-2.5 font-mono text-[8px] text-white/40 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-11deg)', filter: 'blur(1.5px)' }}
                >
                  <div className="flex items-center gap-1 mb-1.5 border-b border-white/[0.03] pb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
                    <span className="text-[7.5px] text-white/20 ml-1">setup-firebase.ts</span>
                  </div>
                  <p><span className="text-accent/40">const</span> config = &#123;</p>
                  <p className="pl-2">bounty: <span className="text-accent/50">"₹400"</span>,</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Background Card 2 (responsive-nav.ts) */}
              <div className="absolute right-3 bottom-6 z-0 w-[43%] animate-float-right" style={{ animationDelay: '-1.4s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-[#8b5cf6]/20 rounded-xl p-2.5 font-mono text-[8px] text-white/40 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(7deg)', filter: 'blur(2px)' }}
                >
                  <div className="flex items-center gap-1 mb-1.5 border-b border-white/[0.02] pb-1">
                    <span className="w-1 h-1 rounded-full bg-red-500/40" />
                    <span className="w-1 h-1 rounded-full bg-green-500/40" />
                    <span className="text-[7px] text-white/20 ml-1">responsive-nav.ts</span>
                  </div>
                  <p><span className="text-accent/50">const</span> config = &#123;</p>
                  <p className="pl-2">bounty: <span className="text-[#8b5cf6]/50">"₹750"</span>,</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Background Card 3 (tsconfig.json) */}
              <div className="absolute right-5 top-5 z-0 w-[38%] animate-float-right" style={{ animationDelay: '-2.1s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-blue-500/20 rounded-xl p-2 font-mono text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-5deg)', filter: 'blur(3.5px)' }}
                >
                  <p className="text-white/20 font-bold border-b border-white/[0.02] pb-0.5">tsconfig.json</p>
                  <p>"compilerOptions": &#123;</p>
                  <p className="pl-2">"strict": true</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Background Card 4 (api-routes.ts) */}
              <div className="absolute left-3 bottom-5 z-0 w-[38%] animate-float-left" style={{ animationDelay: '-2.8s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-emerald-500/10 rounded-xl p-2 font-mono text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(9deg)', filter: 'blur(4.5px)' }}
                >
                  <p className="text-white/10 font-bold border-b border-white/[0.02] pb-0.5">api-routes.ts</p>
                  <p>export default function handler() &#123;</p>
                  <p className="pl-2">res.status(200).json()</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Background Card 5 (next-env.d.ts) */}
              <div className="absolute left-[24%] top-3 z-0 w-[38%] animate-float-left" style={{ animationDelay: '-3.5s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-white/[0.04] rounded-xl p-2 font-mono text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-3deg)', filter: 'blur(2.2px)' }}
                >
                  <p className="text-white/20 font-bold border-b border-white/[0.02] pb-0.5">next-env.d.ts</p>
                  <p>/// &lt;reference types="next" /&gt;</p>
                </div>
              </div>

              {/* Background Card 6 (package.json) */}
              <div className="absolute right-[28%] bottom-3 z-0 w-[38%] animate-float-right" style={{ animationDelay: '-4.2s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.02] rounded-xl p-2 font-mono text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(13deg)', filter: 'blur(5px)' }}
                >
                  <p className="text-white/15 font-bold border-b border-white/[0.02] pb-0.5">package.json</p>
                  <p>"dependencies": &#123; "next": "latest" &#125;</p>
                </div>
              </div>

              {/* Background Card 7 (tailwind.config.js) */}
              <div className="absolute left-2 top-[38%] -translate-y-1/2 z-0 w-[36%] animate-float-left" style={{ animationDelay: '-4.9s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-white/[0.08] rounded-xl p-2 font-mono text-[7.5px] text-white/45 shadow-2xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(8deg)', filter: 'blur(1.2px)' }}
                >
                  <p className="text-white/30 font-bold border-b border-white/[0.03] pb-0.5">tailwind.config.js</p>
                  <p>content: ["./app/**/*.&#123;js,ts&#125;"]</p>
                </div>
              </div>

              {/* Background Card 8 (postcss.config.js) */}
              <div className="absolute right-2 top-[32%] -translate-y-1/2 z-0 w-[36%] animate-float-right" style={{ animationDelay: '-5.6s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-mono text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-10deg)', filter: 'blur(3px)' }}
                >
                  <p className="text-white/20 font-bold border-b border-white/[0.02] pb-0.5">postcss.config.js</p>
                  <p>plugins: &#123; tailwindcss: &#125;</p>
                </div>
              </div>

              {/* Main Card (Center Sharp, Normal, and LARGER) */}
              <div className="relative w-full max-w-[310px] bg-[#0C0C0C] border border-white/[0.12] rounded-2xl p-5 font-mono text-[10.5px] sm:text-xs text-white/95 shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,122,0,0.06)] z-10 animate-float-center">
                <div className="flex items-center gap-1.5 mb-3.5 border-b border-white/[0.05] pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-white/45 ml-2">post-task.config.ts</span>
                </div>
                <div className="space-y-1.5 text-white/75">
                  <p><span className="text-accent">const</span> task = &#123;</p>
                  <p className="pl-4"><span className="text-blue-400">title</span>: <span className="text-emerald-400">"Implement JWT Auth"</span>,</p>
                  <p className="pl-4"><span className="text-blue-400">bounty</span>: <span className="text-accent">"₹1,200"</span>,</p>
                  <p className="pl-4"><span className="text-blue-400">escrow</span>: <span className="text-purple-400">true</span>,</p>
                  <p className="pl-4"><span className="text-blue-400">requiredRank</span>: <span className="text-yellow-400">"Prestige I"</span></p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>
            
            {/* Description Text Area */}
            <div className="p-8 md:p-12 border-t border-white/[0.08] flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-black uppercase text-accent/50 block mb-2">
                  01 / FOR OWNERS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-accent transition-colors duration-300">
                  Scoped tasks, zero overhead.
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Describe your engineering task, set a custom bounty, and escrow the payout. Forke converts your parameters directly into scoped GitHub issues.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 2: OWNER SIDE - CODE REVIEWS */}
          <div className="gsap-how-card group flex flex-col border-b border-white/[0.08] opacity-0">
            {/* Visual Header Panel with multiple floating PRs */}
            <div className="p-8 flex items-center justify-center bg-[#050505] bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] min-h-[380px] relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.02)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Dots Pattern Background Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-screen bg-repeat bg-center opacity-15"
                style={{
                  backgroundImage: `url('/patterns/pattern_${boxPatterns[1]}.svg')`,
                  backgroundSize: '320px',
                  filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(12deg)',
                }}
              />
              
              {/* Swarm of PR indicators and webhooks */}
              <div className="absolute left-6 top-8 z-0 w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-red-400/60 text-xs shadow-glow animate-float-random-2">✕</div>
              <div className="absolute right-12 top-6 z-0 w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400/60 text-xs shadow-glow animate-float-random-1">✓</div>
              <div className="absolute left-1/3 top-8 z-0 text-white/5 font-mono text-[9px] animate-float-random-1">Webhook triggered</div>
              <div className="absolute right-1/3 top-10 z-0 text-purple-400/20 font-mono text-[9px] animate-float-random-2">git merge-base master</div>
              <div className="absolute left-16 bottom-16 z-0 w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400/40 text-[9px] animate-float-random-1">PR</div>
              <div className="absolute right-16 bottom-20 z-0 text-white/5 font-mono text-[9px] animate-float-random-2">Tests run: 142/142</div>
              <div className="absolute left-10 top-1/2 z-0 text-emerald-400/15 font-mono text-xs animate-float-random-1">Verified</div>
              <div className="absolute right-8 top-1/2 z-0 text-red-400/15 font-mono text-xs animate-float-random-2">Conflict: 0</div>

              {/* PR Card 1 (PR #40 - Failed) */}
              <div className="absolute left-3 top-5 z-0 w-[46%] animate-float-left" style={{ animationDelay: '-1.1s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-red-500/25 rounded-xl p-2.5 font-sans text-[9px] text-white/45 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(6deg)', filter: 'blur(2.5px)' }}
                >
                  <div className="flex items-center justify-between mb-1 border-b border-white/[0.03] pb-1">
                    <span className="font-semibold text-white/50">PR #40 - Failed</span>
                    <span className="text-[6px] font-mono text-red-400 bg-red-500/10 px-1 py-0.1 rounded">Failed</span>
                  </div>
                  <p className="text-[8px] text-white/30 font-light">Auto-tests failed on build step</p>
                </div>
              </div>

              {/* PR Card 2 (PR #41 - Merged) */}
              <div className="absolute right-5 bottom-3 z-0 w-[42%] animate-float-right" style={{ animationDelay: '-0.3s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-purple-500/20 rounded-xl p-2.5 font-sans text-[9px] text-white/40 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-12deg)', filter: 'blur(1.8px)' }}
                >
                  <div className="flex items-center justify-between mb-1 border-b border-white/[0.02] pb-1">
                    <span className="font-semibold text-white/50">PR #41 - Merged</span>
                    <span className="text-[7px] font-mono text-purple-400 bg-purple-500/10 px-1 py-0.1 rounded">Merged</span>
                  </div>
                  <p className="text-[8px] text-white/30">Task escrow payout completed</p>
                </div>
              </div>

              {/* Background card 3 (PR #38 - Approved) */}
              <div className="absolute right-2 top-6 z-0 w-[42%] animate-float-right" style={{ animationDelay: '-2.5s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(4deg)', filter: 'blur(4px)' }}
                >
                  <p className="font-semibold">PR #38 - Approved</p>
                  <p className="text-[6px]">Reviewer: admin</p>
                </div>
              </div>

              {/* Background card 4 (PR #39 - Closed) */}
              <div className="absolute left-4 bottom-6 z-0 w-[36%] animate-float-left" style={{ animationDelay: '-3.2s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.02] rounded-xl p-2 font-sans text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-9deg)', filter: 'blur(5px)' }}
                >
                  <p className="font-semibold">PR #39 - Closed</p>
                  <p className="text-[6px]">Duplicate branches resolved</p>
                </div>
              </div>

              {/* Background Card 5 (PR #37 - Merged) */}
              <div className="absolute left-[28%] top-2 z-0 w-[40%] animate-float-left" style={{ animationDelay: '-1.9s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/20 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(11deg)', filter: 'blur(3px)' }}
                >
                  <p className="font-semibold text-white/40">PR #37 - Merged</p>
                  <p className="text-[6px] text-white/30">UPI release completed</p>
                </div>
              </div>

              {/* Background Card 6 (PR #36 - Approved) */}
              <div className="absolute right-[24%] bottom-4 z-0 w-[38%] animate-float-right" style={{ animationDelay: '-4.7s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.02] rounded-xl p-2 font-sans text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-5deg)', filter: 'blur(4.5px)' }}
                >
                  <p className="font-semibold text-white/40">PR #36 - Approved</p>
                  <p className="text-[6px] text-white/30">Admin verified</p>
                </div>
              </div>

              {/* Background Card 7 (PR #35 - Failed) */}
              <div className="absolute left-3 top-[32%] -translate-y-1/2 z-0 w-[34%] animate-float-left" style={{ animationDelay: '-5.2s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-white/[0.08] rounded-xl p-2 font-sans text-[7px] text-white/55 shadow-2xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-13deg)', filter: 'blur(1.5px)' }}
                >
                  <p className="font-semibold text-white/50">PR #35 - Failed</p>
                </div>
              </div>

              {/* Background Card 8 (PR #34 - Closed) */}
              <div className="absolute right-3 top-[38%] -translate-y-1/2 z-0 w-[34%] animate-float-right" style={{ animationDelay: '-0.9s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(10deg)', filter: 'blur(3.5px)' }}
                >
                  <p className="font-semibold text-white/40">PR #34 - Closed</p>
                </div>
              </div>

              {/* Main PR (Center Sharp, Normal, and LARGER) */}
              <div className="relative w-full max-w-[310px] bg-[#0C0C0C] border border-white/[0.12] rounded-2xl p-5 font-sans text-xs text-white/80 shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.06)] z-10 animate-float-center">
                <div className="flex items-center justify-between mb-3.5 border-b border-white/[0.05] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-white">Pull Request #42</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">Passed</span>
                </div>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-2.5 text-white/60 text-[10.5px]">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Auto-testing pipeline passed</p>
                      <p className="text-white/30 text-[8.5px] font-mono">14 unit tests passed in 1.2s</p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-center text-[10.5px] uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)] pointer-events-none">
                    Merge & Release Escrow
                  </button>
                </div>
              </div>
            </div>
            
            {/* Description Text Area */}
            <div className="p-8 md:p-12 border-t border-white/[0.08] flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-black uppercase text-accent/50 block mb-2">
                  02 / FOR OWNERS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-accent transition-colors duration-300">
                  Approve PRs, release funds.
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Review submitted code changes directly via standard GitHub PRs. Once you verify and merge the pull request, the escrowed payout is instantly unlocked.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3: DEVELOPER SIDE - CLAIM TASK */}
          <div className="gsap-how-card group flex flex-col border-b border-white/[0.08] md:border-b-0 md:border-r border-white/[0.08] opacity-0">
            {/* Visual Header Panel with multiple floating tasks to claim */}
            <div className="p-8 flex items-center justify-center bg-[#050505] bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] min-h-[380px] relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,122,0,0.03)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Dots Pattern Background Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-screen bg-repeat bg-center opacity-15"
                style={{
                  backgroundImage: `url('/patterns/pattern_${boxPatterns[2]}.svg')`,
                  backgroundSize: '320px',
                  filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(12deg)',
                }}
              />
              
              {/* Swarm of Language/Tech Tags */}
              <div className="absolute left-6 top-8 z-0 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 font-mono text-[9px] text-blue-400/60 animate-float-random-1">NODE</div>
              <div className="absolute right-12 top-6 z-0 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 font-mono text-[9px] text-red-400/60 animate-float-random-2">RUBY</div>
              <div className="absolute left-1/3 top-8 z-0 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 font-mono text-[9px] text-yellow-400/50 animate-float-random-2">PY</div>
              <div className="absolute right-1/3 top-10 z-0 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono text-[9px] text-emerald-400/50 animate-float-random-1">GO</div>
              <div className="absolute left-16 bottom-16 z-0 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-mono text-[9px] text-cyan-400/50 animate-float-random-2">REACT</div>
              <div className="absolute right-16 bottom-20 z-0 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 font-mono text-[9px] text-orange-400/50 animate-float-random-1">VUE</div>
              <div className="absolute left-10 top-1/2 z-0 text-white/5 font-mono text-[9px] animate-float-random-1">Active claims: 8</div>
              <div className="absolute right-8 top-1/2 z-0 text-white/5 font-mono text-[9px] animate-float-random-2">Avg payout: ₹850</div>

              {/* Task 1 (Fix Auth Bug) */}
              <div className="absolute left-2 top-7 z-0 w-[44%] animate-float-left" style={{ animationDelay: '-2.3s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-accent/35 rounded-xl p-2.5 font-sans text-[9px] text-white/45 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-8deg)', filter: 'blur(1.5px)' }}
                >
                  <div className="flex justify-between items-center mb-1.5 border-b border-white/[0.03] pb-1">
                    <span className="font-semibold text-white/60">Fix Auth Bug</span>
                    <span className="text-accent/75 font-bold">₹450</span>
                  </div>
                </div>
              </div>

              {/* Task 2 (Refactor Store) */}
              <div className="absolute right-4 bottom-5 z-0 w-[44%] animate-float-right" style={{ animationDelay: '-3.7s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-emerald-500/20 rounded-xl p-2.5 font-sans text-[9px] text-white/45 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(14deg)', filter: 'blur(2px)' }}
                >
                  <div className="flex justify-between items-center mb-1.5 border-b border-white/[0.02] pb-1">
                    <span className="font-semibold text-white/50">Refactor Store</span>
                    <span className="text-emerald-400/50 font-bold">₹1,500</span>
                  </div>
                </div>
              </div>

              {/* Background task 3 (Add Charts) */}
              <div className="absolute right-3 top-3 z-0 w-[38%] animate-float-right" style={{ animationDelay: '-1.2s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-white/[0.03] rounded-xl p-2 font-sans text-[7px] text-white/20 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-11deg)', filter: 'blur(3px)' }}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">Add Charts</span>
                    <span className="text-accent/30 font-bold">₹1,200</span>
                  </div>
                </div>
              </div>

              {/* Background task 4 (Clean Logs) */}
              <div className="absolute left-5 bottom-3 z-0 w-[38%] animate-float-left" style={{ animationDelay: '-4.1s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.03] rounded-xl p-2 font-sans text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(5deg)', filter: 'blur(4.8px)' }}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">Clean Logs</span>
                    <span className="text-accent/30 font-bold">₹200</span>
                  </div>
                </div>
              </div>

              {/* Background Card 5 (Setup Stripe) */}
              <div className="absolute left-[22%] top-4 z-0 w-[38%] animate-float-left" style={{ animationDelay: '-0.8s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/20 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(12deg)', filter: 'blur(2.2px)' }}
                >
                  <div className="flex justify-between">
                    <span>Setup Stripe</span>
                    <span className="text-accent/35 font-bold">₹2,000</span>
                  </div>
                </div>
              </div>

              {/* Background Card 6 (Build Navbar) */}
              <div className="absolute right-[26%] bottom-2 z-0 w-[42%] animate-float-right" style={{ animationDelay: '-5.5s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.02] rounded-xl p-2 font-sans text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-7deg)', filter: 'blur(4px)' }}
                >
                  <div className="flex justify-between">
                    <span>Build Navbar</span>
                    <span className="text-accent/35 font-bold">₹300</span>
                  </div>
                </div>
              </div>

              {/* Background Card 7 (Fix Overflow) */}
              <div className="absolute left-1 top-[35%] -translate-y-1/2 z-0 w-[38%] animate-float-left" style={{ animationDelay: '-3.1s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-white/[0.08] rounded-xl p-2 font-sans text-[7.5px] text-white/55 shadow-2xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(9deg)', filter: 'blur(1px)' }}
                >
                  <div className="flex justify-between">
                    <span>Fix Overflow</span>
                    <span className="text-accent/40 font-bold">₹150</span>
                  </div>
                </div>
              </div>

              {/* Background Card 8 (Style FAQ) */}
              <div className="absolute right-1 top-[35%] -translate-y-1/2 z-0 w-[38%] animate-float-right" style={{ animationDelay: '-1.6s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-13deg)', filter: 'blur(3.2px)' }}
                >
                  <div className="flex justify-between">
                    <span>Style FAQ</span>
                    <span className="text-accent/35 font-bold">₹600</span>
                  </div>
                </div>
              </div>

              {/* Main Task (Center Sharp, Normal, and LARGER) */}
              <div className="relative w-full max-w-[310px] bg-[#0C0C0C] border border-white/[0.12] rounded-2xl p-5 font-sans text-xs text-white/80 shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,122,0,0.06)] z-10 animate-float-center">
                <div className="flex justify-between items-start mb-3.5 border-b border-white/[0.05] pb-2">
                  <span className="font-bold text-white">Active Task Feed</span>
                  <span className="text-accent font-black text-sm">₹800</span>
                </div>
                <div className="space-y-3.5">
                  <div>
                    <p className="text-white/30 text-[8.5px] uppercase tracking-wider font-mono">Bounty Description</p>
                    <p className="text-white font-medium text-xs mt-1">Integrate responsive layout for FAQ section</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[9.5px] font-mono bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded text-white/45">React</span>
                    <span className="text-[9.5px] font-mono bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded text-white/45">Tailwind</span>
                  </div>
                  <button className="w-full py-2.5 bg-accent text-bg font-bold rounded-lg text-center text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-[0_4px_12px_rgba(255,122,0,0.15)] pointer-events-none">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Claim & Lock Task
                  </button>
                </div>
              </div>
            </div>
            
            {/* Description Text Area */}
            <div className="p-8 md:p-12 border-t border-white/[0.08] flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-black uppercase text-accent/50 block mb-2">
                  03 / FOR DEVELOPERS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-accent transition-colors duration-300">
                  Claim matching tasks instantly.
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  No interviews, no applications. Browse real-time tasks, verify that you meet the prestige tier requirements, and lock in the bounty to start coding.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 4: DEVELOPER SIDE - CASH OUT */}
          <div className="gsap-how-card group flex flex-col opacity-0">
            {/* Visual Header Panel with multiple floating transactions */}
            <div className="p-8 flex items-center justify-center bg-[#050505] bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] min-h-[380px] relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,122,0,0.03)_0%,transparent_70%)] pointer-events-none" />
              
              {/* Dots Pattern Background Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-screen bg-repeat bg-center opacity-15"
                style={{
                  backgroundImage: `url('/patterns/pattern_${boxPatterns[3]}.svg')`,
                  backgroundSize: '320px',
                  filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(12deg)',
                }}
              />
              
              {/* Swarm of Coins / Streak badges */}
              <div className="absolute left-6 top-8 z-0 w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-500/60 text-xs shadow-glow animate-float-random-1">₹</div>
              <div className="absolute right-12 top-6 z-0 w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-500/60 text-[10px] shadow-glow animate-float-random-2">₹</div>
              <div className="absolute left-1/3 top-8 z-0 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400/50 shadow-glow animate-float-random-2">
                <Flame className="w-4 h-4 fill-orange-400/50" />
              </div>
              <div className="absolute right-1/3 top-10 z-0 text-emerald-400/25 font-mono text-[9px] animate-float-random-1">Transfer successful</div>
              <div className="absolute left-16 bottom-16 z-0 text-white/5 font-mono text-[9px] animate-float-random-2">XP multiplier: +1.2x</div>
              <div className="absolute right-16 bottom-20 z-0 text-white/5 font-mono text-[9px] animate-float-random-1">UPI transaction verified</div>
              <div className="absolute left-10 top-1/2 z-0 text-white/5 font-mono text-[8px] animate-float-random-1">Ref ID: 948201</div>
              <div className="absolute right-8 top-1/2 z-0 text-yellow-500/20 font-bold text-sm animate-float-random-2">₹</div>

              {/* Success Card 1 (Payout Complete ₹350) */}
              <div className="absolute left-4 top-4 z-0 w-[42%] animate-float-left" style={{ animationDelay: '-0.5s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-emerald-500/35 rounded-xl p-2.5 font-sans text-[9px] text-white/50 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(13deg)', filter: 'blur(2px)' }}
                >
                  <div className="flex items-center gap-1 mb-1.5 border-b border-white/[0.03] pb-1">
                    <span className="font-semibold text-white/60">Payout Complete</span>
                  </div>
                  <p className="text-emerald-500 font-mono font-bold">₹350.00</p>
                </div>
              </div>

              {/* Success Card 2 (Payout Complete ₹900) */}
              <div className="absolute right-2 bottom-6 z-0 w-[45%] animate-float-right" style={{ animationDelay: '-1.8s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-emerald-500/20 rounded-xl p-2.5 font-sans text-[9px] text-white/45 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-6deg)', filter: 'blur(3px)' }}
                >
                  <div className="flex items-center gap-1 mb-1.5 border-b border-white/[0.02] pb-1">
                    <span className="font-semibold text-white/50">Payout Complete</span>
                  </div>
                  <p className="text-emerald-500 font-mono font-bold">₹900.00</p>
                </div>
              </div>

              {/* Background card 3 (XP +100) */}
              <div className="absolute right-4 top-5 z-0 w-[40%] animate-float-right" style={{ animationDelay: '-3.3s' }}>
                <div 
                  className="bg-[#0C0C0C]/85 border border-white/[0.03] rounded-xl p-2 font-sans text-[7px] text-white/20 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(8deg)', filter: 'blur(2.5px)' }}
                >
                  <p className="font-semibold">LVL 11 XP +100</p>
                  <p className="text-emerald-500/50">₹250.00</p>
                </div>
              </div>

              {/* Background card 4 (XP +200) */}
              <div className="absolute left-2 bottom-5 z-0 w-[40%] animate-float-left" style={{ animationDelay: '-4.6s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.02] rounded-xl p-2 font-sans text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-12deg)', filter: 'blur(5px)' }}
                >
                  <p className="font-semibold">LVL 13 XP +200</p>
                  <p className="text-emerald-500/50">₹1,200.00</p>
                </div>
              </div>

              {/* Background Card 5 (XP +50) */}
              <div className="absolute left-[26%] top-3 z-0 w-[36%] animate-float-left" style={{ animationDelay: '-2.2s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/20 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-8deg)', filter: 'blur(3.5px)' }}
                >
                  <p className="font-semibold text-white/45">LVL 8 XP +50</p>
                  <p className="text-emerald-500/35">₹150.00</p>
                </div>
              </div>

              {/* Background Card 6 (XP +80) */}
              <div className="absolute right-[28%] bottom-3 z-0 w-[36%] animate-float-right" style={{ animationDelay: '-5.1s' }}>
                <div 
                  className="bg-[#0C0C0C]/75 border border-white/[0.02] rounded-xl p-2 font-sans text-[7px] text-white/15 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(11deg)', filter: 'blur(4px)' }}
                >
                  <p className="font-semibold text-white/45">LVL 9 XP +80</p>
                  <p className="text-emerald-500/35">₹200.00</p>
                </div>
              </div>

              {/* Background Card 7 (XP +500) */}
              <div className="absolute left-3 top-[38%] -translate-y-1/2 z-0 w-[35%] animate-float-left" style={{ animationDelay: '-0.9s' }}>
                <div 
                  className="bg-[#0C0C0C]/90 border border-white/[0.08] rounded-xl p-2 font-sans text-[7.5px] text-white/60 shadow-2xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(-14deg)', filter: 'blur(1px)' }}
                >
                  <p className="font-semibold text-white/45">LVL 15 XP +500</p>
                  <p className="text-emerald-500/35">₹2,500.00</p>
                </div>
              </div>

              {/* Background Card 8 (XP +150) */}
              <div className="absolute right-3 top-[32%] -translate-y-1/2 z-0 w-[35%] animate-float-right" style={{ animationDelay: '-2.7s' }}>
                <div 
                  className="bg-[#0C0C0C]/80 border border-white/[0.04] rounded-xl p-2 font-sans text-[7px] text-white/25 shadow-xl pointer-events-none w-full animate-relative"
                  style={{ transform: 'rotate(7deg)', filter: 'blur(3.2px)' }}
                >
                  <p className="font-semibold text-white/45">LVL 12 XP +150</p>
                  <p className="text-emerald-500/35">₹800.00</p>
                </div>
              </div>

              {/* Main Success Card (Center Sharp, Normal, and LARGER) */}
              <div className="relative w-full max-w-[310px] bg-[#0C0C0C] border border-white/[0.12] rounded-2xl p-5 font-sans text-xs text-white/80 shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,122,0,0.06)] z-10 animate-float-center">
                <div className="flex items-center gap-1.5 mb-3.5 border-b border-white/[0.05] pb-2">
                  <Flame className="w-4.5 h-4.5 text-accent fill-accent animate-pulse" />
                  <span className="font-bold text-white ml-1.5">XP & Payout Success</span>
                </div>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center bg-[#140E0A] border border-accent/15 p-2 rounded-lg">
                    <div>
                      <p className="text-[7.5px] font-mono text-accent uppercase tracking-wider font-black">Prestige XP Earned</p>
                      <p className="text-white font-bold text-[10.5px] mt-1">+150 XP (Fast Shipping Bonus)</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-accent/15 flex items-center justify-center font-mono font-black text-accent text-xs">
                      12
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[9.5px] text-white/40 font-mono border-t border-white/[0.05] pt-2">
                    <span>UPI Transfer Complete</span>
                    <span className="text-emerald-400 font-bold">₹800.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description Text Area */}
            <div className="p-8 md:p-12 border-t border-white/[0.08] flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-black uppercase text-accent/50 block mb-2">
                  04 / FOR DEVELOPERS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-accent transition-colors duration-300">
                  Build reputation, cash out.
                </h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Earn XP upon task completion to level up your profile prestige, which unlocks higher concurrent task limits and private enterprise project boards.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
