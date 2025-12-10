'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  refreshSession: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const isConfigured = supabase !== null

  // Set initial loading state based on whether Supabase is configured
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: isConfigured, // Only loading if Supabase needs to be initialized
  })

  // Initialize auth state
  useEffect(() => {
    // If Supabase is not configured, nothing to initialize
    if (!supabase) {
      return
    }

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
        })
      } catch (error) {
        console.error('Error initializing auth:', error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    initAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        isLoading: false,
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: { message: 'Auth not configured' } as AuthError }
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    },
    [supabase]
  )

  const signUp = useCallback(
    async (email: string, password: string, metadata?: { full_name?: string }) => {
      if (!supabase) {
        return { error: { message: 'Auth not configured' } as AuthError }
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [supabase])

  const resetPassword = useCallback(
    async (email: string) => {
      if (!supabase) {
        return { error: { message: 'Auth not configured' } as AuthError }
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      return { error }
    },
    [supabase]
  )

  const updatePassword = useCallback(
    async (password: string) => {
      if (!supabase) {
        return { error: { message: 'Auth not configured' } as AuthError }
      }
      const { error } = await supabase.auth.updateUser({ password })
      return { error }
    },
    [supabase]
  )

  const refreshSession = useCallback(async () => {
    if (!supabase) return
    const {
      data: { session },
    } = await supabase.auth.refreshSession()
    setState((prev) => ({
      ...prev,
      user: session?.user ?? null,
      session,
    }))
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshSession,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
