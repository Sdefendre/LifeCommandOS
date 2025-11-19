import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardProvider } from '@/components/dashboard/dashboard-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex flex-1 flex-col gap-4 p-3 sm:p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
