'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import CTA from '@/components/shared/CTA'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/Button'
import DotField from '@/components/shared/DotField'
import { 
  Flame, 
  Zap, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Trophy, 
  Clock, 
  Star, 
  Coins, 
  RefreshCw,
  TrendingUp,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TIERS = [
  {
    id: 'early',
    label: 'Early Game',
    icon: Flame,
    range: 'LVL 1–5',
    levels: [
      { lvl: 1, title: 'Newcomer', xp: '0 XP', unlock: 'Basic Bounties' },
      { lvl: 2, title: 'Script Kiddie', xp: '200 XP', unlock: 'Base Developer Access' },
      { lvl: 3, title: 'Bug Chaser', xp: '500 XP', unlock: 'Custom Public Profile URL' },
      { lvl: 4, title: 'Commit Rookie', xp: '1,000 XP', unlock: 'Early-stage Bounty Feed' },
      { lvl: 5, title: 'Stack Explorer', xp: '1,800 XP', unlock: 'Team Task Applications' }
    ]
  },
  {
    id: 'mid',
    label: 'Mid Game',
    icon: Zap,
    range: 'LVL 6–10',
    levels: [
      { lvl: 6, title: 'Code Runner', xp: '2,800 XP', unlock: 'Advanced Search & Filters' },
      { lvl: 7, title: 'Patch Hunter', xp: '4,000 XP', unlock: 'Intermediate Payout Tiers' },
      { lvl: 8, title: 'API Tinkerer', xp: '5,500 XP', unlock: 'Exclusive Discord Access' },
      { lvl: 9, title: 'Build Operator', xp: '7,200 XP', unlock: 'Beta Feature Testing' },
      { lvl: 10, title: 'Sprint Soldier', xp: '9,200 XP', unlock: 'XP Streak Multipliers (+1.2x)' }
    ]
  },
  {
    id: 'skilled',
    label: 'Skilled Tier',
    icon: Award,
    range: 'LVL 11–15',
    levels: [
      { lvl: 11, title: 'Merge Specialist', xp: '11,500 XP', unlock: 'Auto-claim Standby Queue' },
      { lvl: 12, title: 'System Crafter', xp: '14,200 XP', unlock: 'Priority Task Reservation Queue' },
      { lvl: 13, title: 'Bug Assassin', xp: '17,500 XP', unlock: 'Reviewer Shadow-Mode Access' },
      { lvl: 14, title: 'Code Mercenary', xp: '21,500 XP', unlock: 'Higher Concurrent Task Limits' },
      { lvl: 15, title: 'Feature Shipper', xp: '26,000 XP', unlock: 'Elite Bounty Access + Reviewer Role Eligibility' }
    ]
  },
  {
    id: 'elite',
    label: 'Elite Tier',
    icon: Sparkles,
    range: 'LVL 16–20',
    levels: [
      { lvl: 16, title: 'Runtime Knight', xp: '31,500 XP', unlock: 'Evolved Profile Card Frames' },
      { lvl: 17, title: 'Deployment Ninja', xp: '38,000 XP', unlock: 'Custom XP Sound FX' },
      { lvl: 18, title: 'Stack Commander', xp: '45,500 XP', unlock: 'Team Lead Eligibility' },
      { lvl: 19, title: 'Velocity Hacker', xp: '54,000 XP', unlock: 'Fast-track Dispute Resolution' },
      { lvl: 20, title: 'Production Slayer', xp: '63,500 XP', unlock: 'Direct Mentor & Advisory Roles' }
    ]
  },
  {
    id: 'legend',
    label: 'Legend Tier',
    icon: Trophy,
    range: 'LVL 21–25',
    levels: [
      { lvl: 21, title: 'Silicon Phantom', xp: '74,000 XP', unlock: 'Exclusive Dev Merchandise Store' },
      { lvl: 22, title: 'Commit Warlord', xp: '86,000 XP', unlock: 'Sneak Peek Beta Access' },
      { lvl: 23, title: 'Bug Executioner', xp: '99,500 XP', unlock: 'Custom User Theme Accents' },
      { lvl: 24, title: 'System Overlord', xp: '1,15,000 XP', unlock: 'Direct Slack Workspace With Founders' },
      { lvl: 25, title: 'Forke Legend', xp: '1,32,000 XP', unlock: 'Private Invite-Only Enterprise Projects' }
    ]
  }
]

const ALL_LEVELS = TIERS.flatMap((tier) =>
  tier.levels.map((lvl) => ({
    ...lvl,
    tierId: tier.id,
    tierLabel: tier.label,
    tierIcon: tier.icon
  }))
)


const XP_RULES = [
  {
    title: 'Completing Bounties',
    desc: 'Base XP awarded upon task approval based on the budget size.',
    icon: Coins,
    details: [
      { label: '₹100 – ₹399 task', value: '+50 XP' },
      { label: '₹400 – ₹899 task', value: '+100 XP' },
      { label: '₹900 – ₹2,499 task', value: '+200 XP' },
      { label: '₹2,500+ task', value: '+350 XP' }
    ]
  },
  {
    title: 'Speed Bonus',
    desc: 'Rewarded for lightning-fast delivery before 50% of the allocated deadline has elapsed.',
    icon: Clock,
    value: '+25 XP'
  },
  {
    title: 'Star Ratings',
    desc: 'Outstanding client feedback boosts your experience curve directly.',
    icon: Star,
    details: [
      { label: '5★ Review', value: '+30 XP' },
      { label: '4★ Review', value: '+10 XP' }
    ]
  },
  {
    title: 'Login Streaks',
    desc: 'Consistency is rewarded. Claiming daily XP milestones grants compounding returns.',
    icon: Flame,
    value: '+5 to +100 XP'
  },
  {
    title: 'Revision Penalties',
    desc: 'Submitting sloppy, untested work that requires a request for changes penalizes XP.',
    icon: RefreshCw,
    value: '-20 XP',
    isPenalty: true
  }
]

const PRESTIGE_RANKS = [
  { 
    rank: 'I', 
    title: 'Ascended Developer', 
    perk: 'Animated Profile Border Cosmetics', 
    color: 'from-[#D97706]/40 via-transparent to-transparent',
    hexColor: '#D97706',
    mobileGlow: 'rgba(217, 119, 6, 0.15)'
  },
  { 
    rank: 'II', 
    title: 'Ghost in Production', 
    perk: 'Glowing Neon Profile Card Themes', 
    color: 'from-[#ff0055]/20 via-transparent to-transparent',
    hexColor: '#ff0055',
    mobileGlow: 'rgba(255, 0, 85, 0.12)'
  },
  { 
    rank: 'III', 
    title: 'Legendary Shipper', 
    perk: 'Mythical Profile Custom Accents & Themes', 
    color: 'from-[#8b5cf6]/20 via-transparent to-transparent',
    hexColor: '#8b5cf6',
    mobileGlow: 'rgba(139, 92, 246, 0.12)'
  },
  { 
    rank: 'IV', 
    title: 'Kernel Lord', 
    perk: 'Direct Access to Private Beta Bounty Lists', 
    color: 'from-[#3b82f6]/20 via-transparent to-transparent',
    hexColor: '#3b82f6',
    mobileGlow: 'rgba(59, 130, 246, 0.12)'
  },
  { 
    rank: 'V', 
    title: 'Architect of Chaos', 
    perk: 'Elite Leaderboards + Custom Legend Badge', 
    color: 'from-[#10b981]/20 via-transparent to-transparent',
    hexColor: '#10b981',
    mobileGlow: 'rgba(16, 185, 129, 0.12)'
  }
]


export default function LevelsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pageContainerRef = useRef<HTMLDivElement>(null)

  // 1. Autoplay loop cycling through exactly 25 levels
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 25)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  // 2. Keypress event listener for horizontal keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + 25) % 25)
        setIsPaused(true)
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % 25)
        setIsPaused(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useGSAP(() => {
    // 1. Entrance timeline using premium easeOutExpo curves
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    
    tl.fromTo('.gsap-lvl-hero-badge', 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }
    )
    .fromTo('.gsap-lvl-hero-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.1 },
      '-=0.75'
    )
    .fromTo('.gsap-lvl-hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      '-=0.75'
    )
    .fromTo('.gsap-lvl-selector-wrap',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      '-=0.6'
    )

    // 2. Scroll reveals for subsequent sections
    const sections = gsap.utils.toArray<HTMLElement>('.gsap-lvl-section')
    sections.forEach((section) => {
      gsap.fromTo(section.querySelectorAll('.gsap-lvl-element'),
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          }
        }
      )
    })
  }, { scope: pageContainerRef })

  useGSAP(() => {
    // Animate active center card smoothly using rapid staggered easeOutExpo curves on swap
    gsap.fromTo('.gsap-lvl-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'expo.out' }
    )
  }, { dependencies: [activeIndex], scope: pageContainerRef })

  // Derived state bindings (derived dynamically from the primary activeIndex)
  const activeLevel = ALL_LEVELS[activeIndex]
  const activeTab = activeLevel.tierId
  const TierIcon = activeLevel.tierIcon

  // Calculate indices for the 5 visible cards in our infinite viewport window
  const visibleCards = [
    { index: (activeIndex - 2 + 25) % 25, diff: -2 },
    { index: (activeIndex - 1 + 25) % 25, diff: -1 },
    { index: activeIndex, diff: 0 },
    { index: (activeIndex + 1) % 25, diff: 1 },
    { index: (activeIndex + 2) % 25, diff: 2 }
  ]

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-accent selection:text-white">
      {/* Fixed Micro-grain Noise Overlay for high-end tactile screen depth */}
      <div 
        className="fixed inset-0 pointer-events-none z-[99] opacity-[0.012]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />
      
      {/* GPU-Accelerated Tab progress animation keyframe and 3D offset variables */}
      <style>{`
        @keyframes tabProgress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        :root {
          --carousel-offset-1: 90px;
          --carousel-offset-2: 180px;
          --carousel-card-width: 210px;
        }
        @media (min-width: 640px) {
          :root {
            --carousel-offset-1: 180px;
            --carousel-offset-2: 360px;
            --carousel-card-width: 250px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --carousel-offset-1: 220px;
            --carousel-offset-2: 440px;
            --carousel-card-width: 275px;
          }
        }
      `}</style>

      <Navbar />

      {/* --- HERO SECTION WITH SCALED DOTTED BACKGROUND --- */}
      <div className="relative w-full overflow-hidden">
        {/* Ambient background Dot Grid */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none opacity-50"
          style={{
            maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 45%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 45%)',
          }}
        >
          <DotField
            dotRadius={1.2}
            dotSpacing={22}
            bulgeStrength={45}
            glowRadius={150}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={350}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#FF7A00"
            gradientTo="#E66E00"
            glowColor="#050505"
          />
        </div>

        <section className="relative z-10 pt-48 pb-20 md:pt-56 md:pb-28 px-6 max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8 relative z-30">
            {/* Small badge */}
            <div className="gsap-lvl-hero-badge flex items-center justify-center gap-2 opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="ui-eyebrow">{'//'} game progression</span>
            </div>

            {/* Headline */}
            <h1 className="gsap-lvl-hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.02] tracking-[-0.04em] opacity-0">
              The level <span className="font-serif italic font-normal text-accent">system.</span>
            </h1>

            {/* Description */}
            <p className="gsap-lvl-hero-desc text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-0">
              Levels measure platform experience, contribution volume, and consistency — not raw domain skill. Accumulate XP by shipping high-quality code, level up your tier, and unlock premium access.
            </p>
          </div>
        </section>
      </div>

      {/* --- INTERACTIVE LEVEL PROGRESSION & TITLES --- */}
      <section className="gsap-lvl-section relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="gsap-lvl-element ui-eyebrow opacity-0">
              {'//'} progression ladder
            </div>
            <h2 className="gsap-lvl-element text-4xl md:text-6xl font-medium text-white tracking-[-0.03em] leading-none opacity-0">
              Choose your <span className="font-serif italic font-normal text-accent">level.</span>
            </h2>
          </div>

          {/* Typographic Progression Explanation (Replaces the 2nd photo's tabs bar to fill the space beautifully) */}
          <div className="gsap-lvl-element max-w-3xl mx-auto text-center space-y-5 opacity-0">
            <p className="text-white/40 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
              Accumulate XP by shipping high-quality code, keeping active daily streaks, and delivering ahead of deadlines. Advance through 25 milestones divided into 5 prestige tiers to unlock exclusive developer badges, custom UI themes, and private enterprise projects.
            </p>
            
            {/* Elegant horizontal legend roadmap (replaces the tab selectors from the 2nd photo with beautiful static copy) */}
            <div className="hidden sm:flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-4xl mx-auto pt-2 text-[10px] font-mono uppercase tracking-wider text-white/30">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]/60" /> EARLY <span className="text-white/10 font-light">1-5</span></span>
              <span className="text-white/10 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]/70" /> MID <span className="text-white/10 font-light">6-10</span></span>
              <span className="text-white/10 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]/80" /> SKILLED <span className="text-white/10 font-light">11-15</span></span>
              <span className="text-white/10 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]/90" /> ELITE <span className="text-white/10 font-light">16-20</span></span>
              <span className="text-white/10 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" /> LEGEND <span className="text-white/10 font-light">21-25</span></span>
            </div>
          </div>

          {/* 3D Perspective Infinite Carousel viewport */}
          <div className="relative w-full h-[380px] sm:h-[410px] overflow-hidden flex items-center justify-center relative select-none">
            {/* Left navigation fade overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none" />
            {/* Right navigation fade overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none" />

            {/* Floating side navigation buttons overlay (Pic 1 chevrons moved to side of carousel) */}
            <button 
              onClick={() => {
                setActiveIndex((prev) => (prev - 1 + 25) % 25)
                setIsPaused(true)
              }}
              className="absolute left-4 sm:left-12 z-40 bg-black/45 border border-white/[0.08] hover:border-[#FF7A00]/40 rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/50 hover:text-[#FF7A00] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button 
              onClick={() => {
                setActiveIndex((prev) => (prev + 1) % 25)
                setIsPaused(true)
              }}
              className="absolute right-4 sm:right-12 z-40 bg-black/45 border border-white/[0.08] hover:border-[#FF7A00]/40 rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/50 hover:text-[#FF7A00] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="relative w-full max-w-6xl h-full flex items-center justify-center z-10" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              {visibleCards.map(({ index: lvlIdx, diff }) => {
                const lvl = ALL_LEVELS[lvlIdx]
                const isActive = diff === 0
                
                const localIdx = (lvl.lvl - 1) % 5
                const isFirst = localIdx === 0
                const isMid = localIdx === 1 || localIdx === 2
                const isPeak = localIdx === 3
                const isApex = localIdx === 4
                
                let cardClass = ""
                let statusTag = ""
                
                if (isFirst) {
                  cardClass = "from-[#080808] to-[#040404] border-white/[0.03] hover:border-white/[0.12]"
                  statusTag = "INITIATION"
                } else if (isMid) {
                  cardClass = "from-[#0A0A0A] to-[#050505] border-white/[0.04] hover:border-[#FF7A00]/20"
                  statusTag = "ASCENT"
                } else if (isPeak) {
                  cardClass = "from-[#0C0C0C] to-[#060606] border-white/[0.05] hover:border-[#FF7A00]/30"
                  statusTag = "SUMMIT"
                } else if (isApex) {
                  cardClass = "from-[#140E0A] to-[#080605] border-[#FF7A00]/15 hover:border-[#FF7A00]/50"
                  statusTag = "APEX GATEWAY"
                }

                // If active/centered, enforce the stunning Pic 3 glowing active effect
                let finalCardClass = cardClass
                if (isActive) {
                  finalCardClass = "from-[#140E0A] to-[#080605] border-[#FF7A00]"
                }

                const paddedNum = String(lvl.lvl).padStart(2, '0')

                // 3D position styling with dynamic calculations using hardware accelerated scale and translateX
                let cardStyle: React.CSSProperties = {
                  transform: `translateX(-50%)`,
                  opacity: 1,
                  zIndex: 30
                }

                if (diff === -2) {
                  cardStyle = {
                    transform: `translateX(calc(-50% - var(--carousel-offset-2))) scale(0.68)`,
                    opacity: 0.15,
                    zIndex: 10,
                    filter: 'blur(2px)'
                  }
                } else if (diff === -1) {
                  cardStyle = {
                    transform: `translateX(calc(-50% - var(--carousel-offset-1))) scale(0.86)`,
                    opacity: 0.52,
                    zIndex: 20
                  }
                } else if (diff === 0) {
                  cardStyle = {
                    transform: `translateX(-50%) scale(1.05)`,
                    opacity: 1,
                    zIndex: 30
                  }
                } else if (diff === 1) {
                  cardStyle = {
                    transform: `translateX(calc(-50% + var(--carousel-offset-1))) scale(0.86)`,
                    opacity: 0.52,
                    zIndex: 20
                  }
                } else if (diff === 2) {
                  cardStyle = {
                    transform: `translateX(calc(-50% + var(--carousel-offset-2))) scale(0.68)`,
                    opacity: 0.15,
                    zIndex: 10,
                    filter: 'blur(2px)'
                  }
                }

                return (
                  <div 
                    key={lvl.lvl}
                    onClick={() => {
                      if (diff !== 0) {
                        setActiveIndex(lvlIdx)
                        setIsPaused(true)
                      }
                    }}
                    style={cardStyle}
                    className={`absolute left-1/2 w-[var(--carousel-card-width)] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                      diff !== 0 ? 'cursor-pointer select-none' : ''
                    }`}
                  >
                    <div 
                      className={`gsap-lvl-card relative w-full rounded-2xl border bg-gradient-to-b ${finalCardClass} p-6 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group flex flex-col justify-between h-[280px] sm:h-[310px] overflow-hidden text-left ${
                        isActive ? 'shadow-[0_0_30px_rgba(255,122,0,0.18)]' : 'shadow-[0_12px_40px_rgba(0,0,0,0.7)]'
                      }`}
                    >
                      {/* Subtle top light reflection highlight line */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />

                      {/* Ambient spotlight overlay */}
                      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100 ${
                        isActive || isApex 
                          ? "bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.06)_0%,_transparent_65%)]"
                          : "bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.015)_0%,_transparent_65%)]"
                      }`} />

                      {/* Technical Corner Brackets - glowing on the active focused card (Pic 3 visual signature) */}
                      {(isActive || isApex) && (
                        <>
                          <div className={`absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l pointer-events-none transition-colors duration-500 z-20 ${
                            isActive ? 'border-[#FF7A00] border-t-2 border-l-2' : 'border-[#FF7A00]/30'
                          }`} />
                          <div className={`absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r pointer-events-none transition-colors duration-500 z-20 ${
                            isActive ? 'border-[#FF7A00] border-t-2 border-r-2' : 'border-[#FF7A00]/30'
                          }`} />
                          <div className={`absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l pointer-events-none transition-colors duration-500 z-20 ${
                            isActive ? 'border-[#FF7A00] border-b-2 border-l-2' : 'border-[#FF7A00]/30'
                          }`} />
                          <div className={`absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r pointer-events-none transition-colors duration-500 z-20 ${
                            isActive ? 'border-[#FF7A00] border-b-2 border-r-2' : 'border-[#FF7A00]/30'
                          }`} />
                        </>
                      )}

                      {/* Custom visual watermark background grids */}
                      {isFirst && !isActive && (
                        <div className="absolute right-4 bottom-4 font-mono text-[56px] font-bold text-white/[0.01] group-hover:text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter transition-colors duration-500">
                          [{paddedNum}]
                        </div>
                      )}

                      {isMid && !isActive && (
                        <svg className="absolute right-4 bottom-4 w-12 h-12 text-white/[0.01] group-hover:text-white/[0.03] transition-colors duration-500 pointer-events-none" viewBox="0 0 40 40">
                          <circle cx="10" cy="10" r="1" fill="currentColor"/>
                          <circle cx="20" cy="10" r="1" fill="currentColor"/>
                          <circle cx="30" cy="10" r="1" fill="currentColor"/>
                          <circle cx="10" cy="20" r="1" fill="currentColor"/>
                          <circle cx="20" cy="20" r="1" fill="currentColor"/>
                          <circle cx="30" cy="20" r="1" fill="currentColor"/>
                          <circle cx="10" cy="30" r="1" fill="currentColor"/>
                          <circle cx="20" cy="30" r="1" fill="currentColor"/>
                          <circle cx="30" cy="30" r="1" fill="currentColor"/>
                        </svg>
                      )}

                      {isPeak && !isActive && (
                        <svg className="absolute -right-4 -bottom-4 w-20 h-20 text-white/[0.01] group-hover:text-[#FF7A00]/[0.02] transition-colors duration-500 pointer-events-none" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.75" fill="none"/>
                          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.75" fill="none" strokeDasharray="3 3"/>
                          <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.75" fill="none"/>
                        </svg>
                      )}

                      {isApex && (
                        <svg className="absolute -right-2 -bottom-2 w-24 h-24 text-[#FF7A00]/[0.015] group-hover:text-[#FF7A00]/[0.04] transition-colors duration-500 pointer-events-none" viewBox="0 0 100 100">
                          <path d="M 10 10 L 90 90 M 90 10 L 10 90" stroke="currentColor" strokeWidth="0.5"/>
                          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                          <rect x="35" y="35" width="30" height="30" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(45 50 50)"/>
                        </svg>
                      )}

                      {/* Card Header Section */}
                      <div className="flex justify-between items-start relative z-10 w-full">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {/* Level Number Badge (Solid bright orange rounded block for active card) */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm transition-all duration-500 relative z-20 ${
                              isActive 
                                ? 'bg-[#FF7A00] text-black shadow-[0_0_12px_rgba(255,122,0,0.35)] border-transparent' 
                                : isApex 
                                  ? 'bg-white/[0.03] border border-[#FF7A00]/30 text-[#FF7A00]' 
                                  : 'bg-white/[0.03] border border-white/[0.08] text-white/70 group-hover:bg-[#FF7A00] group-hover:text-black group-hover:border-[#FF7A00]'
                            }`}>
                              {paddedNum}
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-[9px] font-mono tracking-widest font-black uppercase transition-colors duration-500 ${
                                isActive ? 'text-[#FF7A00]' : isApex ? 'text-[#FF7A00]/80' : 'text-white/30'
                              }`}>
                                {statusTag}
                              </span>
                              <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.15em] font-medium">STAGE</span>
                            </div>
                          </div>
                        </div>

                        {(isActive || isApex) && (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[7px] font-mono uppercase tracking-wider animate-pulse transition-all duration-500 ${
                            isActive 
                              ? 'bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00]'
                              : 'bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00]'
                          }`}>
                            <span className="w-1 h-1 rounded-full bg-[#FF7A00]" />
                            TIER LOCK
                          </span>
                        )}
                      </div>

                      {/* Middle Section: Title & XP */}
                      <div className="relative z-10 mt-6 flex justify-between items-baseline gap-2 w-full">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#FF7A00] transition-colors duration-300">
                          {lvl.title}
                        </h3>
                        <span className="text-xs sm:text-sm font-mono font-bold text-[#FF7A00] shrink-0">
                          {lvl.xp}
                        </span>
                      </div>

                      {/* Dashed Separator */}
                      <div className="border-t border-dashed border-white/10 my-4 relative z-10 w-full" />

                      {/* Footer Section: Unlocks */}
                      <div className="relative z-10 w-full mb-3 flex-grow flex flex-col justify-end">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-black block mb-1">
                          Unlocks Access
                        </span>
                        <p className="text-xs sm:text-sm text-white/60 font-light leading-snug transition-colors duration-300 group-hover:text-white/80">
                          {lvl.unlock}
                        </p>
                      </div>

                      {/* Dynamic loop indicator progress bar inside active center card */}
                      {isActive && !isPaused && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15 overflow-hidden rounded-b-2xl z-20">
                          <div 
                            key={activeIndex}
                            className="h-full bg-[#FF7A00] w-full origin-left"
                            style={{
                              animation: 'tabProgress 4000ms linear forwards',
                              transformOrigin: 'left'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW TO EARN XP SECTION --- */}
      <section className="gsap-lvl-section relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="gsap-lvl-element ui-eyebrow opacity-0">
              {'//'} the rules
            </div>
            <h2 className="gsap-lvl-element text-4xl md:text-6xl font-medium text-white tracking-[-0.03em] leading-none opacity-0">
              How to earn <span className="font-serif italic font-normal text-accent">XP.</span>
            </h2>
            <p className="gsap-lvl-element text-white/50 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed opacity-0">
              XP rewards consistency, high execution speed, and immaculate client review scores.
            </p>
          </div>

          {/* XP Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {XP_RULES.map((rule, idx) => {
              const Icon = rule.icon
              const isFirst = idx === 0
              
              if (isFirst) {
                return (
                  <div 
                    key={idx}
                    className="gsap-lvl-element md:col-span-2 relative rounded-3xl border border-white/[0.04] bg-[#0A0A0A] p-8 hover:border-[#FF7A00]/30 hover:scale-[1.015] active:scale-[0.99] group opacity-0 overflow-hidden text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    {/* Spotlight Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="h-full flex flex-col md:flex-row gap-8 justify-between relative z-10">
                      {/* Left Column: Icon and Info */}
                      <div className="flex flex-col justify-between space-y-6 md:w-1/2">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0">
                          <Icon className="w-6 h-6" strokeWidth={1.2} />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">
                            {rule.title}
                          </h3>
                          <p className="text-xs text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                            {rule.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right Column: Receipt Payout Table */}
                      <div className="md:w-1/2 bg-[#050505] border border-white/[0.03] p-6 rounded-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.02)] flex flex-col justify-center">
                        <p className="text-[9px] text-white/30 uppercase font-mono font-bold tracking-widest mb-4 border-b border-white/[0.04] pb-2">XP Reward Scale</p>
                        <div className="space-y-3 font-mono">
                          {rule.details?.map((detail, dIdx) => (
                            <div key={dIdx} className="flex justify-between items-center text-xs">
                              <span className="text-white/40 font-light">{detail.label}</span>
                              <span className="text-[#FF7A00] font-bold">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // Standard Cards (Cards 2, 3, 4, 5)
              return (
                <div 
                  key={idx}
                  className="gsap-lvl-element relative rounded-3xl border border-white/[0.04] bg-[#0A0A0A] p-8 hover:border-[#FF7A00]/30 hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between min-h-[280px] overflow-hidden text-left opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  {/* Spotlight Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.02)_0%,_transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Icon and Value Badge */}
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0">
                      <Icon className="w-6 h-6" strokeWidth={1.2} />
                    </div>
                    {rule.value && (
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-md ${
                        rule.isPenalty 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/15' 
                          : 'bg-accent/10 text-accent border border-accent/15'
                      }`}>
                        {rule.value}
                      </span>
                    )}
                  </div>

                  {/* Copy content */}
                  <div className="space-y-4 relative z-10 mt-auto">
                    <h3 className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                      {rule.desc}
                    </p>

                    {/* Optional detailed values */}
                    {rule.details && (
                      <div className="border-t border-white/[0.04] pt-4 mt-4 space-y-2.5 font-mono">
                        {rule.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex justify-between items-center text-xs">
                            <span className="text-white/40 font-light">{detail.label}</span>
                            <span className="text-accent font-bold">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* --- PRESTIGE SYSTEM SHOWCASE --- */}
      <section className="gsap-lvl-section relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="gsap-lvl-element ui-eyebrow opacity-0">
              {'//'} end game content
            </div>
            <h2 className="gsap-lvl-element text-4xl md:text-6xl font-medium text-white tracking-[-0.03em] leading-none opacity-0">
              The prestige <span className="font-serif italic font-normal text-accent">ranks.</span>
            </h2>
            <p className="gsap-lvl-element text-white/50 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed opacity-0">
              Reaching Level 25 unlocks the option to Prestige. Reset your level progression to claim permanent cosmetic titles and high-value platform perks.
            </p>
          </div>

          {/* Ranks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PRESTIGE_RANKS.map((pres, pIdx) => (
              <div 
                key={pIdx}
                className="gsap-lvl-element relative rounded-2xl border border-white/[0.04] bg-[#0A0A0A] p-6 hover:border-[#FF7A00]/30 hover:scale-[1.02] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] group flex flex-col justify-between min-h-[220px] overflow-hidden text-left opacity-0"
              >
                {/* Background Ambient Spotlights matching prestige color - Desktop (Hover only) */}
                <div className={`hidden md:block absolute inset-0 bg-gradient-to-tr ${pres.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                {/* Background Ambient Spotlights matching prestige color - Mobile (Subtle top glow & border) */}
                <div 
                  className="block md:hidden absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${pres.mobileGlow} 0%, transparent 65%)`
                  }}
                />
                <div 
                  className="block md:hidden absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none opacity-70"
                  style={{
                    background: `linear-gradient(to right, transparent, ${pres.hexColor} 30%, ${pres.hexColor} 70%, transparent)`
                  }}
                />

                {/* Giant Roman Numeral Watermark */}
                <div className="font-serif text-6xl md:text-8xl font-medium text-white/[0.015] group-hover:text-[#FF7A00]/[0.03] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 select-none absolute right-4 top-2 leading-none">
                  {pres.rank}
                </div>

                <div className="space-y-3 relative z-10 mt-auto">
                  <h4 className="text-white font-bold text-base md:text-lg tracking-tight group-hover:text-[#FF7A00] transition-colors duration-300">
                    Prestige {pres.rank}
                  </h4>
                  <p className="text-[11px] text-[#FF7A00] font-bold uppercase tracking-wider">
                    {pres.title}
                  </p>
                  <p className="text-xs text-white/40 leading-snug font-light group-hover:text-white/60 transition-colors duration-300 border-t border-white/[0.03] pt-3 mt-3">
                    {pres.perk}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <CTA />

      <Footer />
    </div>
  )
}
