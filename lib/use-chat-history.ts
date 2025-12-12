'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ConversationSummary {
  conversation_id: string
  title: string
  preview: string
  message_count: number
  created_at: string
  updated_at: string
}

export interface ConversationMessage {
  id: number
  created_at: string | null
  user_id: string | null
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  message: string
  metadata: Record<string, unknown> | null
}

interface UseChatHistoryReturn {
  conversations: ConversationSummary[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  loadConversation: (conversationId: string) => Promise<ConversationMessage[]>
  deleteConversation: (conversationId: string) => Promise<boolean>
}

export function useChatHistory(userId: string | undefined): UseChatHistoryReturn {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setConversations([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/ai-agent/conversations?userId=${userId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      console.error('Error fetching chat history:', err)
      setError(err instanceof Error ? err.message : 'Failed to load history')
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const loadConversation = useCallback(
    async (conversationId: string): Promise<ConversationMessage[]> => {
      if (!userId) return []

      try {
        const response = await fetch(
          `/api/ai-agent/history?userId=${userId}&conversationId=${conversationId}`
        )

        if (!response.ok) {
          throw new Error('Failed to load conversation')
        }

        const data = await response.json()
        return data.conversations || []
      } catch (err) {
        console.error('Error loading conversation:', err)
        return []
      }
    },
    [userId]
  )

  const deleteConversation = useCallback(
    async (conversationId: string): Promise<boolean> => {
      if (!userId) return false

      try {
        const response = await fetch(
          `/api/ai-agent/conversations?userId=${userId}&conversationId=${conversationId}`,
          { method: 'DELETE' }
        )

        if (!response.ok) {
          throw new Error('Failed to delete conversation')
        }

        // Remove from local state
        setConversations((prev) => prev.filter((c) => c.conversation_id !== conversationId))
        return true
      } catch (err) {
        console.error('Error deleting conversation:', err)
        return false
      }
    },
    [userId]
  )

  // Initial fetch
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return {
    conversations,
    isLoading,
    error,
    refresh: fetchConversations,
    loadConversation,
    deleteConversation,
  }
}
