'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, FileCode, Star } from 'lucide-react'
import { GithubRepo } from '@/lib/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SITE } from '@/constants/site'

interface GithubWidgetProps {
  repos: GithubRepo[]
}

export function GithubWidget({ repos }: GithubWidgetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!repos || repos.length === 0) return null

  // Calculate a pseudo-progress based on recency to match the visual style
  // Round to 2 decimal places to avoid hydration mismatches
  const getProgress = (dateString: string) => {
    if (!mounted) return 50 // Default value during SSR
    const daysSince = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24)
    // Newer = higher progress. 0 days = 95%, 30 days = 20%
    const progress = Math.min(95, Math.max(15, 100 - daysSince * 2.5))
    return Math.round(progress * 100) / 100 // Round to 2 decimal places
  }

  // Format date like "Due June 15, 2025" -> "Updated Nov 18, 2025"
  const formatDate = (dateString: string) => {
    return `Updated ${new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`
  }

  return (
    <section className="py-8 sm:py-12">
      <Card className="w-full border-border/60 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">Active Projects</CardTitle>
          <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
            <Link href={SITE.github} target="_blank" rel="noopener noreferrer">
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          {repos.slice(0, 4).map((repo, index) => {
            const progress = getProgress(repo.updated_at)

            return (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-base sm:text-lg leading-none tracking-tight">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline underline-offset-4 decoration-primary/50"
                        >
                          {repo.name}
                        </a>
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {repo.description || 'No description provided.'}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-xs font-normal hidden sm:inline-flex"
                    >
                      {formatDate(repo.updated_at)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Activity</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{repo.fork ? 'Collab' : 'Owner'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileCode size={14} />
                        <span>{repo.language || 'Text'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="sm:hidden text-[10px] py-0 h-5 border-border/50"
                      >
                        {new Date(repo.updated_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Badge>
                    </div>
                  </div>
                </div>
                {index < Math.min(repos.length, 4) - 1 && <Separator className="mt-6" />}
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}
