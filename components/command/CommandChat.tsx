'use client'

import { useState, useRef, useEffect, lazy, Suspense, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import {
  Mic,
  User,
  MessageSquare,
  Sparkles,
  Search,
  History,
  Grid,
  ArrowUp,
  Menu,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CommandMessage, CommandMessageLoading } from './CommandMessage'
import { ChatHistory } from './ChatHistory'
import { DEFAULT_MODEL, MODEL_OPTIONS, type ModelOption } from '@/constants/ai'
import { cn } from '@/lib/utils'
import { useChatHistory } from '@/lib/use-chat-history'

// Lazy load VoiceAgent since it's not needed on initial render
const VoiceAgent = lazy(() =>
  import('@/components/VoiceAgent').then((mod) => ({ default: mod.VoiceAgent }))
)

interface CommandChatProps {
  userId?: string
}

interface NavItemProps {
  icon: any
  label: string
  active?: boolean
  onClick?: () => void
  showLabel?: boolean
}

const NavItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  showLabel = false,
}: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center w-full gap-3 transition-all duration-200 relative group',
      showLabel ? 'justify-start px-4 py-3' : 'flex-col justify-center py-4 gap-1',
      active
        ? 'text-primary bg-primary/10'
        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
    )}
  >
    <div
      className={cn(
        'relative transition-transform duration-200',
        !showLabel && 'group-hover:scale-110'
      )}
    >
      <Icon className={cn('h-6 w-6', active && 'fill-current')} />
    </div>
    <span
      className={cn(
        'font-medium transition-colors',
        showLabel ? 'text-sm' : 'text-[10px] hidden md:block'
      )}
    >
      {label}
    </span>

    {active && (
      <motion.div
        layoutId="activeTab"
        className={cn(
          'absolute bg-primary rounded-l-full',
          showLabel
            ? 'left-0 top-0 bottom-0 w-1 rounded-none'
            : 'right-0 top-1/2 -translate-y-1/2 w-1 h-8 hidden md:block'
        )}
      />
    )}

    {/* Tooltip for collapsed mode */}
    {!showLabel && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 md:hidden">
        {label}
      </div>
    )}
  </button>
)

interface SidebarContentProps {
  showLabels?: boolean
  showHistory?: boolean
  onToggleHistory?: () => void
  onNewChat?: () => void
  historyContent?: React.ReactNode
}

const SidebarContent = ({
  showLabels = false,
  showHistory = false,
  onToggleHistory,
  onNewChat,
  historyContent,
}: SidebarContentProps) => (
  <div
    className={cn(
      'h-full min-h-screen flex flex-col z-30 flex-shrink-0',
      showLabels
        ? 'w-full bg-transparent'
        : 'w-16 md:w-24 items-center py-6 bg-black/80 backdrop-blur-xl border-r border-white/10'
    )}
  >
    <div className={cn('mb-8', showLabels ? 'px-6 pt-6 flex items-center gap-3' : '')}>
      <Link href="/">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform cursor-pointer">
          <Sparkles className="h-6 w-6 text-primary-foreground fill-current" />
        </div>
      </Link>
      {showLabels && <span className="font-bold text-lg tracking-tight">Command</span>}
    </div>

    <div className="flex-1 w-full space-y-2 overflow-hidden flex flex-col">
      {showLabels && (
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>
      )}
      <NavItem icon={Search} label="Search" showLabel={showLabels} />
      <NavItem icon={MessageSquare} label="Chat" active onClick={() => {}} showLabel={showLabels} />
      <NavItem icon={Grid} label="Claims" showLabel={showLabels} />
      <NavItem
        icon={History}
        label="History"
        showLabel={showLabels}
        active={showHistory && !showLabels}
        onClick={onToggleHistory}
      />

      {/* History panel for mobile sidebar */}
      {showLabels && historyContent && (
        <div className="flex-1 overflow-hidden mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-medium text-muted-foreground px-6 pb-2 uppercase tracking-wider">
            Recent Chats
          </p>
          <div className="px-2 overflow-y-auto max-h-[calc(100vh-350px)]">{historyContent}</div>
        </div>
      )}
    </div>

    <div className={cn('mt-auto w-full flex flex-col gap-4', showLabels ? 'p-4' : 'items-center')}>
      {!showLabels && <div className="h-px w-10 bg-border/50" />}
      {showLabels && <div className="h-px w-full bg-border/50" />}

      <button
        className={cn(
          'rounded-full bg-secondary overflow-hidden border-2 border-transparent hover:border-primary transition-colors flex items-center gap-3',
          showLabels ? 'w-full p-2' : 'h-10 w-10'
        )}
      >
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="h-5 w-5 text-secondary-foreground" />
        </div>
        {showLabels && (
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">User Profile</span>
            <span className="text-xs text-muted-foreground">Settings</span>
          </div>
        )}
      </button>
    </div>
  </div>
)

