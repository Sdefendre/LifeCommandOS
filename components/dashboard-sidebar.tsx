'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation'

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-card/50 backdrop-blur-xl md:flex md:flex-col h-full">
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
          href="/dashboard"
        >
          <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span>
            LifeCommand<span className="font-normal text-muted-foreground"> Finance</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System
          </div>
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground mb-4',
              'text-muted-foreground'
            )}
          >
            <Home className="h-4 w-4" />
            Command Center
          </Link>

          <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Financial Operations
          </div>
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className="grid gap-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  )
}
