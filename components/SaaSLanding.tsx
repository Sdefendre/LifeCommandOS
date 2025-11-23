import { SiteHeader } from '@/components/SiteHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { ThreeBackground } from '@/components/ThreeBackground'
import dynamic from 'next/dynamic'

// Dynamically import below-the-fold components to reduce initial bundle size
const LandingFeatures = dynamic(
  () => import('@/components/landing/LandingFeatures').then((mod) => mod.LandingFeatures),
  {
    loading: () => <div className="min-h-[400px]" />, // Placeholder to prevent layout shift
  }
)
const LandingRoadmap = dynamic(
  () => import('@/components/landing/LandingRoadmap').then((mod) => mod.LandingRoadmap),
  {
    loading: () => <div className="min-h-[400px]" />,
  }
)
const LandingPricing = dynamic(
  () => import('@/components/landing/LandingPricing').then((mod) => mod.LandingPricing),
  {
    loading: () => <div className="min-h-[400px]" />,
  }
)
const LandingCTA = dynamic(() =>
  import('@/components/landing/LandingCTA').then((mod) => mod.LandingCTA)
)
const LandingFooter = dynamic(() =>
  import('@/components/landing/LandingFooter').then((mod) => mod.LandingFooter)
)

export default function SaaSLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative">
      <ThreeBackground />
      <SiteHeader />

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingRoadmap />
        <LandingPricing />
        <LandingCTA />
        <LandingFooter />
      </main>
    </div>
  )
}
