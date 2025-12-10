'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { useAuth } from '@/lib/auth'
import { ChatHeader } from './ChatHeader'
import { ChatSidebar } from './ChatSidebar'
import { Messages } from './Messages'
import { ChatInput } from './ChatInput'
import { DEFAULT_MODEL, type ModelOption } from '@/constants/ai'

export function Chat() {
  const { user } = useAuth()
  const userId = user?.id
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const selectedModel: ModelOption = DEFAULT_MODEL
  const [inputValue, setInputValue] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  // Mark as client-side after mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize conversation ID on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('ai-conversation-id')
      if (stored) {
        setConversationId(stored)
      } else {
        const newId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
        sessionStorage.setItem('ai-conversation-id', newId)
        setConversationId(newId)
      }
    }
  }, [])

  const chatResult = useChat({
    api: '/api/ai-agent',
    body: {
      userId,
      model: selectedModel,
      conversationId: conversationId || undefined,
    },
  } as any) as any

  const messages = chatResult?.messages || []
  const status = chatResult?.status || 'ready'
  const setMessages = chatResult?.setMessages
  const stop = chatResult?.stop
  const append = chatResult?.append
  const error = chatResult?.error as Error | undefined

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleSubmit = useCallback(async () => {
    const trimmedInput = inputValue.trim()
    if (!trimmedInput) return

    if (typeof append !== 'function') {
      // Silently ignore - chat hook not ready yet
      return
    }

    setInputValue('')
    setSubmitError(null)

    try {
      await append({
        role: 'user',
        content: trimmedInput,
      })
    } catch (e) {
      console.error('Failed to send message:', e)
      setInputValue(trimmedInput)
      setSubmitError(
        e instanceof Error ? e.message : 'Failed to send message. Please try again in a moment.'
      )
    }
  }, [inputValue, append])

  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      if (typeof append !== 'function') {
        // Silently ignore - chat hook not ready yet
        setInputValue(suggestion)
        return
      }
      setInputValue('')
      try {
        await append({
          role: 'user',
          content: suggestion,
        })
      } catch (e) {
        console.error('Failed to send suggestion:', e)
      }
    },
    [append]
  )

  const handleNewChat = useCallback(() => {
    if (setMessages) {
      setMessages([])
    }
    setInputValue('')
    // Generate new conversation ID
    const newId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    sessionStorage.setItem('ai-conversation-id', newId)
    setConversationId(newId)
  }, [setMessages])

  const handleStop = useCallback(() => {
    if (typeof stop === 'function') {
      stop()
    }
  }, [stop])

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="flex h-screen w-full bg-transparent items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-transparent">
      {/* Sidebar */}
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <ChatHeader onNewChat={handleNewChat} onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Messages */}
        <Messages
          messages={messages}
          status={status}
          onSuggestionClick={handleSuggestionClick}
          isChatReady={typeof append === 'function'}
        />

        {/* Error banner */}
        {(error || submitError) && (
          <div className="mx-auto max-w-3xl w-full px-4 pb-2 text-center">
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {submitError || error?.message || 'Something went wrong sending your message.'}
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          input={inputValue}
          setInput={setInputValue}
          onSubmit={handleSubmit}
          onStop={handleStop}
          isLoading={isLoading}
          selectedModel={selectedModel}
        />
      </div>
    </div>
  )
}
