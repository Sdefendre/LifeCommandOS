'use client'

import { motion } from 'framer-motion'
import { Youtube, ArrowRight, Play } from 'lucide-react'
import { SITE } from '@/constants/site'

export function YouTubeSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-y border-border bg-gradient-to-b from-background via-accent/30 to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-4 sm:space-y-6 lg:max-w-xl w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-500 text-xs sm:text-sm font-semibold border border-red-500/20"
            >
              <Youtube size={16} className="fill-current sm:w-[18px] sm:h-[18px]" />
              <span>YouTube Channel</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Watch Me Build &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                Explore
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Join me on YouTube where I document my coding journey, share tutorials, and explore
              new technologies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4"
            >
              <motion.a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40 text-sm sm:text-base w-full sm:w-auto"
              >
                <Youtube size={18} className="fill-white sm:w-5 sm:h-5" />
                Visit Channel
              </motion.a>
              <motion.a
                href={`${SITE.youtube}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold border-2 border-border bg-background hover:bg-accent hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base w-full sm:w-auto"
              >
                Latest Videos{' '}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1 sm:w-[18px] sm:h-[18px]"
                />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-xl"
          >
            <a
              href={SITE.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden border-2 border-border shadow-2xl hover:shadow-red-600/20 transition-all duration-300"
            >
              {/* Enhanced Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent" />

              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-50 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:bg-red-500 transition-colors">
                    <Play
                      size={28}
                      className="text-white fill-white ml-0.5 sm:ml-1 sm:w-9 sm:h-9"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Bottom Info Section */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <Youtube size={16} className="text-white fill-white sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base sm:text-lg md:text-xl group-hover:text-red-400 transition-colors">
                      @Stevedefendre
                    </p>
                    <p className="text-white/70 text-xs sm:text-sm">Subscribe for more content</p>
                  </div>
                </div>
              </div>

              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-300" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
