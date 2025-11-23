'use client'

import dynamic from 'next/dynamic'

// Lazy load non-critical components to improve initial page load
// These must be client-only as they use browser APIs
const ScrollToTop = dynamic(
  () => import('@/components/ScrollToTop').then((mod) => ({ default: mod.ScrollToTop })),
  {
    ssr: false,
  }
)

const ChatFloatingButton = dynamic(
  () =>
    import('@/components/ChatFloatingButton').then((mod) => ({ default: mod.ChatFloatingButton })),
  {
    ssr: false,
  }
)

export function ClientOnlyComponents() {
  return (
    <>
      <ChatFloatingButton />
      <ScrollToTop />
    </>
  )
}
