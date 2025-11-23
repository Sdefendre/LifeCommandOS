'use client'

import dynamic from 'next/dynamic'

// Lazy load Three.js background to improve initial render
// Must be client-only as it uses browser APIs and Three.js
const SubtleThreeBackground = dynamic(
  () =>
    import('@/components/SubtleThreeBackground').then((mod) => ({
      default: mod.SubtleThreeBackground,
    })),
  { ssr: false }
)

export function SubtleThreeBackgroundWrapper() {
  return <SubtleThreeBackground />
}
