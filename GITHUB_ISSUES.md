# GitHub Issues for Command.ai

This file contains all identified issues formatted for easy creation in GitHub. Copy each section to create individual issues.

---

## Critical Priority

### Issue 1: Implement User Authentication System

**Labels:** `priority: critical`, `enhancement`, `blocking`

**Description:**
The application lacks a user authentication system, which blocks all personalized features from working properly.

**Current State:**
- `userId` is hardcoded as `undefined` in `/app/course/content/page.tsx:27`
- Course access, rate limiting, conversation history all depend on user authentication
- Stripe checkout references non-existent auth methods (`supabase.auth.admin.getUserById()`)
- No login/signup pages exist

**Acceptance Criteria:**
- [ ] Create login page at `/login`
- [ ] Create signup page at `/signup`
- [ ] Implement auth context provider
- [ ] Integrate Supabase Auth
- [ ] Add protected route middleware
- [ ] Create user profile page at `/profile`
- [ ] Implement email verification flow
- [ ] Update all `userId = undefined` references to use real auth

**Files to Modify:**
- `app/course/content/page.tsx`
- `app/api/stripe/checkout/route.ts`
- `app/api/ai-agent/route.ts`
- Create new: `app/login/page.tsx`, `app/signup/page.tsx`, `components/AuthProvider.tsx`

---

### Issue 2: Fix Stripe Environment Variable Validation

**Labels:** `priority: critical`, `bug`, `payments`

**Description:**
Stripe integration silently accepts empty environment variables, causing unclear failures in production.

**Current State:**
- `STRIPE_WEBHOOK_SECRET` accepts empty string (line 16 in `app/api/stripe/webhook/route.ts`)
- `STRIPE_COURSE_PRICE_ID` accepts empty string (line 16 in `app/api/stripe/checkout/route.ts`)
- No startup validation for required payment config

**Acceptance Criteria:**
- [ ] Add startup validation for all Stripe environment variables
- [ ] Return clear error messages when config is missing
- [ ] Add `.env.example` with all required Stripe variables documented
- [ ] Log warnings in development mode for missing optional config

**Files to Modify:**
- `app/api/stripe/webhook/route.ts`
- `app/api/stripe/checkout/route.ts`
- Create/update: `.env.example`

---

### Issue 3: Complete Course Progress Database Integration

**Labels:** `priority: critical`, `enhancement`, `courses`

**Description:**
Course progress saving has a TODO comment and silently fails without proper error handling.

**Current State:**
- `CoursePlayer.tsx:53` has `// TODO: Save progress to database`
- Progress calculation exists but database save uses `.catch()` that only logs
- No retry logic or user feedback on save failure

**Acceptance Criteria:**
- [ ] Implement proper progress saving to Supabase
- [ ] Add optimistic UI updates with rollback on failure
- [ ] Show toast notification on save success/failure
- [ ] Add retry logic for transient failures
- [ ] Track completion status per lesson/module

**Files to Modify:**
- `components/CoursePlayer.tsx`
- `lib/supabase.ts` (add progress functions)

---

## High Priority

### Issue 4: Implement Rate Limiting Logic

**Labels:** `priority: high`, `enhancement`, `api`

**Description:**
Rate limiting function exists but always returns `false`, allowing unlimited API usage.

**Current State:**
- `lib/ai-agent.ts:90` has `// TODO: Implement rate limiting logic`
- Function `shouldRateLimit()` just returns `false`
- No database integration for tracking usage

**Acceptance Criteria:**
- [ ] Implement rate limit checking against Supabase
- [ ] Track usage per user/IP for free tier (10 queries/day)
- [ ] Bypass rate limiting for Pro/Lifetime subscribers
- [ ] Return clear error message when rate limited
- [ ] Add rate limit headers to API responses

**Files to Modify:**
- `lib/ai-agent.ts`
- `app/api/ai-agent/route.ts`

---

