'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  BarChart3,
  PiggyBank,
  Wallet,
  Menu,
  Bell,
  Search,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/dashboard/transactions',
    icon: CreditCard,
  },
  {
    title: 'Budgets',
    href: '/dashboard/budgets',
    icon: PieChart,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Savings',
    href: '/dashboard/savings',
    icon: PiggyBank,
  },
  {
    title: 'Balance',
    href: '/dashboard/balance',
    icon: Wallet,
  },
]

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="flex h-14 items-center gap-2 sm:gap-4 border-b bg-background px-2 sm:px-4 lg:h-[60px] lg:px-6 sticky top-0 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden h-9 w-9">
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-[280px] sm:w-[300px]">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <span className="h-6 w-6 rounded-full bg-primary" />
              <span className="">WealthWise</span>
            </Link>
            <Link
              href="/"
              className={cn(
                'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground mb-2',
                'text-muted-foreground'
              )}
            >
              <Home className="h-5 w-5" />
              Back to SteveOS
            </Link>
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                  pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1 min-w-0">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-7 pr-2 shadow-none text-sm sm:text-base sm:pl-8 md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="text-xs sm:text-sm">SD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
