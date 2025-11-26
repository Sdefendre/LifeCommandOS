'use client'

import { useMemo } from 'react'
import {
  Wallet,
  CreditCard,
  Landmark,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  MoreHorizontal,
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
import { format, subMonths } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardCardSkeleton, ChartSkeleton } from '@/components/dashboard-card-skeleton'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { EditableNumber } from '@/components/ui/editable-number'

export default function BalancePage() {
  const { accounts, transactions, updateAccount, isLoading } = useDashboard()

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0)
    const liquidAssets = accounts
      .filter((a) => a.type === 'checking' || a.type === 'savings')
      .reduce((acc, a) => acc + a.balance, 0)
    const creditUtilization = accounts
      .filter((a) => a.type === 'credit')
      .reduce((acc, a) => acc + Math.abs(a.balance), 0)

    return { totalBalance, liquidAssets, creditUtilization }
  }, [accounts])

  // Derived from transactions context
  const cashFlowData = useMemo(() => {
    const months = new Map<string, { month: string; inflow: number; outflow: number }>()
    const today = new Date()

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(today, i)
      const key = format(d, 'MMM')
      months.set(key, { month: key, inflow: 0, outflow: 0 })
    }

    transactions.forEach((t) => {
      const d = new Date(t.date)
      if (d < subMonths(today, 6)) return
      const key = format(d, 'MMM')
      if (months.has(key)) {
        const curr = months.get(key)!
        if (t.type === 'income') curr.inflow += t.amount
        else curr.outflow += Math.abs(t.amount)
      }
    })

    return Array.from(months.values())
  }, [transactions])

  // Simulated balance history based on current balance and reverse transaction application
  // This is an approximation since we don't store historical account snapshots
  const balanceHistory = useMemo(() => {
    let runningBalance = stats.totalBalance
    const history: { month: string; balance: number }[] = []
    const today = new Date()

    // We have current balance. To get previous months, we subtract income and add expenses?
    // Actually: PrevBalance = CurrentBalance - Income + Expenses

    // Current month so far
    history.push({ month: format(today, 'MMM'), balance: runningBalance })

    for (let i = 1; i <= 5; i++) {
      // This logic is slightly flawed if transactions don't align perfectly with months in the loop above, but good enough for demo

      // Find transactions in the *following* month (the one we just processed/stepped back from)
      // Actually better to just take the cashFlowData and walk backwards
      // But cashFlowData is by month.

      // Let's use cashFlowData.
      // The balance at END of month X.
      // Balance at End of Month X-1 = Balance End Month X - Income(Month X) + Expenses(Month X)

      // Get flow for the month we just pushed
      const flow = cashFlowData.find((c) => c.month === history[history.length - 1].month) || {
        inflow: 0,
        outflow: 0,
      }

      runningBalance = runningBalance - flow.inflow + flow.outflow
      history.push({ month: format(subMonths(today, i), 'MMM'), balance: runningBalance })
    }

    return history.reverse()
  }, [stats.totalBalance, cashFlowData])

  function getAccountIcon(type: string) {
    switch (type) {
      case 'checking':
        return Wallet
      case 'savings':
        return Landmark
      case 'credit':
        return CreditCard
      case 'investment':
        return TrendingUp
      default:
        return Wallet
    }
  }

  function getAccountColor(type: string) {
    switch (type) {
      case 'checking':
        return 'text-emerald-500'
      case 'savings':
        return 'text-teal-500'
      case 'credit':
        return 'text-blue-500'
      case 'investment':
        return 'text-orange-500'
      default:
        return 'text-gray-500'
    }
  }

  function getAccountBg(type: string) {
    switch (type) {
      case 'checking':
        return 'bg-emerald-500/10'
      case 'savings':
        return 'bg-teal-500/10'
      case 'credit':
        return 'bg-blue-500/10'
      case 'investment':
        return 'bg-orange-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

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
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={stats.totalBalance}
                onSave={(value) => {
                  const currentTotal = accounts.reduce((sum, acc) => sum + acc.balance, 0)
                  const difference = value - currentTotal
                  if (accounts.length > 0) {
                    const perAccount = difference / accounts.length
                    accounts.forEach((acc) => {
                      updateAccount(acc.id, { balance: acc.balance + perAccount })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquid Assets</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={stats.liquidAssets}
                onSave={(value) => {
                  const liquidAccounts = accounts.filter(
                    (a) => a.type === 'checking' || a.type === 'savings'
                  )
                  const currentTotal = liquidAccounts.reduce((sum, acc) => sum + acc.balance, 0)
                  const difference = value - currentTotal
                  if (liquidAccounts.length > 0) {
                    const perAccount = difference / liquidAccounts.length
                    liquidAccounts.forEach((acc) => {
                      updateAccount(acc.id, { balance: acc.balance + perAccount })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
            </div>
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
              $
              <EditableNumber
                value={stats.creditUtilization}
                onSave={(value) => {
                  const creditAccounts = accounts.filter((a) => a.type === 'credit')
                  const currentTotal = creditAccounts.reduce(
                    (sum, acc) => sum + Math.abs(acc.balance),
                    0
                  )
                  const difference = value - currentTotal
                  if (creditAccounts.length > 0) {
                    const perAccount = difference / creditAccounts.length
                    creditAccounts.forEach((acc) => {
                      updateAccount(acc.id, { balance: acc.balance - perAccount })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total credit used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              <EditableNumber
                value={785}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={300}
                max={850}
              />
            </div>
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
                  itemStyle={{ color: 'var(--foreground)' }}
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
            {accounts.map((account) => {
              const Icon = getAccountIcon(account.type)
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('p-2 rounded-full', getAccountBg(account.type))}>
                      <Icon className={cn('h-5 w-5', getAccountColor(account.type))} />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.institution}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        'font-bold',
                        account.balance < 0 ? 'text-foreground' : 'text-foreground'
                      )}
                    >
                      $
                      <EditableNumber
                        value={account.balance}
                        onSave={(value) => updateAccount(account.id, { balance: value })}
                        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        allowNegative={account.type === 'credit'}
                      />
                    </div>
                    <Badge
                      variant={account.type === 'credit' ? 'outline' : 'secondary'}
                      className="mt-1"
                    >
                      {account.type}
                    </Badge>
                  </div>
                </div>
              )
            })}
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
                  Your liquid assets cover {(stats.liquidAssets / 3000).toFixed(1)} months of
                  estimated expenses. This is a solid emergency buffer.
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
                  You are using about 12% of estimated available credit. Keep it under 30% to
                  maintain your score.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
