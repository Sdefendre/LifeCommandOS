# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Command is an AI-powered education platform for veterans - a multi-page Next.js 15 application helping veterans navigate VA benefits, disability claims, and financial literacy.

## Development Commands

### Core Development

- `bun dev` - Start dev server with Turbopack disabled (localhost:3000)
- `bun build` - Production build with Next.js
- `bun start` - Start production server
- `bun lint` - Run ESLint on the codebase
- `bun format` - Format code with Prettier

### Utility Scripts

- `bun run check-ai-env` - Verify AI environment variables are configured
- `bun run scrape-valor-features` - Scrape Valor features documentation
- `bun run send-newsletter` - Send newsletter to subscribers

### GitHub CLI Shortcuts

- `bun gh:status` - Check repository status
- `bun gh:issues` - List GitHub issues
- `bun gh:prs` - List pull requests
- `bun gh:view` - View repository in browser

## Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Package Manager**: Bun (do NOT use npm, yarn, or pnpm)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI in `components/ui/`
- **Animations**: Framer Motion for all animations
- **3D Graphics**: React Three Fiber + drei for backgrounds
- **AI SDK**: Vercel AI SDK with streaming support
- **Database**: Supabase for conversations, rate limits, subscriptions
- **Charts**: Recharts for financial visualizations

### AI Chat System Architecture

The core AI functionality is built around Grok models via xAI with comprehensive context augmentation:

**Flow**: User input → API route → Prompt building (with KB context) → Grok streaming → Response

**Key Files**:

- `app/api/ai-agent/route.ts` - Main API endpoint handling streaming chat with rate limiting
- `lib/ai-agent.ts` - System prompts and prompt building logic with conversation history
- `lib/knowledge-base.ts` - VA benefits knowledge base search and formatting
- `lib/supabase.ts` - Database operations for rate limiting, conversations, subscriptions, course access
- `constants/ai.ts` - AI model configuration (currently only Grok 4.1 Fast)

**Important Implementation Details**:

- Uses Vercel AI SDK `streamText()` for streaming responses
- Rate limiting: Free tier (20 queries/day), Premium (1000 queries/day)
- Conversation IDs stored in sessionStorage for persistence
- Messages saved to Supabase after streaming completes
- Supports anonymous users with reduced rate limits (5 queries)
- Knowledge base context automatically injected into prompts
- Last 10 conversation messages included for context

### Client Components Architecture

**Command Chat Interface** (`components/command/`):

- `CommandPageClient.tsx` - Main page wrapper with client-only rendering
- `CommandChat.tsx` - Chat UI with sidebar navigation, model selection, voice input
- `CommandMessage.tsx` - Individual message rendering with markdown support
- `ChatInput.tsx` - Message input with textarea auto-resize
- `Messages.tsx` - Message list with scroll management
- `ChatSidebar.tsx` - Navigation sidebar with conversation history
- `ChatHeader.tsx` - Top header with model selector

**Landing Page Components** (`components/landing/`):
All sections dynamically imported for code splitting:

- `HeroThreeBackground.tsx` - Three.js animated background for hero
- `LandingHero.tsx`, `LandingFeatures.tsx`, `LandingTestimonials.tsx`, etc.
- `SaaSLandingWrapper.tsx` - Client-only wrapper with SSR disabled

**Client-Only Pattern**:

- `ClientOnlyComponents.tsx` - Wraps browser-only components (ScrollToTop, ChatFloatingButton)
- Uses Next.js dynamic imports with `ssr: false` to avoid hydration issues
- Three.js backgrounds and voice components are always client-only

### Data Management

**Static Content** (in `constants/`):

- `landing.ts` - Landing page content (features, hero, CTA, pricing)
- `blog.ts` - Blog posts data
- `roadmap.ts` - Product roadmap items
- `projects.ts` - Portfolio projects
- `testimonials.ts` - Customer testimonials
- `navigation.ts` - Site navigation structure
- `dashboard.ts` - BattleStation dashboard data
- `site.ts` - Site-wide configuration

**Dynamic Data** (Supabase tables):

