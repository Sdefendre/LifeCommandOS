'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SITE } from '@/constants/site'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />

      <main className="container mx-auto px-3 sm:px-4 max-w-3xl py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 sm:mb-8">About Me</h1>

          <div className="prose prose-neutral max-w-none">
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              I'm Steve Defendre, a Full-Stack Engineer and Veteran. I build high-performance
              systems and intelligent tools that help people take command of their lives and
              operations.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 my-8 sm:my-12 not-prose">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Background</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Military service instilled discipline, precision, and operational resilience.
                  These principles drive my engineering approach: build systems that don't just
                  function—they execute with reliability and endurance.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Technical Focus</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  React ecosystem (Next.js), TypeScript, and Node.js form my core stack. I focus on
                  AI integration and building intelligent tools that amplify human capability and
                  operational efficiency.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mt-10 sm:mt-12 mb-4 sm:mb-6">
              Experience
            </h2>
            <div className="space-y-6 sm:space-y-8 not-prose">
              <div className="border-l-2 border-border pl-4 sm:pl-6 py-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                  <h3 className="font-semibold text-sm sm:text-base">Founder & Lead Engineer</h3>
                  <span className="text-xs sm:text-sm text-muted-foreground">2023 — Present</span>
                </div>
                <div className="text-primary mb-2 text-sm sm:text-base">SteveOS</div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Architecting custom software solutions with emphasis on scalability, performance,
                  and operational excellence. Building systems that command results.
                </p>
              </div>

              <div className="border-l-2 border-border pl-4 sm:pl-6 py-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                  <h3 className="font-semibold text-sm sm:text-base">Military Service</h3>
                  <span className="text-xs sm:text-sm text-muted-foreground">Previous</span>
                </div>
                <div className="text-primary mb-2 text-sm sm:text-base">
                  United States Armed Forces
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Cultivated leadership capabilities and a systematic approach to mission-critical
                  problem-solving under pressure.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mt-12 sm:mt-16 mb-4 sm:mb-6">Connect</h2>
            <div className="flex flex-col gap-3 sm:gap-4 not-prose">
              <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-4">
                Open to strategic opportunities, complex technical challenges, and connecting with
                operators building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-primary transition-colors"
                >
                  <Mail size={18} className="shrink-0" /> Email
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-primary transition-colors"
                >
                  <Linkedin size={18} className="shrink-0" /> LinkedIn
                </a>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base font-medium hover:text-primary transition-colors"
                >
                  <Github size={18} className="shrink-0" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
