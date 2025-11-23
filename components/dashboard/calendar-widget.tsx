'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, endOfMonth, differenceInCalendarDays } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

export function CalendarWidget() {
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date())
  const [dateData, setDateData] = useState<{ month: string; daysRemaining: number | null }>({
    month: '',
    daysRemaining: null,
  })

  useEffect(() => {
    const today = new Date()
    setDateData({
      month: format(today, 'MMMM yyyy'),
      daysRemaining: differenceInCalendarDays(endOfMonth(today), today),
    })
  }, [])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {dateData.month || <div className="h-8 w-40 bg-muted animate-pulse rounded-md" />}
      </h1>

      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-4 py-2 rounded-full border hover:bg-muted transition-colors hover:text-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {dateData.daysRemaining !== null ? dateData.daysRemaining : '-'}
            </span>
            <span>days left in month</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Calendar</DialogTitle>
            <DialogDescription>View schedule and scheduled obligations.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <CalendarComponent
              mode="single"
              selected={selectedCalendarDate}
              onSelect={setSelectedCalendarDate}
              className="rounded-md border shadow-sm"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
