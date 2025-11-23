import { SiteHeader } from '@/components/SiteHeader'
import { LandingHero } from '@/components/landing/LandingHero'
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
const LandingTestimonials = dynamic(
  () => import('@/components/landing/LandingTestimonials').then((mod) => mod.LandingTestimonials),
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
    <div className="min-h-screen text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative w-full max-w-full">
      <div className="relative z-10 w-full max-w-full">
        <SiteHeader />

        <main className="relative z-10 w-full max-w-full overflow-x-hidden">
          <LandingHero />
          <LandingFeatures />
          <LandingTestimonials />
          <LandingRoadmap />
          <LandingPricing />
          <LandingCTA />
          <LandingFooter />
        </main>
      </div>
    </div>
  )
}
