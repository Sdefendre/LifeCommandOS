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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-5 h-5 bg-primary rounded-sm"></div>
            SteveOS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/work" className="hover:text-primary/80 transition-colors">
              Work
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-primary/80 transition-colors font-semibold text-primary"
            >
              Spendwise
            </Link>
            <Link href="/blog" className="hover:text-primary/80 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-primary/80 transition-colors">
              About
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2"
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
            className="md:hidden border-b border-border bg-background overflow-hidden fixed top-16 left-0 right-0 z-40"
          >
            <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
              <Link
                href="/work"
                className="py-2 border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                href="/dashboard"
                className="py-2 border-b border-border/50 text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Spendwise
              </Link>
              <Link
                href="/blog"
                className="py-2 border-b border-border/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="py-2 border-b border-border/50"
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
