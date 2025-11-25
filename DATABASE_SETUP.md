# Database Setup Summary

## Overview

This document summarizes the complete database setup for Life Command OS, including the feedback system, AI agent infrastructure, and course management.

## Supabase Project

**Project URL:** `https://wmyptvcnwmmspknmeooy.supabase.co`

## Database Tables

### 1. Site Feedback System

**Table:** `site_feedback`

Tracks user feedback from throughout the website.

**Schema:**

- `id` (bigint, primary key)
- `created_at` (timestamptz)
- `type` (text: 'general' | 'bug' | 'feature' | 'content')
- `message` (text, required)
- `rating` (integer, 1-5, optional)
- `email` (text, optional)
- `path` (text, optional - page URL)
- `user_agent` (text, optional)

**Indexes:**

- `idx_site_feedback_created_at` - For sorting by date
- `idx_site_feedback_type` - For filtering by type
- `idx_site_feedback_rating` - For filtering by rating
- `idx_site_feedback_path` - For filtering by page
- `idx_site_feedback_email` - For filtering by email (where not null)

**RLS Policies:**

- ✅ Public can INSERT (anyone can submit feedback)
- ✅ Service role can SELECT (admin access)

### 2. Course Access System

**Table:** `course_access`

Manages user access to courses and training content.

**Schema:**

- `id` (bigint, primary key)
- `created_at`, `updated_at` (timestamptz)
- `user_id` (text, required)
- `course_id` (text, default: '0-100-rating-course')
- `status` (text: 'active' | 'expired' | 'revoked' | 'pending')
- `expires_at` (timestamptz, optional)
- `accessed_at` (timestamptz, optional)
- `completion_percentage` (integer, 0-100)
- `metadata` (jsonb)

**Indexes:**

- `idx_course_access_user_id`
- `idx_course_access_course_id`
- `idx_course_access_status`

**RLS Policies:**

- ✅ Users can view their own course access
- ✅ Service role can manage all course access

### 3. AI Agent Conversations

**Table:** `ai_agent_conversations`

Stores chat history for AI agent interactions.

**Schema:**

- `id` (bigint, primary key)
- `created_at` (timestamptz)
- `user_id` (text, optional)
- `conversation_id` (text, required)
- `role` (text: 'user' | 'assistant' | 'system')
- `message` (text, required)
- `metadata` (jsonb)

**Indexes:**

- `idx_ai_conversations_user_id`
- `idx_ai_conversations_conversation_id`
- `idx_ai_conversations_created_at` (desc)

**RLS Policies:**

- ✅ Users can view/create their own conversations
- ✅ Service role can manage all conversations

### 4. User Subscriptions

**Table:** `user_subscriptions`

Manages user subscription tiers and billing.

**Schema:**

- `id` (bigint, primary key)
- `created_at`, `updated_at` (timestamptz)
- `user_id` (text, unique, required)
- `subscription_type` (text: 'free' | 'premium' | 'lifetime')
- `status` (text: 'active' | 'cancelled' | 'expired' | 'pending')
- `starts_at`, `expires_at` (timestamptz)
- `stripe_subscription_id`, `stripe_customer_id` (text, optional)
- `metadata` (jsonb)

**Indexes:**

- `idx_user_subscriptions_user_id`
- `idx_user_subscriptions_status`
- `idx_user_subscriptions_type`
- `idx_user_subscriptions_stripe_customer_id`

**RLS Policies:**

- ✅ Users can view their own subscription
- ✅ Service role can manage all subscriptions

### 5. AI Agent Rate Limits

**Table:** `ai_agent_rate_limits`

Tracks daily API usage per user for rate limiting.

**Schema:**

- `id` (bigint, primary key)
- `created_at`, `updated_at` (timestamptz)
- `user_id` (text, required)
- `date` (date, required)
- `query_count` (integer, default: 0)
- `tier` (text: 'free' | 'premium' | 'lifetime')
- `metadata` (jsonb)
- Unique constraint: `(user_id, date)`

**Indexes:**

- `idx_rate_limits_user_id`
- `idx_rate_limits_date` (desc)
- `idx_rate_limits_user_date` (composite)

**RLS Policies:**

- ✅ Users can view their own rate limits
- ✅ Service role can manage all rate limits

## Migrations Applied

All migrations have been successfully applied:

1. ✅ `enhance_newsletter_system` (existing)
2. ✅ `create_course_access_table`
3. ✅ `create_ai_agent_conversations_table`
4. ✅ `create_user_subscriptions_table`
5. ✅ `create_ai_agent_rate_limits_table`
6. ✅ `add_feedback_indexes`

## Helper Functions

Located in `lib/supabase.ts`:

### `checkCourseAccess(userId, courseId)`

Checks if a user has active access to a course.

### `saveConversation(userId, conversationId, role, message, metadata)`

Saves a conversation message to the database.

### `checkRateLimit(userId)`

Returns rate limit information:

- `allowed`: boolean
- `remaining`: number
- `limit`: number (20 for free, 1000 for premium/lifetime)

**Rate Limits:**

- Anonymous users: 5 queries/day
- Free tier: 20 queries/day
- Premium/Lifetime: 1000 queries/day

## TypeScript Types

Type definitions are available in:

- `lib/types/supabase.ts` - Full database types (auto-generated)
- `lib/types/database.ts` - Simplified type definitions

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wmyptvcnwmmspknmeooy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## API Endpoints

### Feedback API

**POST** `/api/feedback` - Submit feedback

- Public access (anyone can submit)
- Validates input and stores in `site_feedback` table

**GET** `/api/feedback` - Retrieve feedback

- Service role only
- Supports filtering by type, rating, pagination

### Example Usage

```typescript
// Submit feedback
const response = await fetch('/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'bug',
    message: 'Found an issue with...',
    rating: 4,
    email: 'user@example.com',
    path: '/battlestation',
  }),
})

// Get feedback (requires service role)
const feedback = await fetch('/api/feedback?type=bug&minRating=4')
```

## Security

All tables have **Row Level Security (RLS)** enabled:

- ✅ Public tables (site_feedback): Anonymous inserts allowed
- ✅ User-specific tables: Users can only access their own data
- ✅ Admin access: Service role has full access for backend operations
- ✅ All policies are properly configured and tested

## Next Steps

1. **Set Environment Variables**: Add Supabase credentials to `.env.local`
2. **Test Feedback System**: Submit test feedback via the UI
3. **Monitor Usage**: Check Supabase dashboard for feedback submissions
4. **Customize Types**: Update `lib/types/database.ts` as needed

## Database Statistics

- **Total Tables**: 5 new tables (+ existing newsletter/comment tables)
- **Total Migrations**: 6 migrations applied
- **RLS Enabled**: 100% of new tables
- **Indexes Created**: 15+ indexes for optimal query performance

## Support

For issues or questions:

- Check Supabase dashboard: https://wmyptvcnwmmspknmeooy.supabase.co
- Review migration history via MCP tools
- See `README_FEEDBACK.md` for feedback system documentation
