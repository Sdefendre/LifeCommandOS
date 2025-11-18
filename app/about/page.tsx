'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SITE } from '@/constants/site'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <SiteHeader />

      <main className="container mx-auto px-4 max-w-3xl py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-8">About Me</h1>

          <div className="prose prose-neutral max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              I'm Steve Defendre, a Full-Stack Engineer and Veteran based in the US. I specialize in
              building high-performance web applications and resilient software systems.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Background</h3>
                <p className="text-muted-foreground leading-relaxed">
                  My journey started in the military, where I learned the value of discipline,
                  precision, and reliability. I've carried those principles into software
                  engineering, focusing on building systems that don't just work, but endure.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Technical Focus</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I work primarily with the React ecosystem (Next.js), TypeScript, and Node.js. I'm
                  also deeply interested in AI integration and building tools that enhance developer
                  productivity.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6">Experience</h2>
            <div className="space-y-8 not-prose">
              <div className="border-l-2 border-border pl-6 py-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold">Founder & Lead Engineer</h3>
                  <span className="text-sm text-muted-foreground">2023 — Present</span>
                </div>
                <div className="text-primary mb-2">SteveOS</div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Building custom software solutions for businesses, focusing on scalability and
                  performance.
                </p>
              </div>

              <div className="border-l-2 border-border pl-6 py-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold">Military Service</h3>
                  <span className="text-sm text-muted-foreground">Previous</span>
                </div>
                <div className="text-primary mb-2">United States Armed Forces</div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Developed leadership skills and a disciplined approach to complex problem-solving.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-16 mb-6">Connect</h2>
            <div className="flex flex-col gap-4 not-prose">
              <p className="text-muted-foreground mb-4">
                I'm always open to discussing new opportunities, technical challenges, or just
                connecting with fellow developers.
              </p>
              <div className="flex gap-6">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                >
                  <Mail size={18} /> Email
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                >
                  <Github size={18} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
