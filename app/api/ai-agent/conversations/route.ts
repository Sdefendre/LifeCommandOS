import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

interface ConversationMessage {
  id: number
  created_at: string | null
  user_id: string | null
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  message: string
  metadata: Record<string, unknown> | null
}

interface ConversationSummary {
  conversation_id: string
  title: string
  preview: string
  message_count: number
  created_at: string
  updated_at: string
}

/**
 * GET /api/ai-agent/conversations
 * Retrieve list of conversations for a user (grouped by conversation_id)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    // Get all messages for the user to group by conversation
    const { data, error } = await supabase
      .from('ai_agent_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    // Group messages by conversation_id and create summaries
    const conversationMap = new Map<string, ConversationMessage[]>()

    for (const msg of data || []) {
      const existing = conversationMap.get(msg.conversation_id) || []
      existing.push(msg)
      conversationMap.set(msg.conversation_id, existing)
    }

    // Create conversation summaries
    const conversations: ConversationSummary[] = []

    for (const [conversationId, messages] of conversationMap) {
      // Sort messages by created_at ascending to get first message
      const sortedMessages = messages.sort(
        (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      )

      // Find first user message for title
      const firstUserMessage = sortedMessages.find((m) => m.role === 'user')
      const lastMessage = sortedMessages[sortedMessages.length - 1]
      const firstMessage = sortedMessages[0]

      // Generate title from first user message (truncate to 50 chars)
      const title = firstUserMessage
        ? firstUserMessage.message.slice(0, 50) +
          (firstUserMessage.message.length > 50 ? '...' : '')
        : 'New conversation'

      // Generate preview from last message (truncate to 80 chars)
      const preview = lastMessage
        ? lastMessage.message.slice(0, 80) + (lastMessage.message.length > 80 ? '...' : '')
        : ''

      conversations.push({
        conversation_id: conversationId,
        title,
        preview,
        message_count: messages.length,
        created_at: firstMessage?.created_at || new Date().toISOString(),
        updated_at: lastMessage?.created_at || new Date().toISOString(),
      })
    }

    // Sort by updated_at descending (most recent first)
    conversations.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )

    // Apply limit
    const limitedConversations = conversations.slice(0, limit)

    return NextResponse.json({
      conversations: limitedConversations,
      count: limitedConversations.length,
      total: conversations.length,
    })
  } catch (error) {
    console.error('Error in conversations API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/ai-agent/conversations
 * Delete a conversation by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (!userId || !conversationId) {
      return NextResponse.json(
        { error: 'User ID and Conversation ID are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { error } = await supabase
      .from('ai_agent_conversations')
      .delete()
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)

    if (error) {
      console.error('Error deleting conversation:', error)
      return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete conversation API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
