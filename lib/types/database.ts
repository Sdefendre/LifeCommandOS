/**
 * Database types for Supabase tables
 * Auto-generated types can be updated by running: supabase gen types typescript
 */

export interface Database {
  public: {
    Tables: {
      site_feedback: {
        Row: {
          id: number
          created_at: string | null
          type: 'general' | 'bug' | 'feature' | 'content' | null
          message: string
          rating: number | null
          email: string | null
          path: string | null
          user_agent: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          type?: 'general' | 'bug' | 'feature' | 'content' | null
          message: string
          rating?: number | null
          email?: string | null
          path?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          type?: 'general' | 'bug' | 'feature' | 'content' | null
          message?: string
          rating?: number | null
          email?: string | null
          path?: string | null
          user_agent?: string | null
        }
      }
      course_access: {
        Row: {
          id: number
          created_at: string | null
          updated_at: string | null
          user_id: string
          course_id: string
          status: 'active' | 'expired' | 'revoked' | 'pending'
          expires_at: string | null
          accessed_at: string | null
          completion_percentage: number | null

          metadata: Record<string, any> | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          user_id: string
          course_id?: string
          status?: 'active' | 'expired' | 'revoked' | 'pending'
          expires_at?: string | null
          accessed_at?: string | null
          completion_percentage?: number | null

          metadata?: Record<string, any> | null
        }
        Update: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
          course_id?: string
          status?: 'active' | 'expired' | 'revoked' | 'pending'
          expires_at?: string | null
          accessed_at?: string | null
          completion_percentage?: number | null

          metadata?: Record<string, any> | null
        }
      }
      ai_agent_conversations: {
        Row: {
          id: number
          created_at: string | null
          user_id: string | null
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          message: string

          metadata: Record<string, any> | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          user_id?: string | null
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          message: string

          metadata?: Record<string, any> | null
        }
        Update: {
          id?: number
          created_at?: string | null
          user_id?: string | null
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          message?: string

          metadata?: Record<string, any> | null
        }
      }
      user_subscriptions: {
        Row: {
          id: number
          created_at: string | null
          updated_at: string | null
          user_id: string
          subscription_type: 'free' | 'premium' | 'lifetime'
          status: 'active' | 'cancelled' | 'expired' | 'pending'
          starts_at: string | null
          expires_at: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null

          metadata: Record<string, any> | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          user_id: string
          subscription_type?: 'free' | 'premium' | 'lifetime'
          status?: 'active' | 'cancelled' | 'expired' | 'pending'
          starts_at?: string | null
          expires_at?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null

          metadata?: Record<string, any> | null
        }
        Update: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
          subscription_type?: 'free' | 'premium' | 'lifetime'
          status?: 'active' | 'cancelled' | 'expired' | 'pending'
          starts_at?: string | null
          expires_at?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null

          metadata?: Record<string, any> | null
        }
      }
      ai_agent_rate_limits: {
        Row: {
          id: number
          created_at: string | null
          updated_at: string | null
          user_id: string
          date: string
          query_count: number
          tier: 'free' | 'premium' | 'lifetime'

          metadata: Record<string, any> | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          user_id: string
          date: string
          query_count?: number
          tier?: 'free' | 'premium' | 'lifetime'

          metadata?: Record<string, any> | null
        }
        Update: {
          id?: number
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
          date?: string
          query_count?: number
          tier?: 'free' | 'premium' | 'lifetime'

          metadata?: Record<string, any> | null
        }
      }
    }
  }
}
