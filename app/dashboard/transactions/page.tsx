'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit2,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Briefcase,
  Film,
  Heart,
  Plane,
  HelpCircle,
} from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DashboardCardSkeleton } from '@/components/dashboard-card-skeleton'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { TransactionType } from '@/constants/dashboard'
import { EditableNumber } from '@/components/ui/editable-number'

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, isLoading } =
    useDashboard()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, _setStatusFilter] = useState('all')
  const [sortOrder, _setSortOrder] = useState('desc')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // New Transaction Form State
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    category: 'Food',
    date: format(new Date(), 'yyyy-MM-dd'),
    merchant: '',
    type: 'expense' as TransactionType,
  })

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.merchant.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory =
          categoryFilter === 'all' || t.category.toLowerCase() === categoryFilter.toLowerCase()
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter
        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
  }, [transactions, searchQuery, categoryFilter, statusFilter, sortOrder])

  const totals = useMemo(() => {
    const income = transactions.reduce((acc, t) => (t.amount > 0 ? acc + t.amount : acc), 0)
    const expenses = transactions.reduce((acc, t) => (t.amount < 0 ? acc + t.amount : acc), 0)
    return { income, expenses, net: income + expenses }
  }, [transactions])

  const handleAddTransaction = () => {
    const amountValue = parseFloat(newTransaction.amount)
    // Determine sign based on type
    const finalAmount =
      newTransaction.type === 'income' ? Math.abs(amountValue) : -Math.abs(amountValue)

    addTransaction({
      name: newTransaction.name || 'New Transaction',
      amount: finalAmount,
      date: new Date(newTransaction.date).toISOString(),
      category: newTransaction.category,
      status: 'completed',
      merchant: newTransaction.merchant || newTransaction.name || 'Unknown',
      type: newTransaction.type,
    })

    setIsAddDialogOpen(false)
    setNewTransaction({
      name: '',
      amount: '',
      category: 'Food',
      date: format(new Date(), 'yyyy-MM-dd'),
      merchant: '',
      type: 'expense',
    })
  }

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

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
        <DashboardCardSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              +$
              <EditableNumber
                value={totals.income}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                min={0}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              $
              <EditableNumber
                value={Math.abs(totals.expenses)}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                min={0}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                totals.net >= 0 ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {totals.net >= 0 ? '+' : ''}$
              <EditableNumber
                value={Math.abs(totals.net)}
                onSave={() => {}}
                formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Transactions</CardTitle>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Transaction</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select
                          value={newTransaction.type}
                          onValueChange={(val: TransactionType) =>
                            setNewTransaction({ ...newTransaction, type: val })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          value={newTransaction.name}
                          onChange={(e) =>
                            setNewTransaction({ ...newTransaction, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="merchant" className="text-right">
                          Merchant
                        </Label>
                        <Input
                          id="merchant"
                          className="col-span-3"
                          value={newTransaction.merchant}
                          onChange={(e) =>
                            setNewTransaction({ ...newTransaction, merchant: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          className="col-span-3"
                          value={newTransaction.amount}
                          onChange={(e) =>
                            setNewTransaction({ ...newTransaction, amount: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Select
                          value={newTransaction.category}
                          onValueChange={(val) =>
                            setNewTransaction({ ...newTransaction, category: val })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Bills">Bills</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          className="col-span-3"
                          value={newTransaction.date}
                          onChange={(e) =>
                            setNewTransaction({ ...newTransaction, date: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTransaction}>Save Transaction</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const Icon = getCategoryIcon(transaction.category)
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{format(new Date(transaction.date), 'MMM d')}</span>
                            <span className="text-xs text-muted-foreground md:hidden">
                              {format(new Date(transaction.date), 'yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'p-2 rounded-full hidden md:block',
                                transaction.amount > 0
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-primary/10 text-primary'
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{transaction.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {transaction.merchant}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-bold',
                            transaction.amount > 0 ? 'text-emerald-500' : ''
                          )}
                        >
                          {transaction.amount > 0 ? '+' : ''}$
                          <EditableNumber
                            value={Math.abs(transaction.amount)}
                            onSave={(value) => {
                              const finalAmount = transaction.amount > 0 ? value : -value
                              updateTransaction(transaction.id, { amount: finalAmount })
                            }}
                            formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            min={0}
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => deleteTransaction(transaction.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
