# Unfinished Features Summary

This document lists all unfinished features found in the Command codebase, organized by priority and status.

## 🔴 Critical - Blocking Core Functionality

### 1. User Authentication System

**Status:** Not implemented  
**Priority:** Critical (Priority 2 in ROADMAP.md)  
**Impact:** Blocks all personalized features

**Why it's critical:**

- All database tables reference `user_id`
- Course access requires authenticated users
- Subscription system requires auth
- Rate limiting needs user identification
- Conversation history needs user accounts

**Files with placeholders:**

- `app/course/content/page.tsx` (line 27-29): Has TODO comment, `userId = undefined`
- `components/CheckoutButton.tsx`: Requires userId prop but no way to get it
- `app/api/stripe/checkout/route.ts`: Requires userId but no auth system

**What needs to be done:**

- [ ] Set up Supabase Auth in the app
- [ ] Create login/signup pages (`app/auth/login/page.tsx`, `app/auth/signup/page.tsx`)
- [ ] Create auth callback page (`app/auth/callback/page.tsx`)
- [ ] Add auth context provider (`components/auth-provider.tsx`)
- [ ] Create auth helpers (`lib/auth.ts`)
- [ ] Protect authenticated routes
- [ ] Add user profile page
- [ ] Email verification flow

**Estimated Time:** 4-6 hours

---

## 🟡 High Priority - Partially Complete

### 2. Chat History UI

**Status:** Partially implemented  
**Priority:** High  
**Impact:** Users can't see or access past conversations

**Current state:**

- ✅ API endpoint exists: `app/api/ai-agent/history/route.ts`
- ✅ Backend saves conversations to database
- ❌ UI shows placeholder: "Chat history coming soon"
- ❌ No way to browse past conversations
- ❌ No conversation list in sidebar

**Files:**

- `components/command/ChatSidebar.tsx` (line 87-91): Shows placeholder text
- `components/AIAgentChat.tsx` (line 58-95): Loads history but doesn't display list
- `components/command/CommandChat.tsx`: No history UI implemented

**What needs to be done:**

- [ ] Create conversation list component
- [ ] Add conversation browser to sidebar
- [ ] Implement conversation switching
- [ ] Add "New Chat" button
- [ ] Show conversation titles/previews
- [ ] Add conversation deletion

**Estimated Time:** 3-4 hours

---

### 3. Course Progress Loading

**Status:** Partially implemented  
**Priority:** High  
**Impact:** Users lose progress on page refresh

**Current state:**

- ✅ API endpoint exists: `app/api/course/progress/route.ts` (GET endpoint)
- ✅ Progress saving works: `components/CoursePlayer.tsx` saves to database
- ❌ Progress loading not implemented: Component doesn't fetch existing progress on mount

**Files:**

- `components/CoursePlayer.tsx` (line 23-31): Progress state initialized as empty
- `app/api/course/progress/route.ts`: GET endpoint exists but not called

**What needs to be done:**

- [ ] Add useEffect to load progress on component mount
- [ ] Call GET `/api/course/progress?userId=...&courseId=...`
- [ ] Populate `completedModules` state from API response
- [ ] Handle loading states

**Estimated Time:** 1-2 hours

---

### 4. Course Content Page Authentication

**Status:** Placeholder implementation  
**Priority:** High  
**Impact:** Course page always redirects (userId is always undefined)

**Files:**

- `app/course/content/page.tsx` (line 27-34): Hardcoded `userId = undefined`, always redirects

**What needs to be done:**

- [ ] Get userId from auth session (requires Priority 1: Authentication)
- [ ] Remove placeholder redirect logic
- [ ] Implement proper auth check

**Estimated Time:** 1 hour (after auth is implemented)

---

## 🟠 Medium Priority - Stubs/Placeholders

### 5. Rate Limiting Logic Stub

**Status:** Stub function exists  
**Priority:** Medium  
**Impact:** Function exists but always returns false

**Files:**

- `lib/ai-agent.ts` (line 89-95): `shouldRateLimit()` function is a stub

