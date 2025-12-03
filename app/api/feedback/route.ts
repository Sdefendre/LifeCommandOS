import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, message, rating, email, path, userAgent } = body

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Validate type if provided
    const validTypes = ['general', 'bug', 'feature', 'content']
    const feedbackType = type && validTypes.includes(type) ? type : 'general'

    // Validate rating if provided (should be 1-5)
    let validRating: number | null = null
    if (rating !== null && rating !== undefined) {
      const numRating = Number(rating)
      if (numRating >= 1 && numRating <= 5) {
        validRating = Math.round(numRating)
      }
    }

    // Validate email if provided
    let validEmail: string | null = null
    if (email && typeof email === 'string' && email.includes('@')) {
      validEmail = email.trim()
    }

    // Get Supabase client (will use service role on server-side)
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    // Insert feedback into database
    const { data, error } = await supabase
      .from('site_feedback')
      .insert({
        type: feedbackType,
        message: message.trim(),
        rating: validRating,
        email: validEmail,
        path: path || '/',
        user_agent: userAgent || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Feedback submitted successfully',
        id: data.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again later.' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve feedback (admin/service role only)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    const searchParams = request.nextUrl.searchParams

    // Query parameters for filtering
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const minRating = searchParams.get('minRating')

    // Build query
    let query = supabase
      .from('site_feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('type', type)
    }

    if (minRating) {
      query = query.gte('rating', parseInt(minRating))
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to retrieve feedback' }, { status: 500 })
    }

    return NextResponse.json(
      {
        feedback: data || [],
        total: count || 0,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error retrieving feedback:', error)
    return NextResponse.json({ error: 'Failed to retrieve feedback' }, { status: 500 })
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
