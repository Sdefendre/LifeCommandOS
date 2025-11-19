'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between max-w-5xl">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 font-semibold text-base sm:text-lg tracking-tight group"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-sm shadow-md group-hover:shadow-lg transition-shadow"></div>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              SteveOS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
            <Link href="/work" className="hover:text-blue-600 transition-colors">
              Work
            </Link>
            <Link
              href="/dashboard"
              className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              WealthWise
            </Link>
            <Link href="/blog" className="hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-cyan-500 transition-colors">
              About
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-1 sm:-mr-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background overflow-hidden fixed top-14 sm:top-16 left-0 right-0 z-40"
          >
            <nav className="flex flex-col p-4 space-y-3 text-sm font-medium">
              <Link
                href="/work"
                className="py-2.5 border-b border-border/50 active:bg-accent/50 rounded-sm px-2 -mx-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                href="/dashboard"
                className="py-2.5 border-b border-border/50 text-primary font-medium active:bg-accent/50 rounded-sm px-2 -mx-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                WealthWise
              </Link>
              <Link
                href="/blog"
                className="py-2.5 border-b border-border/50 active:bg-accent/50 rounded-sm px-2 -mx-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="py-2.5 border-b border-border/50 active:bg-accent/50 rounded-sm px-2 -mx-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
