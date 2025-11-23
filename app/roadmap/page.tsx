import { SiteHeader } from '@/components/SiteHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { Roadmap } from '@/components/Roadmap'

export const metadata = {
  title: 'Product Roadmap - Life Command OS',
  description: 'Future plans and feature roadmap for Life Command OS.',
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
            Product Roadmap
          </h1>
          <p className="text-xl text-muted-foreground">
            The future of Life Command OS. We're building a complete operating system for personal
            finance and productivity.
          </p>
        </div>

        <Roadmap />
      </main>

      <LandingFooter />
    </div>
  )
}
