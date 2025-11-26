import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'
import { DashboardThreeBackgroundWrapper } from '@/components/DashboardThreeBackgroundWrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BattleStation',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
        <DashboardThreeBackgroundWrapper />
        <DashboardSidebar />
        <div className="flex flex-col min-w-0 relative z-10 w-full max-w-full overflow-x-hidden">
          <DashboardHeader />
          <main className="flex flex-1 flex-col gap-4 p-3 sm:p-4 lg:gap-6 lg:p-6 overflow-x-hidden w-full max-w-full">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
