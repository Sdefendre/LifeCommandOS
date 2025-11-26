import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Server-side client (uses service role key if available)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export function getSupabaseClient() {
  // If we have a service role key (server-side), use it for admin operations
  if (supabaseServiceKey && typeof window === 'undefined') {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  // Otherwise use anon key (client-side or when service key not available)
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Helper functions for course access
export async function checkCourseAccess(userId: string, courseId: string = '0-100-rating-course') {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('course_access')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .single()

  if (error || !data) return false

  // Check if access has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return false
  }

  return true
}

// Helper function to save AI conversation
export async function saveConversation(
  userId: string | undefined,
  conversationId: string,
  role: 'user' | 'assistant',
  message: string,

  metadata?: Record<string, any>
) {
  if (!userId) return

  const supabase = getSupabaseClient()
  const { error } = await supabase.from('ai_agent_conversations').insert({
    user_id: userId,
    conversation_id: conversationId,
    role,
    message,
    metadata,
  })

  if (error) {
    console.error('Error saving conversation:', error)
  }
}

// Helper function to check rate limits
export async function checkRateLimit(userId: string | undefined): Promise<{
  allowed: boolean
  remaining: number
  limit: number
}> {
  if (!userId) {
    // For anonymous users, apply stricter limits
    return { allowed: true, remaining: 5, limit: 5 }
  }

  const supabase = getSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  // Get or create rate limit record
  const { data: rateLimit, error } = await supabase
    .from('ai_agent_rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  // Check user subscription tier
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('subscription_type')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  const isPremium =
    subscription?.subscription_type === 'premium' || subscription?.subscription_type === 'lifetime'
  const limit = isPremium ? 1000 : 20 // Free tier: 20 queries/day, Premium: 1000/day

  if (error || !rateLimit) {
    // Create new rate limit record
    await supabase.from('ai_agent_rate_limits').insert({
      user_id: userId,
      date: today,
      query_count: 1,
      tier: isPremium ? 'premium' : 'free',
    })
    return { allowed: true, remaining: limit - 1, limit }
  }

  const remaining = limit - rateLimit.query_count
  const allowed = remaining > 0

  if (allowed) {
    // Increment query count
    await supabase
      .from('ai_agent_rate_limits')
      .update({ query_count: rateLimit.query_count + 1 })
      .eq('id', rateLimit.id)
  }

  return { allowed, remaining: Math.max(0, remaining), limit }
}
