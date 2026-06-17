'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Search } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Section, Eyebrow, H2 } from './primitives'
import Reveal from './Reveal'
import { useWaitlisterView } from './useWaitlisterView'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Proof of work — a snapshot of the real public profile page (DEV ID lanyard +
 * shipped-work ledger), captured as a static image and shown inside a laptop
 * whose lid opens as you scroll the section into view. Using a flat PNG instead
 * of the live 3D lanyard keeps the laptop trivially responsive on phone/tablet.
 */
const MOCKUP_SRC = '/forke-assets/landing-assets/proof-mockup.png'

/**
 * A laptop that opens on scroll. The screen (lid) is hinged at its bottom edge
 * and rotates from nearly-closed up to flat-open, scrubbed to scroll progress;
 * the base sits below as the keyboard deck. The whole unit scales fluidly with
 * its container, so the same markup works from phone to desktop.
 */
function LaptopMockup({
  lidRef,
  screenRef,
}: {
  lidRef: React.RefObject<HTMLDivElement | null>
  screenRef: React.RefObject<HTMLImageElement | null>
}) {
  return (
    <div className="w-full" style={{ perspective: '2200px' }}>
      {/* Screen / lid — hinged at the bottom edge, rotates open on scroll */}
      <div
        ref={lidRef}
        className="relative mx-auto w-full origin-bottom"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div className="relative overflow-hidden rounded-t-xl rounded-b-sm border border-white/[0.12] bg-[#0b0b0d] p-[0.6%] pb-[0.9%] shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
          {/* Webcam dot on the top bezel */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-[0.35%]">
            <span className="h-[3px] w-[3px] rounded-full bg-white/25 sm:h-[4px] sm:w-[4px]" />
          </div>
          <div className="overflow-hidden rounded-[5px]">
            {/* Browser chrome — traffic lights + an address/search bar so the
                screenshot reads as a live browser tab, not a bare image. */}
            <div className="flex items-center gap-[2%] border-b border-white/[0.06] bg-[#161618] px-[2%] py-[1.1%]">
              <div className="flex shrink-0 items-center gap-[5px]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#ff5f57] sm:h-[8px] sm:w-[8px]" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#febc2e] sm:h-[8px] sm:w-[8px]" />
                <span className="h-[6px] w-[6px] rounded-full bg-[#28c840] sm:h-[8px] sm:w-[8px]" />
              </div>
              {/* Address / search field — clamped sizing so it stays proportional
                  from phone up to the laptop's max width without runaway scaling. */}
              <div className="flex min-w-0 flex-1 items-center gap-[1.5%] rounded-full border border-white/[0.07] bg-white/[0.04] px-[1.8%] py-[0.7%]">
                <Lock
                  className="shrink-0 text-emerald-400/70"
                  style={{ width: 'clamp(7px, 1.3vw, 12px)', height: 'clamp(7px, 1.3vw, 12px)' }}
                />
                <span
                  className="truncate font-mono leading-none text-white/55"
                  style={{ fontSize: 'clamp(6px, 1.25vw, 12px)' }}
                >
                  forke.space/<span className="text-white/85">elonmusk</span>
                </span>
                <Search
                  className="ml-auto shrink-0 text-white/30"
                  style={{ width: 'clamp(7px, 1.3vw, 12px)', height: 'clamp(7px, 1.3vw, 12px)' }}
                />
              </div>
            </div>
            {/* The captured profile-page mockup */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={screenRef}
              src={MOCKUP_SRC}
              alt="A Forke public profile — verified DEV ID card and shipped-work ledger"
              className="block w-full select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Base / keyboard deck — slightly wider than the lid, sits flush below it */}
      <div className="relative mx-auto -mt-px w-[106%] -translate-x-[2.8%]">
        <div className="flex h-[10px] justify-center rounded-b-xl border border-t-0 border-white/[0.08] bg-gradient-to-b from-[#26262a] via-[#141416] to-[#0a0a0c] shadow-[0_34px_70px_rgba(0,0,0,0.65)] sm:h-[14px]">
          {/* Trackpad notch */}
          <div className="h-[45%] w-[12%] rounded-b-[5px] bg-black/40" />
        </div>
      </div>
    </div>
  )
}

export default function Proof({ n = '004' }: { n?: string }) {
  const showWaitlisterView = useWaitlisterView()
  const wrapRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLImageElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)

  // Apple-style product reveal: the laptop pins centered in the viewport for a
  // long scroll, then the lid opens with weight (eased, not linear) while the
  // whole unit scales up slightly and the screen brightens from dim to full —
  // the way Apple unveils a MacBook. Releases once fully open. Skipped under
  // reduced motion (renders open and bright).
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(lidRef.current, { rotateX: 0 })
      gsap.set(screenRef.current, { filter: 'brightness(1)' })
      return
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: pinRef.current,
        start: 'center center',
        // Longer pinned scroll (Apple lets the reveal breathe).
        end: '+=140%',
        pin: pinRef.current,
        pinSpacing: true,
        // The section uses overflow-hidden, which breaks position:fixed pinning;
        // pin via transforms so it sticks inside the clipped ancestor.
        pinType: 'transform',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // The lid weightily swings open; the device scales up and the screen
    // brightens in alongside it — all on one scrubbed timeline.
    tl.fromTo(
      lidRef.current,
      { rotateX: -88, transformPerspective: 2400, transformOrigin: 'bottom center' },
      { rotateX: 0, duration: 1 },
      0
    )
      .fromTo(
        scaleRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 1, ease: 'power1.out' },
        0
      )
      .fromTo(
        screenRef.current,
        { filter: 'brightness(0.35)' },
        { filter: 'brightness(1)', duration: 0.7, ease: 'power1.in' },
        0.35
      )
  }, { scope: wrapRef })

  return (
    <Section id="proof" className="overflow-hidden px-5 pb-10 pt-16 md:px-10 md:pb-16 md:pt-24">
      <div ref={wrapRef}>
        <Reveal>
          <Eyebrow n={n} label="proof of work" />
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <H2 accent="compiles.">A resume that</H2>
            <p className="max-w-md pb-1.5 text-[15px] font-light leading-relaxed text-white/45">
              Every approved task lands on your public profile automatically —
              timestamped, client-rated, linked to the merged PR. Recruiters
              don&apos;t read claims. They read receipts.
            </p>
          </div>
          <Link
            href={showWaitlisterView ? '/' : '/register'}
            className="group mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium text-white/75 transition-colors hover:text-white"
          >
            {showWaitlisterView ? 'Coming soon' : 'Claim your username'}
            <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {/* The artifact: the real profile page (DEV ID card + shipped-work
            ledger) captured as an image, shown on a laptop that opens on scroll */}
        <div className="relative mt-14 flex justify-center w-full">
          <div aria-hidden className="absolute -inset-x-12 top-10 h-56 rounded-full bg-accent/[0.05] blur-[110px]" />
          <div ref={pinRef} className="relative mx-auto w-full max-w-[920px]">
            {/* Inner wrapper carries the scale tween so it never fights the
                pin transform ScrollTrigger writes onto pinRef itself. */}
            <div ref={scaleRef} className="w-full origin-center will-change-transform">
              <LaptopMockup lidRef={lidRef} screenRef={screenRef} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
