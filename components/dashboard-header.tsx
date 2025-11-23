'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Bell, Search, Home, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
// import { FeedbackDialog } from '@/components/FeedbackDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation'
import { Logo } from '@/components/Logo'

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="flex h-14 items-center gap-2 sm:gap-4 border-b border-border/80 dark:border-border/60 bg-background/95 dark:bg-background/95 backdrop-blur-xl px-3 sm:px-6 lg:h-[60px] sticky top-0 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden -ml-2 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-[300px] sm:w-[300px] p-0">
          <div className="flex h-14 items-center border-b px-6">
            <Link className="no-underline" href="/dashboard">
              <Logo size="md" />
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4 px-4">
            <nav className="grid gap-1 text-sm font-medium">
              <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System
              </div>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-4"
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 hover:text-foreground hover:bg-muted transition-colors',
                    pathname === item.href
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1 hidden sm:block">
        <form>
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search financial records..."
              className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px] h-9 focus-visible:ring-1"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-9 w-9 relative hidden sm:flex">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 ml-2 ring-2 ring-transparent hover:ring-primary/20 transition-all"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/headshot.png" alt="Steve" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Steve Defendre</p>
                <p className="text-xs leading-none text-muted-foreground">steve@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