**Note:** Actual rate limiting IS implemented in `app/api/ai-agent/route.ts` using `checkRateLimit()` from `lib/supabase.ts`. This stub function appears unused.

**What needs to be done:**

- [ ] Remove stub function if unused, OR
- [ ] Implement proper logic if it's needed elsewhere

**Estimated Time:** 30 minutes

---

### 6. Voice Agent Rate Limiting

**Status:** TODO comment  
**Priority:** Medium  
**Impact:** Voice agent has no rate limiting

**Files:**

- `app/api/voice-agent/session/route.ts` (line 23-33): TODO comment for rate limiting

**What needs to be done:**

- [ ] Add rate limiting check before creating session
- [ ] Use same rate limiting logic as AI agent
- [ ] Return 429 error if limit exceeded

**Estimated Time:** 1 hour

---

## 🔵 Low Priority - Planned Features

### 7. Admin Dashboard

**Status:** Not started  
**Priority:** Low (Priority 3 in ROADMAP.md)  
**Impact:** No way to manage feedback, users, or view analytics

**What needs to be done:**

- [ ] Create admin dashboard layout (`app/admin/layout.tsx`)
- [ ] Create dashboard overview (`app/admin/page.tsx`)
- [ ] Feedback management page (`app/admin/feedback/page.tsx`)
- [ ] User management page (`app/admin/users/page.tsx`)
- [ ] Subscription management page (`app/admin/subscriptions/page.tsx`)
- [ ] Create admin components (`components/admin/FeedbackTable.tsx`, etc.)
- [ ] Admin authentication check

**Estimated Time:** 6-8 hours

---

### 8. Course Content System

**Status:** Pages exist but need content  
**Priority:** Low (Priority 4 in ROADMAP.md)  
**Impact:** Users can purchase but no content to view

**What needs to be done:**

- [ ] Build course content viewer
- [ ] Add progress tracking (partially done)
- [ ] Create course curriculum structure
- [ ] Add video/article content components
- [ ] Implement completion tracking
- [ ] Certificate generation (future)

**Estimated Time:** 8-10 hours

---

### 9. Feedback System Enhancements

**Status:** Basic functionality complete  
**Priority:** Low (Priority 5 in ROADMAP.md)  
**Impact:** Missing advanced features

**What needs to be done:**

- [ ] Email notifications for new feedback
- [ ] Feedback analytics dashboard
- [ ] Auto-tagging based on content
- [ ] Response functionality (reply to feedback)
- [ ] Feedback status tracking (new, in-progress, resolved)

**Estimated Time:** 3-4 hours

---

## 📋 Summary by Status

### Not Started (0% complete)

1. User Authentication System
2. Admin Dashboard
3. Course Content System (content creation)
4. Feedback System Enhancements

### Partially Complete (50-80% complete)

1. Chat History UI (backend done, UI missing)
2. Course Progress Loading (saving works, loading missing)
3. Course Content Page (needs auth integration)

### Stubs/Placeholders (needs implementation)

1. Rate Limiting Logic Stub (`lib/ai-agent.ts`)
2. Voice Agent Rate Limiting

---

## 🎯 Recommended Implementation Order

1. **User Authentication** (4-6 hours) - Unblocks everything else
2. **Course Progress Loading** (1-2 hours) - Quick win, improves UX
3. **Chat History UI** (3-4 hours) - High user value
4. **Voice Agent Rate Limiting** (1 hour) - Security/abuse prevention
5. **Admin Dashboard** (6-8 hours) - Management tools
6. **Course Content System** (8-10 hours) - Content delivery
7. **Feedback Enhancements** (3-4 hours) - Polish

**Total Estimated Time:** 26-35 hours

---

## 🔍 How This Was Found

This analysis was performed by:

1. Searching for TODO/FIXME comments
2. Searching for "placeholder", "coming soon", "not implemented"
3. Reviewing ROADMAP.md and CHANGELOG.md
4. Examining API routes and components for incomplete implementations
5. Checking for stub functions and placeholder values
