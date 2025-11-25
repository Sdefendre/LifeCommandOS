import { CommandChat } from '@/components/command/CommandChat'
import { CommandThreeBackground } from '@/components/CommandThreeBackground'
import type { Viewport } from 'next'

export const metadata = {
  title: 'CommandAI - Life Command OS',
  description: 'Direct interface for CommandAI. Ask about VA benefits, claims, and transition.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function CommandPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent supports-[height:100dvh]:min-h-dvh dark text-foreground">
      <CommandThreeBackground />
      <CommandChat />
    </div>
  )
}
