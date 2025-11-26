'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface VoiceAgentProps {
  userId?: string
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export function VoiceAgent({ userId }: VoiceAgentProps) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [isMuted, setIsMuted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionRef = useRef<any>(null)

  const wakeLockRef = useRef<any>(null)

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await (navigator as any).wakeLock.request('screen')
        wakeLockRef.current = lock
        console.log('Wake Lock active')
      }
    } catch (err) {
      console.error('Wake Lock error:', err)
    }
  }

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
        wakeLockRef.current = null
        console.log('Wake Lock released')
      } catch (err) {
        console.error('Release Wake Lock error:', err)
      }
    }
  }

  const disconnect = async () => {
    try {
      if (sessionRef.current) {
        await sessionRef.current.disconnect()
        sessionRef.current = null
      }
      await releaseWakeLock()
      setStatus('disconnected')
      setIsListening(false)
      setIsMuted(false)
      setError(null)
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }

  // Handle visibility change to re-acquire wake lock
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (status === 'connected' && document.visibilityState === 'visible') {
        await requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [status])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        disconnect()
      }
      releaseWakeLock()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle network status changes
  useEffect(() => {
    const handleOffline = () => {
      if (status === 'connected') {
        setError('Internet connection lost. Please reconnect.')
        disconnect()
      }
    }

    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('offline', handleOffline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const connect = async () => {
    try {
      setStatus('connecting')
      setError(null)

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop()) // Stop immediately, SDK will handle it

      // Get session token from API
      const response = await fetch('/api/voice-agent/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create session')
      }

      const { sessionToken } = await response.json()

      // Dynamically import the OpenAI Agents SDK
      const { RealtimeAgent, RealtimeSession } = await import('@openai/agents/realtime')

      // Create agent with veteran-focused instructions
      const agent = new RealtimeAgent({
        name: 'Command',
        instructions: `You are Command, a helpful voice assistant built specifically for military veterans. Your role is to provide clear, accurate, and empathetic guidance about:

1. VA Benefits and Eligibility
2. Service-Connected Disability Claims
3. C&P (Compensation & Pension) Exams
4. DD-214 Understanding
5. Transition Resources
6. Financial Literacy for Veterans

Key Guidelines:
- Use veteran-specific terminology (DD-214, C&P, EAS, MOS, rating, service-connected, etc.)
- Be empathetic and understanding of the challenges veterans face
- Provide clear, actionable advice
- Keep responses conversational and concise
- Use a supportive, encouraging tone
- Speak naturally as if having a conversation with a friend

Remember: You're built by veterans, for veterans. Speak their language and understand their struggles.`,
      })

      // Create session
      const session = new RealtimeSession(agent)

      // Connect to the session
      await session.connect({
        apiKey: sessionToken, // Use the ephemeral session token from our API
      })

      sessionRef.current = session
      await requestWakeLock()

      // Handle session events
      // The SDK automatically handles audio playback through WebRTC
      // We just need to track the listening state and errors

      // Handle listening state changes
      // Note: Event names may vary based on SDK version - adjust as needed
      if (typeof session.on === 'function') {
        const sessionAny = session as any
        try {
          sessionAny.on('listening', () => {
            setIsListening(true)
          })

          sessionAny.on('not_listening', () => {
            setIsListening(false)
          })

          // Handle errors
          sessionAny.on('error', (err: Error) => {
            console.error('Session error:', err)
            setError(err.message || 'An error occurred during the conversation')
            setStatus('error')
          })
        } catch {
          console.warn('Session event handling may not be available in this SDK version')
        }

        // Handle connection events
        sessionAny.on('connected', () => {
          setStatus('connected')
        })

        sessionAny.on('disconnected', () => {
          setStatus('disconnected')
          setIsListening(false)
        })
      }

      // Status will be set by the 'connected' event handler if available
      // Otherwise set it directly
      if (typeof session.on !== 'function') {
        setStatus('connected')
      }
    } catch (err) {
      console.error('Connection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect to voice agent')
      setStatus('error')
    }
  }

  const toggleMute = () => {
    if (sessionRef.current) {
      if (isMuted) {
        sessionRef.current.unmute()
      } else {
        sessionRef.current.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Status Card */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Agent
          </CardTitle>
          <CardDescription>
            Have a natural conversation about VA benefits, disability claims, and transition
            resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  status === 'connected'
                    ? 'bg-[#657832] dark:bg-[#78823c] animate-pulse'
                    : status === 'connecting'
                      ? 'bg-yellow-500 dark:bg-yellow-400 animate-pulse'
                      : status === 'error'
                        ? 'bg-destructive dark:bg-destructive'
                        : 'bg-muted-foreground/50'
                }`}
              />
              <span className="text-sm font-medium capitalize">{status}</span>
            </div>

            {/* Connection Button */}
            {status === 'connected' ? (
              <Button onClick={disconnect} variant="destructive" className="w-full sm:w-auto">
                <MicOff className="h-4 w-4 mr-2" />
                End Conversation
              </Button>
            ) : (
              <Button
                onClick={connect}
                disabled={status === 'connecting'}
                className="w-full sm:w-auto"
              >
                {status === 'connecting' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Conversation
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Active Conversation Visualizer */}
          {status === 'connected' && (
            <div className="flex flex-col items-center justify-center py-6 gap-4 border rounded-lg bg-muted/20">
              <div className="relative">
                {isListening && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-primary/40"
                  />
                )}
                <div
                  className={`relative z-10 h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? 'bg-primary/20 text-primary scale-105'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Mic className="h-8 w-8" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium animate-pulse">
                {isListening ? 'Listening...' : 'Agent is active'}
              </p>
            </div>
          )}

          {/* Mute Toggle */}
          {status === 'connected' && (
            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!sessionRef.current}
            >
              {isMuted ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Mute
                </>
              )}
            </Button>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          {status === 'disconnected' && (
            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p>• Click &quot;Start Conversation&quot; to begin</p>
              <p>• Allow microphone access when prompted</p>
              <p>• Speak naturally - the agent will respond with voice</p>
              <p>• Use the mute button to temporarily disable your microphone</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
