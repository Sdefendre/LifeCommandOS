'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { MODEL_OPTIONS, type ModelOption } from '@/constants/ai'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

interface AIAgentChatProps {
  userId?: string
}

export function AIAgentChat({ userId }: AIAgentChatProps) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>('gpt-4o-mini')
  const [input, setInput] = useState('')
  // Generate conversation ID on mount and persist it
  const [conversationId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('ai-conversation-id')
      if (stored) return stored
      const newId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('ai-conversation-id', newId)
      return newId
    }
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  })
  const [rateLimit, setRateLimit] = useState<{ remaining: number; limit: number } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update sessionStorage when conversation ID changes
  useEffect(() => {
    if (typeof window !== 'undefined' && conversationId) {
      sessionStorage.setItem('ai-conversation-id', conversationId)
    }
  }, [conversationId])

  // Use the useChat hook from AI SDK for proper streaming support
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai-agent',
      body: {
        userId,
        model: selectedModel,
        conversationId: conversationId || undefined,
      },
    }),
  })

  // Load conversation history on mount if userId exists
  useEffect(() => {
    async function loadHistory() {
      if (!userId || !conversationId) return

      try {
        const response = await fetch(
          `/api/ai-agent/history?userId=${userId}&conversationId=${conversationId}`
        )
        if (response.ok) {
          const data = await response.json()
          if (data.conversations && data.conversations.length > 0) {
            // Convert database format to chat format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const historyMessages = data.conversations.map((conv: any) => ({
              id: `history-${conv.id}`,
              role: conv.role,
              parts: [{ type: 'text', text: conv.message }],
            }))
            // Add welcome message and history
            setMessages([
              {
                id: '1',
                role: 'assistant',
                parts: [
                  {
                    type: 'text',
                    text: "Welcome! I'm Command. I can help you understand VA benefits, disability claims, C&P exams, and your DD-214. What would you like to know?",
                  },
                ],
              },
              ...historyMessages,
            ])
          }
        }
      } catch (err) {
        console.error('Failed to load conversation history:', err)
      }
    }

    loadHistory()
  }, [userId, conversationId, setMessages])

  // Load rate limit status on mount and after messages
  useEffect(() => {
    async function loadRateLimit() {
      if (!userId) {
        setRateLimit({ remaining: 5, limit: 5 }) // Anonymous limit
        return
      }

      try {
        const response = await fetch(`/api/ai-agent/rate-limit?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setRateLimit({
            remaining: data.remaining,
            limit: data.limit,
          })
        }
      } catch (err) {
        console.error('Failed to load rate limit:', err)
      }
    }

    loadRateLimit()
  }, [userId, messages])

  const isLoading = status === 'submitted' || status === 'streaming'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input || !input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: userMessage }],
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Model Selection & Rate Limit */}
      <div className="border-b border-border p-3 bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Model:</span>
            <Select
              value={selectedModel}
              onValueChange={(value) => setSelectedModel(value as ModelOption)}
            >
              <SelectTrigger className="h-8 w-[200px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {rateLimit && (
            <Badge
              variant={rateLimit.remaining <= 2 ? 'destructive' : 'secondary'}
              className="flex items-center gap-1.5 text-xs"
            >
              <Zap className="h-3 w-3" />
              {rateLimit.remaining} / {rateLimit.limit} remaining
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            )}
            <Card
              className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary/10 border-primary/20'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <CardContent className="p-3">
                <div className="text-sm markdown-content">
                  <MarkdownRenderer
                    content={
                      message.parts
                        ?.filter((part) => part.type === 'text')
                        .map((part) => ('text' in part ? part.text : ''))
                        .join('') || ''
                    }
                  />
                </div>
              </CardContent>
            </Card>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <Card className="bg-destructive/10 border-destructive/20 max-w-[80%]">
              <CardContent className="p-3">
                <p className="text-sm text-destructive">
                  {error.message || 'An error occurred. Please try again.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-border p-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit(e as any)
              }
            }}
            placeholder="Ask about VA benefits, disability claims, C&P exams, DD-214..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input || !input.trim() || isLoading}
            size="lg"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {rateLimit ? (
            <>
              {rateLimit.remaining === 0 ? (
                <span className="text-destructive">
                  Daily limit reached. Upgrade for unlimited access.
                </span>
              ) : (
                <>
                  {rateLimit.remaining} of {rateLimit.limit} queries remaining today.
                  {rateLimit.limit <= 20 && ' Upgrade for unlimited access.'}
                </>
              )}
            </>
          ) : (
            'Free tier: Limited queries per day. Upgrade for unlimited access.'
          )}
        </p>
      </div>
    </div>
  )
}
