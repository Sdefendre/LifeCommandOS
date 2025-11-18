'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { format, endOfMonth, differenceInCalendarDays } from 'date-fns'
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  Upload,
} from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import Papa from 'papaparse'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { DashboardCardSkeleton, ChartSkeleton } from '@/components/dashboard-card-skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Mock Data
const spendingData = [
  { month: 'Jan', spending: 1250, budget: 1500 },
  { month: 'Feb', spending: 1400, budget: 1500 },
  { month: 'Mar', spending: 1100, budget: 1500 },
  { month: 'Apr', spending: 1600, budget: 1500 },
  { month: 'May', spending: 1350, budget: 1500 },
  { month: 'Jun', spending: 1450, budget: 1500 },
]

const categoryData = [
  { category: 'Food', amount: 450, fill: 'var(--color-food)' },
  { category: 'Transport', amount: 320, fill: 'var(--color-transport)' },
  { category: 'Shopping', amount: 280, fill: 'var(--color-shopping)' },
  { category: 'Bills', amount: 400, fill: 'var(--color-bills)' },
]

const budgetCategories = [
  {
    name: 'Food & Dining',
    spent: 450,
    budget: 600,
    icon: Utensils,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    name: 'Transportation',
    spent: 320,
    budget: 400,
    icon: Car,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    name: 'Shopping',
    spent: 280,
    budget: 300,
    icon: ShoppingBag,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    name: 'Bills & Utilities',
    spent: 400,
    budget: 500,
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
]

const initialRecentTransactions = [
  {
    id: 1,
    name: 'Grocery Store',
    category: 'Food',
    amount: -85.5,
    date: 'Today, 2:30 PM',
    icon: Utensils,
  },
  {
    id: 2,
    name: 'Gas Station',
    category: 'Transport',
    amount: -45.0,
    date: 'Yesterday, 6:15 PM',
    icon: Car,
  },
  {
    id: 3,
    name: 'Freelance Payment',
    category: 'Income',
    amount: 1200.0,
    date: 'Yesterday, 9:00 AM',
    icon: DollarSign,
  },
  {
    id: 4,
    name: 'Online Shop',
    category: 'Shopping',
    amount: -120.99,
    date: 'Jun 15, 10:45 AM',
    icon: ShoppingBag,
  },
  {
    id: 5,
    name: 'Electric Bill',
    category: 'Bills',
    amount: -150.0,
    date: 'Jun 14, 11:30 AM',
    icon: Zap,
  },
]

const chartConfig = {
  spending: {
    label: 'Spending',
    color: 'hsl(var(--chart-1))',
  },
  budget: {
    label: 'Budget',
    color: 'hsl(var(--chart-2))',
  },
  food: {
    label: 'Food',
    color: 'hsl(var(--chart-3))',
  },
  transport: {
    label: 'Transport',
    color: 'hsl(var(--chart-4))',
  },
  shopping: {
    label: 'Shopping',
    color: 'hsl(var(--chart-5))',
  },
  bills: {
    label: 'Bills',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dashboard Metrics State
  const [totalBalance, setTotalBalance] = useState(12450.0)
  const [monthlySpending, setMonthlySpending] = useState(1450.0)
  const [budgetRemaining, setBudgetRemaining] = useState(550.0)
  const [savingsGoal, setSavingsGoal] = useState(8400.0)
  const [savingsGoalTarget, setSavingsGoalTarget] = useState(10000.0)
  const [transactions, setTransactions] = useState(initialRecentTransactions)

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editType, setEditType] = useState<'balance' | 'spending' | 'budget' | 'savings' | null>(
    null
  )
  const [editValue, setEditValue] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const today = new Date()
  const currentMonth = format(today, 'MMMM yyyy')
  const daysRemaining = differenceInCalendarDays(endOfMonth(today), today)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleCardClick = (type: 'balance' | 'spending' | 'budget' | 'savings') => {
    setEditType(type)
    switch (type) {
      case 'balance':
        setEditTitle('Edit Total Balance')
        setEditValue(totalBalance.toString())
        break
      case 'spending':
        setEditTitle('Edit Monthly Spending')
        setEditValue(monthlySpending.toString())
        break
      case 'budget':
        setEditTitle('Edit Budget Remaining')
        setEditValue(budgetRemaining.toString())
        break
      case 'savings':
        setEditTitle('Edit Savings Goal')
        setEditValue(savingsGoal.toString())
        break
    }
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    const value = parseFloat(editValue)
    if (isNaN(value)) return

    switch (editType) {
      case 'balance':
        setTotalBalance(value)
        break
      case 'spending':
        setMonthlySpending(value)
        break
      case 'budget':
        setBudgetRemaining(value)
        break
      case 'savings':
        setSavingsGoal(value)
        break
    }
    setIsEditDialogOpen(false)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // NOTE: Using client-side CSV parsing (free and fast).
    // If you want to use the Grok 4 Fast API, you would send the file content to your backend
    // which would then call the xAI API with your API key.
    // Example API call structure provided below in comments.

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTransactions: any[] = []
        let newIncome = 0
        let newExpense = 0

        results.data.forEach((row: any, index: number) => {
          // Basic heuristic to find columns
          const amount = parseFloat(row.amount || row.Amount || row.Debit || row.Credit || '0')
          const description =
            row.description || row.Description || row.Memo || 'Unknown Transaction'
          const date = row.date || row.Date || 'Today'

          if (!isNaN(amount) && amount !== 0) {
            if (amount > 0) newIncome += amount
            else newExpense += Math.abs(amount)

            parsedTransactions.push({
              id: index + 100, // offset IDs
              name: description,
              category: amount > 0 ? 'Income' : 'Uncategorized',
              amount: amount,
              date: date,
              icon: amount > 0 ? DollarSign : ShoppingBag,
            })
          }
        })

        // Update State with parsed data
        if (parsedTransactions.length > 0) {
          setTransactions(parsedTransactions.slice(0, 5)) // Show top 5
          setMonthlySpending((prev) => prev + newExpense)
          setTotalBalance((prev) => prev + newIncome - newExpense)
          // alert(`Processed ${parsedTransactions.length} transactions!`)
        }
      },
    })

    // Reset input
    event.target.value = ''
  }

  /*
   * GROK 4 FAST API INTEGRATION EXAMPLE
   *
   * async function processWithGrok(fileContent: string) {
   *   const response = await fetch('https://api.x.ai/v1/chat/completions', {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'Authorization': 'Bearer YOUR_XAI_API_KEY'
   *     },
   *     body: JSON.stringify({
   *       model: "grok-beta",
   *       messages: [
   *         {
   *           role: "system",
   *           content: "You are a financial parser. Extract transactions from this CSV/Text and return JSON with fields: date, description, amount, category."
   *         },
   *         {
   *           role: "user",
   *           content: fileContent
   *         }
   *       ]
   *     })
   *   })
   *   const data = await response.json()
   *   return data.choices[0].message.content
   * }
   */

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <ChartSkeleton />
      </div>
    )
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">{currentMonth}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border">
          <Calendar className="h-4 w-4" />
          <span className="font-medium text-foreground">{daysRemaining}</span>
          <span>days until next month</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick('balance')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+12.5%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick('spending')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spending (Month)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {monthlySpending.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingDown className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">-2.1%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick('budget')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {budgetRemaining.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <Progress value={72} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">72% of monthly budget used</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick('savings')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {savingsGoal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <Progress value={(savingsGoal / savingsGoalTarget) * 100} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((savingsGoal / savingsGoalTarget) * 100)}% of $
              {savingsGoalTarget.toLocaleString()} goal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>
              Compare your spending against your budget over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={spendingData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  dataKey="spending"
                  type="natural"
                  fill="var(--color-spending)"
                  fillOpacity={0.4}
                  stroke="var(--color-spending)"
                  stackId="a"
                />
                <Area
                  dataKey="budget"
                  type="natural"
                  fill="var(--color-budget)"
                  fillOpacity={0.1}
                  stroke="var(--color-budget)"
                  stackId="b"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Spending by category for the current month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={categoryData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="amount" fill="var(--color-food)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Recent transactions from your connected accounts.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/transactions">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {transactions.map((transaction) => (
                <div className="flex items-center" key={transaction.id}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback
                      className={
                        transaction.amount > 0
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-primary/10 text-primary'
                      }
                    >
                      <transaction.icon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category}</p>
                  </div>
                  <div
                    className={cn(
                      'ml-auto font-medium',
                      transaction.amount > 0 ? 'text-emerald-500' : ''
                    )}
                  >
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Track your monthly budget limits.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {budgetCategories.map((category) => (
              <div className="flex items-center justify-between space-x-4" key={category.name}>
                <div className="flex items-center space-x-4">
                  <div className={cn('p-2 rounded-full', category.bg)}>
                    <category.icon className={cn('h-4 w-4', category.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{category.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${category.spent} / ${category.budget}
                    </p>
                  </div>
                </div>
                <div className="w-1/3">
                  <Progress
                    value={(category.spent / category.budget) * 100}
                    className={cn(
                      'h-2',
                      category.spent / category.budget > 0.9 ? 'bg-red-100' : ''
                    )}
                    indicatorClassName={cn(
                      category.spent / category.budget > 1
                        ? 'bg-red-500'
                        : category.spent / category.budget > 0.85
                          ? 'bg-amber-500'
                          : 'bg-primary'
                    )}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/dashboard/budgets">Manage Budgets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button - Now Upload */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={handleUploadClick}
          title="Upload Bank Statement (CSV)"
        >
          <Upload className="h-6 w-6" />
        </Button>
      </div>

      {/* Edit Value Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTitle}</DialogTitle>
            <DialogDescription>Update the value for this metric.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value ($)
              </Label>
              <Input
                id="value"
                type="number"
                className="col-span-3"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
