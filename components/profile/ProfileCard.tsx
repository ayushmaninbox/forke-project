'use client'

import React from 'react'

interface ProfileCardProps {
  name: string
  username?: string | null
  level: number
  levelTitle: string
  headline?: string | null
  avatarUrl?: string | null
}

/**
 * Pure CSS/DOM lanyard card — crystal-clear native text & images (no WebGL
 * texture). Gently swings like it's hanging, and periodically flips front↔back.
 */
export default function ProfileCard({ name, username, level, levelTitle, headline, avatarUrl }: ProfileCardProps) {
  const initial = (name?.[0] || 'F').toUpperCase()
  const desc = headline || 'Building real, verified work.'

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <div className="lanyard-root flex flex-col items-center" style={{ perspective: '1600px', transformOrigin: 'top center' }}>
        {/* Strap */}
        <div className="relative w-7 h-24 overflow-hidden rounded-t-sm shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff8a00] to-[#c2620a]" />
          <div className="absolute inset-0 flex flex-col items-center justify-around py-2 text-[7px] font-black tracking-[0.2em] text-black/35">
            <span>FORKE</span><span>FORKE</span><span>FORKE</span>
          </div>
        </div>
        {/* Clasp */}
        <div className="w-9 h-3.5 rounded-b-md bg-gradient-to-b from-neutral-200 to-neutral-500 shadow-md -mt-px z-10" />
        <div className="w-4 h-4 rounded-full border-[3px] border-neutral-400 bg-neutral-800 -mt-2 shadow-inner z-0" />

        {/* Flipping card */}
        <div className="lanyard-card relative w-[300px] h-[424px] mt-1.5" style={{ transformStyle: 'preserve-3d' }}>
          {/* FRONT */}
          <CardFace>
            <div className="flex items-center justify-between">
              <span className="text-[#ff8a00] font-mono font-black text-base">FORKE //</span>
              <span className="text-white/35 font-mono font-bold text-[9px] tracking-[0.15em]">DEV CREDENTIAL</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-5">
              <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-[#ff8a00]/70 bg-[#ff8a00]/10 flex items-center justify-center shadow-[0_0_24px_rgba(255,138,0,0.18)]">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" draggable={false} />
                ) : (
                  <span className="text-5xl font-black text-[#ff8a00]">{initial}</span>
                )}
              </div>

              <div className="w-full space-y-2.5">
                <Field><span className="font-bold text-white text-[17px]">{name}</span></Field>
                <Field><span className="font-mono font-bold text-[#ff8a00] text-sm">LVL {level} · {levelTitle}</span></Field>
                <Field><span className="text-white/70 text-[13px]">{desc}</span></Field>
              </div>
            </div>

            <div>
              <div className="flex items-end gap-[2px] h-7 opacity-25">
                {BARS.map((w, i) => (
                  <span key={i} className="bg-white" style={{ width: w, height: '100%' }} />
                ))}
              </div>
              <p className="text-[8px] font-mono text-white/25 tracking-[0.12em] mt-1.5">VERIFIED · PROOF OF WORK · FORKE.SPACE</p>
            </div>
          </CardFace>

          {/* BACK */}
          <CardFace back>
            <div className="flex items-center justify-between">
              <span className="text-white/30 font-mono font-bold text-[9px] tracking-[0.15em]">FORKE NETWORK</span>
              <span className="text-[#ff8a00] font-mono font-black text-base">// </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/forke-assets/forky_clean_transparent.png" alt="Forky" className="w-44 h-44 object-contain drop-shadow-[0_0_20px_rgba(255,138,0,0.15)]" draggable={false} />
              <span className="text-[#ff8a00] font-mono font-black text-xl">@{username || 'forke'}</span>
            </div>
            <p className="text-center text-[8px] font-mono text-white/25 tracking-[0.18em]">FORKE // DEVELOPER NETWORK</p>
          </CardFace>
        </div>
      </div>

      <style>{`
        @keyframes lanyardDrop {
          0% { opacity: 0; transform: translateY(-26px) rotate(-6deg); }
          100% { opacity: 1; transform: translateY(0) rotate(-2.2deg); }
        }
        @keyframes lanyardSwing {
          0%, 100% { transform: rotate(-2.2deg); }
          50% { transform: rotate(2.2deg); }
        }
        @keyframes lanyardFlip {
          0%, 60%   { transform: rotateY(0deg); }
          64%, 88%  { transform: rotateY(180deg); }
          92%, 100% { transform: rotateY(360deg); }
        }
        .lanyard-root {
          transform-origin: top center;
          animation: lanyardDrop 0.9s cubic-bezier(0.22,1,0.36,1) both,
                     lanyardSwing 3.6s ease-in-out 0.9s infinite;
        }
        .lanyard-card { animation: lanyardFlip 30s ease-in-out 1.2s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lanyard-root, .lanyard-card { animation: none; }
        }
      `}</style>
    </div>
  )
}

const BARS = ['2px', '4px', '2px', '6px', '3px', '2px', '5px', '2px', '3px', '7px', '2px', '4px', '2px', '5px', '3px', '2px', '6px', '2px', '4px', '3px', '2px', '5px', '7px', '2px', '3px', '4px', '2px', '6px', '2px', '3px', '5px', '2px', '4px', '2px', '7px', '3px', '2px', '5px', '2px', '4px']

function CardFace({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 rounded-[20px] overflow-hidden border border-white/[0.09] p-5 flex flex-col bg-gradient-to-b from-[#151013] via-[#0d0a0c] to-[#0a0708] shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)]"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : undefined,
      }}
    >
      {/* ember glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-[#ff8a00]/15 blur-3xl" />
      <div className="relative flex flex-col h-full">{children}</div>
    </div>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full text-center py-2.5 rounded-xl border border-[#ff8a00]/25 bg-white/[0.015]">
      {children}
    </div>
  )
}
