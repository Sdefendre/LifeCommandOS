'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { format, endOfMonth, differenceInCalendarDays } from 'date-fns'
import type { LucideIcon } from 'lucide-react'
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

// Types help keep the dashboard data structures predictable.
interface TransactionEntry {
  id: number
  name: string
  category: string
  amount: number
  date: string
  icon: LucideIcon
}

interface UpcomingBill {
  id: number
  name: string
  amount: number
  dueDate: string
  category: string
  status: 'scheduled' | 'autopay' | 'due-soon'
}

interface AccountBreakdownEntry {
  id: number
  name: string
  balance: number
  trend: number
  type: 'cash' | 'credit' | 'investment'
  color: string
}

// Unified category list shared across filters, uploads, and badges.
const transactionCategoryOptions = [
  'Income',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Housing',
  'Entertainment',
  'Health',
  'Travel',
  'Uncategorized',
] as const

// Lightweight keyword heuristics that kick in when we have no personal rule yet.
const categoryKeywordMap: {
  keywords: string[]
  category: (typeof transactionCategoryOptions)[number]
}[] = [
  { keywords: ['uber', 'lyft', 'shell', 'chevron', 'metro', 'taxi'], category: 'Transport' },
  { keywords: ['grocery', 'market', 'food', 'cafe', 'restaurant'], category: 'Food' },
  { keywords: ['amazon', 'shop', 'boutique', 'store'], category: 'Shopping' },
  { keywords: ['rent', 'mortgage', 'landlord'], category: 'Housing' },
  { keywords: ['netflix', 'spotify', 'prime'], category: 'Entertainment' },
  { keywords: ['insurance', 'utility', 'electric', 'water', 'gas'], category: 'Bills' },
  { keywords: ['gym', 'dentist', 'clinic'], category: 'Health' },
  { keywords: ['hotel', 'airbnb', 'airlines'], category: 'Travel' },
]

const CATEGORY_RULES_STORAGE_KEY = 'spendwiseCategoryRules'
const LEGACY_CATEGORY_RULES_STORAGE_KEY = 'wealthwiseCategoryRules'

