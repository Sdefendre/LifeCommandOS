'use client'

import { useState, useMemo } from 'react'
import {
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { differenceInDays } from 'date-fns'

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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DashboardCardSkeleton, ChartSkeleton } from '@/components/dashboard-card-skeleton'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { SavingsGoal } from '@/constants/dashboard'
import { EditableNumber } from '@/components/ui/editable-number'

export default function SavingsPage() {
  const {
    savingsGoals: goals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    isLoading,
  } = useDashboard()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isContributeOpen, setIsContributeOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')

  // New Goal Form State
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    category: 'lifestyle',
    color: '#64748b',
  })

  const stats = useMemo(() => {
    const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0)
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0)
    const achieved = goals.filter((g) => g.currentAmount >= g.targetAmount).length
    // monthlyContribution is not in SavingsGoal type in constants, assume 0 or add field
    // I'll ignore monthlyContribution stat for now or infer it if I add it to type
    // For now, let's just show total saved
    return { totalSaved, totalTarget, achieved }
  }, [goals])

  // Mock trend data based on total saved (could be dynamic but keeping it simple)
  const savingsGrowthData = useMemo(() => {
    // Just a flat line + growth simulation for visual
    const base = stats.totalSaved * 0.8
    return [
      { month: 'Jan', total: base },
      { month: 'Feb', total: base * 1.05 },
      { month: 'Mar', total: base * 1.1 },
      { month: 'Apr', total: base * 1.15 },
      { month: 'May', total: base * 1.2 },
      { month: 'Jun', total: stats.totalSaved },
    ]
  }, [stats.totalSaved])

  const handleAddGoal = () => {
    addSavingsGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.target),
      currentAmount: 0,
      deadline: newGoal.deadline,
      color: getCategoryColor(newGoal.category),
    })
    setIsAddDialogOpen(false)
    setNewGoal({
      name: '',
      target: '',
      deadline: '',
      category: 'lifestyle',
      color: '#64748b',
    })
  }

  const handleContribute = () => {
    if (!selectedGoal || !contributionAmount) return

    const amount = parseFloat(contributionAmount)
    updateSavingsGoal(selectedGoal.id, { currentAmount: selectedGoal.currentAmount + amount })

    setIsContributeOpen(false)
    setSelectedGoal(null)
    setContributionAmount('')
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'essential':
        return 'bg-red-500'
      case 'major':
        return 'bg-emerald-500'
      case 'lifestyle':
        return 'bg-teal-500'
      case 'education':
        return 'bg-cyan-500'
      default:
        return 'bg-gray-500'
    }
  }

  function getDaysRemaining(deadline?: string) {
    if (!deadline) return 0
    const days = differenceInDays(new Date(deadline), new Date())
    return days > 0 ? days : 0
  }

  function getStatusText(current: number, target: number) {
    if (current >= target) return 'Completed'
    if (current / target >= 0.75) return 'Almost There'
    if (current > 0) return 'In Progress'
    return 'Started'
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
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <PiggyBank className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={stats.totalSaved}
                onSave={(value) => {
                  const currentTotal = goals.reduce((sum, g) => sum + g.currentAmount, 0)
                  const difference = value - currentTotal
                  if (goals.length > 0) {
                    const perGoal = difference / goals.length
                    goals.forEach((goal) => {
                      updateSavingsGoal(goal.id, {
                        currentAmount: Math.max(0, goal.currentAmount + perGoal),
                      })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500">+4.5%</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goal Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              <EditableNumber
                value={stats.totalTarget}
                onSave={(value) => {
                  const currentTotal = goals.reduce((sum, g) => sum + g.targetAmount, 0)
                  const difference = value - currentTotal
                  if (goals.length > 0) {
                    const perGoal = difference / goals.length
                    goals.forEach((goal) => {
                      updateSavingsGoal(goal.id, {
                        targetAmount: Math.max(0, goal.targetAmount + perGoal),
                      })
                    })
                  }
                }}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
              />
            </div>
            <Progress
              value={stats.totalTarget > 0 ? (stats.totalSaved / stats.totalTarget) * 100 : 0}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              <EditableNumber
                value={stats.achieved}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground">Completed goals</p>
          </CardContent>
        </Card>
        <Card>
          {/* Placeholder since I removed monthlyContribution from type */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <EditableNumber
                value={goals.length - stats.achieved}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Savings Growth</CardTitle>
            <CardDescription>Total savings balance over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={savingsGrowthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  dataKey="total"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Tips</CardTitle>
            <CardDescription>Recommendations to reach your goals faster.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                  Increase Contributions
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Raising your monthly contribution by $50 could help you reach your goals faster.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                  On Track
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You&apos;re on track to hit your Emergency Fund goal. Keep it up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Your Goals</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g. New Car"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="target">Target Amount</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(val) => setNewGoal({ ...newGoal, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essential">Essential</SelectItem>
                    <SelectItem value="major">Major Purchase</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const percentage = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0

          return (
            <Card key={goal.id} className="relative overflow-hidden">
              <div
                className={cn(
                  'absolute top-0 left-0 w-1 h-full',
                  goal.color?.replace('bg-', 'bg-') || 'bg-gray-500'
                )}
              />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-full bg-muted')}>
                    <Target className={cn('h-4 w-4', 'text-foreground')} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{goal.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {getStatusText(goal.currentAmount, goal.targetAmount)}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => deleteSavingsGoal(goal.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-end justify-between mb-2">
                  <div className="text-2xl font-bold">
                    $
                    <EditableNumber
                      value={goal.currentAmount}
                      onSave={(value) => updateSavingsGoal(goal.id, { currentAmount: value })}
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      min={0}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    of $
                    <EditableNumber
                      value={goal.targetAmount}
                      onSave={(value) => updateSavingsGoal(goal.id, { targetAmount: value })}
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      min={0}
                    />
                  </div>
                </div>
                <Progress value={percentage * 100} className="h-2" />
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getDaysRemaining(goal.deadline)} days left
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedGoal(goal)
                    setIsContributeOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to {selectedGoal?.name}</DialogTitle>
            <DialogDescription>
              Current Balance: ${selectedGoal?.currentAmount.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="100"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleContribute}>Contribute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
