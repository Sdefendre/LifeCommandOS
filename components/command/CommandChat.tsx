'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Mic,
  Plus,
  User,
  MessageSquare,
  Sparkles,
  Zap,
  Search,
  Image as ImageIcon,
  History,
  Grid,
  Menu,
  Globe,
  ArrowUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CommandMessage, CommandMessageLoading } from './CommandMessage'
import { VoiceAgent } from '@/components/VoiceAgent'
import { MODEL_OPTIONS, type ModelOption } from '@/constants/ai'
import { cn } from '@/lib/utils'

interface CommandChatProps {
  userId?: string
}

export function CommandChat({ userId }: CommandChatProps) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>('gpt-4o-mini')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  // Removed unused rateLimit state

  // Generate conversation ID
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Update sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && conversationId) {
      sessionStorage.setItem('ai-conversation-id', conversationId)
    }
  }, [conversationId])

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai-agent',
      body: {
        userId,
        model: selectedModel,
        conversationId: conversationId || undefined,
      },
    }),
  })

  const [input, setInput] = useState('')

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
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  const submitMessage = () => {
    if (!input || !input.trim() || status === 'submitted' || status === 'streaming') return

    const userMessage = input.trim()
    setInput('')

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: userMessage }],
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitMessage()
  }

  const toggleVoiceMode = () => setIsVoiceMode(!isVoiceMode)

  const NavItem = ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: Icon,
    label,
    active = false,
    onClick,
  }: {
    icon: any // eslint-disable-line @typescript-eslint/no-explicit-any
    label: string
    active?: boolean
    onClick?: () => void
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center w-full py-4 gap-1 transition-all duration-200 relative group',
        active
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
      )}
    >
      <div className="relative transition-transform duration-200 group-hover:scale-110">
        <Icon className={cn('h-6 w-6', active && 'fill-current')} />
      </div>
      <span className="text-[10px] font-medium hidden md:block transition-colors">{label}</span>

      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full hidden md:block"
        />
      )}

      {/* Tooltip for mobile/collapsed */}
      <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 md:hidden">
        {label}
      </div>
    </button>
  )

  const Sidebar = () => (
    <div className="h-full flex flex-col items-center py-6 bg-background/50 backdrop-blur-xl border-r border-border/20 w-16 md:w-24 z-30 flex-shrink-0">
      <div className="mb-8">
        <Link href="/">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </Link>
      </div>

      <div className="flex-1 w-full space-y-2">
        <NavItem icon={Search} label="Search" />
        <NavItem icon={MessageSquare} label="Chat" active onClick={() => {}} />
        <NavItem icon={Grid} label="Claims" />
        <NavItem icon={History} label="History" />
      </div>

      <div className="mt-auto w-full flex flex-col items-center gap-4">
        <div className="h-px w-10 bg-border/50" />
        <button className="h-10 w-10 rounded-full bg-secondary overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
          <User className="h-full w-full p-2 text-secondary-foreground" />
        </button>
      </div>
    </div>
  )

  const SuggestedCard = ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: Icon,
    title,
    description,
    delay,
  }: {
    icon: any // eslint-disable-line @typescript-eslint/no-explicit-any
    title: string
    description: string
    delay: number
  }) => (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={() => {
        setInput(title)
        // Optional: auto-submit or let user edit
      }}
      className="flex flex-col items-start p-3 md:p-4 rounded-xl bg-background/40 hover:bg-background/60 border border-white/5 hover:border-primary/20 transition-all text-left group w-full h-full backdrop-blur-sm min-h-[100px] md:min-h-[120px]"
    >
      <div className="flex items-center gap-2 mb-2 text-muted-foreground group-hover:text-primary transition-colors">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Topic</span>
      </div>
      <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {description}
      </p>
    </motion.button>
  )

  return (
    <div className="flex h-[100vh] overflow-hidden bg-transparent text-foreground font-sans">
      {/* Sidebar - Hidden on mobile, handled by sheet/bottom nav if needed */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-background/50 backdrop-blur-md z-20 absolute top-0 left-0 right-0">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-[80px] bg-black border-r border-white/10 pt-safe"
              >
                <Sidebar />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg tracking-tight">Command</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMessages([])}>
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth custom-scrollbar flex flex-col">
          {isVoiceMode ? (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <VoiceAgent userId={userId} />
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center mb-12 w-full"
                  >
                    <div className="mb-8 relative">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                      <Sparkles className="h-20 w-20 text-white relative z-10 fill-white/10" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-white">
                      Ready to tackle some veteran questions?
                    </h1>

                    {/* Search Input Centered */}
                    <div className="w-full max-w-2xl relative group mb-12">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
                      <div className="relative flex items-center bg-[#1a1a1a] rounded-full border border-white/10 focus-within:border-primary/50 transition-all shadow-2xl">
                        <Search className="h-5 w-5 text-muted-foreground ml-5 shrink-0" />
                        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
                          <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent border-none focus:ring-0 py-4 px-4 text-lg text-white placeholder:text-muted-foreground/50 outline-none"
                          />
                          <div className="pr-2 flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-white rounded-full"
                              onClick={toggleVoiceMode}
                            >
                              <Mic className="h-5 w-5" />
                            </Button>
                            <Button
                              type="submit"
                              size="icon"
                              disabled={!input.trim() || isLoading}
                              className={cn(
                                'h-10 w-10 rounded-full transition-all duration-300',
                                input.trim()
                                  ? 'bg-white text-black hover:bg-gray-200'
                                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                              )}
                            >
                              <ArrowUp className="h-5 w-5" />
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div className="absolute top-full left-0 right-0 mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/60 font-medium">
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Globe className="h-3 w-3" /> Search Web
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                          <ImageIcon className="h-3 w-3" /> Generate Images
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Zap className="h-3 w-3" /> Deep Research
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Suggestion Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl px-4">
                    <SuggestedCard
                      icon={MessageSquare}
                      title="VA Benefits"
                      description="Explain my disability rating and compensation."
                      delay={0.2}
                    />
                    <SuggestedCard
                      icon={Grid}
                      title="Claims Analysis"
                      description="Analyze my C&P exam results for potential issues."
                      delay={0.3}
                    />
                    <SuggestedCard
                      icon={History}
                      title="Transition Guide"
                      description="Help me plan my transition from active duty to civilian life."
                      delay={0.4}
                    />
                    <SuggestedCard
                      icon={Sparkles}
                      title="Success Stories"
                      description="Show me examples of successful benefit claims."
                      delay={0.5}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col min-h-full pb-32 pt-20 md:pt-10">
                  <div className="max-w-3xl mx-auto w-full px-4 space-y-2 md:space-y-0">
                    {messages.map((message, i) => (
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
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 md:pt-10 z-20 supports-[padding-bottom:env(safe-area-inset-bottom)]:pb-[max(12px,env(safe-area-inset-bottom))]">
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-[#1a1a1a] rounded-2xl md:rounded-3xl border border-white/10 focus-within:border-primary/50 transition-all shadow-2xl overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <Textarea
                    ref={textareaRef}
                    value={input || ''}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="min-h-[48px] max-h-[200px] w-full resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent py-3 md:py-4 px-3 md:px-4 text-base text-white placeholder:text-muted-foreground/50 outline-none"
                    rows={1}
                  />
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-white rounded-full min-h-[40px] min-w-[40px]"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-white rounded-full min-h-[40px] min-w-[40px]"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                      <Select
                        value={selectedModel}
                        onValueChange={(value) => setSelectedModel(value as ModelOption)}
                      >
                        <SelectTrigger className="h-8 border-none bg-transparent hover:bg-white/5 focus:ring-0 gap-1 text-muted-foreground text-xs w-auto px-2 min-h-[32px]">
                          <span className="truncate max-w-[80px] md:max-w-[100px]">
                            {selectedModel}
                          </span>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                          {MODEL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleVoiceMode}
                        className="h-8 w-8 text-muted-foreground hover:text-white rounded-full min-h-[40px] min-w-[40px]"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!input || typeof input !== 'string' || !input.trim() || isLoading}
                        className={cn(
                          'h-8 w-8 rounded-full transition-all min-h-[40px] min-w-[40px]',
                          input?.trim()
                            ? 'bg-white text-black hover:bg-gray-200'
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
