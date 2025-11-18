'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Wallet,
  CreditCard,
  Landmark,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardCardSkeleton, ChartSkeleton } from '@/components/dashboard-card-skeleton'
import { cn } from '@/lib/utils'

// Mock Data
const accounts = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'checking',
    balance: 4250.5,
    bank: 'Chase',
    last4: '4589',
    icon: Wallet,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    id: '2',
    name: 'High Yield Savings',
    type: 'savings',
    balance: 12400.0,
    bank: 'Ally',
    last4: '9012',
    icon: Landmark,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: '3',
    name: 'Travel Rewards',
    type: 'credit',
    balance: -1250.3,
    bank: 'Amex',
    last4: '3456',
    icon: CreditCard,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    id: '4',
    name: 'Everyday Cash',
    type: 'credit',
    balance: -450.2,
    bank: 'Citi',
    last4: '7890',
    icon: CreditCard,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
]

const balanceHistory = [
  { month: 'Jan', balance: 12500 },
  { month: 'Feb', balance: 13200 },
  { month: 'Mar', balance: 13800 },
  { month: 'Apr', balance: 14100 },
  { month: 'May', balance: 13900 },
  { month: 'Jun', balance: 14950 },
]

const cashFlowData = [
  { month: 'Jan', inflow: 4500, outflow: 3200 },
  { month: 'Feb', inflow: 4800, outflow: 3500 },
  { month: 'Mar', inflow: 4600, outflow: 3100 },
  { month: 'Apr', inflow: 5200, outflow: 3800 },
  { month: 'May', inflow: 5000, outflow: 3400 },
  { month: 'Jun', inflow: 5500, outflow: 3900 },
]

export default function BalancePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0)
    const liquidAssets = accounts
      .filter((a) => a.type === 'checking' || a.type === 'savings')
      .reduce((acc, a) => acc + a.balance, 0)
    const creditUtilization = accounts
      .filter((a) => a.type === 'credit')
      .reduce((acc, a) => acc + Math.abs(a.balance), 0)

    return { totalBalance, liquidAssets, creditUtilization }
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquid Assets</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.liquidAssets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Cash available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Debt</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              ${stats.creditUtilization.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across 2 cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">785</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Net Worth History</CardTitle>
            <CardDescription>Growth over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Inflow vs Outflow (6 mo)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                />
                <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
            <CardDescription>Manage your connected bank accounts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn('p-2 rounded-full', account.bg)}>
                    <account.icon className={cn('h-5 w-5', account.color)} />
                  </div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.bank} •••• {account.last4}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      'font-bold',
                      account.balance < 0 ? 'text-foreground' : 'text-foreground'
                    )}
                  >
                    ${Math.abs(account.balance).toLocaleString()}
                  </div>
                  <Badge
                    variant={account.type === 'credit' ? 'outline' : 'secondary'}
                    className="mt-1"
                  >
                    {account.type}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <MoreHorizontal className="mr-2 h-4 w-4" /> Manage Accounts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health</CardTitle>
            <CardDescription>AI-driven insights based on your balance.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex gap-4 items-start p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                  Strong Liquidity
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Your liquid assets cover 6 months of expenses. This is an excellent emergency
                  buffer.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-400">
                  Credit Utilization
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Your credit utilization is at 12%, which is healthy. Keep it under 30% to maintain
                  your score.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
