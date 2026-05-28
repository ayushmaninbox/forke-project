import { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/shared/Hero'
import HowItWorks from '@/components/shared/HowItWorks'
import FirstMerge from '@/components/shared/FirstMerge'
import LevelSystem from '@/components/shared/LevelSystem'
import FAQ from '@/components/shared/FAQ'
import CTA from '@/components/shared/CTA'
import Footer from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Forke — Ship Real Work, Get Paid',
  description: 'The premier micro-task marketplace for developers. Complete coding bounties, level up your engineering skills, and earn rewards for your contributions.',
}

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <FirstMerge />
        <LevelSystem />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
