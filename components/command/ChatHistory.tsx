'use client'

import { MessageSquare, Trash2, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ConversationSummary } from '@/lib/use-chat-history'

interface ChatHistoryProps {
  conversations: ConversationSummary[]
  currentConversationId: string
  isLoading: boolean
  error: string | null
  onSelectConversation: (conversationId: string) => void
  onDeleteConversation: (conversationId: string) => void
  onNewConversation: () => void
  showNewChatButton?: boolean
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: ConversationSummary
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
        isActive
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-white/5 border border-transparent'
      )}
    >
      <div
        className={cn(
          'mt-0.5 p-1.5 rounded-md shrink-0',
          isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
        )}
      >
        <MessageSquare className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            isActive ? 'text-foreground' : 'text-foreground/90'
          )}
        >
          {conversation.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {formatRelativeTime(conversation.updated_at)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export function ChatHistory({
  conversations,
  currentConversationId,
  isLoading,
  error,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  showNewChatButton = true,
}: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      {showNewChatButton && (
        <div className="px-3 pb-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            onClick={onNewConversation}
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-destructive/10 p-3 text-center">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Start chatting to see your history
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
              Recent
            </p>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.conversation_id}
                conversation={conversation}
                isActive={conversation.conversation_id === currentConversationId}
                onSelect={() => onSelectConversation(conversation.conversation_id)}
                onDelete={() => onDeleteConversation(conversation.conversation_id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