// Mock Data
const spendingData = [
  { month: 'Jan', spending: 1250, budget: 1500 },
  { month: 'Feb', spending: 1400, budget: 1500 },
  { month: 'Mar', spending: 1100, budget: 1500 },
  { month: 'Apr', spending: 1600, budget: 1500 },
  { month: 'May', spending: 1350, budget: 1500 },
  { month: 'Jun', spending: 1450, budget: 1500 },
  { month: 'Jul', spending: 1550, budget: 1500 },
  { month: 'Aug', spending: 1300, budget: 1500 },
  { month: 'Sep', spending: 1200, budget: 1500 },
  { month: 'Oct', spending: 1480, budget: 1500 },
  { month: 'Nov', spending: 950, budget: 1500 },
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

const cashFlowData = [
  { month: 'Jan', income: 4200, expenses: 2950, savings: 1250 },
  { month: 'Feb', income: 4100, expenses: 3050, savings: 1050 },
  { month: 'Mar', income: 4350, expenses: 2875, savings: 1475 },
  { month: 'Apr', income: 4400, expenses: 3200, savings: 1200 },
  { month: 'May', income: 4500, expenses: 3100, savings: 1400 },
  { month: 'Jun', income: 4300, expenses: 2850, savings: 1450 },
  { month: 'Jul', income: 4450, expenses: 2980, savings: 1470 },
  { month: 'Aug', income: 4600, expenses: 3050, savings: 1550 },
  { month: 'Sep', income: 4550, expenses: 2950, savings: 1600 },
  { month: 'Oct', income: 4700, expenses: 3120, savings: 1580 },
  { month: 'Nov', income: 4650, expenses: 2900, savings: 1750 },
  { month: 'Dec', income: 4800, expenses: 3300, savings: 1500 },
]

const savingsTrendData = [
  { month: 'Jan', saved: 6200, target: 6000 },
  { month: 'Feb', saved: 6900, target: 6830 },
  { month: 'Mar', saved: 7200, target: 7660 },
  { month: 'Apr', saved: 7600, target: 8490 },
  { month: 'May', saved: 8100, target: 9320 },
  { month: 'Jun', saved: 8400, target: 10150 },
  { month: 'Jul', saved: 8700, target: 10980 },
  { month: 'Aug', saved: 9300, target: 11810 },
  { month: 'Sep', saved: 9700, target: 12640 },
  { month: 'Oct', saved: 10100, target: 13470 },
  { month: 'Nov', saved: 10550, target: 14300 },
  { month: 'Dec', saved: 11000, target: 15130 },
]

const upcomingBills: UpcomingBill[] = [
  {
    id: 1,
    name: 'Rent',
    amount: 1800,
    dueDate: '2024-07-01',
    category: 'Housing',
    status: 'scheduled',
  },
  {
    id: 2,
    name: 'Electric Utility',
    amount: 145,
    dueDate: '2024-06-23',
    category: 'Bills',
    status: 'due-soon',
  },
  {
    id: 3,
    name: 'Internet',
    amount: 85,
    dueDate: '2024-06-20',
    category: 'Bills',
    status: 'autopay',
  },
  {
    id: 4,
    name: 'Car Insurance',
    amount: 120,
    dueDate: '2024-06-28',
    category: 'Transport',
    status: 'scheduled',
  },
  {
    id: 5,
    name: 'Gym Membership',
    amount: 55,
    dueDate: '2024-06-25',
    category: 'Health',
    status: 'autopay',
  },
]

const accountBreakdown: AccountBreakdownEntry[] = [
  {
    id: 1,
    name: 'Checking',
    balance: 5200,
    trend: 4.2,
    type: 'cash',
    color: 'hsl(var(--chart-1))',
  },
  {
    id: 2,
    name: 'High-Yield Savings',
    balance: 4300,
    trend: 3.1,
    type: 'cash',
    color: 'hsl(var(--chart-2))',
  },
  {
    id: 3,
    name: 'Brokerage',
    balance: 2850,
    trend: -1.2,
    type: 'investment',
    color: 'hsl(var(--chart-3))',
  },
  {
    id: 4,
    name: 'Rewards Credit',
    balance: -900,
    trend: -0.8,
    type: 'credit',
    color: 'hsl(var(--chart-4))',
  },
]

// CSS color map for the pie chart in the Net Worth dialog.
const netWorthChartConfig = accountBreakdown.reduce((config, account) => {
  config[`account-${account.id}`] = { label: account.name, color: account.color }
  return config
}, {} as ChartConfig)

function normalizeMerchantName(value: string) {
  return value.trim().toLowerCase()
}

const initialRecentTransactions: TransactionEntry[] = [
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
  jan: {
    label: 'January',
    color: 'hsl(var(--chart-1))',
  },
  feb: {
    label: 'February',
    color: 'hsl(var(--chart-2))',
  },
  mar: {
    label: 'March',
    color: 'hsl(var(--chart-3))',
  },
  apr: {
    label: 'April',
    color: 'hsl(var(--chart-4))',
  },
  may: {
    label: 'May',
    color: 'hsl(var(--chart-5))',
  },
  jun: {
    label: 'June',
    color: 'hsl(var(--primary))',
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
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-2))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-3))',
  },
  savings: {
    label: 'Savings',
    color: 'hsl(var(--chart-4))',
  },
  saved: {
    label: 'Saved',
    color: 'hsl(var(--chart-1))',
  },
  target: {
    label: 'Target',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dashboard Metrics State
  const [totalBalance, setTotalBalance] = useState(12450.0)
  const [monthlySpending, setMonthlySpending] = useState(1450.0)
  const [budgetRemaining, setBudgetRemaining] = useState(550.0)
  const [savingsGoal, setSavingsGoal] = useState(8400.0)
  const [savingsGoalTarget, setSavingsGoalTarget] = useState(10000.0)
  const [transactions, setTransactions] = useState(initialRecentTransactions)
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all'
  )
  const [transactionCategoryFilter, setTransactionCategoryFilter] = useState<string>('all')
  const [transactionSearch, setTransactionSearch] = useState('')
  const [categoryRules, setCategoryRules] = useState<Record<string, string>>({})
  const [reviewTransactions, setReviewTransactions] = useState<TransactionEntry[]>([])
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isNetWorthDialogOpen, setIsNetWorthDialogOpen] = useState(false)

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editType, setEditType] = useState<'balance' | 'spending' | 'budget' | 'savings' | null>(
    null
  )
  const [editValue, setEditValue] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const [dateData, setDateData] = useState<{ month: string; daysRemaining: number | null }>({
    month: '',
    daysRemaining: null,
  })

  useEffect(() => {
    const storedRules = localStorage.getItem(CATEGORY_RULES_STORAGE_KEY)
    if (storedRules) {
      try {
        setCategoryRules(JSON.parse(storedRules))
        return
      } catch {
        setCategoryRules({})
        return
      }
    }

    const legacyRules = localStorage.getItem(LEGACY_CATEGORY_RULES_STORAGE_KEY)
    if (legacyRules) {
      try {
        const parsedLegacyRules = JSON.parse(legacyRules)
        setCategoryRules(parsedLegacyRules)
        localStorage.setItem(CATEGORY_RULES_STORAGE_KEY, legacyRules)
        localStorage.removeItem(LEGACY_CATEGORY_RULES_STORAGE_KEY)
      } catch {
        setCategoryRules({})
      }
    }
  }, [])

  useEffect(() => {
    const today = new Date()
    setDateData({
      month: format(today, 'MMMM yyyy'),
      daysRemaining: differenceInCalendarDays(endOfMonth(today), today),
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const persistCategoryRules = (updatedRules: Record<string, string>) => {
    setCategoryRules(updatedRules)
    localStorage.setItem(CATEGORY_RULES_STORAGE_KEY, JSON.stringify(updatedRules))
    localStorage.removeItem(LEGACY_CATEGORY_RULES_STORAGE_KEY)
  }

  // Merge remembered rules + heuristics to auto-label imported transactions.
  const getSuggestedCategory = (name: string, amount: number): string => {
    const normalized = normalizeMerchantName(name)
    if (categoryRules[normalized]) {
      return categoryRules[normalized]
    }
    if (amount > 0) {
      return 'Income'
    }
    const keywordMatch = categoryKeywordMap.find((entry) =>
      entry.keywords.some((keyword) => normalized.includes(keyword))
    )
    if (keywordMatch) {
      return keywordMatch.category
    }
    return 'Uncategorized'
  }

  const handleReviewCategoryChange = (transactionId: number, category: string) => {
    setReviewTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, category } : transaction
      )
    )
  }

  const handleConfirmImport = () => {
    if (!reviewTransactions.length) return

    const updatedRules = { ...categoryRules }
    reviewTransactions.forEach((transaction) => {
      updatedRules[normalizeMerchantName(transaction.name)] = transaction.category
    })
    persistCategoryRules(updatedRules)

    const incomeAdded = reviewTransactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expenseAdded = reviewTransactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)

    setTransactions((prev) => [...reviewTransactions, ...prev].slice(0, 5))
    setMonthlySpending((prev) => prev + expenseAdded)
    setTotalBalance((prev) => prev + incomeAdded - expenseAdded)

    setIsReviewDialogOpen(false)
    setReviewTransactions([])
  }

  const handleCancelImport = () => {
    setIsReviewDialogOpen(false)
    setReviewTransactions([])
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      transactionTypeFilter === 'all'
        ? true
        : transactionTypeFilter === 'income'
          ? transaction.amount > 0
          : transaction.amount < 0
    const matchesCategory =
      transactionCategoryFilter === 'all'
        ? true
        : transaction.category.toLowerCase() === transactionCategoryFilter.toLowerCase()
    const matchesSearch = transaction.name.toLowerCase().includes(transactionSearch.toLowerCase())
    return matchesType && matchesCategory && matchesSearch
  })

  // Derived insights that power alerts, summaries, and additional cards.
  const savingsProgressPercent = Math.round((savingsGoal / savingsGoalTarget) * 100)
  const budgetAlerts = budgetCategories.filter(
    (category) => category.spent / category.budget >= 0.85
  )
  const sortedBills = [...upcomingBills].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
  const highlightedBillDates = sortedBills.map((bill) => new Date(bill.dueDate))
  const nextBills = sortedBills.slice(0, 4)
  const today = new Date()
  const upcomingWithinThirtyDays = sortedBills.filter((bill) => {
    const dueDate = new Date(bill.dueDate)
    const daysUntilDue = differenceInCalendarDays(dueDate, today)
    return daysUntilDue >= 0 && daysUntilDue <= 30
  })

  const netWorthTotal = accountBreakdown.reduce((sum, account) => sum + account.balance, 0)
  const netWorthChartData = accountBreakdown.map((account) => ({
    id: account.id,
    name: account.name,
    key: `account-${account.id}`,
    value: Math.abs(account.balance),
    balance: account.balance,
    trend: account.trend,
  }))
  const billStatusClassMap: Record<UpcomingBill['status'], string> = {
    'due-soon': 'bg-amber-500/15 text-amber-600',
    autopay: 'bg-emerald-500/15 text-emerald-600',
    scheduled: 'bg-primary/10 text-primary',
  }
  const billStatusLabelMap: Record<UpcomingBill['status'], string> = {
    'due-soon': 'Due soon',
    autopay: 'Autopay',
    scheduled: 'Scheduled',
  }
  const transactionTypeFilters = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expenses', value: 'expense' },
  ] as const

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

    // NOTE: Using client-side CSV parsing so uploads stay private.

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTransactions: TransactionEntry[] = []

        results.data.forEach((row: any, index: number) => {
          // Basic heuristic to find columns
          const amount = parseFloat(row.amount || row.Amount || row.Debit || row.Credit || '0')
          const description =
            row.description || row.Description || row.Memo || 'Unknown Transaction'
          const date = row.date || row.Date || 'Today'

          if (!isNaN(amount) && amount !== 0) {
            const categorySuggestion = getSuggestedCategory(description, amount)
            parsedTransactions.push({
              id: Number(`${Date.now()}${index}`),
              name: description,
              category: categorySuggestion,
              amount: amount,
              date: date,
              icon: amount > 0 ? DollarSign : ShoppingBag,
            })
          }
        })

        if (parsedTransactions.length > 0) {
          setReviewTransactions(parsedTransactions.slice(0, 10))
          setIsReviewDialogOpen(true)
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
    <div className="grid flex-1 items-start gap-4 p-3 sm:p-4 md:gap-6 lg:gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight min-h-[2rem] sm:min-h-[2.25rem]">
          {dateData.month || (
            <div className="h-8 sm:h-9 w-40 sm:w-48 bg-muted animate-pulse rounded-md" />
          )}
        </h1>
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
              <DialogDescription>
                Preview upcoming bills so you can plan the rest of the month.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 px-2">
              <CalendarComponent
                mode="single"
                selected={selectedCalendarDate}
                onSelect={(date) => date && setSelectedCalendarDate(date)}
                className="rounded-md border w-full"
                modifiers={{
                  bills: highlightedBillDates,
                }}
                modifiersClassNames={{
                  bills: 'bg-amber-100 text-amber-900 data-[selected=true]:bg-amber-200',
                }}
              />
            </div>
            <div className="space-y-3 px-2 pb-4">
              <p className="text-sm text-muted-foreground">
                {upcomingWithinThirtyDays.length} bill
                {upcomingWithinThirtyDays.length === 1 ? '' : 's'} due in the next 30 days.
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sortedBills.map((bill) => (
                  <div
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    key={bill.id}
                  >
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(bill.dueDate), 'MMM d')} • {bill.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'border-none text-xs font-medium mt-1 px-2 py-0.5',
                          billStatusClassMap[bill.status]
                        )}
                      >
                        {billStatusLabelMap[bill.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick('balance')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center flex-wrap mt-1 gap-1">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-500 font-medium">+12.5%</span>
              <span className="hidden sm:inline">from last month</span>
              <span className="sm:hidden">vs last month</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs sm:text-sm"
              onClick={(event) => {
                event.stopPropagation()
                setIsNetWorthDialogOpen(true)
              }}
            >
              View net worth
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
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
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              {monthlySpending.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center flex-wrap mt-1 gap-1">
              <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-500 font-medium">-2.1%</span>
              <span className="hidden sm:inline">from last month</span>
              <span className="sm:hidden">vs last month</span>
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
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              {budgetRemaining.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <Progress value={72} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2 break-words">
              72% of monthly budget used
            </p>
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
            <div className="text-xl sm:text-2xl font-bold break-words">
              $
              {savingsGoal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <Progress value={savingsProgressPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2 break-words">
              {savingsProgressPercent}% of ${savingsGoalTarget.toLocaleString()} goal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Spending Overview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Monthly spending for the current year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] sm:h-[350px] w-full">
              <BarChart
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
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="spending" fill="var(--color-spending)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Category Breakdown</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Spending by category for the current month.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-1 sm:px-4">
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={categoryData}
                margin={{ top: 10, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={45} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Cash Flow Pulse</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Track income, expenses, and savings month over month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <AreaChart
                data={cashFlowData}
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
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={45}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--color-income)"
                  fill="var(--color-income)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-expenses)"
                  fill="var(--color-expenses)"
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="var(--color-savings)"
                  fill="var(--color-savings)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Savings Goal Forecast</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Projected progress toward ${savingsGoalTarget.toLocaleString()} goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <LineChart
                data={savingsTrendData}
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
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={45} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line
                  type="monotone"
                  dataKey="saved"
                  stroke="var(--color-saved)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="var(--color-target)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="font-semibold">On track</div>
              <div className="text-muted-foreground">
                At {savingsProgressPercent}% with current pace, goal is hit in{' '}
                <span className="font-medium text-foreground">~4 months</span>.
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Upcoming Bills</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Next obligations at a glance.
              </CardDescription>
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              {upcomingWithinThirtyDays.length} due soon •{' '}
              <span className="text-foreground">
                ${upcomingWithinThirtyDays.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
              </span>{' '}
              this month
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {nextBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {format(new Date(bill.dueDate), 'MMM d')} • {bill.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-none text-xs font-medium mt-1 px-2 py-0.5',
                        billStatusClassMap[bill.status]
                      )}
                    >
                      {billStatusLabelMap[bill.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCalendarDialogOpen(true)}
            >
              Open bill calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="grid gap-1 sm:gap-2 flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Recent transactions from your connected accounts.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1 shrink-0">
                <Link href="/dashboard/transactions">
                  View All
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                {transactionTypeFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={transactionTypeFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      setTransactionTypeFilter(filter.value as 'all' | 'income' | 'expense')
                    }
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select
                  value={transactionCategoryFilter}
                  onValueChange={setTransactionCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {transactionCategoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={transactionSearch}
                    onChange={(event) => setTransactionSearch(event.target.value)}
                    placeholder="Search name"
                    className="pl-8 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 sm:space-y-8">
              {filteredTransactions.length ? (
                filteredTransactions.map((transaction) => (
                  <div className="flex items-center gap-3 sm:gap-4" key={transaction.id}>
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback
                        className={
                          transaction.amount > 0
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-primary/10 text-primary'
                        }
                      >
                        <transaction.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                        transaction.amount > 0 ? 'text-emerald-500' : ''
                      )}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No transactions match this filter.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Budget Status</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Track your monthly budget limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6">
              {budgetCategories.map((category) => (
                <div
                  className="flex items-center justify-between gap-3 sm:gap-4"
                  key={category.name}
                >
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <div className={cn('p-1.5 sm:p-2 rounded-full shrink-0', category.bg)}>
                      <category.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', category.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium leading-none truncate">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${category.spent} / ${category.budget}
                      </p>
                    </div>
                  </div>
                  <div className="w-20 sm:w-24 shrink-0">
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
              <Button variant="outline" className="w-full mt-2 text-sm" asChild>
                <Link href="/dashboard/budgets">Manage Budgets</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg sm:text-xl">Budget Alerts</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Warnings before overspending hits.
                </CardDescription>
              </div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              {budgetAlerts.length ? (
                <div className="space-y-3">
                  {budgetAlerts.map((category) => {
                    const usagePercent = Math.round((category.spent / category.budget) * 100)
                    const isOver = usagePercent > 100
                    return (
                      <div
                        key={category.name}
                        className="flex items-center justify-between rounded-lg border px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {usagePercent}% of ${category.budget}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-none text-xs font-medium px-2 py-0.5',
                            isOver ? 'bg-red-500/15 text-red-600' : 'bg-amber-500/15 text-amber-600'
                          )}
                        >
                          {isOver ? 'Over budget' : 'Near limit'}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  All categories are within their limits.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button - Now Upload */}
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
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg"
          onClick={handleUploadClick}
          title="Upload Bank Statement (CSV)"
        >
          <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
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

      {/* Upload Review Dialog */}
      <Dialog
        open={isReviewDialogOpen}
        onOpenChange={(open) => (open ? setIsReviewDialogOpen(true) : handleCancelImport())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Imported Transactions</DialogTitle>
            <DialogDescription>
              SpendWise matched categories using your history. Double-check before saving.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Need to teach a new rule? Pick a category once and we will remember it for future
              uploads.
            </p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead className="w-32 text-right">Amount</TableHead>
                    <TableHead className="w-48">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-xs text-muted-foreground">{transaction.date}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {transaction.amount > 0 ? '+' : '-'}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={transaction.category}
                          onValueChange={(value) =>
                            handleReviewCategoryChange(transaction.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pick a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {transactionCategoryOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelImport}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport} disabled={!reviewTransactions.length}>
              Save & apply
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
              Accounts contributing to your ${totalBalance.toLocaleString()} balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer config={netWorthChartConfig} className="h-56 w-full">
              <PieChart>
                <Pie
                  data={netWorthChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {netWorthChartData.map((entry) => (
                    <Cell key={entry.id} fill={`var(--color-${entry.key})`} />
                  ))}
                </Pie>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="space-y-4">
              {netWorthChartData.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.balance >= 0 ? 'Asset' : 'Liability'} • {entry.trend >= 0 ? '+' : ''}
                      {entry.trend}%
                    </p>
                  </div>
                  <div
                    className={cn(
                      'font-semibold',
                      entry.balance >= 0 ? 'text-foreground' : 'text-red-500'
                    )}
                  >
                    {entry.balance >= 0 ? '' : '-'}${Math.abs(entry.balance).toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="rounded-lg border bg-muted/50 px-3 py-2 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <span>Total Net Worth</span>
                  <span>${netWorthTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
