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
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined)
  const [dateData, setDateData] = useState<{ month: string; daysRemaining: number | null }>({
    month: '',
    daysRemaining: null,
  })

  useEffect(() => {
    const today = new Date()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCalendarDate(today)
    setDateData({
      month: format(today, 'MMMM yyyy'),
      daysRemaining: differenceInCalendarDays(endOfMonth(today), today),
    })
  }, [])

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 text-center sm:text-left">
      <div className="text-2xl sm:text-3xl font-bold tracking-tight">
        {dateData.month || <div className="h-8 w-40 bg-muted animate-pulse rounded-md" />}
      </div>

      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/40 px-3 sm:px-4 py-2 rounded-full border hover:bg-muted transition-colors hover:text-foreground">
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="font-medium text-foreground">
              {dateData.daysRemaining !== null ? dateData.daysRemaining : '-'}
            </span>
            <span className="hidden sm:inline">days left in month</span>
            <span className="sm:hidden">days left</span>
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