### Issue 5: Create Admin Dashboard

**Labels:** `priority: high`, `enhancement`, `admin`

**Description:**
No admin interface exists for managing users, feedback, and subscriptions.

**Current State:**
- Listed in ROADMAP.md as Priority 3 (not started)
- No admin pages or routes exist
- Feedback, users, and subscriptions cannot be managed

**Acceptance Criteria:**
- [ ] Create admin layout at `/admin`
- [ ] Add admin authentication/authorization
- [ ] Create feedback management page (`/admin/feedback`)
- [ ] Create user management page (`/admin/users`)
- [ ] Create subscription management page (`/admin/subscriptions`)
- [ ] Add analytics dashboard (`/admin/analytics`)
- [ ] Implement feedback status tracking (new, in-progress, resolved)

**Files to Create:**
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/feedback/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/subscriptions/page.tsx`
- `app/admin/analytics/page.tsx`

---

### Issue 6: Replace Dashboard Mock Data with Supabase Integration

**Labels:** `priority: high`, `enhancement`, `dashboard`

**Description:**
The WealthWise BattleStation uses localStorage mock data instead of real database integration.

**Current State:**
- `components/dashboard/dashboard-context.tsx:49` comments "Initialize with mock data"
- All financial data stored in localStorage only
- No sync between devices or persistence in database

**Acceptance Criteria:**
- [ ] Create Supabase tables for transactions, budgets, savings goals
- [ ] Migrate dashboard context to use Supabase
- [ ] Implement real-time sync with Supabase subscriptions
- [ ] Add data migration for existing localStorage data
- [ ] Maintain offline support with sync on reconnect

**Files to Modify:**
- `components/dashboard/dashboard-context.tsx`
- `lib/supabase.ts`
- Create: `supabase/migrations/xxx_dashboard_tables.sql`

---

### Issue 7: Implement Voice Agent Rate Limiting

**Labels:** `priority: high`, `enhancement`, `api`

**Description:**
Voice agent session endpoint has rate limiting code commented out.

**Current State:**
- `app/api/voice-agent/session/route.ts:23` has `// TODO: Add rate limiting check here if needed`
- Rate limiting logic is commented out (lines 23-33)
- No protection against abuse

**Acceptance Criteria:**
- [ ] Uncomment and implement rate limiting
- [ ] Share rate limiting logic with AI agent endpoint
- [ ] Add appropriate limits for voice sessions (more expensive than text)

**Files to Modify:**
- `app/api/voice-agent/session/route.ts`
- `lib/ai-agent.ts` (shared rate limit logic)

---

## Medium Priority

### Issue 8: Add Test Coverage

**Labels:** `priority: medium`, `testing`, `tech-debt`

**Description:**
The project has zero test files and no testing infrastructure.

**Current State:**
- No `.test.ts` or `.spec.ts` files exist
- No Jest/Vitest configuration
- No E2E test setup (Playwright/Cypress)
- DEPLOYMENT.md has no testing checklist

**Acceptance Criteria:**
- [ ] Set up Vitest for unit testing
- [ ] Add tests for critical API routes (`/api/ai-agent`, `/api/stripe/*`)
- [ ] Add tests for utility functions in `/lib`
- [ ] Set up Playwright for E2E testing
- [ ] Add tests for auth flow (once implemented)
- [ ] Add CI pipeline for running tests
- [ ] Achieve minimum 60% code coverage for critical paths

**Files to Create:**
- `vitest.config.ts`
- `playwright.config.ts`
- `__tests__/` directory structure
- `.github/workflows/test.yml`

---

### Issue 9: Improve Error Handling Consistency

**Labels:** `priority: medium`, `enhancement`, `ux`

**Description:**
Error handling is inconsistent across the application, using browser alerts instead of proper UI components.

