'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Wifi,
  Smartphone,
  Film,
  Heart,
  Plane,
  Briefcase,
  HelpCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DashboardCardSkeleton } from '@/components/dashboard-card-skeleton'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { CATEGORY_COLORS } from '@/constants/dashboard'
import { EditableNumber } from '@/components/ui/editable-number'

export default function BudgetsPage() {
  const { budgets, addBudget, updateBudget, isLoading } = useDashboard()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Get current month index (0-11) for default tab
  const currentDate = new Date()
  const currentMonthIndex = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // State for selected month (0-11, where 0 = January)
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex.toString())

  // New Budget Form State
  const [newBudget, setNewBudget] = useState({
    name: '',
    limit: '',
    category: 'Food',
  })

  // Generate month names for tabs
  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1)
      return date.toLocaleString('default', { month: 'long' })
    })
  }, [currentYear])

  const stats = useMemo(() => {
    const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0)
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
    const atRisk = budgets.filter((b) => b.spent / b.limit >= 0.9).length
    const onTrack = budgets.filter((b) => b.spent / b.limit < 0.9).length

    return { totalBudget, totalSpent, atRisk, onTrack }
  }, [budgets])

  const pieData = useMemo(() => {
    return budgets.map((b) => ({
      name: b.name,
      value: b.spent,
      color: CATEGORY_COLORS[b.name] || CATEGORY_COLORS[b.iconName] || '#64748b',
    }))
  }, [budgets])

  const handleAddBudget = () => {
    addBudget({
      name: newBudget.name || newBudget.category,
      spent: 0,
      limit: parseFloat(newBudget.limit),
      iconName: newBudget.category, // Mapping category to icon name
      color: CATEGORY_COLORS[newBudget.category] || '#64748b',
    })
    setIsAddDialogOpen(false)
    setNewBudget({ name: '', limit: '', category: 'Food' })
  }

  function getCategoryIcon(iconName: string) {
    switch (iconName) {
      case 'Food':
        return Utensils
      case 'Utensils':
        return Utensils
      case 'Transport':
        return Car
      case 'Car':
        return Car
      case 'Shopping':
        return ShoppingBag
      case 'ShoppingBag':
        return ShoppingBag
      case 'Utilities':
        return Zap
      case 'Zap':
        return Zap
      case 'Internet':
        return Wifi
      case 'Entertainment':
        return Film
      case 'Film':
        return Film
      case 'Health':
        return Heart
      case 'Travel':
        return Plane
      case 'Work':
        return Briefcase
      default:
        return HelpCircle
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
    if (percentage >= 0.9) return 'secondary'
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

  // Get display year
  const displayYear = currentYear

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <Tabs value={selectedMonth} onValueChange={setSelectedMonth} className="w-full">
          <TabsList className="h-auto p-1 bg-transparent flex-wrap justify-start">
            {monthNames.map((monthName, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="text-xl sm:text-3xl font-serif font-bold tracking-tight data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground/60 px-3 py-2 sm:px-4 sm:py-3 hover:text-foreground transition-colors"
              >
                {monthName} {displayYear}
              </TabsTrigger>
            ))}
          </TabsList>
          {monthNames.map((_, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-0">
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Monthly Budget</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        <EditableNumber
                          value={stats.totalBudget}
                          onSave={(value) => {
                            const currentTotal = budgets.reduce((sum, b) => sum + b.limit, 0)
                            const difference = value - currentTotal
                            if (budgets.length > 0) {
                              const perBudget = difference / budgets.length
                              budgets.forEach((b) => {
                                updateBudget(b.id, { limit: Math.max(0, b.limit + perBudget) })
                              })
                            }
                          }}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          min={0}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        <EditableNumber
                          value={stats.totalSpent}
                          onSave={(value) => {
                            const currentTotal = budgets.reduce((sum, b) => sum + b.spent, 0)
                            const difference = value - currentTotal
                            if (budgets.length > 0) {
                              const perBudget = difference / budgets.length
                              budgets.forEach((b) => {
                                updateBudget(b.id, { spent: Math.max(0, b.spent + perBudget) })
                              })
                            }
                          }}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          min={0}
                        />
                      </div>
                      <Progress
                        value={
                          stats.totalBudget > 0 ? (stats.totalSpent / stats.totalBudget) * 100 : 0
                        }
                        className="mt-2 h-2"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Budgets At Risk</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-500">
                        <EditableNumber
                          value={stats.atRisk}
                          onSave={() => {}}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          min={0}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Categories exceeding 90%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">On Track</CardTitle>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-500">
                        <EditableNumber
                          value={stats.onTrack}
                          onSave={() => {}}
                          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                          min={0}
                        />
                      </div>
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
                                onChange={(e) =>
                                  setNewBudget({ ...newBudget, name: e.target.value })
                                }
                                placeholder="e.g. Groceries"
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
                                value={newBudget.limit}
                                onChange={(e) =>
                                  setNewBudget({ ...newBudget, limit: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="category" className="text-right">
                                Category Type
                              </Label>
                              <Select
                                value={newBudget.category}
                                onValueChange={(val) =>
                                  setNewBudget({ ...newBudget, category: val })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Food">Food</SelectItem>
                                  <SelectItem value="Transport">Transport</SelectItem>
                                  <SelectItem value="Shopping">Shopping</SelectItem>
                                  <SelectItem value="Utilities">Utilities</SelectItem>
                                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                                  <SelectItem value="Health">Health</SelectItem>
                                  <SelectItem value="Travel">Travel</SelectItem>
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
                        const percentage = budget.limit > 0 ? budget.spent / budget.limit : 1
                        const Icon = getCategoryIcon(budget.iconName)

                        return (
                          <div key={budget.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn('p-2 rounded-full bg-muted text-foreground')}>
                                  <Icon className="h-4 w-4" />
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
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">
                                  $
                                  <EditableNumber
                                    value={budget.spent}
                                    onSave={(value) => updateBudget(budget.id, { spent: value })}
                                    formatOptions={{
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }}
                                    min={0}
                                  />{' '}
                                  <span className="text-muted-foreground font-normal">
                                    / $
                                    <EditableNumber
                                      value={budget.limit}
                                      onSave={(value) => updateBudget(budget.id, { limit: value })}
                                      formatOptions={{
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }}
                                      min={0}
                                    />
                                  </span>
                                </div>
                                <div
                                  className={cn(
                                    'text-xs',
                                    percentage >= 1 ? 'text-red-500' : 'text-emerald-500'
                                  )}
                                >
                                  {percentage >= 1
                                    ? `$${(budget.spent - budget.limit).toFixed(0)} over`
                                    : `$${(budget.limit - budget.spent).toFixed(0)} left`}
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
                          <div
                            key={entry.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{entry.name}</span>
                            </div>
                            <span className="font-medium">
                              $
                              <EditableNumber
                                value={entry.value}
                                onSave={(value) => {
                                  const budget = budgets.find((b) => b.name === entry.name)
                                  if (budget) {
                                    updateBudget(budget.id, { spent: value })
                                  }
                                }}
                                formatOptions={{
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }}
                                min={0}
                              />
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
