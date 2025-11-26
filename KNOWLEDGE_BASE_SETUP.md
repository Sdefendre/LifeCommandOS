# Knowledge Base Setup Guide

This guide outlines everything you need to get the knowledge base feature working in your AI agent.

## ✅ What's Already Done

- ✅ Knowledge base database schema created (`002_knowledge_base_schema.sql`)
- ✅ Knowledge base seed data created (`003_knowledge_base_seed_data.sql`)
- ✅ Knowledge base search functions implemented (`lib/knowledge-base.ts`)
- ✅ AI agent integration with knowledge base (`lib/ai-agent.ts`)
- ✅ API route updated to use knowledge base (`app/api/ai-agent/route.ts`)

## 🔧 What You Need to Do

### 1. Apply Database Migrations

You need to run the Supabase migrations to create the knowledge base table and populate it with seed data.

**Option A: Using Supabase CLI (Recommended)**

```bash
# If you have Supabase CLI installed locally
supabase db push

# Or apply migrations manually through Supabase dashboard
```

**Option B: Using Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/002_knowledge_base_schema.sql`
   - `supabase/migrations/003_knowledge_base_seed_data.sql`

**Option C: Using MCP Supabase Tools (if configured)**
The migrations can be applied using the Supabase MCP tools if you have them configured.

### 2. Verify Environment Variables

Make sure these environment variables are set in your `.env.local` file and in your deployment (Vercel):

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # For server-side operations

# AI API Keys (Required for AI responses)
OPENAI_API_KEY=your_openai_api_key  # For GPT models
XAI_API_KEY=your_xai_api_key        # For Grok models
```

### 3. Fix Rate Limiting in API Route

The API route currently uses the old `shouldRateLimit` function. Update it to use the Supabase-based rate limiting:

**File: `app/api/ai-agent/route.ts`**

Replace:

```typescript
import { SYSTEM_PROMPT, shouldRateLimit, buildPrompt, type ConversationMessage } from '@/lib/ai-agent'

// ... later in the code ...
if (shouldRateLimit(userId)) {
```

With:

```typescript
import { SYSTEM_PROMPT, buildPrompt, type ConversationMessage } from '@/lib/ai-agent'
import { checkRateLimit } from '@/lib/supabase'

// ... later in the code ...
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
```

### 4. Verify Supabase Connection

Test that your Supabase connection is working:

1. Check that `lib/supabase.ts` has the correct configuration
2. Verify the Supabase client can connect (check browser console for errors)
3. Test the knowledge base search function manually if needed

### 5. Test the Knowledge Base

After applying migrations, test that the knowledge base is working:

1. Go to `/ai-agent` page
2. Ask a question like "What is a DD-214?" or "How do I prepare for a C&P exam?"
3. The AI should respond with information from the knowledge base articles

### 6. Add More Knowledge Base Articles (Optional)

You can add more articles to the knowledge base by:

1. **Via SQL:**

```sql
INSERT INTO knowledge_base (title, content, category, tags, keywords, priority, is_active)
VALUES (
  'Your Article Title',
  'Your article content here...',
  'category-name',
  ARRAY['tag1', 'tag2'],
  ARRAY['keyword1', 'keyword2'],
  5,
  TRUE
);
```

2. **Via Supabase Dashboard:**
   - Go to Table Editor → `knowledge_base`
   - Click "Insert" → "Insert row"
   - Fill in the fields

## 🐛 Troubleshooting

### Knowledge Base Not Being Used

1. **Check database connection:**
   - Verify Supabase environment variables are set
   - Check browser console for connection errors

2. **Check migrations:**
   - Verify the `knowledge_base` table exists
   - Verify seed data was inserted (should have 8 articles)

3. **Check search function:**
   - Add console logs in `lib/knowledge-base.ts` to debug search queries
   - Verify the search is finding articles

4. **Check API route:**
   - Verify `buildPrompt` is being called with `includeKnowledgeBase: true`
   - Check server logs for errors during knowledge base search

### Rate Limiting Issues

- If rate limiting isn't working, make sure the `ai_agent_rate_limits` table exists
- Check that `checkRateLimit` function is being called correctly

### AI Not Responding with Knowledge Base Content

- Verify the knowledge base articles are being included in the system prompt
- Check that the AI model is actually using the knowledge base context
- Try asking very specific questions that match the keywords in the seed data

## 📝 Next Steps

1. **Monitor Performance:**
   - Track which knowledge base articles are most useful
   - Monitor search query performance

2. **Expand Knowledge Base:**
   - Add more articles based on common user questions
   - Update existing articles with more detailed information

3. **Improve Search:**
   - Fine-tune keywords and tags for better matching
   - Adjust priority scores to surface most relevant articles

4. **Analytics:**
   - Track which articles are being matched to queries
   - Use this data to improve article content and keywords

## 🔗 Related Files

- `supabase/migrations/002_knowledge_base_schema.sql` - Database schema
- `supabase/migrations/003_knowledge_base_seed_data.sql` - Initial articles
- `lib/knowledge-base.ts` - Search and retrieval functions
- `lib/ai-agent.ts` - AI prompt building with knowledge base
- `app/api/ai-agent/route.ts` - API endpoint that uses knowledge base
