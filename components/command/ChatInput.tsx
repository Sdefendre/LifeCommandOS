'use client'

import { useRef, useEffect, useCallback, memo } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MODEL_OPTIONS, type ModelOption } from '@/constants/ai'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  isLoading: boolean
  selectedModel: ModelOption
}

function PureChatInput({
  input,
  setInput,
  onSubmit,
  onStop,
  isLoading,
  selectedModel,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (input.trim() && !isLoading) {
          onSubmit()
        }
      }
    },
    [input, isLoading, onSubmit]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit()
      }
    },
    [input, isLoading, onSubmit]
  )

  const selectedModelData = MODEL_OPTIONS.find((m) => m.value === selectedModel)

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-6 pb-4 px-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden focus-within:border-white/20 transition-colors">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="min-h-[52px] max-h-[200px] w-full resize-none border-0 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
            disabled={isLoading}
          />

          {/* Bottom bar with model selector and submit */}
          <div className="flex items-center justify-between px-3 pb-3">
            {/* Model Display (fixed) */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 font-medium text-foreground">
                {selectedModelData?.label || 'Grok 4.1 Fast'}
              </span>
            </div>

            {/* Submit / Stop Button */}
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onStop}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20"
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className={cn(
                  'h-8 w-8 rounded-lg transition-all',
                  input.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-white/10 text-muted-foreground'
                )}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
          CommandAI can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  )
}

export const ChatInput = memo(PureChatInput)