**Current State:**
- `CheckoutButton.tsx:62` uses `alert('Failed to start checkout...')`
- `upcoming-bills.tsx` uses native `confirm()` dialog
- Some errors silently caught with `.catch()` that only logs
- No consistent toast/notification system

**Acceptance Criteria:**
- [ ] Replace all `alert()` calls with toast notifications
- [ ] Replace all `confirm()` calls with modal dialogs
- [ ] Implement consistent error boundary components
- [ ] Add user-friendly error messages for all API failures
- [ ] Log errors to monitoring service (Sentry/LogRocket)

**Files to Modify:**
- `components/CheckoutButton.tsx`
- `components/dashboard/upcoming-bills.tsx`
- All components using `alert()` or `confirm()`
- Create: `components/ui/toast.tsx` (if not using shadcn toast)

---

### Issue 10: Fix TypeScript Type Safety Issues

**Labels:** `priority: medium`, `tech-debt`, `typescript`

**Description:**
There are 39 instances of loose `any` types and TypeScript workarounds throughout the codebase.

**Current State:**
- 39 instances of `any` type across codebase
- `as any` casts in `components/AIAgentChat.tsx` (lines 51, 58)
- `@ts-expect-error` in `app/api/ai-agent/route.ts:169`
- Reduces type safety and IDE support

**Acceptance Criteria:**
- [ ] Replace all `any` types with proper types
- [ ] Remove all `as any` casts
- [ ] Fix or document all `@ts-expect-error` comments
- [ ] Enable stricter TypeScript settings in `tsconfig.json`
- [ ] Add types for all API responses

**Files to Modify:**
- `components/AIAgentChat.tsx`
- `app/api/ai-agent/route.ts`
- All files with `any` types
- `tsconfig.json`

---

### Issue 11: Remove Console Logging for Production

**Labels:** `priority: medium`, `tech-debt`, `logging`

**Description:**
There are 90 `console.log()` statements that should use proper logging in production.

**Current State:**
- 90 instances of `console.log()` throughout codebase
- 8 instances of `console.warn()`
- No structured logging system
- Logs may expose sensitive information

**Acceptance Criteria:**
- [ ] Implement proper logging utility (e.g., pino, winston)
- [ ] Replace `console.log()` with appropriate log levels
- [ ] Add environment-based log filtering (debug in dev, error in prod)
- [ ] Ensure no sensitive data is logged
- [ ] Add request ID tracking for API logs

**Files to Modify:**
- Create: `lib/logger.ts`
- All files with `console.log()` statements

---

### Issue 12: Improve Accessibility (a11y)

**Labels:** `priority: medium`, `accessibility`, `enhancement`

**Description:**
The application has limited accessibility support with only 34 ARIA attributes across 100+ components.

**Current State:**
- Only 34 `aria-*` attributes across 20 component files
- Missing ARIA labels on many interactive elements
- Keyboard navigation not fully tested
- No screen reader testing documented

**Acceptance Criteria:**
- [ ] Audit all interactive elements for proper ARIA labels
- [ ] Add `aria-label` to icon-only buttons
- [ ] Ensure proper heading hierarchy (h1 > h2 > h3)
- [ ] Add skip links for main content
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Add keyboard navigation for all modals/dialogs
- [ ] Document accessibility features

**Files to Modify:**
- All interactive components
- `components/ui/*.tsx`
- `app/layout.tsx` (skip links)

---

### Issue 13: Add Environment Variable Validation on Startup

**Labels:** `priority: medium`, `enhancement`, `dx`

**Description:**
Environment variables are not validated on startup, leading to runtime errors.

**Current State:**
- Hardcoded fallback email `'steve.defendre12@gmail.com'` appears 6 times
- Inconsistent site URLs (`steve-os.vercel.app` vs `defendre-solutions.vercel.app`)
- No validation of required vs optional env vars

