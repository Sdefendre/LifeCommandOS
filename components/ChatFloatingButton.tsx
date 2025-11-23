'use client'

import { lazy, Suspense } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Lazy load the dialog to improve initial page load
const ChatDialog = lazy(() =>
  import('@/components/ChatDialog').then((mod) => ({ default: mod.ChatDialog }))
)

// Simple button component that doesn't require lazy loading
function ChatButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Chat with Command"
    >
      <MessageCircle className="size-5 transition-transform group-hover:rotate-12" />
    </motion.button>
  )
}

export function ChatFloatingButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 sm:bottom-6 sm:right-6"
      style={{
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px) + 1.5rem)',
        right: 'max(1.5rem, env(safe-area-inset-right, 0px) + 1.5rem)',
      }}
    >
      <Suspense fallback={<ChatButton />}>
        <ChatDialog trigger={<ChatButton />} />
      </Suspense>
    </motion.div>
  )
}
