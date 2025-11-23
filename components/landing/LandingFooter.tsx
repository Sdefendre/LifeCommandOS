import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="py-8 sm:py-12 border-t border-border bg-background">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Life Command OS</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Life Command OS. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Built by{' '}
            <a
              href="https://defendresolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              DefendreSolutions.com
            </a>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
          <Link href="/features#roadmap" className="hover:text-primary transition-colors">
            Roadmap
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
