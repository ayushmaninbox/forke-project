'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
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
  Bookmark
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
  { rank: 'I', title: 'Ascended Developer', perk: 'Animated Profile Border Cosmetics', color: 'from-[#D97706]/40 via-transparent to-transparent' },
  { rank: 'II', title: 'Ghost in Production', perk: 'Glowing Neon Profile Card Themes', color: 'from-[#ff0055]/20 via-transparent to-transparent' },
  { rank: 'III', title: 'Legendary Shipper', perk: 'Mythical Profile Custom Accents & Themes', color: 'from-[#8b5cf6]/20 via-transparent to-transparent' },
  { rank: 'IV', title: 'Kernel Lord', perk: 'Direct Access to Private Beta Bounty Lists', color: 'from-[#3b82f6]/20 via-transparent to-transparent' },
  { rank: 'V', title: 'Architect of Chaos', perk: 'Elite Leaderboards + Custom Legend Badge', color: 'from-[#10b981]/20 via-transparent to-transparent' }
]

export default function LevelsPage() {
  const [activeTab, setActiveTab] = useState('early')
  const pageContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // 1. Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo('.gsap-lvl-hero-badge', 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo('.gsap-lvl-hero-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 },
      '-=0.6'
    )
    .fromTo('.gsap-lvl-hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo('.gsap-lvl-selector-wrap',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5'
    )

    // 2. Scroll reveals for subsequent sections
    const sections = gsap.utils.toArray<HTMLElement>('.gsap-lvl-section')
    sections.forEach((section) => {
      gsap.fromTo(section.querySelectorAll('.gsap-lvl-element'),
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          }
        }
      )
    })
  }, { scope: pageContainerRef })

  const currentTier = TIERS.find(t => t.id === activeTab) || TIERS[0]
  const TierIcon = currentTier.icon

  return (
    <div ref={pageContainerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-accent selection:text-white">
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
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">Game Progression</span>
            </div>

            {/* Headline */}
            <h1 className="gsap-lvl-hero-title font-serif text-6xl md:text-8xl text-white leading-none tracking-tight opacity-0">
              The Level <span className="text-accent italic font-normal text-glow">System</span>
            </h1>

            {/* Description */}
            <p className="gsap-lvl-hero-desc text-muted text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-0">
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
            <div className="gsap-lvl-element inline-flex items-center gap-2 text-accent font-black tracking-widest text-xs uppercase opacity-0">
              Progression Ladder
            </div>
            <h2 className="gsap-lvl-element font-serif text-4xl md:text-6xl text-white tracking-tight leading-none opacity-0">
              Choose your <span className="text-accent italic font-normal">tier</span>
            </h2>
          </div>

          {/* Tab selectors */}
          <div className="gsap-lvl-selector-wrap opacity-0 flex flex-wrap justify-center gap-3 p-2 bg-[#0e0e0e] border border-white/[0.04] rounded-full max-w-3xl mx-auto backdrop-blur-xl">
            {TIERS.map((tier) => {
              const Icon = tier.icon
              const isActive = activeTab === tier.id
              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTab(tier.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-b from-accent to-[#d97706] text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]' 
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tier.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ml-1 font-black ${
                    isActive ? 'bg-black/20 text-bg' : 'bg-white/5 text-white/40'
                  }`}>
                    {tier.range}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Level Cards Deck */}
          <div className="gsap-lvl-element grid grid-cols-1 md:grid-cols-5 gap-4 opacity-0">
            {currentTier.levels.map((lvl) => (
              <div 
                key={lvl.lvl}
                className="relative rounded-[2rem] bg-gradient-to-b from-[#141414] to-[#090909] border border-white/[0.05] p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-accent/40 hover:shadow-[0_10px_20px_-10px_rgba(255,122,0,0.1)] hover:-translate-y-1 group overflow-hidden"
              >
                {/* Visual Top Highlight Accent */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />
                
                {/* Ambient Internal Spotlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Level Title Node */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center font-mono font-black text-accent text-sm shadow-[0_0_10px_rgba(255,122,0,0.05)]">
                    L{lvl.lvl}
                  </div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
                    {lvl.xp}
                  </span>
                </div>

                {/* Level Title & Unlock details */}
                <div className="space-y-3 relative z-10 text-left">
                  <h3 className="text-white font-bold text-base md:text-lg leading-tight tracking-tight group-hover:text-accent transition-colors duration-300">
                    {lvl.title}
                  </h3>
                  <div className="border-t border-white/[0.04] pt-2.5">
                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Unlocks</p>
                    <p className="text-xs text-white/60 leading-tight font-light group-hover:text-white/80 transition-colors duration-300">
                      {lvl.unlock}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- HOW TO EARN XP SECTION --- */}
      <section className="gsap-lvl-section relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="gsap-lvl-element inline-flex items-center gap-2 text-accent font-black tracking-widest text-xs uppercase opacity-0">
              The Rules
            </div>
            <h2 className="gsap-lvl-element font-serif text-4xl md:text-6xl text-white tracking-tight leading-none opacity-0">
              How to earn <span className="text-accent italic font-normal">XP</span>
            </h2>
            <p className="gsap-lvl-element text-muted text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed opacity-0">
              XP rewards consistency, high execution speed, and immaculate client review scores.
            </p>
          </div>

          {/* XP Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {XP_RULES.map((rule, idx) => {
              const Icon = rule.icon
              return (
                <div 
                  key={idx} 
                  className="gsap-lvl-element relative p-8 rounded-[2rem] bg-gradient-to-b from-[#141414] to-[#090909] border border-white/[0.05] hover:border-accent/30 hover:shadow-[0_15px_35px_-15px_rgba(255,122,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[280px] group opacity-0 overflow-hidden"
                >
                  {/* Spotlight Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Icon and Value Badge */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg group-hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] transition-all duration-500 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    {rule.value && (
                      <span className={`text-xs font-mono font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                        rule.isPenalty 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        {rule.value}
                      </span>
                    )}
                  </div>

                  {/* Copy content */}
                  <div className="space-y-4 relative z-10 text-left">
                    <h3 className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-accent transition-colors duration-300">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-300">
                      {rule.desc}
                    </p>

                    {/* Optional detailed values */}
                    {rule.details && (
                      <div className="border-t border-white/[0.04] pt-3 mt-3 space-y-2 font-mono">
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
            <div className="gsap-lvl-element inline-flex items-center gap-2 text-accent font-black tracking-widest text-xs uppercase opacity-0">
              End Game Content
            </div>
            <h2 className="gsap-lvl-element font-serif text-4xl md:text-6xl text-white tracking-tight leading-none opacity-0">
              The Prestige <span className="text-accent italic font-normal">ranks</span>
            </h2>
            <p className="gsap-lvl-element text-muted text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed opacity-0">
              Reaching Level 25 unlocks the option to Prestige. Reset your level progression to claim permanent cosmetic titles and high-value platform perks.
            </p>
          </div>

          {/* Ranks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PRESTIGE_RANKS.map((pres, pIdx) => (
              <div 
                key={pIdx}
                className="gsap-lvl-element relative p-6 rounded-[2rem] bg-[#0e0e0e] border border-white/[0.04] hover:border-accent/40 transition-all duration-300 text-left min-h-[220px] flex flex-col justify-between overflow-hidden group opacity-0"
              >
                {/* Background Ambient Spotlights matching prestige color */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${pres.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Giant Roman Numeral */}
                <div className="font-serif text-5xl font-black text-white/[0.02] group-hover:text-accent/5 transition-colors duration-500 tracking-tighter leading-none select-none">
                  {pres.rank}
                </div>

                <div className="space-y-3 relative z-10">
                  <h4 className="text-white font-bold text-base md:text-lg tracking-tight group-hover:text-accent transition-colors duration-300">
                    Prestige {pres.rank}
                  </h4>
                  <p className="text-[11px] text-accent font-bold uppercase tracking-wider">
                    {pres.title}
                  </p>
                  <p className="text-xs text-white/40 leading-tight font-light group-hover:text-white/60 transition-colors duration-300 border-t border-white/[0.04] pt-2 mt-2">
                    {pres.perk}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="gsap-lvl-section relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="p-8 md:p-14 rounded-[3.5rem] bg-[#0a0a0a] border border-white/[0.04] shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,122,0,0.05)_0%,_transparent_60%)] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <h2 className="gsap-lvl-element font-serif text-3xl md:text-5xl text-white leading-tight tracking-tight opacity-0">
              Earn your XP. Forge your path.
            </h2>
            <p className="gsap-lvl-element text-sm md:text-base text-white/50 leading-relaxed font-light opacity-0">
              Claim real tasks, ship verified code, level up, and cash out instantly. Ready to start grinding?
            </p>
            <div className="gsap-lvl-element flex flex-col sm:flex-row justify-center gap-4 opacity-0">
              <Button 
                size="lg" 
                className="rounded-xl px-8 py-3.5 h-auto text-xs font-bold uppercase tracking-wider bg-gradient-to-b from-accent to-[#d97706] border-b-2 border-black/30 shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(180,83,9)] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-bg flex items-center justify-center gap-2"
                onClick={() => window.location.href = '/register'}
              >
                Join the movement <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl px-8 py-3.5 h-auto text-xs font-bold uppercase tracking-wider border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center bg-transparent"
                onClick={() => window.location.href = '/bounties'}
              >
                Browse Bounties
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
