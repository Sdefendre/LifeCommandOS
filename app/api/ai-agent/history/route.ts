import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/ai-agent/history
 * Retrieve conversation history for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })
    }

    // Build query
    let query = supabase
      .from('ai_agent_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit)

    // Filter by conversation ID if provided
    if (conversationId) {
      query = query.eq('conversation_id', conversationId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching conversation history:', error)
      return NextResponse.json({ error: 'Failed to fetch conversation history' }, { status: 500 })
    }

    return NextResponse.json({
      conversations: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error('Error in conversation history API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