- `ai_agent_conversations` - Chat message history with metadata
- `ai_agent_rate_limits` - Daily query limits per user
- `user_subscriptions` - Subscription tiers (free/premium/lifetime)
- `course_access` - User access to premium courses

### Route Structure

**Main Routes**:

- `/` - SaaS landing page with dynamic imports
- `/command` - AI chat interface (main feature)
- `/course` - Course overview
- `/course/content` - Course content viewer
- `/features` - Features page with roadmap and changelog
- `/work` - Portfolio showcase
- `/blog` - Blog listing
- `/blog/[id]` - Individual blog posts
- `/about` - About page
- `/privacy` - Privacy policy
- `/terms` - Terms of service

**BattleStation Routes** (`/battlestation/*`):

- `/battlestation` - Dashboard overview
- `/battlestation/transactions` - Transaction history
- `/battlestation/budgets` - Budget management
- `/battlestation/reports` - Financial reports
- `/battlestation/savings` - Savings goals
- `/battlestation/balance` - Balance details

**Deprecated Routes** (kept for backwards compatibility):

- `/dashboard/*` - Old dashboard routes (redirect to /battlestation)
- `/ai-agent` - Old chat route (redirect to /command)

### Performance Optimizations

**Code Splitting**:

- Landing page sections lazy loaded with Suspense boundaries
- VoiceAgent dynamically imported only when needed
- Three.js backgrounds client-only with dynamic imports
- Placeholder divs with min-heights prevent layout shift

**Client-Side Rendering Strategy**:

- `SaaSLanding` wrapped with `ssr: false` for optimal performance
- Browser-only APIs wrapped in `ClientOnlyComponents`
- Avoid hydration mismatches with careful SSR/CSR separation

## Environment Variables

**Required for AI Functionality**:

- `XAI_API_KEY` - Grok API key from x.ai (REQUIRED for chat)

**Required for Data Persistence**:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

**Optional**:

- `OPENAI_API_KEY` - For future OpenAI model support
- `GOOGLE_CALENDAR_API_KEY` - Google Calendar integration
- `GOOGLE_CALENDAR_ID` - Calendar ID (default: "primary")
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Newsletter functionality

**Important**: Run `bun run check-ai-env` to verify AI environment configuration before development.

## Development Notes

### Package Manager

Always use `bun` for this project. Do NOT use `npm`, `yarn`, or `pnpm`. Bun is significantly faster and can run TypeScript natively without transpilation.

### Dev Server Configuration

The dev command includes `TURBOPACK=0` to disable Turbopack. This is intentional for compatibility with certain dependencies.

### TypeScript Configuration

- Path alias `@/*` maps to project root
- Strict mode enabled
- JSX runtime: `react-jsx` (no need to import React)
- Target: ES2017 for broad compatibility

### Git Workflow

Project uses husky + lint-staged for pre-commit hooks:

- Automatically runs Prettier on staged files
- Configured in `lint-staged` field of package.json

### Linear Integration

Project linked to Linear workspace: https://linear.app/ceceriforma/project/life-command-os-113a92ca8686

- Team: Ceceriforma
- Project ID: `cea70c7e-066a-4e85-931c-2e5983067453`

## Common Development Patterns

### Adding New AI Models

1. Update `constants/ai.ts` with new model option
2. Modify `app/api/ai-agent/route.ts` to handle new provider
3. Test rate limiting and conversation storage
4. Update model selector in `CommandChat.tsx`

### Adding Knowledge Base Content

1. Add content to Supabase `knowledge_base` table
2. Content automatically searchable via `lib/knowledge-base.ts`
3. Relevant articles injected into AI prompts automatically

### Creating New Landing Sections

1. Create component in `components/landing/`
2. Add to `app/page.tsx` with dynamic import
3. Update `constants/landing.ts` with content data
4. Use Suspense with loading placeholder

### Working with Supabase

- Client creation handled by `getSupabaseClient()` in `lib/supabase.ts`
- Automatically selects service role key (server) or anon key (client)
- Gracefully degrades if Supabase not configured
- All database operations should handle null client
