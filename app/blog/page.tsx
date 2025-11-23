'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Clock, Search, X } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { BLOG_POSTS } from '@/constants/blog'
import { createFadeInUp, viewportOnce } from '@/lib/motion'
import { NewsletterSubscription } from '@/components/NewsletterSubscription'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'

// Lazy load Three.js background to improve initial render
const SubtleThreeBackground = dynamic(
  () =>
    import('@/components/SubtleThreeBackground').then((mod) => ({
      default: mod.SubtleThreeBackground,
    })),
  { ssr: false }
)

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return sortedPosts

    const query = searchQuery.toLowerCase().trim()
    return sortedPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [sortedPosts, searchQuery])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative">
      <SubtleThreeBackground />
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 max-w-4xl py-12 sm:py-16 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Writing & Videos</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Strategic insights on software engineering, system architecture, and operational
            excellence.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              aria-label="Search blog posts"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Posts List */}
        <div className="space-y-6 mb-16">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              variants={createFadeInUp(false)}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog/${post.id}`}>
                <Card className="group border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-xl sm:text-2xl font-bold group-hover:text-primary-gradient transition-colors flex-1">
                        {post.title}
                      </h2>
                      {/* @ts-expect-error - youtubeId is optional in blog post type */}
                      {post.youtubeId && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-600 shrink-0">
                          <Play size={14} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <time>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary-gradient text-sm font-medium group-hover:gap-2 transition-all">
                        Read
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-lg text-muted-foreground mb-4">No posts found</p>
            <button onClick={() => setSearchQuery('')} className="text-primary hover:underline">
              Clear search
            </button>
          </motion.div>
        )}

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="pt-12 border-t border-border"
        >
          <div className="bg-accent/30 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold mb-2">Stay Operational</h3>
            <p className="text-muted-foreground mb-6">
              Receive intelligence updates on new publications. No noise, unsubscribe anytime.
            </p>
            <NewsletterSubscription />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
