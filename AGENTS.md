# AI Agent Handbook - SteveOS

This document provides context and guidelines for AI agents working on the SteveOS codebase.

## 1. Project Overview

**SteveOS** is the personal operating system and portfolio for Steve Defendre. It acts as a central hub for his projects, writings, and digital identity.

### Key Entities

- **Project**: SteveOS
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
  - `api/`: API routes (calendar, newsletter, RSS).
- `components/`: Reusable UI components.
  - `ui/`: Shadcn UI component library (Avatar, Badge, Button, Card, Chart, Dialog, etc.).
  - `dashboard-*.tsx`: Dashboard-specific components (sidebar, header, skeletons).
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
