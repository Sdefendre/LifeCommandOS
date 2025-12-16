'use client'

import { useRef, useEffect, useState, memo, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { UIMessage } from 'ai'
import { Message } from './Message'
import { ThinkingIndicator } from './ThinkingIndicator'
import { ChatGreeting } from './ChatGreeting'

interface MessagesProps {
  messages: UIMessage[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  onSuggestionClick: (suggestion: string) => void
  isChatReady?: boolean
}

function PureMessages({ messages, status, onSuggestionClick, isChatReady = true }: MessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  const isLoading = status === 'submitted' || status === 'streaming'

  // Check if user is at bottom
  const checkIfAtBottom = () => {
    const container = containerRef.current
    if (!container) return true
    const threshold = 100
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const atBottom = checkIfAtBottom()
      setIsAtBottom(atBottom)
      if (!atBottom) {
        setUserHasScrolled(true)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    endRef.current?.scrollIntoView({ behavior })
    setIsAtBottom(true)
    setUserHasScrolled(false)
  }, [])

  // Auto-scroll to bottom when new messages arrive (if user hasn't scrolled up)
  useEffect(() => {
    if (!userHasScrolled || isAtBottom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      scrollToBottom('smooth')
    }
  }, [messages, status, userHasScrolled, isAtBottom, scrollToBottom])

  // Reset userHasScrolled when a new message is sent
  useEffect(() => {
    if (status === 'submitted') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserHasScrolled(false)
    }
  }, [status])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-contain"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-4 md:py-8">
        {messages.length === 0 ? (
          <ChatGreeting onSuggestionClick={onSuggestionClick} disabled={!isChatReady} />
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {messages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                isLoading={isLoading && index === messages.length - 1}
              />
            ))}

            <AnimatePresence mode="wait">
              {status === 'submitted' && <ThinkingIndicator key="thinking" />}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={endRef} className="h-4 shrink-0" />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && messages.length > 0 && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-10 rounded-full bg-background/90 border border-border p-2.5 shadow-lg backdrop-blur-sm hover:bg-muted transition-colors"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (prevProps.messages !== nextProps.messages) return false
  if (prevProps.isChatReady !== nextProps.isChatReady) return false
  return true
})
