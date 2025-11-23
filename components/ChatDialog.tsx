'use client'

import { useState, Suspense, lazy } from 'react'
import { MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

// Lazy load the chat component to improve initial page load
const AIAgentChat = lazy(() =>
  import('@/components/AIAgentChat').then((mod) => ({ default: mod.AIAgentChat }))
)

interface ChatDialogProps {
  /** Optional trigger button - if not provided, defaults to chat icon button */
  trigger?: React.ReactNode
}

// Loading skeleton for chat initialization
function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">Loading chat...</p>
    </div>
  )
}

export function ChatDialog({ trigger }: ChatDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="flex items-center justify-center rounded-full bg-primary text-primary-foreground p-3 shadow-lg hover:shadow-xl transition-all"
            aria-label="Chat with Command"
          >
            <MessageCircle className="size-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-[700px] h-[85vh] max-h-[700px] flex flex-col p-0 gap-0"
        style={{
          marginTop: 'max(1rem, env(safe-area-inset-top, 0px) + 1rem)',
          marginBottom: 'max(1rem, env(safe-area-inset-bottom, 0px) + 1rem)',
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>Command</DialogTitle>
          <DialogDescription>
            Get instant answers about VA benefits, disability claims, C&P exams, and your DD-214.
            Built by veterans, for veterans.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-6 pb-6 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0">
            {open && (
              <Suspense fallback={<ChatLoadingSkeleton />}>
                <AIAgentChat />
              </Suspense>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
