import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-xl mb-2">Life Command OS</h3>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Life Command OS. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/roadmap" className="hover:text-primary transition-colors">
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
