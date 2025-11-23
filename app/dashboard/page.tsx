'use client'

import { useDashboard } from '@/components/dashboard/dashboard-context'
import { DashboardCardSkeleton, ChartSkeleton } from '@/components/dashboard-card-skeleton'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { BudgetStatus } from '@/components/dashboard/budget-status'
import { UpcomingBills } from '@/components/dashboard/upcoming-bills'
import { TransactionImport } from '@/components/dashboard/transaction-import'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'

export default function DashboardPage() {
  const { isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-4">
            <ChartSkeleton />
          </div>
          <div className="space-y-4">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">BattleStation</h1>
        <p className="text-sm text-muted-foreground mt-1">Your financial command center</p>
      </div>

      <CalendarWidget />

      {/* Summary Cards */}
      <OverviewCards />

      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Left Column (Transactions) */}
        <RecentTransactions />

        {/* Right Column (Budgets & Bills) */}
        <div className="space-y-4 md:space-y-8">
          <BudgetStatus />
          <UpcomingBills />
        </div>
      </div>

      {/* Floating Actions */}
      <TransactionImport />
    </div>
  )
}
