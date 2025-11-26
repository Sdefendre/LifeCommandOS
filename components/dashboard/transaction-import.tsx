'use client'

import { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditableNumber } from '@/components/ui/editable-number'
import { useDashboard } from '@/components/dashboard/dashboard-context'
import { format } from 'date-fns'

export function TransactionImport() {
  const { addTransaction } = useDashboard()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const [reviewTransactions, setReviewTransactions] = useState<any[]>([])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTransactions: any[] = []

        results.data.forEach((row: any) => {
          const amount = parseFloat(row.amount || row.Amount || row.Debit || row.Credit || '0')
          const description =
            row.description || row.Description || row.Memo || 'Unknown Transaction'
          const date = row.date || row.Date || new Date().toISOString()
          const type = amount > 0 ? 'income' : 'expense'

          if (!isNaN(amount) && amount !== 0) {
            parsedTransactions.push({
              name: description,
              category: 'Uncategorized',
              amount: amount,
              date: date,
              type: type,
              merchant: description,
            })
          }
        })

        if (parsedTransactions.length > 0) {
          setReviewTransactions(parsedTransactions.slice(0, 10)) // Preview first 10
          setIsReviewDialogOpen(true)
        }
      },
    })
    event.target.value = ''
  }

  const handleConfirmImport = () => {
    reviewTransactions.forEach((t) => {
      addTransaction(t)
    })
    setIsReviewDialogOpen(false)
    setReviewTransactions([])
  }

  const handleCancelImport = () => {
    setIsReviewDialogOpen(false)
    setReviewTransactions([])
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileUpload}
      />
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl z-40 animate-in fade-in zoom-in duration-200"
        onClick={handleUploadClick}
        title="Upload Bank Statement (CSV)"
      >
        <Upload className="h-6 w-6" />
      </Button>

      <Dialog
        open={isReviewDialogOpen}
        onOpenChange={(open) => (open ? setIsReviewDialogOpen(true) : handleCancelImport())}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Review Imported Transactions
            </DialogTitle>
            <DialogDescription>
              We found {reviewTransactions.length} transactions. Please review them before
              importing.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-[50vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewTransactions.map((t, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className={t.amount > 0 ? 'text-[#657832]' : ''}>
                          $
                          <EditableNumber
                            value={Math.abs(t.amount)}
                            onSave={(value) => {
                              const updatedTransactions = [...reviewTransactions]
                              updatedTransactions[idx] = {
                                ...updatedTransactions[idx],
                                amount: t.amount >= 0 ? value : -value,
                              }
                              setReviewTransactions(updatedTransactions)
                            }}
                            formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                            min={0}
                          />
                        </div>
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
            <Button onClick={handleConfirmImport}>Import Transactions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
