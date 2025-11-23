'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export function LandingHero() {
  return (
    <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 text-sm font-mono font-medium rounded-full border-red-500/50 text-red-500 bg-red-500/10 uppercase tracking-wider"
              >
                Escape Survival Mode
              </Badge>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold tracking-tight mb-6 leading-[1.1] antialiased"
            >
              Stop Surviving. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 animate-gradient-x">
                Start Commanding.
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-sans"
            >
              Your intelligent operating system for life. Stabilize finances, eliminate chaos, and
              execute with precision. An AI agent built for those ready to build their future.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                >
                  Initialize Command <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 hover:bg-secondary/50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Review Directives
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden p-2 sm:p-4 hover:shadow-primary/20 transition-all duration-500">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center relative overflow-hidden group hover:scale-[1.01] transition-transform duration-700 ease-out">
              {/* Abstract representation of dashboard */}
              <Image
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop"
                alt="Dashboard Background"
                fill
                className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              <div className="relative z-10 text-center p-8">
                <Shield className="h-20 w-20 text-primary mx-auto mb-4 opacity-80" />
                <p className="text-2xl font-mono font-bold text-white tracking-widest uppercase">
                  Command Center Active
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}
