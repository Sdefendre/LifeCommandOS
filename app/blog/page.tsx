'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, FileText } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { BLOG_POSTS } from '@/constants/blog'
import { createFadeInUp, viewportOnce } from '@/lib/motion'
import { NewsletterSubscription } from '@/components/NewsletterSubscription'

export default function BlogPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />

      <main className="container mx-auto px-3 sm:px-4 max-w-3xl py-12 sm:py-16 md:py-20">
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Writing & Videos
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Thoughts on software engineering, system design, and building products.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {sortedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              variants={createFadeInUp(false)}
              initial="initial"
              whileInView="animate"
              whileHover={{ x: 6 }}
              viewport={viewportOnce}
              className="group transition-all duration-300 hover:bg-accent/30 rounded-lg p-3 sm:p-4 -mx-3 sm:-mx-4"
            >
              <Link href={`/blog/${post.id}`} className="block">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <h2 className="text-xl sm:text-2xl font-semibold group-hover:underline underline-offset-4 decoration-muted-foreground/50 flex items-center gap-2 flex-1 min-w-0">
                    {/* @ts-ignore */}
                    {post.youtubeId ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-100 text-red-600 mr-1 shrink-0">
                        <Play size={12} fill="currentColor" className="sm:w-3.5 sm:h-3.5" />
                      </span>
                    ) : null}
                    <span className="min-w-0">{post.title}</span>
                  </h2>
                  <time className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0 sm:ml-4">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-primary/80 group-hover:text-primary transition-colors">
                  {/* @ts-ignore */}
                  {post.youtubeId ? 'Watch video' : 'Read more'}{' '}
                  <motion.span whileHover={{ x: 5 }} className="inline-block">
                    <ArrowRight size={14} />
                  </motion.span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-10 md:pt-12 border-t border-border">
          <div className="bg-accent/30 rounded-xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Stay updated</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Get notified when I publish new articles. No spam, unsubscribe anytime.
            </p>
            <NewsletterSubscription />
          </div>
        </div>
      </main>
    </div>
  )
}
