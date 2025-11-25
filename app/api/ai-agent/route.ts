import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createXai } from '@ai-sdk/xai'
import { buildPrompt, SYSTEM_PROMPT, type ConversationMessage } from '@/lib/ai-agent'
import { checkRateLimit, saveConversation } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // useChat with DefaultChatTransport sends: { messages, data, ...body }
    // The body object from transport config (userId, model) is merged into the request body
    const { messages: chatMessages, userId, model = 'gpt-4o-mini', conversationId } = body

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

    // Determine which provider to use based on model
    const isGrok = model.startsWith('grok-')
    const apiKey = isGrok ? process.env.XAI_API_KEY : process.env.OPENAI_API_KEY
    const apiKeyName = isGrok ? 'XAI_API_KEY' : 'OPENAI_API_KEY'

    // Check if API key is configured
    if (!apiKey) {
      console.error(`${apiKeyName} is not configured`)
      return new Response(
        JSON.stringify({
          error: 'AI service not configured',
          message: `The ${isGrok ? 'XAI (Grok)' : 'OpenAI'} API key is not configured. Please add ${apiKeyName} to your environment variables.`,
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

    // Select the appropriate model based on user choice
    let aiModel
    if (isGrok) {
      // Use Grok models
      let grokModel: string
      if (model === 'grok-4.1-fast') {
        grokModel = 'grok-4.1-fast'
      } else if (model === 'grok-4-fast-reasoning') {
        grokModel = 'grok-4-fast-reasoning'
      } else {
        grokModel = 'grok-4-fast-non-reasoning'
      }
      // Create xAI provider with explicit API key
      const xaiProvider = createXai({ apiKey })
      aiModel = xaiProvider(grokModel)
    } else {
      // Use OpenAI models
      let openaiModel: string
      if (model === 'gpt-5.1') {
        openaiModel = 'gpt-5.1'
      } else if (model === 'gpt-4o') {
        openaiModel = 'gpt-4o'
      } else {
        openaiModel = 'gpt-4o-mini'
      }
      aiModel = openai(openaiModel)
    }

    // Save user message to database
    if (userId && lastUserMessage) {
      await saveConversation(userId, currentConversationId, 'user', lastUserMessage, {
        model,
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
      maxTokens: isGrok ? 2000 : 1000, // Grok supports longer responses
      onFinish: async ({ text }) => {
        // Save assistant response after streaming completes
        if (userId && text) {
          await saveConversation(userId, currentConversationId, 'assistant', text, {
            model,
            timestamp: new Date().toISOString(),
          }).catch((err) => {
            console.error('Failed to save assistant message:', err)
          })
        }
      },
    })

    // Return the streaming response with conversation ID in headers
    // Use toTextStreamResponse() as suggested by the compiler
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
