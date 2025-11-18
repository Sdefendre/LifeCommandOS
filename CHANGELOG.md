# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Dashboard System**: Comprehensive financial dashboard with sidebar navigation
  - Financial metrics cards (Balance, Spending, Budget, Savings)
  - Interactive charts using Recharts (spending trends, category breakdowns)
  - Transaction management with CSV import functionality
  - Budget tracking across multiple categories
  - Editable metric values via dialog interface
  - Loading states with skeleton components
- **Dashboard Routes**: Multiple dashboard pages
  - `/dashboard` - Main overview page
  - `/dashboard/transactions` - Transaction history
  - `/dashboard/budgets` - Budget management
  - `/dashboard/reports` - Financial reports
  - `/dashboard/savings` - Savings goals
  - `/dashboard/balance` - Balance details
- **Dashboard Components**:
  - `DashboardSidebar` - Navigation sidebar with active route highlighting
  - `DashboardHeader` - Header component for dashboard pages
  - `DashboardCardSkeleton` - Loading skeleton for dashboard cards
- **Google Calendar Integration**:
  - API route (`/api/calendar`) for fetching Google Calendar events
  - Support for API key authentication
  - Calendar event formatting and display
  - Setup documentation in `GOOGLE_CALENDAR_SETUP.md`
- **UI Component Library**: Added Shadcn UI components
  - Avatar, Badge, Button, Calendar, Card, Chart
  - Dialog, Dropdown Menu, Input, Label, Popover
  - Progress, Select, Separator, Sheet, Skeleton, Table, Tabs
- **CSV Processing**: PapaParse integration for bank statement imports
- **Chart Library**: Recharts integration for data visualization
- **Date Utilities**: date-fns for date formatting and calculations
- Blog: Added "DreamGuard: The Subconscious Sentinel" post
- Blog: Added "PulsePod: The Rhythm of Life" post
- Blog: Added "Sentinel Mirror: Reflection Redefined" post
- Blog: Added "LifeLine X: The Ultimate Safety Net" post
- Blog: Per-post routes (`/blog/[id]`), tag filter bar with `?tag=` links, clickable tags on cards
- Work: Clickable case study cards linking to live sites
- Animations: Shared motion utilities (`lib/motion.ts`) and reduced-motion support
- SEO: Dynamic `sitemap.ts` and `robots.ts`, JSON-LD on blog posts
- DX: Prettier + Husky + lint-staged, GitHub Actions CI (type-check, lint, build)
- Structure: Split `constants.tsx` into `constants/{site,services,projects,blog,testimonials}.ts`
- Multi-page architecture with dedicated routes
- Services page with interactive category tabs and keyboard navigation (arrow keys, Home/End)
- Work page combining case studies and testimonials with metrics
- About page with company story and team information
- Blog functionality with dedicated listing page
- Blog post cards with glassmorphism design and comprehensive content
- Mission statement section with veteran badge on homepage
- Project metrics display with bullet-separated format
- Contact section with project timelines and pricing information
- WCAG 2.1 AA accessibility compliance with full keyboard navigation
- ARIA attributes and semantic HTML throughout
- Focus management for mobile menu and interactive elements
- Service category management system in constants.tsx
- Enhanced content structure for consultancy business model
- Comprehensive project documentation updates

### Changed

- **Dependencies**: Added new packages
  - `recharts` - Chart library for data visualization
  - `react-day-picker` - Calendar component
  - `date-fns` - Date utility library
  - `papaparse` - CSV parsing library
  - `googleapis` - Google Calendar API integration
  - Additional Radix UI components for dashboard UI
- **Project Structure**: Added dashboard directory structure
  - `app/dashboard/` - Dashboard routes and layout
  - `components/ui/` - Shadcn UI component library
  - `components/dashboard-*.tsx` - Dashboard-specific components
- Transformed from portfolio to consultancy-focused website
- Homepage restructured with mission, services preview, work preview
- Navigation updated with new page links (Services, Work, About)
- Route renamed from `/success-stories` to `/work` for consistency
- Contact section redesigned with project information instead of contact form
- Services moved from hardcoded to data-driven via SERVICES constant
- Projects enhanced with metrics and improved card design
- Glass button styling improved to remove visual artifacts
- Mobile menu styling enhanced with glassmorphism consistency
- Newsletter subscription: improved accessibility (aria-live/roles) and reduced-motion friendly entrance animation
- Floating background: respect prefers-reduced-motion and reduce element count on small screens

### Technical Improvements

- Enabled Next Image optimization and set long-lived cache headers
- Added skip-to-content link and focus styles
- Standardized `PROJECTS.links` shape and types
- README.md updated with current project state and multi-page architecture
- CLAUDE.md updated with latest architecture changes and development patterns
- CONTRIBUTING.md enhanced with better guidelines
- DEVELOPMENT.md updated with current tech stack
- DEPLOYMENT.md updated with latest processes
- Component organization improved with better separation
- Accessibility implementation with keyboard navigation patterns
- Performance optimizations maintained with Framer Motion
- Fixed potential timer leaks in animated components by cleaning up timeouts
- Avoided unnecessary re-renders and heavy animations when reduced motion is requested

## [0.1.0] - 2024-12-19

### Added

- Initial Next.js 15 portfolio website
- Glassmorphism design with dark/light theme support
- Single-page application with smooth scroll navigation
- Hero section with animated introduction
- Services section with glass card grid
- Projects showcase with portfolio items
- Testimonials carousel
- Contact section with company information
- Responsive design for all device sizes
- SEO optimization with comprehensive meta tags
- Performance optimizations with Framer Motion
- TypeScript strict mode implementation
- Tailwind CSS v4 integration
- shadcn/ui component library
- Lucide React icons
- Animated floating dots background
- OKLCH color space for consistent theming
- Custom glassmorphism utility classes

### Technical Features

- Next.js 15 with App Router architecture
- React 19 with latest features
- TypeScript for type safety
- Framer Motion for animations
- PostCSS with Tailwind CSS v4
- ESLint configuration for code quality
- SWC minification for optimized builds
- Image optimization with WebP/AVIF support
- Google Fonts integration (Inter + Playfair Display)

### Content

- Company information and contact details
- Service offerings description
- Portfolio projects with live links
- Client testimonials
- Professional bio and background
- Social media integration (LinkedIn, GitHub)

### Performance

- Optimized bundle size with package-level imports
- Lazy loading for images and components
- Efficient re-renders with React 19 features
- Fast refresh development experience
- Production-ready build optimization

### Accessibility

- WCAG compliant design
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management for interactive elements

### SEO

- Complete meta tag implementation
- OpenGraph social media optimization
- Twitter Card integration
- Structured data for search engines
- Sitemap and robots.txt files
- Google Search Console preparation

---

## Version History Format

### [Version] - Date

#### Added

- New features

#### Changed

- Changes in existing functionality

#### Deprecated

- Soon-to-be removed features

#### Removed

- Removed features

#### Fixed

- Bug fixes

#### Security

- Security improvements
