import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, moduleId, completed, progressPercentage } = body

    if (!userId || !courseId || !moduleId) {
      return NextResponse.json(
        { error: 'userId, courseId, and moduleId are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })
    }

    // Upsert course progress
    const { error } = await supabase.from('course_progress').upsert(
      {
        user_id: userId,
        course_id: courseId,
        module_id: moduleId,
        completed: completed || false,
        progress_percentage: progressPercentage || (completed ? 100 : 0),
        last_accessed_at: new Date().toISOString(),
        completed_at: completed ? new Date().toISOString() : null,
      },
      {
        onConflict: 'user_id,course_id,module_id',
      }
    )

    if (error) {
      console.error('Error saving course progress:', error)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Course progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId') || '0-100-rating-course'

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error fetching course progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ progress: data || [] })
  } catch (error) {
    console.error('Course progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
