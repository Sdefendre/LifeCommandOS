'use client'

import dynamic from 'next/dynamic'

// Lazy load Three.js background to improve initial render
// Must be client-only as it uses browser APIs and Three.js
const DashboardThreeBackground = dynamic(
  () =>
    import('@/components/DashboardThreeBackground').then((mod) => ({
      default: mod.DashboardThreeBackground,
    })),
  { ssr: false }
)

export function DashboardThreeBackgroundWrapper() {
  return <DashboardThreeBackground />
}
