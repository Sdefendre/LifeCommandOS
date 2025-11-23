'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { PROJECTS } from '@/constants/projects'
import { createFadeInUp, viewportOnce } from '@/lib/motion'
import { SearchBar } from '@/components/SearchBar'
import dynamic from 'next/dynamic'

// Lazy load Three.js background to improve initial render
const SubtleThreeBackground = dynamic(
  () =>
    import('@/components/SubtleThreeBackground').then((mod) => ({
      default: mod.SubtleThreeBackground,
    })),
  { ssr: false }
)

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative">
      <SubtleThreeBackground />
      <SiteHeader />

      <main className="container mx-auto px-3 sm:px-4 max-w-5xl py-12 sm:py-16 md:py-20">
        <div className="max-w-2xl mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Work</h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            A curated collection of operational systems, full-stack applications, and technical
            experiments designed for precision and impact.
          </p>
        </div>

        <SearchBar
          items={PROJECTS}
          searchKeys={['title', 'desc', 'tag']}
          placeholder="Search projects..."
          emptyMessage="No projects found matching your search."
          containerClassName="grid gap-6 sm:gap-8"
          renderItem={(project, index) => {
            // Determine if the link is internal (starts with /) or external
            const isInternalLink = project.links?.live?.startsWith('/')
            const href = project.links?.live || '#'

            const cardContent = (
              <motion.article
                variants={createFadeInUp(false)}
                initial="initial"
                whileInView="animate"
                viewport={viewportOnce}
                className="group border border-border rounded-xl p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:bg-accent/10 cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h2 className="text-xl sm:text-2xl font-semibold">{project.title}</h2>
                      <span className="text-xs font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground shrink-0 self-start sm:self-auto">
                        {project.tag}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                      {project.desc}
                    </p>

                    {project.metrics && (
                      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-4">
                        {project.metrics.split('•').map((metric, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-background border border-border px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
                          >
                            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                            <span className="break-words">{metric.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      <span>View project</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              </motion.article>
            )

            // Use Next.js Link for internal routes, regular anchor for external
            if (isInternalLink) {
              return (
                <Link key={index} href={href}>
                  {cardContent}
                </Link>
              )
            }

            return (
              <a key={index} href={href} target="_blank" rel="noopener noreferrer">
                {cardContent}
              </a>
            )
          }}
        />

        <div className="mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            Ready to execute a mission-critical project?
          </p>
          <Link
            href="/#contact"
            className="font-medium hover:underline underline-offset-4 flex items-center gap-2 hover:text-primary transition-colors text-sm sm:text-base"
          >
            Initiate Contact{' '}
            <motion.span whileHover={{ x: 5 }}>
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </div>
      </main>
    </div>
  )
}
