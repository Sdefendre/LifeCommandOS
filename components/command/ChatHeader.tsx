'use client'

import Link from 'next/link'
import { Plus, PanelLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/auth'

interface ChatHeaderProps {
  onNewChat: () => void
  onToggleSidebar: () => void
  showSidebarToggle?: boolean
}

export function ChatHeader({
  onNewChat,
  onToggleSidebar,
  showSidebarToggle = true,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="flex items-center gap-2 md:hidden">
        {/* Sidebar toggle - mobile only */}
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Logo - only show on mobile when sidebar is hidden */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">CommandAI</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* New Chat Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="h-9 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Chat</span>
        </Button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  )
}
