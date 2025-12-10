import { redirect } from 'next/navigation'
import { MainHeader } from '@/components/MainHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { SubtleThreeBackgroundWrapper } from '@/components/SubtleThreeBackgroundWrapper'
import { CoursePlayer } from '@/components/CoursePlayer'
import { courseModules } from '@/components/CourseContent'
import { checkCourseAccess } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Course Content - Command',
  description: 'Access your premium course content',
}

interface CourseContentPageProps {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function CourseContentPage({
  searchParams: _searchParams,
}: CourseContentPageProps) {
  // Get authenticated user from Supabase
  const supabase = await createClient()
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  // If user is not authenticated, redirect to login
  if (!user) {
    redirect('/login?redirect=/course/content')
  }

  const userId = user.id

  // Check if user has course access
  const hasAccess = await checkCourseAccess(userId, '0-100-rating-course')

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative">
        <SubtleThreeBackgroundWrapper />
        <MainHeader />

        <main className="flex-1 container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-4xl">
          <Card className="glass text-center">
            <CardHeader>
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-2xl">Course Access Required</CardTitle>
              <CardDescription>
                You need to purchase the course to access this content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link href="/course">Purchase Course</Link>
              </Button>
            </CardContent>
          </Card>
        </main>

        <LandingFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SubtleThreeBackgroundWrapper />
      <MainHeader />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            0-100% Service-Connected Disability Rating Course
          </h1>
          <p className="text-muted-foreground">
            Complete the modules below to master the strategy for maximizing your benefits.
          </p>
        </div>

        <CoursePlayer modules={courseModules} courseId="0-100-rating-course" userId={userId} />
      </main>

      <LandingFooter />
    </div>
  )
}
