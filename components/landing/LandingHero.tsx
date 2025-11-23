'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Medal, Users, GraduationCap } from 'lucide-react'
// Note: Shield icon is NOT imported here - only used in app/ai-agent/page.tsx
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useReducedMotion } from 'framer-motion'

const stats = [
  { label: 'Veterans Served', value: '2.5K+', icon: Users },
  { label: 'Success Rate', value: '94%', icon: Medal },
  { label: 'AI-Powered', value: '24/7', icon: GraduationCap },
]

export function LandingHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? false : 'hidden'}
            animate={shouldReduceMotion ? false : 'visible'}
            variants={
              shouldReduceMotion
                ? undefined
                : {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.05,
                      },
                    },
                  }
            }
          >
            <motion.div
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    }
              }
            >
              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }
                }
              >
                <Badge
                  variant="outline"
                  className="mb-6 px-5 py-2 text-sm font-mono font-medium rounded-full border-primary/50 text-primary bg-primary/10 dark:bg-primary/20 uppercase tracking-wider hover:border-primary/70 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 cursor-default"
                >
                  Built by Veterans, For Veterans
                </Badge>
              </motion.div>
            </motion.div>

            <motion.h1
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    }
              }
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold tracking-tight mb-6 leading-[1.1] antialiased"
            >
              <motion.span
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }
                }
                className="inline-block cursor-default"
              >
                Stop Surviving.
              </motion.span>
              <br />
              <motion.span
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }
                }
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-primary/80 animate-gradient-x inline-block cursor-default hover:from-primary hover:via-primary hover:to-primary transition-all duration-300"
              >
                Start Commanding Your Benefits.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    }
              }
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }
              }
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed font-sans cursor-default hover:text-foreground/90 transition-colors duration-300"
            >
              AI-powered education for veterans ready to escape survival mode and unlock financial
              freedom.
            </motion.p>
            <motion.p
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: 'easeOut', delay: 0.05 },
                      },
                    }
              }
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }
              }
              className="text-base sm:text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-sans cursor-default hover:text-muted-foreground transition-colors duration-300"
            >
              Confused about your DD-214? Overwhelmed by C&P exams? Broke after EAS? We&apos;ve been
              there. Let&apos;s navigate your service-connected benefits together.
            </motion.p>

            <motion.div
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: 'easeOut', delay: 0.1 },
                      },
                    }
              }
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16"
            >
              <Link href="/ai-agent" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 py-7 rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-150 bg-primary border-0 group font-semibold relative overflow-hidden text-white dark:text-primary-foreground"
                >
                  <span className="relative z-10 flex items-center font-semibold text-white dark:text-primary-foreground">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform text-white dark:text-primary-foreground" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 py-7 rounded-full border-2 border-primary/70 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all duration-150 font-semibold backdrop-blur-sm bg-background/95 dark:bg-background/80 text-foreground"
                >
                  <span className="text-foreground font-semibold">See How It Works</span>
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicator */}
            <motion.div
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } },
                    }
              }
              className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground mb-16"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Free Command</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>No credit card required</span>
              <span className="hidden sm:inline">•</span>
              <span>Veteran-owned & operated</span>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? undefined : { duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={shouldReduceMotion ? false : { opacity: 1, scale: 1 }}
                  transition={
                    shouldReduceMotion ? undefined : { duration: 0.3, delay: 0.25 + index * 0.05 }
                  }
                  className="glass rounded-xl p-6 hover:scale-105 transition-all duration-150"
                >
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
