import { LayoutDashboard, CreditCard, PieChart, BarChart3, PiggyBank, Wallet } from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
] as const

export const DASHBOARD_NAV_ITEMS = [
  {
    title: 'BattleStation',
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
] as const
