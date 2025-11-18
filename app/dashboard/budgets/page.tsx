'use client'

import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Wifi,
  Coffee,
  Home,
  Smartphone,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DashboardCardSkeleton } from '@/components/dashboard-card-skeleton'
import { cn } from '@/lib/utils'

// Mock Data
const initialBudgets = [
  {
    id: '1',
    name: 'Food & Dining',
    spent: 450,
    budget: 600,
    icon: Utensils,
    color: '#f97316', // orange-500
    period: 'monthly',
  },
  {
    id: '2',
    name: 'Transportation',
    spent: 320,
    budget: 400,
    icon: Car,
    color: '#3b82f6', // blue-500
    period: 'monthly',
  },
  {
    id: '3',
    name: 'Shopping',
    spent: 280,
    budget: 300,
    icon: ShoppingBag,
    color: '#a855f7', // purple-500
    period: 'monthly',
  },
  {
    id: '4',
    name: 'Utilities',
    spent: 180,
    budget: 200,
    icon: Zap,
    color: '#eab308', // yellow-500
    period: 'monthly',
  },
  {
    id: '5',
    name: 'Internet',
    spent: 60,
    budget: 60,
    icon: Wifi,
    color: '#14b8a6', // teal-500
    period: 'monthly',
  },
  {
    id: '6',
    name: 'Entertainment',
    spent: 120,
    budget: 150,
    icon: Smartphone,
    color: '#ec4899', // pink-500
    period: 'monthly',
  },
]

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // New Budget Form State
  const [newBudget, setNewBudget] = useState({
    name: '',
    budget: '',
    period: 'monthly',
    category: 'Food',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0)
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
    const atRisk = budgets.filter((b) => b.spent / b.budget >= 0.9).length
    const onTrack = budgets.filter((b) => b.spent / b.budget < 0.9).length

    return { totalBudget, totalSpent, atRisk, onTrack }
  }, [budgets])

  const pieData = useMemo(() => {
    return budgets.map((b) => ({
      name: b.name,
      value: b.spent,
      color: b.color,
    }))
  }, [budgets])

  const handleAddBudget = () => {
    const budget = {
      id: Math.random().toString(36).substr(2, 9),
      name: newBudget.name,
      spent: 0,
      budget: parseFloat(newBudget.budget),
      icon: getCategoryIcon(newBudget.category),
      color: '#64748b', // default
      period: newBudget.period,
    }
    setBudgets([...budgets, budget])
    setIsAddDialogOpen(false)
    setNewBudget({ name: '', budget: '', period: 'monthly', category: 'Food' })
  }

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id))
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'Food':
        return Utensils
      case 'Transport':
        return Car
      case 'Shopping':
        return ShoppingBag
      case 'Utilities':
        return Zap
      default:
        return ShoppingBag
    }
  }

  function getStatusColor(percentage: number) {
    if (percentage >= 1) return 'bg-red-500'
    if (percentage >= 0.9) return 'bg-amber-500'
    return 'bg-primary'
  }

  function getStatusText(percentage: number) {
    if (percentage >= 1) return 'Over Budget'
    if (percentage >= 0.9) return 'At Risk'
    return 'On Track'
  }

  function getBadgeVariant(percentage: number) {
    if (percentage >= 1) return 'destructive'
    if (percentage >= 0.9) return 'secondary' // Using secondary for warningish look or outline
    return 'outline'
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
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>
    )
  }

  // Get current month and year
  const currentDate = new Date()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground">
          {monthName} {year}
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Budget</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
            <Progress value={(stats.totalSpent / stats.totalBudget) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budgets At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.atRisk}</div>
            <p className="text-xs text-muted-foreground">Categories exceeding 90%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{stats.onTrack}</div>
            <p className="text-xs text-muted-foreground">Categories within limits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Budget Categories</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Budget</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      value={newBudget.name}
                      onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-right">
                      Limit ($)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      className="col-span-3"
                      value={newBudget.budget}
                      onChange={(e) => setNewBudget({ ...newBudget, budget: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Icon
                    </Label>
                    <Select
                      value={newBudget.category}
                      onValueChange={(val) => setNewBudget({ ...newBudget, category: val })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddBudget}>Create Budget</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="grid gap-6">
            {budgets.map((budget) => {
              const percentage = budget.spent / budget.budget
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <budget.icon className="h-4 w-4" style={{ color: budget.color }} />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {budget.name}
                          <Badge
                            variant={getBadgeVariant(percentage) as any}
                            className="text-[10px] px-1 py-0 h-5"
                          >
                            {getStatusText(percentage)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{budget.period}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        ${budget.spent}{' '}
                        <span className="text-muted-foreground font-normal">
                          / ${budget.budget}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'text-xs',
                          percentage >= 1 ? 'text-red-500' : 'text-emerald-500'
                        )}
                      >
                        {percentage >= 1
                          ? `$${(budget.spent - budget.budget).toFixed(0)} over`
                          : `$${(budget.budget - budget.spent).toFixed(0)} left`}
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={percentage * 100}
                    className="h-2"
                    indicatorClassName={getStatusColor(percentage)}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-medium">${entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
