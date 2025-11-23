'use client'

import { FeedbackDialog } from '@/components/FeedbackDialog'
import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeedbackFloatingButtonProps {
  /** The page or section where feedback is being submitted */
  path?: string
}

export function FeedbackFloatingButton({ path }: FeedbackFloatingButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <FeedbackDialog
        path={path}
        trigger={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Provide feedback"
          >
            <MessageSquare className="size-5 transition-transform group-hover:rotate-12" />
          </motion.button>
        }
      />
    </motion.div>
  )
}
