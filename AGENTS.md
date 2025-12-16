# AI Agent Handbook - Command

This document provides context and guidelines for AI agents working on the Command codebase.

## 1. Project Overview

**Command** is the personal operating system and portfolio for Steve Defendre. It acts as a central hub for his projects, writings, and digital identity.

### Key Entities

- **Project**: Command
- **Owner**: Steve Defendre
- **Core Philosophy**: Discipline, Precision, Resilience.

## 2. Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Utility-first).
- **UI Library**: Shadcn UI (Radix Primitives), Lucide React (Icons).
- **Animations**: Framer Motion.
- **State Management**: Minimal client state; preference for RSC.

## 3. File Structure

- `app/`: Routes and pages.
  - `battlestation/`: Financial BattleStation routes and layout.
  - `features/`: Features page with roadmap and changelog.
  - `command/`: Command AI chat interface page.
  - `api/`: API routes (calendar, newsletter, RSS, ai-agent, stripe, voice-agent).
- `components/`: Reusable UI components.
  - `ui/`: Shadcn UI component library (Avatar, Badge, Button, Card, Chart, Dialog, etc.).
  - `landing/`: Landing page sections (Hero, Features, Testimonials, Roadmap, Pricing, CTA, Footer).
  - `command/`: Command interface components (Chat, ChatSidebar, CommandMessage).
  - `dashboard-*.tsx`: BattleStation-specific components (sidebar, header, skeletons).
  - `ClientOnlyComponents.tsx`: Lazy-loaded client-only components wrapper.
  - `SaaSLanding.tsx`: Main landing page component with dynamic imports.
  - `SaaSLandingWrapper.tsx`: Client wrapper for landing page (SSR disabled).
  - `*Background*.tsx`: Three.js background components with wrappers.
- `constants/`: Static content (text, pricing, blog posts, landing page content) - **Edit these to change site copy.**
  - `landing.ts`: Landing page content (hero, features, pricing, etc.).
  - `ai.ts`: AI model configurations and options.
- `blog_posts/`: Long-form content for the blog.
- `public/`: Static assets.

## 4. Coding Guidelines

### General

- **Functional**: Use functional components.
- **Types**: Explicitly type everything with interfaces.
- **Naming**: PascalCase for components, kebab-case for files/directories.

### Styling

- Use Tailwind utility classes.
- `app/globals.css` for global themes.

### Performance

- Favor **React Server Components (RSC)**.
- Wrap client components in `<Suspense>` if they fetch data.
- Use **Dynamic Imports** with `dynamic()` from Next.js for code splitting.
- Use **Client-Only Components** wrapper (`ClientOnlyComponents.tsx`) for components requiring browser APIs.
- Lazy load non-critical components with `ssr: false` to improve initial page load.
- Use `dynamic()` imports with loading states for better UX during code splitting.
- **Landing Page**: All below-the-fold sections use dynamic imports with loading placeholders to prevent layout shift.
- **Three.js Backgrounds**: Loaded client-side only to avoid SSR issues.

## 5. Common Commands

- `pnpm dev`: Start development server (or `npm run dev`).
- `pnpm build`: Build for production (or `npm run build`).
- `pnpm lint`: Check for linting errors (or `npm run lint`).
- `pnpm format`: Format code with Prettier (or `npm run format`).
- `pnpm send-newsletter`: Send newsletter to subscribers.
- `pnpm scrape-reddit`: Scrape Reddit data for knowledge base.
- `pnpm verify-reddit-dataset`: Verify Reddit dataset integrity.
- `pnpm gh:status`: Check GitHub repository status.
- `pnpm gh:issues`: List GitHub issues.
- `pnpm gh:prs`: List GitHub pull requests.

## 6. BattleStation Development

### BattleStation Structure

- BattleStation uses a layout component (`app/battlestation/layout.tsx`) with sidebar and header.
- Main BattleStation page is at `app/battlestation/page.tsx`.
- Uses Shadcn UI components from `components/ui/`.
- Charts use Recharts library with ChartContainer wrapper.

### Key Patterns

- **Client Components**: BattleStation pages use `"use client"` for interactivity.
- **State Management**: Uses React hooks (useState, useEffect) for local state.
- **Data Visualization**: Recharts with ChartConfig for consistent theming.
- **Loading States**: Skeleton components for better UX during data loading.
- **CSV Processing**: PapaParse for client-side CSV parsing (no backend required).

