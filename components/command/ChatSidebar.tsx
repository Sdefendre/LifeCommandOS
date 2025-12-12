'use client'

import Link from 'next/link'
import {
  X,
  MessageSquare,
  Sparkles,
  Clock,
  Settings,
  User,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ConversationSummary } from '@/lib/use-chat-history'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  conversations?: ConversationSummary[]
  currentConversationId?: string
  isLoadingHistory?: boolean
  historyError?: string | null
  onSelectConversation?: (conversationId: string) => void
  onDeleteConversation?: (conversationId: string) => void
  onNewConversation?: () => void
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href?: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon: Icon, label, href, active, onClick }: NavItemProps) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
        active
          ? 'bg-white/10 text-foreground'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
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
  onDelete?: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-start gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all',
        isActive
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-white/5 border border-transparent'
      )}
    >
      <div
        className={cn(
          'mt-0.5 p-1 rounded shrink-0',
          isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
        )}
      >
        <MessageSquare className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-xs font-medium truncate',
            isActive ? 'text-foreground' : 'text-foreground/90'
          )}
        >
          {conversation.title}
        </p>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {formatRelativeTime(conversation.updated_at)}
        </p>
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

export function ChatSidebar({
  isOpen,
  onClose,
  conversations = [],
  currentConversationId = '',
  isLoadingHistory = false,
  historyError = null,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}: ChatSidebarProps) {
  const hasHistoryFeature = onSelectConversation !== undefined

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-50 h-screen w-[280px] flex flex-col bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Command</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        {onNewConversation && (
          <div className="p-3 border-b border-white/5">
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

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <NavItem icon={MessageSquare} label="Chat" active />
          <NavItem icon={Clock} label="History" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {hasHistoryFeature ? (
            <>
              <p className="text-[10px] font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
                Recent Chats
              </p>
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : historyError ? (
                <div className="rounded-lg bg-destructive/10 p-2 text-center">
                  <p className="text-[10px] text-destructive">{historyError}</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="rounded-lg bg-white/5 p-3 text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-1 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.conversation_id}
                      conversation={conversation}
                      isActive={conversation.conversation_id === currentConversationId}
                      onSelect={() => onSelectConversation?.(conversation.conversation_id)}
                      onDelete={
                        onDeleteConversation
                          ? () => onDeleteConversation(conversation.conversation_id)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-xs text-muted-foreground text-center">Chat history coming soon</p>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Guest User</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
