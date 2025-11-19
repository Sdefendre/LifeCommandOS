import { LucideIcon } from 'lucide-react'
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  DollarSign,
  Briefcase,
  Home,
  Plane,
  Heart,
} from 'lucide-react'

// --- Types ---

export type TransactionType = 'income' | 'expense'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  name: string
  amount: number
  date: string
  category: string
  status: TransactionStatus
  merchant: string
  type: TransactionType
}

export interface BudgetCategory {
  id: string
  name: string
  spent: number
  limit: number
  color: string // Tailwind class or hex
  iconName: string // storing string name to map to icon component
}

export interface SavingsGoal {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  deadline?: string
  color: string
}

export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit'
  balance: number
  institution: string
  lastUpdated: string
}

export interface RecurringBill {
  id: string
  name: string
  amount: number
  dueDate: number // Day of month (1-31)
  category: string
  isAutopay: boolean
}

// --- Mock Data ---

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    name: 'Grocery Run',
    amount: -156.42,
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
    category: 'Food',
    status: 'completed',
    merchant: 'Whole Foods',
    type: 'expense',
  },
  {
    id: '2',
    name: 'Gas Station',
    amount: -45.0,
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    category: 'Transport',
    status: 'completed',
    merchant: 'Shell',
    type: 'expense',
  },
  {
    id: '3',
    name: 'Freelance Payment',
    amount: 1200.0,
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    category: 'Income',
    status: 'completed',
    merchant: 'Client Inc',
    type: 'income',
  },
  {
    id: '4',
    name: 'New Headphones',
    amount: -129.99,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    category: 'Shopping',
    status: 'completed',
    merchant: 'Amazon',
    type: 'expense',
  },
  {
    id: '5',
    name: 'Electric Bill',
    amount: -150.0,
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    category: 'Bills',
    status: 'pending',
    merchant: 'Utility Co',
    type: 'expense',
  },
  {
    id: '6',
    name: 'Salary',
    amount: 3500.0,
    date: new Date(new Date().setDate(1)).toISOString(), // 1st of month
    category: 'Income',
    status: 'completed',
    merchant: 'Employer',
    type: 'income',
  },
  {
    id: '7',
    name: 'Restaurant Dinner',
    amount: -85.5,
    date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    category: 'Food',
    status: 'completed',
    merchant: 'Tasty Bites',
    type: 'expense',
  },
  {
    id: '8',
    name: 'Netflix Subscription',
    amount: -15.99,
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    category: 'Entertainment',
    status: 'completed',
    merchant: 'Netflix',
    type: 'expense',
  },
  // Add past months data for reports
  {
    id: '9',
    name: 'Last Month Rent',
    amount: -1800,
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    category: 'Housing',
    status: 'completed',
    merchant: 'Landlord',
    type: 'expense',
  },
  {
    id: '10',
    name: 'Last Month Salary',
    amount: 3500,
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    category: 'Income',
    status: 'completed',
    merchant: 'Employer',
    type: 'income',
  },
  {
    id: '11',
    name: 'Two Months Ago Salary',
    amount: 3500,
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    category: 'Income',
    status: 'completed',
    merchant: 'Employer',
    type: 'income',
  },
]

export const INITIAL_BUDGETS: BudgetCategory[] = [
  {
    id: '1',
    name: 'Food & Dining',
    spent: 450,
    limit: 600,
    color: 'bg-orange-500',
    iconName: 'Utensils',
  },
  {
    id: '2',
    name: 'Transportation',
    spent: 320,
    limit: 400,
    color: 'bg-blue-500',
    iconName: 'Car',
  },
  {
    id: '3',
    name: 'Shopping',
    spent: 280,
    limit: 300,
    color: 'bg-purple-500',
    iconName: 'ShoppingBag',
  },
  {
    id: '4',
    name: 'Bills & Utilities',
    spent: 400,
    limit: 500,
    color: 'bg-yellow-500',
    iconName: 'Zap',
  },
  {
    id: '5',
    name: 'Entertainment',
    spent: 120,
    limit: 200,
    color: 'bg-pink-500',
    iconName: 'Film',
  },
]

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    currentAmount: 8400,
    targetAmount: 10000,
    deadline: '2024-12-31',
    color: 'bg-emerald-500',
  },
  {
    id: '2',
    name: 'New Laptop',
    currentAmount: 1200,
    targetAmount: 2500,
    deadline: '2024-11-15',
    color: 'bg-indigo-500',
  },
  {
    id: '3',
    name: 'Vacation',
    currentAmount: 500,
    targetAmount: 3000,
    deadline: '2025-06-01',
    color: 'bg-cyan-500',
  },
]

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Main Checking',
    type: 'checking',
    balance: 5240.5,
    institution: 'Chase',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'High Yield Savings',
    type: 'savings',
    balance: 12500.0,
    institution: 'Ally',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sapphire Preferred',
    type: 'credit',
    balance: -850.2,
    institution: 'Chase',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Investment Portfolio',
    type: 'investment',
    balance: 45200.0,
    institution: 'Vanguard',
    lastUpdated: new Date().toISOString(),
  },
]

export const INITIAL_BILLS: RecurringBill[] = [
  {
    id: '1',
    name: 'Rent',
    amount: 1800,
    dueDate: 1,
    category: 'Housing',
    isAutopay: false,
  },
  {
    id: '2',
    name: 'Internet',
    amount: 85,
    dueDate: 15,
    category: 'Bills',
    isAutopay: true,
  },
  {
    id: '3',
    name: 'Spotify',
    amount: 11.99,
    dueDate: 20,
    category: 'Entertainment',
    isAutopay: true,
  },
]

export const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-500',
  Transport: 'bg-blue-500',
  Shopping: 'bg-purple-500',
  Bills: 'bg-yellow-500',
  Housing: 'bg-red-500',
  Entertainment: 'bg-pink-500',
  Health: 'bg-green-500',
  Travel: 'bg-cyan-500',
  Income: 'bg-emerald-500',
  Other: 'bg-gray-500',
}
