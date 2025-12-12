import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { createXai } from '@ai-sdk/xai'
import { DEFAULT_MODEL } from '@/constants/ai'
import { buildPrompt, SYSTEM_PROMPT, type ConversationMessage } from '@/lib/ai-agent'
import { checkRateLimit, isSupabaseConfigured, saveConversation } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // useChat with DefaultChatTransport sends: { messages, data, ...body }
    // The body object from transport config (userId, model) is merged into the request body
    const { messages: chatMessages, userId: bodyUserId, conversationId } = body
    const resolvedModel = DEFAULT_MODEL

    // Get authenticated user from server session (preferred) or fallback to body userId
    let userId = bodyUserId
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
      }
    }

    // Warn (but allow) if Supabase isn't configured; KB/Community Q&A will be skipped gracefully
    if (!isSupabaseConfigured) {
      console.warn(
        'Supabase not configured; knowledge base and community Q&A context will be skipped.'
      )
    }

    // Use provided conversation ID or generate a new one (for tracking conversations)
    const currentConversationId =
      conversationId || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Check rate limiting
    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `You have reached your daily limit (${rateLimit.limit} queries). Upgrade to premium for unlimited access.`,
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      console.error('XAI_API_KEY is not configured')
      return new Response(
        JSON.stringify({
          error: 'AI service not configured',
          message:
            'The XAI_API_KEY environment variable is missing. Add your Grok key to .env.local.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Extract the last user message and conversation history
    // useChat sends messages with 'parts' array format: { role, parts: [{ type: 'text', text: string }] }
    let lastUserMessage = ''
    const conversationHistory: ConversationMessage[] = []

    if (!chatMessages || !Array.isArray(chatMessages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const recentMessages = chatMessages
      .filter((msg: { role: string }) => msg.role !== 'system')
      .slice(-20)

    for (const msg of recentMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        // Extract text from parts array (useChat format) or use content directly
        let messageContent = ''
        if (msg.parts && Array.isArray(msg.parts)) {
          // Extract text from parts array
          messageContent = msg.parts
            .filter((part: { type: string }) => part.type === 'text')
            .map((part: { text?: string }) => part.text || '')
            .join('')
        } else if (msg.content) {
          // Fallback to content field if parts don't exist
          messageContent = typeof msg.content === 'string' ? msg.content : String(msg.content)
        } else if (typeof msg === 'string') {
          // Handle string messages
          messageContent = msg
        }

        // Only add non-empty messages
        if (messageContent.trim()) {
          const conversationMsg: ConversationMessage = {
            role: msg.role as 'user' | 'assistant',
            content: messageContent,
          }
          conversationHistory.push(conversationMsg)

          // Get the last user message for Reddit dataset search
          if (msg.role === 'user') {
            lastUserMessage = messageContent
          }
        }
      }
    }

    // Ensure we have at least one user message
    if (!lastUserMessage && conversationHistory.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid user message found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build prompt with knowledge base and Reddit dataset context
    let systemPromptWithContext: string
    try {
      systemPromptWithContext = await buildPrompt(
        lastUserMessage || conversationHistory[conversationHistory.length - 1]?.content || '',
        conversationHistory.slice(0, -1), // Exclude the last message as it's the current question
        true, // Include knowledge base
        true // Include Reddit dataset
      )
    } catch (promptError) {
      console.error('Error building prompt with knowledge base:', promptError)
      // Fallback to basic prompt if knowledge base/Reddit search fails
      systemPromptWithContext = `${SYSTEM_PROMPT}\n\nConversation History:\n${conversationHistory
        .slice(0, -1)
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join(
          '\n\n'
        )}\n\nCurrent User Question: ${lastUserMessage || conversationHistory[conversationHistory.length - 1]?.content || ''}`
    }

    // Build messages array for the AI model
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPromptWithContext },
    ]

    // Add conversation history (excluding system messages)
    for (const msg of conversationHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    }

    // Select Grok model (only supported option)
    const xaiProvider = createXai({ apiKey })
    const aiModel = xaiProvider(resolvedModel)

    // Save user message to database
    if (userId && lastUserMessage) {
      await saveConversation(userId, currentConversationId, 'user', lastUserMessage, {
        model: resolvedModel,
        timestamp: new Date().toISOString(),
      }).catch((err) => {
        console.error('Failed to save user message:', err)
        // Don't fail the request if saving fails
      })
    }

    // Stream the response using Vercel AI SDK
    const result = await streamText({
      model: aiModel,
      messages,
      temperature: 0.7,
      // @ts-expect-error - maxTokens is supported by providers but might be missing in type definition
      maxTokens: 2000,
      onFinish: async ({ text }) => {
        // Save assistant response after streaming completes
        if (userId && text) {
          await saveConversation(userId, currentConversationId, 'assistant', text, {
            model: resolvedModel,
            timestamp: new Date().toISOString(),
          }).catch((err) => {
            console.error('Failed to save assistant message:', err)
          })
        }
      },
    })

    // Return the streaming response with conversation ID in headers
    const response = result.toTextStreamResponse()

    response.headers.set('X-Conversation-ID', currentConversationId)
    response.headers.set('X-Rate-Limit-Remaining', String(rateLimit.remaining))
    response.headers.set('X-Rate-Limit-Limit', String(rateLimit.limit))
    return response
  } catch (error) {
    console.error('AI Agent API Error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { errorMessage, errorStack })
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: errorMessage || 'Failed to process your request',
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
