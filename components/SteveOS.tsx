'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Github, Linkedin, Mail } from 'lucide-react'
import { SITE } from '@/constants/site'
import { PROJECTS } from '@/constants/projects'
import { BLOG_POSTS } from '@/constants/blog'
import type { ProjectLinks } from '@/constants/projects'

import { SiteHeader } from '@/components/SiteHeader'
import { YouTubeSection } from '@/components/YouTubeSection'
import { GithubWidget } from '@/components/GithubWidget'
import type { GithubRepo } from '@/lib/github'

export default function SteveOS({ repos = [] }: { repos?: GithubRepo[] }) {
  const sortedBlogPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  const ProjectCard = ({
    title,
    tag,
    desc,
    links,
    metrics,
  }: {
    title: string
    tag: string
    desc: string
    links: ProjectLinks
    metrics?: string
  }) => {
    // Determine if the link is internal (starts with /) or external
    const isInternalLink = links?.live?.startsWith('/')
    const href = links?.live || '#'

    const cardContent = (
      <motion.article
        className="group border border-border rounded-lg p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold flex-1 min-w-0">{title}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground shrink-0">
            {tag}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 sm:mb-4 leading-relaxed">{desc}</p>

        {metrics && (
          <div className="mb-3 sm:mb-4 pt-2 sm:pt-3 border-t border-border">
            <div className="space-y-1">
              {metrics.split('•').map((metric, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 bg-primary rounded-full shrink-0"></span>
                  <span className="break-words">{metric.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground group-hover:text-primary transition-colors">
          <span>View project</span>
          <ExternalLink size={12} />
        </div>
      </motion.article>
    )

    // Use Next.js Link for internal routes, regular anchor for external
    if (isInternalLink) {
      return <Link href={href}>{cardContent}</Link>
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    )
  }

  const BlogCard = ({
    title,
    excerpt,
    date,
    readTime,
    id,
  }: {
    title: string
    excerpt: string
    date: string
    readTime: string
    id: string
  }) => (
    <Link href={`/blog/${id}`} className="block group">
      <motion.article
        className="py-3 sm:py-4 border-b border-border group-last:border-0 transition-colors hover:bg-accent/30 rounded-lg px-3 sm:px-4 -mx-3 sm:-mx-4"
        whileHover={{ x: 4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-medium group-hover:underline underline-offset-4 decoration-muted-foreground/50 flex-1">
            {title}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap sm:ml-4 shrink-0">
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{excerpt}</p>
        <div className="text-xs text-muted-foreground/60">{readTime}</div>
      </motion.article>
    </Link>
  )

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />

      <main>
        <div className="container mx-auto px-3 sm:px-4 max-w-5xl">
          {/* Hero */}
          <section className="py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="max-w-3xl">
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
                  Welcome{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    Steve.
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-medium text-muted-foreground mb-4 sm:mb-6">
                  What would you like to build today?
                </p>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                  {SITE.mission}
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href="/work"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                    >
                      View My Work <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium border border-border hover:bg-accent transition-colors hover:shadow-md text-sm sm:text-base w-full sm:w-auto"
                    >
                      More About Me
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="h-px w-full bg-border" />

          {/* Selected Work */}
          <section className="py-12 sm:py-16 md:py-20">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Selected Work</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Recent projects and experiments.
                </p>
              </div>
              <Link
                href="/work"
                className="group text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 self-start sm:self-auto"
              >
                View all projects{' '}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {PROJECTS.slice(0, 4).map((project, i) => (
                <ProjectCard key={i} {...project} />
              ))}
            </div>
          </section>

          <GithubWidget repos={repos} />
        </div>

        <YouTubeSection />

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Latest Writing */}
          <section className="py-12 sm:py-16 md:py-20">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Writing</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Thoughts on software, strategy, and tech.
                </p>
              </div>
              <Link
                href="/blog"
                className="group text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 self-start sm:self-auto"
              >
                Read the blog{' '}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="max-w-2xl">
              {sortedBlogPosts.slice(0, 3).map((post, i) => (
                <BlogCard key={i} {...post} />
              ))}
            </div>
          </section>

          {/* Contact / Footer */}
          <section id="contact" className="py-12 sm:py-16 md:py-20 border-t border-border">
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Let&apos;s connect</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  I&apos;m always open to discussing new projects, opportunities, or just chatting
                  about tech.
                </p>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="flex items-center gap-2 sm:gap-3 text-sm hover:text-primary transition-colors break-all"
                  >
                    <Mail size={18} className="shrink-0" />{' '}
                    <span className="break-all">{SITE.email}</span>
                  </a>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-sm hover:text-primary transition-colors"
                  >
                    <Linkedin size={18} className="shrink-0" /> LinkedIn
                  </a>
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-sm hover:text-primary transition-colors"
                  >
                    <Github size={18} className="shrink-0" /> GitHub
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs text-muted-foreground text-center sm:text-left">
              <p>© {new Date().getFullYear()} SteveOS. All rights reserved.</p>
              <p>Built with Next.js & Tailwind.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
