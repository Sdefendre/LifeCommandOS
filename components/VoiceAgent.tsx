'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

  const disconnect = async () => {
    try {
      if (sessionRef.current) {
        await sessionRef.current.disconnect()
        sessionRef.current = null
      }
      setStatus('disconnected')
      setIsListening(false)
      setIsMuted(false)
      setError(null)
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        disconnect()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        apiKey: sessionToken, // Use the session token from our API
      })

      sessionRef.current = session

      // Handle session events
      // The SDK automatically handles audio playback through WebRTC
      // We just need to track the listening state and errors

      // Handle listening state changes
      // Note: Event names may vary based on SDK version - adjust as needed
      if (typeof session.on === 'function') {
        session.on('listening', () => {
          setIsListening(true)
        })

        session.on('not_listening', () => {
          setIsListening(false)
        })

        // Handle errors
        session.on('error', (err: Error) => {
          console.error('Session error:', err)
          setError(err.message || 'An error occurred during the conversation')
          setStatus('error')
        })

        // Handle connection events
        session.on('connected', () => {
          setStatus('connected')
        })

        session.on('disconnected', () => {
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
          <div className="flex items-center justify-between">
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
            {status === 'disconnected' || status === 'error' ? (
              <Button onClick={connect} disabled={status === 'connecting'}>
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
            ) : (
              <Button onClick={disconnect} variant="destructive">
                <MicOff className="h-4 w-4 mr-2" />
                End Conversation
              </Button>
            )}
          </div>

          {/* Listening Indicator */}
          <AnimatePresence>
            {isListening && status === 'connected' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

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
