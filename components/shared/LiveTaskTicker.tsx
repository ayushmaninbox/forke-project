import React from 'react'
import { CheckCircle2, Flame, Zap, Bug } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const FEED_ITEMS = [
  { text: 'Fixed API bug', reward: '+₹800 XP', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
  { text: '6 Task Streak', reward: '+150 XP', icon: <Flame className="w-4 h-4 text-orange-400" /> },
  { text: 'React Landing Page', reward: '+₹2200', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
  { text: 'REST Endpoint', reward: '+₹500', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
  { text: 'Bug Squashed: Navbar', reward: '+₹400', icon: <Bug className="w-4 h-4 text-red-400" /> },
  { text: 'Leaderboard #1 reached', reward: '+500 XP', icon: <Flame className="w-4 h-4 text-orange-400" /> },
]

export default function LiveTaskTicker({ isHeroEmbedded = false }: { isHeroEmbedded?: boolean }) {
  const displayItems = [...FEED_ITEMS, ...FEED_ITEMS, ...FEED_ITEMS] // Triple for seamless looping

  return (
    <section className={cn(
      "left-0 w-full h-14 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center overflow-hidden",
      isHeroEmbedded ? "absolute bottom-0" : "fixed bottom-0 z-40"
    )}>
      <div className="absolute left-0 top-0 h-full bg-black z-10 px-8 flex items-center gap-3 border-r border-white/10">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase whitespace-nowrap">
          Live Bounty Feed
        </span>
      </div>

      <div className="flex animate-ticker whitespace-nowrap pl-[240px]">
        {displayItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 mx-8 group"
          >
            {item.icon}
            <span className="text-sm font-medium text-muted group-hover:text-white transition-colors">
              {item.text}
            </span>
            <span className="text-sm font-bold text-accent">
              {item.reward}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
