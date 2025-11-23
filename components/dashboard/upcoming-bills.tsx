'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditableNumber } from '@/components/ui/editable-number'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { format } from 'date-fns'
import { BillDialog } from './bill-dialog'
import { RecurringBill } from '@/constants/dashboard'

// Helper function for date calculations
function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export function UpcomingBills() {
  const { bills, updateBill, deleteBill } = useDashboard()
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false)
  const [editingBill, setEditingBill] = useState<RecurringBill | null>(null)

  // Upcoming Bills Logic
  const upcomingBills = useMemo(() => {
    const today = new Date().getDate()
    return [...bills]
      .map((bill) => {
        let dueDate = new Date()
        dueDate.setDate(bill.dueDate)
        // If due date is in the past for this month, show next month
        if (bill.dueDate < today) {
          dueDate = addMonths(dueDate, 1)
        }
        return { ...bill, actualDate: dueDate }
      })
      .sort((a, b) => a.actualDate.getTime() - b.actualDate.getTime())
      .slice(0, 5)
  }, [bills])

  const handleAddBill = () => {
    setEditingBill(null)
    setIsBillDialogOpen(true)
  }

  const handleEditBill = (bill: RecurringBill) => {
    setEditingBill(bill)
    setIsBillDialogOpen(true)
  }

  const handleDeleteBill = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Scheduled Obligations</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddBill}
          className="h-8 w-8 p-0 rounded-full hover:bg-muted"
          title="Add Bill"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBills.length ? (
            upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between gap-3 text-sm group p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{bill.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Due {format(bill.actualDate, 'MMM d')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">
                    $
                    <EditableNumber
                      value={bill.amount}
                      onSave={(value) => updateBill(bill.id, { amount: value })}
                      formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                      min={0}
                    />
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEditBill(bill)}
                      title="Edit Bill"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
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
            <p className="text-sm text-muted-foreground text-center py-4">
              No scheduled obligations.
            </p>
          )}
        </div>
      </CardContent>

      <BillDialog
        open={isBillDialogOpen}
        onOpenChange={setIsBillDialogOpen}
        editingBill={editingBill}
      />
    </Card>
  )
}
