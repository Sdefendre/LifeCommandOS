'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { NAV_LINKS } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'

function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-primary transition-colors no-underline"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/command"
        className="hover:text-primary transition-colors no-underline font-medium"
        suppressHydrationWarning
      >
        Command
      </Link>
      <Link
        href="/dashboard"
        className="font-semibold text-primary-gradient hover:opacity-80 transition-opacity no-underline"
      >
        BattleStation
      </Link>
      <ThemeToggle />
    </nav>
  )
}

function MobileMenu({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <div
      className={cn(
        'md:hidden border-b border-border/80 dark:border-border/60 bg-background/95 dark:bg-background/95 backdrop-blur-xl overflow-hidden fixed top-14 sm:top-16 left-0 right-0 z-40 transition-all duration-200 ease-in-out',
        open
          ? 'max-h-[500px] opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
      )}
    >
      <nav className="flex flex-col p-4 space-y-3 text-sm font-medium">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="py-2.5 border-b border-border/50 active:bg-accent/50 rounded-sm px-2 -mx-2 no-underline"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/command"
          className="py-2.5 border-b border-border/50 active:bg-accent/50 rounded-sm px-2 -mx-2 no-underline font-medium"
          onClick={() => setOpen(false)}
          suppressHydrationWarning
        >
          Command
        </Link>
        <Link
          href="/dashboard"
          className="py-2.5 border-b border-border/50 text-primary font-medium active:bg-accent/50 rounded-sm px-2 -mx-2 no-underline"
          onClick={() => setOpen(false)}
        >
          BattleStation
        </Link>
      </nav>
    </div>
  )
}

export function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div suppressHydrationWarning>
      <header
        className="sticky top-0 z-50 w-full border-b border-border/80 dark:border-border/60 bg-background/95 dark:bg-background/95 backdrop-blur-xl relative"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between max-w-5xl">
          <Link href="/" className="no-underline">
            <Logo size="sm" />
          </Link>
          <DesktopNav />
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-1 sm:-mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </div>
  )
}
