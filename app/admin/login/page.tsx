'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { adminLogin } from '@/lib/admin-actions'
import { useRouter } from 'next/navigation'
import { Lock, User } from 'lucide-react'
import Image from 'next/image'

const REACTION_IMAGES = [
  '404_forky.png', 'boss_mode_forky.png', 'bug_panic_forky.png', 'confused_forky.png',
  'crying_forky.png', 'dead_inside_forky.png', 'default_forky.png', 'excited_forky.png',
  'fire_streak_forky.png', 'grind_mode_forky.png', 'happy_forky.png', 'level_up_forky.png',
  'loading_forky.png', 'locked_in_forky.png', 'loot_goblin_forky.png', 'peeking_forky.png',
  'proud_forky.png', 'rich_forky.png', 'shocked_forky.png', 'sleepy_forky.png', 'thinking_forky.png'
]

interface ForkyInstance {
  src: string
  top: number
  left: number
  size: number
  rotate: number
  delay: number
  duration: number
  opacity: number
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [forkies, setForkies] = useState<ForkyInstance[]>([])

  useEffect(() => {
    // High-density distribution
    const instances: ForkyInstance[] = []
    const slots: { r: number, c: number }[] = []
    const rows = 10
    const cols = 14

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Reduced exclusion zone for a tighter feel
        const isCenter = (r >= 3 && r <= 6) && (c >= 5 && c <= 8)
        if (!isCenter) {
          slots.push({ r, c })
        }
      }
    }

    const shuffledSlots = [...slots].sort(() => Math.random() - 0.5)
    const targetCount = Math.min(60, slots.length)
    
    for (let i = 0; i < targetCount; i++) {
      const slot = shuffledSlots[i]
      if (!slot) break

      const img = REACTION_IMAGES[Math.floor(Math.random() * REACTION_IMAGES.length)]
      const baseTop = (slot.r / rows) * 100
      const baseLeft = (slot.c / cols) * 100
      
      const isLarge = Math.random() > 0.7
      const size = isLarge ? (180 + Math.random() * 60) : (120 + Math.random() * 40)
      
      instances.push({
        src: `/forke-assets/forky-reactions/${img}`,
        top: baseTop + (Math.random() * 6 - 3),
        left: baseLeft + (Math.random() * 4 - 2),
        size,
        rotate: Math.random() * 60 - 30,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 6,
        opacity: isLarge ? (0.12 + Math.random() * 0.08) : (0.08 + Math.random() * 0.05)
      })
    }

    setForkies(instances)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await adminLogin(formData)

    if (result.success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(result.error || 'Failed to login')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor - High Density Random Forkies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {forkies.map((forky, idx) => (
          <div 
            key={idx}
            className="absolute animate-float-slow transition-opacity duration-1000 hover:opacity-100 group/forky"
            style={{ 
              top: `${forky.top}%`,
              left: `${forky.left}%`,
              width: `${forky.size}px`,
              height: `${forky.size}px`,
              transform: `rotate(${forky.rotate}deg)`,
              animationDelay: `${forky.delay}s`,
              animationDuration: `${forky.duration}s`,
              opacity: forky.opacity
            }}
          >
            <Image 
              src={forky.src} 
              alt="Forky" 
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(255,122,0,0.15)] select-none pointer-events-none transition-transform duration-1000 group-hover/forky:scale-110"
              draggable={false}
            />
          </div>
        ))}
        
        {/* Glow Spots */}
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-accent/[0.03] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-accent/[0.01] rounded-full blur-[200px]" />
      </div>

      <div className="w-full max-w-[360px] space-y-8 relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center h-20 relative mb-4">
            <div className="w-32 h-32 absolute bottom-0 animate-pulse-slow">
              <Image 
                src="/forke-assets/forke_logo.png" 
                alt="Logo" 
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(255,122,0,0.5)] select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-serif text-white tracking-tight leading-tight">Admin <span className="text-accent italic">Panel</span></h1>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">Restricted Access Area</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-[2rem] bg-black/70 border border-white/10 space-y-6 glass shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-accent" /> Username
              </label>
              <input 
                name="username"
                required 
                type="text" 
                className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-5 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.03] transition-all" 
                placeholder="admin_id" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] text-white/40 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-accent" /> Password
              </label>
              <input 
                name="password"
                required 
                type="password" 
                className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-5 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.03] transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <Button 
            disabled={isLoading}
            className="w-full h-14 text-sm font-black uppercase tracking-[0.15em] rounded-xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 transition-all active:scale-[0.98] relative z-10"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Decrypting...</span>
              </div>
            ) : (
              'Enter Panel'
            )}
          </Button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(4deg); }
        }
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; filter: brightness(1); }
          50% { transform: scale(1.05); opacity: 0.9; filter: brightness(1.2); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
        .glass {
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
        }
      `}</style>
    </div>
  )
}
