import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/shared/Hero'
import LiveTaskTicker from '@/components/shared/LiveTaskTicker'
import HowItWorks from '@/components/shared/HowItWorks'
import LevelSystem from '@/components/shared/LevelSystem'
import Stats from '@/components/shared/Stats'
import CTA from '@/components/shared/CTA'
import Footer from '@/components/shared/Footer'

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <LiveTaskTicker />
        <HowItWorks />
        <LevelSystem />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
