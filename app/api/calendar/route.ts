import { NextResponse } from 'next/server'
import { google } from 'googleapis'

/**
 * Google Calendar API Route
 *
 * This route fetches events from Google Calendar.
 *
 * To set this up:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select an existing one
 * 3. Enable the Google Calendar API
 * 4. Create credentials (API Key or OAuth 2.0)
 * 5. Add your credentials to .env.local:
 *    - GOOGLE_CALENDAR_API_KEY=your_api_key
 *    - GOOGLE_CALENDAR_ID=your_calendar_id (usually your email)
 *
 * For OAuth 2.0 (more secure, allows access to user's calendar):
 *    - GOOGLE_CLIENT_ID=your_client_id
 *    - GOOGLE_CLIENT_SECRET=your_client_secret
 *    - GOOGLE_REDIRECT_URI=your_redirect_uri
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeMin = searchParams.get('timeMin') || new Date().toISOString()
    const timeMax =
      searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    // Check if API key is configured
    const apiKey = process.env.GOOGLE_CALENDAR_API_KEY
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'

    if (!apiKey) {
      // Return empty events if API key is not configured
      // This allows the calendar to still work without Google Calendar integration
      return NextResponse.json({
        events: [],
        message:
          'Google Calendar API key not configured. Add GOOGLE_CALENDAR_API_KEY to your .env.local file.',
      })
    }

    // Initialize Google Calendar API with API key
    const calendar = google.calendar({ version: 'v3', auth: apiKey })

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []

    // Format events for the frontend
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.summary || 'No Title',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description,
      location: event.location,
      allDay: !event.start?.dateTime, // If there's no dateTime, it's an all-day event
    }))

    return NextResponse.json({
      events: formattedEvents,
    })
  } catch (error) {
    console.error('Error fetching calendar events:', error)

    // Return empty events on error so the calendar still works
    return NextResponse.json(
      {
        events: [],
        error: 'Failed to fetch calendar events',
      },
      { status: 500 }
    )
  }
}
