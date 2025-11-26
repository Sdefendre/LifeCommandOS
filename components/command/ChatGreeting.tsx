'use client'

import { motion } from 'framer-motion'
import { Sparkles, MessageSquare, FileText, HelpCircle } from 'lucide-react'

interface ChatGreetingProps {
  onSuggestionClick: (suggestion: string) => void
  disabled?: boolean
}

const suggestions = [
  {
    icon: FileText,
    title: 'VA Claims',
    prompt: 'How do I file a VA disability claim?',
  },
  {
    icon: HelpCircle,
    title: 'Benefits',
    prompt: 'What benefits am I eligible for as a veteran?',
  },
  {
    icon: MessageSquare,
    title: 'C&P Exam',
    prompt: 'How should I prepare for my C&P exam?',
  },
]

export function ChatGreeting({ onSuggestionClick, disabled = false }: ChatGreetingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-2xl"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150" />
          <div className="relative z-10 h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl md:text-3xl font-semibold text-foreground mb-3"
        >
          How can I help you today?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-muted-foreground text-base md:text-lg mb-8 max-w-md"
        >
          Ask me anything about VA benefits, disability claims, or your transition journey.
        </motion.p>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              disabled={disabled}
              className={`group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-200 ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <suggestion.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-foreground">{suggestion.title}</span>
              <span className="text-xs text-muted-foreground text-center line-clamp-2">
                {suggestion.prompt}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
