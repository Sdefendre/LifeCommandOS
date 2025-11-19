'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { format, endOfMonth, differenceInCalendarDays, startOfMonth } from 'date-fns'
import {
  ArrowUpRight,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  Upload,
  Search,
  Wallet,
  HelpCircle,
  Film,
  Heart,
  Plane,
  Briefcase,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Pie,
  PieChart,
} from 'recharts'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { Transaction, TransactionType } from '@/constants/dashboard'
import { EditableNumber } from '@/components/ui/editable-number'

// Chart Config
const chartConfig = {
  spending: { label: 'Spending', color: 'hsl(var(--chart-1))' },
  budget: { label: 'Budget', color: 'hsl(var(--chart-2))' },
  income: { label: 'Income', color: 'hsl(var(--chart-2))' },
  expenses: { label: 'Expenses', color: 'hsl(var(--chart-3))' },
  savings: { label: 'Savings', color: 'hsl(var(--chart-4))' },
  saved: { label: 'Saved', color: 'hsl(var(--chart-1))' },
  target: { label: 'Target', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function DashboardPage() {
  const {
    transactions,
    budgets,
    savingsGoals,
    accounts,
    bills,
    addTransaction,
    updateTransaction,
    addBill,
    updateBill,
    deleteBill,
    updateAccount,
    updateBudget,
    updateSavingsGoal,
    isLoading,
  } = useDashboard()

  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all'
  )
  const [transactionCategoryFilter, setTransactionCategoryFilter] = useState<string>('all')
  const [transactionSearch, setTransactionSearch] = useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewTransactions, setReviewTransactions] = useState<any[]>([]) // Temporary type for import review
  const [isNetWorthDialogOpen, setIsNetWorthDialogOpen] = useState(false)
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false)
  const [editingBill, setEditingBill] = useState<{
    id: string
    name: string
    amount: number
    dueDate: number
    category: string
    isAutopay: boolean
  } | null>(null)
  const [billFormData, setBillFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Bills',
    isAutopay: false,
  })

  const [dateData, setDateData] = useState<{ month: string; daysRemaining: number | null }>({
    month: '',
    daysRemaining: null,
  })

  useEffect(() => {
    const today = new Date()
    setDateData({
      month: format(today, 'MMMM yyyy'),
      daysRemaining: differenceInCalendarDays(endOfMonth(today), today),
    })
  }, [])

  // --- Derived Metrics ---

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

  // Filtered Transactions for List
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesType =
          transactionTypeFilter === 'all' ? true : transaction.type === transactionTypeFilter
        const matchesCategory =
          transactionCategoryFilter === 'all'
            ? true
            : transaction.category.toLowerCase() === transactionCategoryFilter.toLowerCase()
        const matchesSearch = transaction.name
          .toLowerCase()
          .includes(transactionSearch.toLowerCase())
        return matchesType && matchesCategory && matchesSearch
      })
      .slice(0, 5) // Show only recent 5
  }, [transactions, transactionTypeFilter, transactionCategoryFilter, transactionSearch])

  // Budget Alerts
  const budgetAlerts = useMemo(() => {
    return budgets.filter((b) => b.limit > 0 && b.spent / b.limit >= 0.85)
  }, [budgets])

  // Helper function for date calculations
  function addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  // Upcoming Bills (Mock logic for sorting)
  const upcomingBills = useMemo(() => {
    const today = new Date().getDate()
    return [...bills]
      .map((bill) => {
        let dueDate = new Date()
        dueDate.setDate(bill.dueDate)
        if (bill.dueDate < today) {
          dueDate = addMonths(dueDate, 1)
        }
        return { ...bill, actualDate: dueDate }
      })
      .sort((a, b) => a.actualDate.getTime() - b.actualDate.getTime())
      .slice(0, 5)
  }, [bills])

  const upcomingWithinThirtyDays = upcomingBills // Simplified

  // Helpers
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

  // --- Handlers ---

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTransactions: any[] = []

        results.data.forEach((row: any, index: number) => {
          const amount = parseFloat(row.amount || row.Amount || row.Debit || row.Credit || '0')
          const description =
            row.description || row.Description || row.Memo || 'Unknown Transaction'
          const date = row.date || row.Date || new Date().toISOString()
          const type = amount > 0 ? 'income' : 'expense'

          if (!isNaN(amount) && amount !== 0) {
            parsedTransactions.push({
              name: description,
              category: 'Uncategorized',
              amount: amount,
              date: date,
              type: type,
              merchant: description,
            })
          }
        })

        if (parsedTransactions.length > 0) {
          setReviewTransactions(parsedTransactions.slice(0, 10))
          setIsReviewDialogOpen(true)
        }
      },
    })
    event.target.value = ''
  }

  const handleConfirmImport = () => {
    reviewTransactions.forEach((t) => {
      addTransaction(t)
    })
    setIsReviewDialogOpen(false)
    setReviewTransactions([])
  }

  const handleCancelImport = () => {
    setIsReviewDialogOpen(false)
    setReviewTransactions([])
  }

  // Bill management handlers
  const handleAddBill = () => {
    setEditingBill(null)
    setBillFormData({
      name: '',
      amount: '',
      dueDate: '',
      category: 'Bills',
      isAutopay: false,
    })
    setIsBillDialogOpen(true)
  }

  const handleEditBill = (bill: (typeof upcomingBills)[0]) => {
    setEditingBill({
      id: bill.id,
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      category: bill.category,
      isAutopay: bill.isAutopay,
    })
    setBillFormData({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate.toString(),
      category: bill.category,
      isAutopay: bill.isAutopay,
    })
    setIsBillDialogOpen(true)
  }

  const handleDeleteBill = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id)
    }
  }

  const handleSaveBill = () => {
    const amount = parseFloat(billFormData.amount)
    const dueDate = parseInt(billFormData.dueDate)

    if (!billFormData.name || isNaN(amount) || isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
      alert('Please fill in all fields correctly. Due date must be between 1 and 31.')
      return
    }

    if (editingBill) {
      updateBill(editingBill.id, {
        name: billFormData.name,
        amount: amount,
        dueDate: dueDate,
        category: billFormData.category,
        isAutopay: billFormData.isAutopay,
      })
    } else {
      addBill({
        name: billFormData.name,
        amount: amount,
        dueDate: dueDate,
        category: billFormData.category,
        isAutopay: billFormData.isAutopay,
      })
    }

    setIsBillDialogOpen(false)
    setEditingBill(null)
    setBillFormData({
      name: '',
      amount: '',
      dueDate: '',
      category: 'Bills',
      isAutopay: false,
    })
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 max-[430px]:grid-cols-2 max-[430px]:gap-3">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <ChartSkeleton />
      </div>
    )
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-3 sm:p-4 md:gap-6 lg:gap-8 max-[430px]:gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-2 max-[430px]:gap-2 max-[430px]:mb-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight min-h-[2rem] sm:min-h-[2.25rem]">
          {dateData.month || <div className="h-8 w-40 bg-muted animate-pulse rounded-md" />}
        </h1>

        {/* Calendar Dialog Button */}
        <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border hover:bg-muted transition-colors cursor-pointer w-full sm:w-auto">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="font-medium text-foreground min-w-[1ch] inline-block text-center">
                {dateData.daysRemaining !== null ? dateData.daysRemaining : '-'}
              </span>
              <span className="hidden xs:inline">days until next month</span>
              <span className="xs:hidden">days left</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] mx-4">
            <DialogHeader className="pb-4">
              <DialogTitle>Calendar View</DialogTitle>
              <DialogDescription>Preview upcoming bills.</DialogDescription>
            </DialogHeader>
            <div className="py-4 px-2">
              <CalendarComponent
                mode="single"
                selected={selectedCalendarDate}
                onSelect={(date) => date && setSelectedCalendarDate(date)}
                className="rounded-md border w-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              <EditableNumber
                value={totalBalance}
                onSave={(value) => {
                  // Distribute the difference proportionally across accounts
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
            <p className="text-xs text-muted-foreground flex items-center flex-wrap mt-1 gap-1">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-500 font-medium">
                +
                <EditableNumber
                  value={12.5}
                  onSave={() => {}}
                  formatOptions={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                />
                %
              </span>
              <span className="hidden sm:inline">from last month</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs sm:text-sm"
              onClick={() => setIsNetWorthDialogOpen(true)}
            >
              View net worth
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spending (Month)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              <EditableNumber
                value={monthlySpending}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center flex-wrap mt-1 gap-1">
              <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-500 font-medium">
                -
                <EditableNumber
                  value={2.1}
                  onSave={() => {}}
                  formatOptions={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                />
                %
              </span>
              <span className="hidden sm:inline">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              <EditableNumber
                value={budgetRemaining}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
            <Progress
              value={(monthlySpending / (monthlySpending + budgetRemaining)) * 100}
              className="mt-2 h-2"
            />
            <p className="text-xs text-muted-foreground mt-2 break-words">
              <EditableNumber
                value={Math.round(
                  (monthlySpending / (monthlySpending + budgetRemaining || 1)) * 100
                )}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
                max={100}
              />
              % of monthly budget used
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              <EditableNumber
                value={currentSavings}
                onSave={(value) => {
                  // Distribute proportionally across savings goals
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
            <Progress value={savingsProgressPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2 break-words">
              <EditableNumber
                value={savingsProgressPercent}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
                max={100}
              />
              % of $
              <EditableNumber
                value={totalSavingsGoal}
                onSave={(value) => {
                  // Distribute proportionally across savings goals
                  const currentTotal = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0)
                  const difference = value - currentTotal
                  if (savingsGoals.length > 0) {
                    const perGoal = difference / savingsGoals.length
                    savingsGoals.forEach((goal) => {
                      updateSavingsGoal(goal.id, {
                        targetAmount: Math.max(0, goal.targetAmount + perGoal),
                      })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />{' '}
              goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Transactions List */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="grid gap-1 sm:gap-2 flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Recent activity from all accounts.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1 shrink-0">
                <Link href="/dashboard/transactions">
                  View All
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
            {/* Simplified Filters for Dashboard View */}
          </CardHeader>
          <CardContent>
            <div className="space-y-6 sm:space-y-8">
              {filteredTransactions.length ? (
                filteredTransactions.map((transaction) => {
                  const Icon = getCategoryIcon(transaction.category)
                  return (
                    <div className="flex items-center gap-3 sm:gap-4" key={transaction.id}>
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                        <AvatarFallback
                          className={
                            transaction.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-primary/10 text-primary'
                          }
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-0 sm:ml-4 space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {transaction.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.category}</p>
                      </div>
                      <div
                        className={cn(
                          'ml-auto font-medium text-sm sm:text-base shrink-0',
                          transaction.type === 'income' ? 'text-emerald-500' : ''
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
                <p className="text-sm text-muted-foreground">No transactions found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget Status / Alerts */}
        <div className="grid gap-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Budget Status</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Top categories by spending.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6">
              {budgets.slice(0, 4).map((category) => {
                const Icon = getCategoryIcon(category.iconName || category.name)
                const percent = Math.min(100, (category.spent / category.limit) * 100)
                return (
                  <div
                    className="flex items-center justify-between gap-3 sm:gap-4"
                    key={category.id}
                  >
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className={cn('p-1.5 sm:p-2 rounded-full shrink-0 bg-muted')}>
                        <Icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4')} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium leading-none truncate">
                          {category.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          $
                          <EditableNumber
                            value={category.spent}
                            onSave={(value) => updateBudget(category.id, { spent: value })}
                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                            min={0}
                          />{' '}
                          / $
                          <EditableNumber
                            value={category.limit}
                            onSave={(value) => updateBudget(category.id, { limit: value })}
                            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                            min={0}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="w-20 sm:w-24 shrink-0">
                      <Progress
                        value={percent}
                        className={cn('h-2')}
                        indicatorClassName={
                          percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-amber-500' : 'bg-primary'
                        }
                      />
                    </div>
                  </div>
                )
              })}
              <Button variant="outline" className="w-full mt-2 text-sm" asChild>
                <Link href="/dashboard/budgets">Manage Budgets</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg sm:text-xl">Upcoming Bills</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBill}
                className="h-8 w-8 p-0"
                title="Add Bill"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.length ? (
                  upcomingBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between gap-2 text-sm group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{bill.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {format(bill.actualDate, 'MMM d')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          $
                          <EditableNumber
                            value={bill.amount}
                            onSave={(value) => updateBill(bill.id, { amount: value })}
                            formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            min={0}
                          />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditBill(bill)}
                            title="Edit Bill"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteBill(bill.id)}
                            title="Delete Bill"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming bills.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />
        <Button
          size="lg"
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg max-[430px]:h-11 max-[430px]:w-11"
          onClick={handleUploadClick}
          title="Upload Bank Statement (CSV)"
        >
          <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Import Review Dialog */}
      <Dialog
        open={isReviewDialogOpen}
        onOpenChange={(open) => (open ? setIsReviewDialogOpen(true) : handleCancelImport())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Imported Transactions</DialogTitle>
            <DialogDescription>Confirm transactions to import.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewTransactions.map((t, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      $
                      <EditableNumber
                        value={Math.abs(t.amount)}
                        onSave={(value) => {
                          const updatedTransactions = [...reviewTransactions]
                          updatedTransactions[idx] = {
                            ...updatedTransactions[idx],
                            amount: t.amount >= 0 ? value : -value,
                          }
                          setReviewTransactions(updatedTransactions)
                        }}
                        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        min={0}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelImport}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport}>
              Import {reviewTransactions.length} Transactions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Net Worth Dialog */}
      <Dialog open={isNetWorthDialogOpen} onOpenChange={setIsNetWorthDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Net Worth Snapshot
            </DialogTitle>
            <DialogDescription>
              Accounts contributing to your $
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
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />{' '}
              balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart can go here if desired, removed for brevity/cleanliness in refactor */}
            <div className="space-y-4 col-span-2">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.institution}</p>
                  </div>
                  <div className="font-bold">
                    $
                    <EditableNumber
                      value={acc.balance}
                      onSave={(value) => updateAccount(acc.id, { balance: value })}
                      formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                      allowNegative={acc.type === 'credit'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Edit/Add Dialog */}
      <Dialog open={isBillDialogOpen} onOpenChange={setIsBillDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBill ? 'Edit Bill' : 'Add New Bill'}</DialogTitle>
            <DialogDescription>
              {editingBill
                ? 'Update the bill details below.'
                : 'Enter the details for your recurring bill.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bill-name">Bill Name</Label>
              <Input
                id="bill-name"
                placeholder="e.g., Rent, Internet, Netflix"
                value={billFormData.name}
                onChange={(e) => setBillFormData({ ...billFormData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-amount">Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={billFormData.amount}
                onChange={(e) => setBillFormData({ ...billFormData, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-due-date">Due Date (Day of Month)</Label>
              <Input
                id="bill-due-date"
                type="number"
                min="1"
                max="31"
                placeholder="1-31"
                value={billFormData.dueDate}
                onChange={(e) => setBillFormData({ ...billFormData, dueDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-category">Category</Label>
              <Select
                value={billFormData.category}
                onValueChange={(value) => setBillFormData({ ...billFormData, category: value })}
              >
                <SelectTrigger id="bill-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bills">Bills</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bill-autopay"
                checked={billFormData.isAutopay}
                onChange={(e) => setBillFormData({ ...billFormData, isAutopay: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="bill-autopay" className="cursor-pointer">
                Autopay enabled
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBillDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBill}>{editingBill ? 'Update Bill' : 'Add Bill'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
