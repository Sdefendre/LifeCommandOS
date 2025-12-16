'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  Transaction,
  BudgetCategory,
  SavingsGoal,
  Account,
  RecurringBill,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_ACCOUNTS,
  INITIAL_BILLS,
} from '@/constants/dashboard'

interface DashboardContextType {
  transactions: Transaction[]
  budgets: BudgetCategory[]
  savingsGoals: SavingsGoal[]
  accounts: Account[]
  bills: RecurringBill[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addBudget: (budget: Omit<BudgetCategory, 'id'>) => void
  updateBudget: (id: string, updates: Partial<BudgetCategory>) => void
  deleteBudget: (id: string) => void
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void
  deleteSavingsGoal: (id: string) => void
  updateAccount: (id: string, updates: Partial<Account>) => void
  addBill: (bill: Omit<RecurringBill, 'id'>) => void
  updateBill: (id: string, updates: Partial<RecurringBill>) => void
  deleteBill: (id: string) => void
  isLoading: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<BudgetCategory[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [bills, setBills] = useState<RecurringBill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with mock data (simulating fetch)
  useEffect(() => {
    // Try to load from local storage first to persist across refreshes during demo
    const loadData = <T,>(key: string, initial: T): T => {
      if (typeof window === 'undefined') return initial
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(loadData('lifecmd_transactions', INITIAL_TRANSACTIONS))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBudgets(loadData('lifecmd_budgets', INITIAL_BUDGETS))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavingsGoals(loadData('lifecmd_savings', INITIAL_SAVINGS_GOALS))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccounts(loadData('lifecmd_accounts', INITIAL_ACCOUNTS))
    setBills(loadData('lifecmd_bills', INITIAL_BILLS))
    setIsLoading(false)
  }, [])

  // Persist changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('lifecmd_transactions', JSON.stringify(transactions))
      localStorage.setItem('lifecmd_budgets', JSON.stringify(budgets))
      localStorage.setItem('lifecmd_savings', JSON.stringify(savingsGoals))
      localStorage.setItem('lifecmd_accounts', JSON.stringify(accounts))
      localStorage.setItem('lifecmd_bills', JSON.stringify(bills))
    }
  }, [transactions, budgets, savingsGoals, accounts, bills, isLoading])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    }
    setTransactions((prev) => [newTransaction, ...prev])

    // Update account balance if relevant (simplified)
    // In a real app, we'd match account IDs.
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.type === 'checking') {
          // Default to checking for now
          return { ...acc, balance: acc.balance + newTransaction.amount }
        }
        return acc
      })
    )
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const addBudget = (budget: Omit<BudgetCategory, 'id'>) => {
    const newBudget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
    }
    setBudgets((prev) => [...prev, newBudget])
  }

  const updateBudget = (id: string, updates: Partial<BudgetCategory>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
    }
    setSavingsGoals((prev) => [...prev, newGoal])
  }

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((s) => s.id !== id))
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const addBill = (bill: Omit<RecurringBill, 'id'>) => {
    const newBill = {
      ...bill,
      id: Math.random().toString(36).substr(2, 9),
    }
    setBills((prev) => [...prev, newBill])
  }

  const updateBill = (id: string, updates: Partial<RecurringBill>) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <DashboardContext.Provider
      value={{
        transactions,
        budgets,
        savingsGoals,
        accounts,
        bills,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        updateAccount,
        addBill,
        updateBill,
        deleteBill,
        isLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
