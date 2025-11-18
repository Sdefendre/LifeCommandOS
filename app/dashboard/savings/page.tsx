'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Plane,
  Home,
  GraduationCap,
  Car,
  Smartphone,
  Wallet,
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
import { differenceInDays, addMonths, format } from 'date-fns'

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
import { DashboardCardSkeleton, ChartSkeleton } from '@/components/dashboard-card-skeleton'
import { cn } from '@/lib/utils'

// Types
type Goal = {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  category: string
  icon: any
  color: string
  monthlyContribution: number
}

// Mock Data
const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 15000,
    current: 12450,
    deadline: '2024-12-31',
    category: 'essential',
    icon: Target,
    color: '#ef4444', // red-500
    monthlyContribution: 500,
  },
  {
    id: '2',
    name: 'Japan Trip',
    target: 5000,
    current: 2100,
    deadline: '2025-05-15',
    category: 'lifestyle',
    icon: Plane,
    color: '#3b82f6', // blue-500
    monthlyContribution: 300,
  },
  {
    id: '3',
    name: 'New Laptop',
    target: 2500,
    current: 1800,
    deadline: '2024-08-30',
    category: 'lifestyle',
    icon: Smartphone,
    color: '#a855f7', // purple-500
    monthlyContribution: 200,
  },
  {
    id: '4',
    name: 'House Downpayment',
    target: 50000,
    current: 8500,
    deadline: '2027-01-01',
    category: 'major',
    icon: Home,
    color: '#10b981', // emerald-500
    monthlyContribution: 1000,
  },
]

const savingsGrowthData = [
  { month: 'Jan', total: 21000 },
  { month: 'Feb', total: 22500 },
  { month: 'Mar', total: 23200 },
  { month: 'Apr', total: 24000 },
  { month: 'May', total: 24850 },
  { month: 'Jun', total: 25850 },
]

export default function SavingsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isContributeOpen, setIsContributeOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')

  // New Goal Form State
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    category: 'lifestyle',
    monthlyContribution: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const totalSaved = goals.reduce((acc, g) => acc + g.current, 0)
    const totalTarget = goals.reduce((acc, g) => acc + g.target, 0)
    const achieved = goals.filter((g) => g.current >= g.target).length
    const monthlyContribution = goals.reduce((acc, g) => acc + g.monthlyContribution, 0)

    return { totalSaved, totalTarget, achieved, monthlyContribution }
  }, [goals])

  const handleAddGoal = () => {
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: 0,
      deadline: newGoal.deadline,
      category: newGoal.category,
      monthlyContribution: parseFloat(newGoal.monthlyContribution),
      icon: getCategoryIcon(newGoal.category),
      color: '#64748b',
    }
    setGoals([...goals, goal])
    setIsAddDialogOpen(false)
    setNewGoal({
      name: '',
      target: '',
      deadline: '',
      category: 'lifestyle',
      monthlyContribution: '',
    })
  }

  const handleContribute = () => {
    if (!selectedGoal || !contributionAmount) return

    const amount = parseFloat(contributionAmount)
    setGoals(
      goals.map((g) => (g.id === selectedGoal.id ? { ...g, current: g.current + amount } : g))
    )
    setIsContributeOpen(false)
    setSelectedGoal(null)
    setContributionAmount('')
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case 'essential':
        return Target
      case 'major':
        return Home
      case 'lifestyle':
        return Plane
      case 'education':
        return GraduationCap
      default:
        return Wallet
    }
  }

  function getDaysRemaining(deadline: string) {
    const days = differenceInDays(new Date(deadline), new Date())
    return days > 0 ? days : 0
  }

  function getStatusText(current: number, target: number) {
    if (current >= target) return 'Completed'
    if (current / target >= 0.75) return 'Almost There'
    if (current > 0) return 'In Progress'
    return 'Started'
  }

  function getStatusColor(current: number, target: number) {
    if (current >= target) return 'bg-emerald-500 text-emerald-500'
    if (current / target >= 0.75) return 'bg-blue-500 text-blue-500'
    return 'bg-primary text-primary'
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
            <div className="text-2xl font-bold">${stats.totalSaved.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">${stats.totalTarget.toLocaleString()}</div>
            <Progress value={(stats.totalSaved / stats.totalTarget) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.achieved}</div>
            <p className="text-xs text-muted-foreground">Completed goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contribution</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyContribution.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Scheduled savings</p>
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
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                  Increase Contributions
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Raising your monthly contribution by $50 could help you reach your Japan Trip goal
                  2 months early.
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
                  You're on track to hit your Emergency Fund goal by December. Keep it up!
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
                  <Label htmlFor="contribution">Monthly Contribution</Label>
                  <Input
                    id="contribution"
                    type="number"
                    value={newGoal.monthlyContribution}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, monthlyContribution: e.target.value })
                    }
                    placeholder="200"
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
            <DialogFooter>
              <Button onClick={handleAddGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const percentage = goal.current / goal.target
          const statusColor = getStatusColor(goal.current, goal.target)

          return (
            <Card key={goal.id} className="relative overflow-hidden">
              <div className={cn('absolute top-0 left-0 w-1 h-full', statusColor.split(' ')[0])} />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-full bg-muted')}>
                    <goal.icon className={cn('h-4 w-4', statusColor.split(' ')[1])} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{goal.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {getStatusText(goal.current, goal.target)}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-end justify-between mb-2">
                  <div className="text-2xl font-bold">${goal.current.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    of ${goal.target.toLocaleString()}
                  </div>
                </div>
                <Progress value={percentage * 100} className="h-2" />
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getDaysRemaining(goal.deadline)} days left
                  </div>
                  <div>${goal.monthlyContribution}/mo</div>
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
              Current Balance: ${selectedGoal?.current.toLocaleString()}
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