export function CommandChat({ userId }: CommandChatProps) {
  const selectedModel: ModelOption = DEFAULT_MODEL
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  // Generate conversation ID
  const [conversationId, setConversationId] = useState<string>('')

  // Chat history hook
  const {
    conversations,
    isLoading: isHistoryLoading,
    error: historyError,
    refresh: refreshHistory,
    loadConversation,
    deleteConversation,
  } = useChatHistory(userId)

  // Initialize conversation ID on client side only to match hydration
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

  // Type definitions may be incomplete, but these options work at runtime
  const chatResult = useChat({
    api: '/api/ai-agent',
    body: {
      userId,
      model: selectedModel,
      conversationId: conversationId || undefined,
    },
  } as any) as any

  const { messages, status, error, append, setMessages } = chatResult
  // Alias append to sendMessage for compatibility with existing code structure
  const sendMessage = append
  const selectedModelLabel =
    MODEL_OPTIONS.find((m) => m.value === selectedModel)?.label || 'Grok 4.1 Fast'

  // Load rate limit
  useEffect(() => {
    async function loadRateLimit() {
      if (!userId) {
        return
      }
      try {
        const response = await fetch(`/api/ai-agent/rate-limit?userId=${userId}`)
        if (response.ok) {
          // Could update rate limit state here if added back
        }
      } catch (err) {
        console.error('Failed to load rate limit:', err)
      }
    }
    loadRateLimit()
  }, [userId, messages])

  const isLoading = status === 'submitted' || status === 'streaming'
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  const submitMessage = async () => {
    const trimmedInput = (inputValue || '').trim() || ''
    if (!trimmedInput || status === 'submitted' || status === 'streaming') {
      return
    }

    const userMessage = trimmedInput
    setInputValue('')

    try {
      await sendMessage({
        role: 'user',
        content: userMessage,
      })
    } catch (e) {
      console.error('Failed to send message:', e)
      // Restore input on error
      setInputValue(userMessage)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setInputValue(value || '')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Use void to explicitly ignore the promise and prevent React warnings
    void submitMessage()
  }

  const toggleVoiceMode = () => setIsVoiceMode(!isVoiceMode)
  const toggleHistory = () => setShowHistory(!showHistory)

  // Handle selecting a conversation from history
  const handleSelectConversation = useCallback(
    async (selectedConversationId: string) => {
      if (selectedConversationId === conversationId) {
        setShowHistory(false)
        return
      }

      // Load the conversation messages
      const conversationMessages = await loadConversation(selectedConversationId)

      if (conversationMessages.length > 0) {
        // Convert to UIMessage format
        const uiMessages = conversationMessages
          .filter((msg) => msg.role !== 'system')
          .map((msg, index) => ({
            id: `${msg.conversation_id}-${index}`,
            role: msg.role as 'user' | 'assistant',
            content: msg.message,
            createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
            parts: [{ type: 'text' as const, text: msg.message }],
          }))

        // Update conversation ID and messages
        setConversationId(selectedConversationId)
        sessionStorage.setItem('ai-conversation-id', selectedConversationId)
        setMessages(uiMessages)
      }

      setShowHistory(false)
      setMobileMenuOpen(false)
    },
    [conversationId, loadConversation, setMessages]
  )

  // Handle starting a new conversation
  const handleNewConversation = useCallback(() => {
    const newId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    sessionStorage.setItem('ai-conversation-id', newId)
    setConversationId(newId)
    setMessages([])
    setShowHistory(false)
    setMobileMenuOpen(false)
  }, [setMessages])

  // Handle deleting a conversation
  const handleDeleteConversation = useCallback(
    async (deleteConversationId: string) => {
      const success = await deleteConversation(deleteConversationId)

      if (success && deleteConversationId === conversationId) {
        // Start a new conversation if we deleted the current one
        handleNewConversation()
      }
    },
    [conversationId, deleteConversation, handleNewConversation]
  )

  // Refresh history when messages change (new message sent)
  useEffect(() => {
    if (messages.length > 0 && userId) {
      // Debounce the refresh to avoid too many calls
      const timeout = setTimeout(() => {
        refreshHistory()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [messages.length, userId, refreshHistory])

  // History content for sidebar
  const historyContent = (
    <ChatHistory
      conversations={conversations}
      currentConversationId={conversationId}
      isLoading={isHistoryLoading}
      error={historyError}
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
      onNewConversation={handleNewConversation}
      showNewChatButton={false}
    />
  )

  return (
    <div className="flex h-full min-h-[100dvh] w-full overflow-hidden bg-transparent text-foreground font-sans">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex h-screen sticky top-0">
        <SidebarContent
          showHistory={showHistory}
          onToggleHistory={toggleHistory}
          onNewChat={handleNewConversation}
        />

        {/* Desktop History Panel */}
        {showHistory && (
          <div className="w-72 h-full bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-semibold text-sm">Chat History</h2>
            </div>
            <div className="flex-1 overflow-y-auto py-2">{historyContent}</div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-[100] supports-[padding-top:env(safe-area-inset-top)]:top-[max(1rem,env(safe-area-inset-top))]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-full bg-zinc-900/50 backdrop-blur-lg border border-white/10 text-white hover:bg-zinc-800/80 shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu (Sheet) */}
      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side="left"
            className="w-[300px] p-0 border-r border-white/10 bg-black/30 backdrop-blur-2xl overflow-hidden relative"
            style={{
              background:
                'linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(0, 0, 0, 0.3) 100%)',
            }}
          >
            {/* Star pattern overlay - visible through glass */}
            <div
              className="absolute inset-0 opacity-50 pointer-events-none z-0"
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at 20px 30px, #fff, transparent),
                  radial-gradient(1px 1px at 60px 70px, rgba(255,255,255,0.9), transparent),
                  radial-gradient(0.8px 0.8px at 50px 50px, #fff, transparent),
                  radial-gradient(1px 1px at 80px 10px, rgba(255,255,255,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 90px 40px, rgba(255,255,255,0.5), transparent),
                  radial-gradient(0.8px 0.8px at 33px 60px, rgba(255,255,255,0.9), transparent),
                  radial-gradient(1px 1px at 55px 80px, #fff, transparent),
                  radial-gradient(1.5px 1.5px at 70px 100px, rgba(255,255,255,0.7), transparent),
                  radial-gradient(0.8px 0.8px at 120px 50px, rgba(255,255,255,1), transparent),
                  radial-gradient(1.5px 1.5px at 150px 80px, rgba(255,255,255,0.5), transparent),
                  radial-gradient(1px 1px at 180px 20px, rgba(255,255,255,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 200px 60px, #fff, transparent),
                  radial-gradient(0.8px 0.8px at 230px 90px, rgba(255,255,255,0.7), transparent),
                  radial-gradient(1px 1px at 260px 40px, rgba(255,255,255,0.9), transparent),
                  radial-gradient(1.5px 1.5px at 280px 70px, rgba(255,255,255,0.6), transparent),
                  radial-gradient(1px 1px at 40px 120px, rgba(255,255,255,0.8), transparent),
                  radial-gradient(1.5px 1.5px at 100px 150px, rgba(255,255,255,0.6), transparent),
                  radial-gradient(0.8px 0.8px at 160px 180px, rgba(255,255,255,0.9), transparent),
                  radial-gradient(1px 1px at 240px 200px, #fff, transparent)
                `,
                backgroundSize: '300px 400px',
                backgroundRepeat: 'repeat',
              }}
            />
            {/* Glass effect gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-0" />
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="relative z-10 h-full">
              <SidebarContent
                showLabels={true}
                onNewChat={handleNewConversation}
                historyContent={historyContent}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth custom-scrollbar flex flex-col pt-16 md:pt-0">
          {isVoiceMode ? (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <Suspense
                fallback={
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-sm">Loading voice...</p>
                  </div>
                }
              >
                <VoiceAgent userId={userId} />
              </Suspense>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-end p-4 md:p-8 max-w-5xl mx-auto w-full pb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center w-full"
                  >
                    {!(inputValue || '').trim() && (
                      <>
                        <div className="mb-6 md:mb-8 relative">
                          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                          <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-primary relative z-10 fill-primary/10" />
                        </div>
                        <h1 className="text-2xl md:text-5xl font-bold mb-8 tracking-tight text-foreground px-4">
                          Ready to tackle some veteran questions?
                        </h1>
                      </>
                    )}

                    {/* Search Input Centered */}
                    <div className="w-full max-w-2xl relative group px-2">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
                      <div className="relative flex items-center bg-white/5 backdrop-blur-xl rounded-full border border-white/10 focus-within:border-primary/50 transition-all shadow-2xl">
                        <Search className="h-5 w-5 text-muted-foreground ml-4 md:ml-5 shrink-0" />
                        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
                          <input
                            type="text"
                            value={inputValue || ''}
                            onChange={handleInputChange}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent border-none focus:ring-0 py-3 md:py-4 px-3 md:px-4 text-base md:text-lg text-foreground placeholder:text-muted-foreground/70 outline-none"
                          />
                          <div className="pr-2 flex items-center gap-1">
                            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-foreground">
                              {selectedModelLabel}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8 md:h-10 md:w-10"
                              onClick={toggleVoiceMode}
                            >
                              <Mic className="h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                            <Button
                              type="submit"
                              size="icon"
                              disabled={!(inputValue || '').trim() || isLoading}
                              className={cn(
                                'h-8 w-8 md:h-10 md:w-10 rounded-full transition-all duration-300',
                                (inputValue || '').trim()
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                              )}
                            >
                              <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-col min-h-full pb-40 pt-4 md:pt-10">
                  <div className="max-w-3xl mx-auto w-full px-4 space-y-2 md:space-y-0">
                    {messages.map((message: UIMessage, i: number) => (
                      <CommandMessage
                        key={message.id}
                        message={message}
                        isLast={i === messages.length - 1}
                      />
                    ))}
                    {isLoading && <CommandMessageLoading />}
                    {error && (
                      <div className="p-3 md:p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20 backdrop-blur-md shadow-lg my-2 md:my-4">
                        Error: {error.message}
                      </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Floating Input Area (Only visible when there are messages) */}
        {!isVoiceMode && messages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 md:pt-10 z-20 pb-[max(12px,env(safe-area-inset-bottom))]">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 focus-within:border-primary/50 transition-all shadow-2xl overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue || ''}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="min-h-[48px] max-h-[200px] w-full resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent py-3 md:py-4 px-3 md:px-4 text-base text-foreground placeholder:text-muted-foreground/70 outline-none"
                    rows={1}
                  />
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-foreground">
                        {selectedModelLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleVoiceMode}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full min-h-[40px] min-w-[40px]"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!(inputValue || '').trim() || isLoading}
                        className={cn(
                          'h-8 w-8 rounded-full transition-all min-h-[40px] min-w-[40px]',
                          (inputValue || '').trim()
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                        )}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="text-center mt-2 text-[10px] text-muted-foreground/40 font-mono px-4">
                COMMAND OS v1.0.4 • SECURE
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