### Google Calendar Integration

- API route at `app/api/calendar/route.ts`.
- Requires `GOOGLE_CALENDAR_API_KEY` environment variable.
- See `GOOGLE_CALENDAR_SETUP.md` for setup instructions.

## 7. Landing Page Development

### Landing Page Structure

The homepage (`app/page.tsx`) uses a Suspense boundary and wraps `SaaSLandingWrapper`:

- **SaaSLandingWrapper**: Client component that dynamically imports `SaaSLanding` with SSR disabled
- **SaaSLanding**: Main landing page component that imports all sections dynamically
- **Sections**: Hero, Features, Testimonials, Roadmap, Pricing, CTA, Footer
- **Performance**: Each section is dynamically imported with loading placeholders (min-height divs)

### Landing Page Components

Located in `components/landing/`:

- `LandingHero.tsx` - Hero section with CTA buttons
- `LandingFeatures.tsx` - Feature showcase grid
- `LandingTestimonials.tsx` - Customer testimonials carousel
- `LandingRoadmap.tsx` - Product roadmap preview
- `LandingPricing.tsx` - Pricing tiers and plans
- `LandingCTA.tsx` - Final call-to-action section
- `LandingFooter.tsx` - Footer with links and information
- `HeroThreeBackground.tsx` - Three.js background for hero section

### Content Management

- **Landing Page Content**: Edit `constants/landing.ts` to update all landing page copy
- **Pricing**: Pricing tiers are defined in `constants/landing.ts` under `LANDING_PRICING`
- **Features**: Feature list is in `constants/landing.ts` under `LANDING_FEATURES`
- **Testimonials**: Testimonial data is in `constants/testimonials.ts`

## 8. Command Interface Development

### Command Interface Structure

The `/command` page (`app/command/page.tsx`) provides an AI chat interface:

- **Chat**: Main chat component with sidebar navigation and conversation history
- **ChatSidebar**: Sidebar with conversation list, switching, and deletion (fully implemented)
- **CommandMessage**: Individual message rendering with markdown support
- **CommandThreeBackground**: Three.js background effects
- **VoiceAgent**: Voice input component with microphone support

### Key Features

- **Model Selection**: Dropdown to switch between AI models (GPT-4o, GPT-4o Mini, Grok, etc.)
- **Conversation Management**: Session-based conversation IDs stored in sessionStorage
- **Chat History**: Full conversation history UI with sidebar, switching, and deletion
- **Rate Limiting**: Daily query limits tracked via Supabase
- **Responsive Design**: Mobile-friendly with sheet menu for navigation
- **Voice Mode**: Toggle between text and voice input modes

### Command Interface Components

- `components/command/Chat.tsx` - Main chat interface
- `components/command/ChatSidebar.tsx` - Sidebar with conversation history
- `components/command/CommandMessage.tsx` - Message rendering
- `components/CommandThreeBackground.tsx` - Background effects
- `components/VoiceAgent.tsx` - Voice input handling

## 9. Deployment

- Deploys to Vercel.
- Environment variables must be configured in Vercel dashboard.
- Google Calendar API key should be added as environment variable.
- Supabase environment variables required for full functionality.

## 10. Linear Project Management

This project is connected to Linear for issue tracking and project management.

### Linear Project Details

- **Project Name**: Command
- **Project ID**: `cea70c7e-066a-4e85-931c-2e5983067453`
- **Team**: Ceceriforma
- **Project URL**: [https://linear.app/ceceriforma/project/command-113a92ca8686](https://linear.app/ceceriforma/project/command-113a92ca8686)

### Using Linear MCP

When creating Linear issues related to this project, always specify the project:

```typescript
// Example: Create an issue for the Command project
project: 'Command'
// or
project: 'cea70c7e-066a-4e85-931c-2e5983067453'
```

### Common Linear Operations

- **Create Issues**: Use Linear MCP to create issues directly from code discussions
- **Link Issues**: Reference Linear issues in commit messages or PR descriptions
- **Track Features**: Use Linear to track feature requests and bug reports
- **Project Planning**: Organize work items in the Command project

### Best Practices

- Create Linear issues for significant bugs or feature requests
- Link issues to relevant code changes when possible
- Use descriptive titles and include context in issue descriptions
- Assign issues to appropriate team members when working collaboratively
