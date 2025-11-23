'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { PROJECTS } from '@/constants/projects'
import { createFadeInUp, viewportOnce } from '@/lib/motion'
import dynamic from 'next/dynamic'

// Lazy load Three.js background to improve initial render
const SubtleThreeBackground = dynamic(
  () =>
    import('@/components/SubtleThreeBackground').then((mod) => ({
      default: mod.SubtleThreeBackground,
    })),
  { ssr: false }
)

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative">
      <SubtleThreeBackground />
      <SiteHeader />

      <main className="container mx-auto px-4 max-w-5xl py-20">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Work</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A selection of projects ranging from full-stack applications to technical experiments.
          </p>
        </div>

        <div className="grid gap-8">
          {PROJECTS.map((project, index) => (
            <motion.article
              key={index}
              variants={createFadeInUp(false)}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              className="group border border-border rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:bg-accent/10"
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-semibold">{project.title}</h2>
                    <span className="text-xs font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground">
                      {project.tag}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                    {project.desc}
                  </p>

                  {project.metrics && (
                    <div className="mb-6 flex flex-wrap gap-4">
                      {project.metrics.split('•').map((metric, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground bg-background border border-border px-3 py-1.5 rounded-full"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>{metric.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-5">
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                      >
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                    {project.links?.code && (
                      <a
                        href={project.links.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        View Code <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-border flex justify-between items-center">
          <p className="text-muted-foreground">Interested in working together?</p>
          <Link
            href="/#contact"
            className="font-medium hover:underline underline-offset-4 flex items-center gap-2 hover:text-primary transition-colors"
          >
            Let&apos;s talk{' '}
            <motion.span whileHover={{ x: 5 }}>
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </div>
      </main>
    </div>
  )
}
