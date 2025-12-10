import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null during build or when env vars are not configured
    // This allows the app to build and gracefully degrade without Supabase
    return null
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
