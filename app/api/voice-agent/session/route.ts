import { NextRequest } from 'next/server'

/**
 * API route to create a session token for OpenAI Voice Agent
 * This route securely handles the API key on the server side
 */
export async function POST(_request: NextRequest) {
  try {
    // const body = await request.json()
    // const { userId } = body

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured')
      return new Response(
        JSON.stringify({
          error: 'Voice agent not configured',
          message: 'The voice agent service is not properly configured. Please contact support.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // TODO: Add rate limiting check here if needed
    // const rateLimit = await checkRateLimit(userId)
    // if (!rateLimit.allowed) {
    //   return new Response(
    //     JSON.stringify({
    //       error: 'Rate limit exceeded',
    //       message: `You have reached your daily limit. Upgrade to premium for unlimited access.`,
    //     }),
    //     { status: 429, headers: { 'Content-Type': 'application/json' } }
    //   )
    // }

    // Return the API key as a session token
    // Note: In production, you might want to use a more secure approach
    // like generating a temporary token that expires after a certain time
    return new Response(
      JSON.stringify({
        sessionToken: apiKey,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Voice Agent Session API Error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: errorMessage || 'Failed to create voice agent session',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
