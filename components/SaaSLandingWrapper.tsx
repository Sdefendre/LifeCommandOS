'use client'

import dynamic from 'next/dynamic'

// Remove ssr: false since this is already a client component
// This helps avoid webpack chunk resolution issues during build
const SaaSLanding = dynamic(() => import('@/components/SaaSLanding'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  ),
})

export function SaaSLandingWrapper() {
  return <SaaSLanding />
}
