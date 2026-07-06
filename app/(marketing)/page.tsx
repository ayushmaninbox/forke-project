import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/shared/Hero'
import FirstMerge from '@/components/shared/FirstMerge'
import LevelSystem from '@/components/shared/LevelSystem'
import FAQ from '@/components/shared/FAQ'
import CTA from '@/components/shared/CTA'
import SupportedBy from '@/components/landing/SupportedBy'
import Footer from '@/components/shared/Footer'
import Stats from '@/components/landing/Stats'
import Pipeline from '@/components/landing/Pipeline'
import Session from '@/components/landing/Session'
import Verdict from '@/components/landing/Verdict'
import Proof from '@/components/landing/Proof'
import ReviewSystem from '@/components/landing/ReviewSystem'
import { Rails, Section } from '@/components/landing/primitives'

export const metadata: Metadata = {
  title: { absolute: 'Forke — Ship Real Work, Get Paid' },
  description: 'The premier micro-task marketplace for developers. Complete coding bounties, level up your engineering skills, and earn rewards for your contributions.',
  alternates: { canonical: '/' },
}

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Full-bleed cover — hero with Forky + ticker */}
        <Hero />

        {/* Ledger block one — rails dissolve before the video */}
        <Rails fadeBottom>
          <Stats />
          <Pipeline />
          <Session n="002" />
        </Rails>

        {/* Full-bleed brand moment — the video carries its own edge fades */}
        <FirstMerge />

        {/* Ledger block two — rails fade back in, then dissolve before the CTA */}
        <Rails fadeTop fadeBottom>
          <Verdict n="003" flush />
          <Proof n="004" />
          <Section>
            <LevelSystem />
          </Section>
          <ReviewSystem n="006" />
          <FAQ n="007" />
        </Rails>

        <SupportedBy />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
