import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://defendre-solutions.vercel.app')

  const routes = ['', '/services', '/work', '/about', '/blog', '/features']

  const routeEntries = routes.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: new URL(`/blog/${post.id}`, base).toString(),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routeEntries, ...blogEntries]
}
