import { Suspense } from 'react'
import SteveOS from '@/components/SteveOS'
import { getRecentRepos } from '@/lib/github'

async function ReposLoader() {
  let repos = []
  try {
    repos = await getRecentRepos('Sdefendre')
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    // Continue rendering with empty repos array
  }
  return <SteveOS repos={repos} />
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ReposLoader />
    </Suspense>
  )
}
