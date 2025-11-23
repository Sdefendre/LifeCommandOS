'use client'

import { useMemo, useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EditableNumber } from '@/components/ui/editable-number'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { startOfMonth } from 'date-fns'
import { NetWorthDialog } from './net-worth-dialog'

export function OverviewCards() {
  const { accounts, transactions, budgets, savingsGoals, updateAccount, updateSavingsGoal } =
    useDashboard()
  const [isNetWorthDialogOpen, setIsNetWorthDialogOpen] = useState(false)

  // Calculate metrics
  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + acc.balance, 0),
    [accounts]
  )

  const monthlySpending = useMemo(() => {
    const start = startOfMonth(new Date())
    return transactions
      .filter((t) => t.type === 'expense' && new Date(t.date) >= start)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  }, [transactions])

  const budgetRemaining = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
    return Math.max(0, totalBudget - monthlySpending)
  }, [budgets, monthlySpending])

  const totalSavingsGoal = useMemo(
    () => savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0),
    [savingsGoals]
  )
  const currentSavings = useMemo(
    () => savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0),
    [savingsGoals]
  )
  const savingsProgressPercent =
    totalSavingsGoal > 0 ? Math.round((currentSavings / totalSavingsGoal) * 100) : 0

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={totalBalance}
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
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium mr-1">+2.5%</span>
              from last month
            </div>
            <Button
              variant="link"
              size="sm"
              className="px-0 h-auto mt-2 text-xs text-primary"
              onClick={() => setIsNetWorthDialogOpen(true)}
            >
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Spending */}
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Expenditure
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={monthlySpending}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingDown className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium mr-1">-4.1%</span>
              from last month
            </div>
          </CardContent>
        </Card>

        {/* Budget Remaining */}
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Budget
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={budgetRemaining}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <Progress
              value={(monthlySpending / (monthlySpending + budgetRemaining)) * 100}
              className="mt-3 h-1.5"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((monthlySpending / (monthlySpending + budgetRemaining || 1)) * 100)}% used
            </p>
          </CardContent>
        </Card>

        {/* Savings Goal */}
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Progress
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={currentSavings}
                onSave={(value) => {
                  const currentTotal = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0)
                  const difference = value - currentTotal
                  if (savingsGoals.length > 0) {
                    const perGoal = difference / savingsGoals.length
                    savingsGoals.forEach((goal) => {
                      updateSavingsGoal(goal.id, {
                        currentAmount: Math.max(0, goal.currentAmount + perGoal),
                      })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <Progress value={savingsProgressPercent} className="mt-3 h-1.5" />
            <p className="text-xs text-muted-foreground mt-2">
              {savingsProgressPercent}% of ${totalSavingsGoal.toLocaleString()} goal
            </p>
          </CardContent>
        </Card>
      </div>

      <NetWorthDialog
        open={isNetWorthDialogOpen}
        onOpenChange={setIsNetWorthDialogOpen}
        totalBalance={totalBalance}
      />
    </>
  )
}
