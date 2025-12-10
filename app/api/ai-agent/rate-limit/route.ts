import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/ai-agent/rate-limit
 * Get current rate limit status for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let userId = searchParams.get('userId') || undefined

    // Get authenticated user from server session (preferred)
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
      }
    }

    const rateLimit = await checkRateLimit(userId)

    return NextResponse.json({
      allowed: rateLimit.allowed,
      remaining: rateLimit.remaining,
      limit: rateLimit.limit,
    })
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return NextResponse.json({ error: 'Failed to check rate limit' }, { status: 500 })
  }
}
