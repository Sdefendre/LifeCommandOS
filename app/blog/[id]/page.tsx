import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/constants/blog'
import { CodeBlockEnhancer } from '@/components/CodeBlockEnhancer'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { ShareButtons } from '@/components/ShareButtons'
import { ReadingProgress } from '@/components/ReadingProgress'
import { FeedbackDialog } from '@/components/FeedbackDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SubtleThreeBackgroundWrapper } from '@/components/SubtleThreeBackgroundWrapper'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const post = BLOG_POSTS.find((p) => p.id === id)
  if (!post) return { title: 'Post not found' }
  const title = post.title
  const description = post.excerpt
  const ogImage = '/logo.png'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { id } = await params
  const post = BLOG_POSTS.find((p) => p.id === id)
  if (!post) {
    return (
      <main className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-3xl mx-auto">
          <p>Post not found.</p>
          <Link href="/blog" className="text-primary underline">
            Back to blog
          </Link>
        </div>
      </main>
    )
  }

  // Get related posts (same tags, excluding current post)
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.id !== post.id && p.tags?.some((tag) => post.tags?.includes(tag))
  ).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SubtleThreeBackgroundWrapper />
      <ReadingProgress />
      <div className="relative z-10">
        {/* Modern Header */}
        <header className="sticky top-0 left-0 right-0 backdrop-blur-md bg-background/80 border-b border-border z-40 shadow-sm">
          <nav className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 hover:bg-secondary">
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back to Blog</span>
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <FeedbackDialog path={`/blog/${id}`} />
              <span className="text-xs text-muted-foreground hidden sm:inline flex items-center gap-1.5">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
          </nav>
        </header>

        <main id="main-content" className="pt-8 pb-20">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <header className="mb-8 md:mb-12">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs flex items-center gap-1">
                    <Tag size={10} />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </header>

            {/* YouTube Embed */}
            {/* @ts-expect-error - YouTubeId is optional */}
            {post.youtubeId && (
              <div className="mb-8 md:mb-12 rounded-xl overflow-hidden border border-border shadow-lg">
                <YouTubeEmbed
                  // @ts-expect-error - youtubeId is optional in blog post type
                  videoId={post.youtubeId}
                  title={post.title}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-p:text-foreground/90 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-ul:my-6 prose-ol:my-6 prose-li:my-2">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Enhance code blocks after hydration */}
            <CodeBlockEnhancer />

            {/* Share Section */}
            <div className="mt-12 md:mt-16 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Share this article</h3>
                  <p className="text-sm text-muted-foreground">Help others discover this content</p>
                </div>
                <div className="flex-shrink-0">
                  <ShareButtons
                    title={post.title}
                    url={`https://steve-os.vercel.app/blog/${post.id}`}
                    description={post.excerpt}
                  />
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 md:mt-20 pt-12 border-t border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <Card className="group h-full border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
                        <div className="p-6 flex flex-col h-full">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary-gradient transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2 flex-1">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog CTA */}
            <div className="mt-12 md:mt-16">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-bold mb-3">Enjoyed this article?</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Explore more insights on software engineering, system architecture, and
                    operational excellence.
                  </p>
                  <Link href="/blog">
                    <Button size="lg" className="gap-2">
                      Browse All Articles
                      <ArrowLeft size={18} className="rotate-180" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </article>
        </main>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
