'use client'

import { motion } from 'framer-motion'
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import type { UIMessage } from 'ai'
import { Button } from '@/components/ui/button'

interface CommandMessageProps {
  message: UIMessage
  isLast?: boolean
}

export function CommandMessage({ message }: CommandMessageProps) {
  const isUser = message.role === 'user'

  // Extract text content from message parts
  const content =
    (message as any).content ||
    (message as any).parts
      ?.filter((part: any) => part.type === 'text')
      .map((part: any) => ('text' in part ? part.text : ''))
      .join('') ||
    ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex gap-3 p-2 w-full mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary fill-current" />
          </div>
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl backdrop-blur-sm ${
            isUser
              ? 'bg-white/10 text-white rounded-br-none border border-white/10 shadow-sm'
              : 'bg-black/30 text-foreground/90 rounded-bl-none border border-white/5 shadow-sm'
          }`}
        >
          <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            <MarkdownRenderer content={content} />
          </div>
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 md:gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-6 md:w-6 text-muted-foreground hover:text-white min-h-[32px] min-w-[32px]"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-6 md:w-6 text-muted-foreground hover:text-white min-h-[32px] min-w-[32px]"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-6 md:w-6 text-muted-foreground hover:text-white min-h-[32px] min-w-[32px]"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-6 md:w-6 text-muted-foreground hover:text-white min-h-[32px] min-w-[32px]"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-secondary flex items-center justify-center border border-white/10 overflow-hidden">
            <User className="h-3 w-3 md:h-4 md:w-4 text-secondary-foreground" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function CommandMessageLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-3 p-2 w-full justify-start mb-2"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-0" />
        <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-150" />
        <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-300" />
      </div>
    </motion.div>
  )
}