**Acceptance Criteria:**
- [ ] Create environment validation schema (zod or similar)
- [ ] Validate all required env vars on app startup
- [ ] Fail fast with clear error messages for missing required vars
- [ ] Log warnings for missing optional vars
- [ ] Remove all hardcoded fallback values
- [ ] Create comprehensive `.env.example`

**Files to Create/Modify:**
- Create: `lib/env.ts`
- Update: `next.config.mjs` or create `instrumentation.ts`
- Create: `.env.example`

---

## Low Priority

### Issue 14: Implement Email Notifications for Feedback

**Labels:** `priority: low`, `enhancement`, `notifications`

**Description:**
No email notifications are sent when users submit feedback or when feedback status changes.

**Current State:**
- Listed in ROADMAP.md Priority 5 (not started)
- Feedback is stored but no notifications sent
- Admins must manually check for new feedback

**Acceptance Criteria:**
- [ ] Send email to admin when new feedback is submitted
- [ ] Send confirmation email to user when feedback received
- [ ] Send notification when feedback status changes
- [ ] Add email templates for each notification type

**Files to Modify:**
- `app/api/feedback/route.ts`
- Create: `lib/email-templates/`

---

### Issue 15: Implement Feedback Auto-Tagging System

**Labels:** `priority: low`, `enhancement`, `ai`

**Description:**
Feedback items are not automatically categorized or tagged.

**Current State:**
- Listed in ROADMAP.md Priority 5 (not started)
- All feedback requires manual categorization
- No AI-powered analysis of feedback content

**Acceptance Criteria:**
- [ ] Use AI to categorize feedback (bug, feature request, question, etc.)
- [ ] Auto-assign priority based on content analysis
- [ ] Extract key topics/tags from feedback text
- [ ] Allow manual override of auto-tags

**Files to Modify:**
- `app/api/feedback/route.ts`
- Create: `lib/feedback-analysis.ts`

---

### Issue 16: Add Feedback Response/Reply Functionality

**Labels:** `priority: low`, `enhancement`, `admin`

**Description:**
Admins cannot respond to feedback within the application.

**Current State:**
- Listed in ROADMAP.md Priority 5 (not started)
- No reply functionality exists
- Communication must happen outside the app

**Acceptance Criteria:**
- [ ] Add reply form to admin feedback view
- [ ] Store reply history with feedback
- [ ] Send email notification to user with reply
- [ ] Show reply history to user in their feedback view

**Files to Modify:**
- Create: `app/admin/feedback/[id]/page.tsx`
- Create: `components/admin/FeedbackReply.tsx`

---

### Issue 17: Fix ESLint Rule Disabling

**Labels:** `priority: low`, `tech-debt`, `code-quality`

**Description:**
ESLint rules are disabled in some files instead of fixing the underlying issues.

**Current State:**
- `react-hooks/exhaustive-deps` disabled in `components/VoiceAgent.tsx:88`
- May be other disabled rules throughout codebase

**Acceptance Criteria:**
- [ ] Audit all ESLint disable comments
- [ ] Fix underlying issues instead of disabling rules
- [ ] Document any necessary exceptions with clear reasoning
- [ ] Enable stricter ESLint rules

**Files to Modify:**
- `components/VoiceAgent.tsx`
- `.eslintrc.json`

---

## Summary

| Priority | Count | Issues |
|----------|-------|--------|
| Critical | 3 | #1, #2, #3 |
| High | 4 | #4, #5, #6, #7 |
| Medium | 6 | #8, #9, #10, #11, #12, #13 |
| Low | 4 | #14, #15, #16, #17 |
| **Total** | **17** | |

### Suggested Labels to Create

- `priority: critical`
- `priority: high`
- `priority: medium`
- `priority: low`
- `blocking`
- `enhancement`
- `bug`
- `tech-debt`
- `testing`
- `accessibility`
- `payments`
- `courses`
- `api`
- `admin`
- `dashboard`
- `ux`
- `typescript`
- `logging`
- `dx`
- `notifications`
- `ai`
- `code-quality`
