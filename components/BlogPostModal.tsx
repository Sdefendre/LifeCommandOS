'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  tags?: string[]
  youtubeId?: string
}

export default function BlogPostModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  if (!post) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
    >
      <div className="min-h-screen relative">
        <div className="relative z-10">
          <header className="sticky top-0 glass-header border-b border-white/10">
            <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <button
                onClick={onClose}
                className="glass-button px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-sm sm:text-base"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />{' '}
                <span className="hidden sm:inline">Back to Blog</span>
              </button>
              <button
                onClick={onClose}
                className="glass-button p-2 rounded-full hover:scale-105 transition-transform"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </header>
          <article className="max-w-4xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
            <div
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </div>
    </motion.div>
  )
}
