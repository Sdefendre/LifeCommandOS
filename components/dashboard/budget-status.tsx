'use client'

import Link from 'next/link'
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Wallet,
  Film,
  Heart,
  Plane,
  Briefcase,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EditableNumber } from '@/components/ui/editable-number'
import { useDashboard } from '@/components/dashboard/dashboard-context'

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'food':
      return Utensils
    case 'transport':
      return Car
    case 'shopping':
      return ShoppingBag
    case 'bills':
      return Zap
    case 'income':
      return Wallet
    case 'entertainment':
      return Film
    case 'health':
      return Heart
    case 'travel':
      return Plane
    case 'work':
      return Briefcase
    default:
      return HelpCircle
  }
}

export function BudgetStatus() {
  const { budgets, updateBudget } = useDashboard()

  // Sort by highest spending percentage
  const sortedBudgets = [...budgets]
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Budget Status</CardTitle>
        <CardDescription>Category allocation and utilization metrics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {sortedBudgets.map((category) => {
          const Icon = getCategoryIcon(category.iconName || category.name)
          const percent = Math.min(100, (category.spent / category.limit) * 100)
          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    $
                    <EditableNumber
                      value={category.spent}
                      onSave={(value) => updateBudget(category.id, { spent: value })}
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      min={0}
                    />
                  </span>
                  {' / '}
                  $
                  <EditableNumber
                    value={category.limit}
                    onSave={(value) => updateBudget(category.id, { limit: value })}
                    formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    min={0}
                  />
                </div>
              </div>
              <Progress
                value={percent}
                className="h-2"
                indicatorClassName={
                  percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-amber-500' : 'bg-primary'
                }
              />
            </div>
          )
        })}
        <Button variant="outline" className="w-full mt-2" asChild>
          <Link href="/battlestation/budgets">Configure Allocations</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
