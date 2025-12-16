'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { RecurringBill } from '@/constants/dashboard'

interface BillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingBill: RecurringBill | null
}

export function BillDialog({ open, onOpenChange, editingBill }: BillDialogProps) {
  const { addBill, updateBill } = useDashboard()
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Bills',
    isAutopay: false,
  })

  useEffect(() => {
    if (editingBill) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: editingBill.name,
        amount: editingBill.amount.toString(),
        dueDate: editingBill.dueDate.toString(),
        category: editingBill.category,
        isAutopay: editingBill.isAutopay,
      })
    } else {
      setFormData({
        name: '',
        amount: '',
        dueDate: '',
        category: 'Bills',
        isAutopay: false,
      })
    }
  }, [editingBill, open])

  const handleSave = () => {
    const amount = parseFloat(formData.amount)
    const dueDate = parseInt(formData.dueDate)

    if (!formData.name || isNaN(amount) || isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
      alert('Please fill in all fields correctly. Due date must be between 1 and 31.')
      return
    }

    if (editingBill) {
      updateBill(editingBill.id, {
        name: formData.name,
        amount: amount,
        dueDate: dueDate,
        category: formData.category,
        isAutopay: formData.isAutopay,
      })
    } else {
      addBill({
        name: formData.name,
        amount: amount,
        dueDate: dueDate,
        category: formData.category,
        isAutopay: formData.isAutopay,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bill-amount">Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bill-due-date">Due Date (Day)</Label>
              <Input
                id="bill-due-date"
                type="number"
                min="1"
                max="31"
                placeholder="1-31"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bill-category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
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
              checked={formData.isAutopay}
              onChange={(e) => setFormData({ ...formData, isAutopay: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="bill-autopay" className="cursor-pointer font-normal">
              Autopay enabled
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{editingBill ? 'Update Bill' : 'Add Bill'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
