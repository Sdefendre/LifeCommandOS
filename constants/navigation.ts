import { LayoutDashboard, CreditCard, PieChart, BarChart3, PiggyBank, Wallet } from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
] as const

export const DASHBOARD_NAV_ITEMS = [
  {
    title: 'BattleStation',
    href: '/battlestation',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/battlestation/transactions',
    icon: CreditCard,
  },
  {
    title: 'Budgets',
    href: '/battlestation/budgets',
    icon: PieChart,
  },
  {
    title: 'Reports',
    href: '/battlestation/reports',
    icon: BarChart3,
  },
  {
    title: 'Savings',
    href: '/battlestation/savings',
    icon: PiggyBank,
  },
  {
    title: 'Balance',
    href: '/battlestation/balance',
    icon: Wallet,
  },
] as const
