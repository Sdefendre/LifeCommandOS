# AI Agent Handbook - Life Command OS

This document provides context and guidelines for AI agents working on the Life Command OS codebase.

## 1. Project Overview

**Life Command OS** is the personal operating system and portfolio for Steve Defendre. It acts as a central hub for his projects, writings, and digital identity.

### Key Entities

- **Project**: Life Command OS
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
  - `dashboard/`: Financial dashboard routes and layout.
  - `features/`: Features page with roadmap and changelog.
  - `api/`: API routes (calendar, newsletter, RSS, ai-agent, stripe).
- `components/`: Reusable UI components.
  - `ui/`: Shadcn UI component library (Avatar, Badge, Button, Card, Chart, Dialog, etc.).
  - `dashboard-*.tsx`: Dashboard-specific components (sidebar, header, skeletons).
  - `ClientOnlyComponents.tsx`: Lazy-loaded client-only components wrapper.
  - `*Background*.tsx`: Three.js background components with wrappers.
- `constants/`: Static content (text, pricing, blog posts) - **Edit these to change site copy.**
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

## 5. Common Commands

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Check for linting errors.
- `npm run format`: Format code with Prettier.
- `npm run send-newsletter`: Send newsletter to subscribers.

## 6. Dashboard Development

### Dashboard Structure

- Dashboard uses a layout component (`app/dashboard/layout.tsx`) with sidebar and header.
- Main dashboard page is at `app/dashboard/page.tsx`.
- Uses Shadcn UI components from `components/ui/`.
- Charts use Recharts library with ChartContainer wrapper.

### Key Patterns

- **Client Components**: Dashboard pages use `"use client"` for interactivity.
- **State Management**: Uses React hooks (useState, useEffect) for local state.
- **Data Visualization**: Recharts with ChartConfig for consistent theming.
- **Loading States**: Skeleton components for better UX during data loading.
- **CSV Processing**: PapaParse for client-side CSV parsing (no backend required).

### Google Calendar Integration

- API route at `app/api/calendar/route.ts`.
- Requires `GOOGLE_CALENDAR_API_KEY` environment variable.
- See `GOOGLE_CALENDAR_SETUP.md` for setup instructions.

## 7. Deployment

- Deploys to Vercel.
- Environment variables must be configured in Vercel dashboard.
- Google Calendar API key should be added as environment variable.

## 8. Linear Project Management

This project is connected to Linear for issue tracking and project management.

### Linear Project Details

- **Project Name**: Life Command OS
- **Project ID**: `cea70c7e-066a-4e85-931c-2e5983067453`
- **Team**: Ceceriforma
- **Project URL**: [https://linear.app/ceceriforma/project/life-command-os-113a92ca8686](https://linear.app/ceceriforma/project/life-command-os-113a92ca8686)

### Using Linear MCP

When creating Linear issues related to this project, always specify the project:

```typescript
// Example: Create an issue for the Life Command OS project
project: 'Life Command OS'
// or
project: 'cea70c7e-066a-4e85-931c-2e5983067453'
```

### Common Linear Operations

- **Create Issues**: Use Linear MCP to create issues directly from code discussions
- **Link Issues**: Reference Linear issues in commit messages or PR descriptions
- **Track Features**: Use Linear to track feature requests and bug reports
- **Project Planning**: Organize work items in the Life Command OS project

### Best Practices

- Create Linear issues for significant bugs or feature requests
- Link issues to relevant code changes when possible
- Use descriptive titles and include context in issue descriptions
- Assign issues to appropriate team members when working collaboratively
