# AI Agent Setup Guide

This guide will help you set up the AI Agent chat feature for Life Command OS with full functionality.

## Prerequisites

1. **Node.js** (v18.18 or later)
2. **Supabase Account** (for rate limiting, knowledge base, and conversation history)
3. **OpenAI API Key** (required)
4. **XAI API Key** (optional, for Grok models)

## Environment Variables

Add these to your `.env.local` file:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-...

# Optional: XAI API Key (for Grok models)
XAI_API_KEY=xai-...

# Required: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Getting API Keys

### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to `.env.local` as `OPENAI_API_KEY`

### XAI API Key (Optional)

1. Visit [X.AI Console](https://console.x.ai/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `xai-`)
6. Add to `.env.local` as `XAI_API_KEY`

### Supabase Setup

1. Visit [Supabase](https://supabase.com/)
2. Create a new project or use existing
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Database Schema

The AI agent requires the following Supabase tables. Run these migrations:

### 1. Rate Limiting Table

```sql
CREATE TABLE IF NOT EXISTS ai_agent_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  date DATE NOT NULL,
  query_count INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_date ON ai_agent_rate_limits(user_id, date);
```

### 2. Conversation History Table

```sql
CREATE TABLE IF NOT EXISTS ai_agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON ai_agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_conv ON ai_agent_conversations(conversation_id);
```

### 3. Knowledge Base Table (Optional)

```sql
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_active ON knowledge_base(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
```

### 4. Reddit Dataset Table (Optional)

```sql
CREATE TABLE IF NOT EXISTS reddit_qa_dataset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  question TEXT,
  answer TEXT,
  upvotes INTEGER DEFAULT 0,
  url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reddit_qa_upvotes ON reddit_qa_dataset(upvotes);
```

### 5. Full-Text Search Function for Reddit (Optional)

```sql
CREATE OR REPLACE FUNCTION search_reddit_qa(
  search_query TEXT,
  result_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  question TEXT,
  answer TEXT,
  upvotes INTEGER,
  url TEXT,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.title,
    r.question,
    r.answer,
    r.upvotes,
    r.url,
    (
      CASE
        WHEN r.title ILIKE '%' || search_query || '%' THEN 10.0
        WHEN r.question ILIKE '%' || search_query || '%' THEN 5.0
        WHEN r.answer ILIKE '%' || search_query || '%' THEN 3.0
        ELSE 1.0
      END + (r.upvotes::REAL / 100.0)
    ) AS relevance_score
  FROM reddit_qa_dataset r
  WHERE
    r.title ILIKE '%' || search_query || '%'
    OR r.question ILIKE '%' || search_query || '%'
    OR r.answer ILIKE '%' || search_query || '%'
  ORDER BY relevance_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
```

## Testing the Integration

1. **Start the development server:**

   ```bash
   pnpm dev
   ```

2. **Navigate to the AI Agent page:**
   - Visit `http://localhost:3000/ai-agent`

3. **Test basic functionality:**
   - Send a test message (e.g., "What is a DD-214?")
   - Verify streaming response works
   - Check that messages appear correctly

4. **Test model switching:**
   - Try different models (GPT-4o, GPT-4o Mini, Grok models)
   - Verify each model responds correctly

5. **Test rate limiting:**
   - Send multiple messages
   - Check rate limit badge updates
   - Verify limit enforcement

6. **Test error handling:**
   - Temporarily remove API key
   - Verify user-friendly error message appears
   - Restore API key and test again

## Features

### ✅ Implemented

- **Streaming Responses**: Real-time AI responses using Vercel AI SDK
- **Multiple Models**: Support for OpenAI (GPT-4o, GPT-4o Mini) and Grok models
- **Rate Limiting**: Daily query limits with Supabase tracking
- **Conversation History**: Persistent chat history in Supabase
- **Knowledge Base Integration**: Search and include relevant articles in responses
- **Reddit Dataset Integration**: Include relevant Q&A from r/veteransbenefits
- **Error Handling**: Graceful error messages and fallbacks
- **Model Selection**: UI to switch between different AI models

### 🔄 Optional Enhancements

- User authentication for personalized experience
- Premium tier with unlimited queries
- Conversation export
- Analytics dashboard
- Custom knowledge base articles
- Reddit dataset scraping automation

## Troubleshooting

### "AI service not configured" Error

- Check that `OPENAI_API_KEY` is set in `.env.local`
- Verify the API key is valid and has credits
- Restart the development server after adding environment variables

### "Rate limit exceeded" Error

- Check Supabase connection
- Verify `ai_agent_rate_limits` table exists
- Check that rate limit logic is working correctly

### Knowledge Base Not Working

- Verify `knowledge_base` table exists in Supabase
- Check that articles are marked as `is_active = true`
- Ensure Supabase connection is configured correctly

### Reddit Dataset Not Working

- Verify `reddit_qa_dataset` table exists
- Check that `search_reddit_qa` function exists (or fallback search will be used)
- Ensure Supabase connection is configured correctly

### Messages Not Streaming

- Check browser console for errors
- Verify API route is returning streaming response
- Check network tab to see if streaming is working

## Support

For issues or questions:

- Check the [README.md](../README.md) for general setup
- Review error messages in browser console and server logs
- Verify all environment variables are set correctly
