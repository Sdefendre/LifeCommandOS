'use client'

import Link from 'next/link'
import {
  ArrowRight,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EditableNumber } from '@/components/ui/editable-number'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { cn } from '@/lib/utils'

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

export function RecentTransactions() {
  const { transactions, updateTransaction } = useDashboard()

  // Show only last 5 transactions
  const recentTransactions = transactions.slice(0, 5)

  return (
    <Card className="xl:col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
          <CardDescription>Latest financial operations and movements.</CardDescription>
        </div>
        <Button asChild size="sm" variant="outline" className="gap-1">
          <Link href="/battlestation/transactions">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category)
              return (
                <div className="flex items-center gap-4 group" key={transaction.id}>
                  <Avatar className="h-10 w-10 rounded-lg border bg-card/50">
                    <AvatarFallback
                      className={cn(
                        'rounded-lg bg-transparent',
                        transaction.type === 'income'
                          ? 'text-[#657832]'
                          : 'text-muted-foreground group-hover:text-primary transition-colors'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{transaction.category}</p>
                  </div>
                  <div
                    className={cn(
                      'font-semibold text-sm tabular-nums',
                      transaction.type === 'income' ? 'text-[#657832]' : ''
                    )}
                  >
                    {transaction.type === 'income' ? '+' : ''}$
                    <EditableNumber
                      value={Math.abs(transaction.amount)}
                      onSave={(value) => {
                        const finalAmount = transaction.type === 'income' ? value : -value
                        updateTransaction(transaction.id, { amount: finalAmount })
                      }}
                      formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                      min={0}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No transactions found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
