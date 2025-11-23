/**
 * API route to create a session token for OpenAI Voice Agent
 * This route securely handles the API key on the server side
 */
export async function POST() {
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

    // Create a new ephemeral session with OpenAI
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'verse',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI Session Error:', errorData)
      return new Response(
        JSON.stringify({
          error: 'Failed to create session',
          message: errorData.error?.message || 'Failed to create voice agent session',
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    // Return the ephemeral client secret as the session token
    return new Response(
      JSON.stringify({
        sessionToken: data.client_secret,
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
