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
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-card lg:flex lg:flex-col h-full">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
          <span className="h-6 w-6 rounded-full bg-primary" />
          <span className="">WealthWise</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary mb-2',
              'text-muted-foreground'
            )}
          >
            <Home className="h-4 w-4" />
            Back to SteveOS
          </Link>
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
