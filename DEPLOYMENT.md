# Deployment Guide

## Pre-Deployment Checklist

### 1. Content Review

- [ ] Update site information in `constants/site.ts` (name, email, tagline, mission)
- [ ] Review and update service categories and pricing in `constants/services.ts`
- [ ] Add real project URLs, descriptions, and metrics to `constants/projects.ts`
- [ ] Replace placeholder images with actual assets
- [ ] Update testimonials with real client quotes
- [ ] Verify contact information and email links are correct
- [ ] Review blog posts and ensure content is current
- [ ] Verify AI agent configuration and knowledge base content
- [ ] Check course content and Stripe integration
- [ ] Test BattleStation functionality and Google Calendar integration
- [ ] Verify features page displays correctly with roadmap and changelog

### 2. SEO & Performance

- [ ] Update `metadataBase` URL in `app/layout.tsx`
- [ ] Set `NEXT_PUBLIC_SITE_URL` (for sitemap/robots absolute URLs)
- [ ] Add Google Search Console verification code
- [ ] Test all internal links work correctly
- [ ] Verify images are optimized and load properly
- [ ] Run Lighthouse audit (aim for >90 in all categories)

### 3. Technical Setup

- [ ] Test all pages load correctly (homepage, battlestation, ai-agent, course, blog, about, work, features)
- [ ] Verify responsive design on mobile/tablet/desktop
- [ ] Test service category tabs work with keyboard navigation (arrow keys, Home/End)
- [ ] Test all external links open in new tabs
- [ ] Ensure smooth scrolling to anchor sections works on homepage
- [ ] Validate accessibility with keyboard navigation and screen readers
- [ ] Check ARIA attributes and semantic HTML structure
- [ ] Validate HTML and check for console errors
- [ ] Test AI agent chat functionality
- [ ] Verify BattleStation routes and components
- [ ] Test course enrollment and Stripe integration
- [ ] Verify Google Calendar integration (if configured)

### 4. Analytics Setup

- [ ] Vercel Analytics automatically enabled when deployed to Vercel
- [ ] No additional configuration needed for basic analytics
- [ ] View analytics at https://vercel.com/analytics after deployment

## Deployment Steps

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Domain**
   - Add custom domain in Vercel dashboard
   - Update `metadataBase` URL in code
   - Redeploy after URL change

### Option 2: Other Platforms

**Netlify:**

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18+

**Railway/Render:**

- Build command: `npm run build`
- Start command: `npm start`
- Node version: 18+

## Post-Deployment

### 1. Verification

- [ ] Visit live site and test all pages (homepage, battlestation, ai-agent, course, blog, about, work, features)
- [ ] Check mobile responsiveness across all pages
- [ ] Test service category tabs and keyboard navigation
- [ ] Verify email links and contact information work
- [ ] Test social media links and external project links
- [ ] Confirm favicon displays correctly
- [ ] Validate accessibility features and keyboard navigation
- [ ] Test AI agent chat with different models
- [ ] Verify BattleStation functionality and data visualization
- [ ] Test course enrollment flow
- [ ] Verify Google Calendar integration (if configured)

### 2. SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (optional)
- [ ] Test Open Graph preview on social media
- [ ] Verify structured data (optional)

### 3. Performance Monitoring

- [ ] Run Lighthouse audit on live site
- [ ] Check Core Web Vitals
- [ ] Monitor loading speeds
- [ ] Set up uptime monitoring (optional)
- [ ] View Vercel Analytics dashboard for real-time metrics
- [ ] Monitor Web Vitals in Vercel Analytics

## Environment Variables

### Required for Full Functionality

- `OPENAI_API_KEY`: Required for AI agent chat functionality
- `NEXT_PUBLIC_SUPABASE_URL`: Required for database features (rate limiting, knowledge base, conversations)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Required for Supabase client
- `SUPABASE_SERVICE_ROLE_KEY`: Required for server-side operations

### Optional

- `XAI_API_KEY`: For Grok model support in AI agent
- `GOOGLE_CALENDAR_API_KEY`: For calendar integration in BattleStation
- `GOOGLE_CALENDAR_ID`: Calendar ID (defaults to "primary")
- `STRIPE_SECRET_KEY`: For course payment processing
- `STRIPE_WEBHOOK_SECRET`: For Stripe webhook verification
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For newsletter email functionality
- `NEXT_PUBLIC_SITE_URL`: For absolute URLs in sitemap/robots (defaults to production URL)

## Troubleshooting

**Build Errors:**

- Check Node.js version (18+ required)
- Clear `.next` folder and rebuild
- Verify all imports are correct

**Image Issues:**

- Ensure images are in `public/` directory
- Check file names match exactly
- Verify image formats are supported

**Performance Issues:**

- Optimize images (use WebP/AVIF)
- Check bundle size with `npm run build`
- Review Lighthouse recommendations

## Maintenance

### Regular Updates

- Keep dependencies updated monthly
- Monitor Core Web Vitals
- Update content and portfolio projects
- Refresh testimonials periodically

### Security

- Update Next.js and dependencies regularly
- Monitor for security vulnerabilities
- Use HTTPS (automatic with Vercel)
- Keep contact information current
