# Google Calendar Integration Setup Guide

This guide will help you connect your Google Calendar to the dashboard calendar view.

## Quick Setup Steps

### 1. Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Calendar API"
5. Click on it and press **Enable**

### 2. Create API Credentials

#### Option A: API Key (Simpler, for public calendars)

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. (Optional) Click **Restrict Key** to limit usage:
   - Under **API restrictions**, select "Restrict key"
   - Choose "Google Calendar API"
   - Click **Save**

#### Option B: OAuth 2.0 (More secure, for private calendars)

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add your authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
5. Copy your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
# For API Key method (Option A)
GOOGLE_CALENDAR_API_KEY=your_api_key_here
GOOGLE_CALENDAR_ID=primary

# For OAuth method (Option B) - requires additional setup
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

**Note:**

- `GOOGLE_CALENDAR_ID` defaults to `"primary"` which is your main calendar
- For a different calendar, use the calendar ID (found in calendar settings)
- For public calendars, you can use the calendar's public URL ID

### 4. Make Your Calendar Public (if using API Key)

If you want to use the API Key method with your personal calendar:

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click the **Settings** gear icon
3. Select **Settings** > **Settings for my calendars**
4. Choose your calendar
5. Under **Access permissions**, check **Make available to public**
6. Copy the **Calendar ID** from the **Integrate calendar** section

### 5. Restart Your Development Server

After adding environment variables:

```bash
npm run dev
```

## Testing

1. Navigate to your dashboard
2. Click on the "days until next month" button
3. The calendar dialog should open and display your Google Calendar events

## Troubleshooting

### No events showing?

- Check that `GOOGLE_CALENDAR_API_KEY` is set in `.env.local`
- Verify the API key has access to Google Calendar API
- Make sure your calendar is public (if using API key method)
- Check the browser console for any error messages

### API Key restrictions

If you restricted your API key:

- Make sure "Google Calendar API" is enabled
- Check that your domain/IP is allowed (if you set restrictions)

### OAuth Setup (Advanced)

For OAuth 2.0 setup, you'll need to implement an authentication flow. The current implementation supports API keys for simplicity, but OAuth provides better security and access to private calendars.

## Security Notes

- **Never commit** `.env.local` to version control
- API keys should be restricted to specific APIs and domains
- For production, use environment variables in your hosting platform (Vercel, etc.)
- Consider using OAuth 2.0 for production applications

## Next Steps

- The calendar will automatically fetch events when opened
- Events are displayed on the calendar with visual indicators
- Upcoming events are listed below the calendar
- You can click on dates to see events for that day
