import type React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SkipLink } from '@/components/SkipLink'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Life Command OS - Stop Surviving. Start Commanding.',
    template: '%s | Life Command OS',
  },
  description:
    'Life Command OS is your intelligent command center. An AI agent built for people who’ve spent too long fighting to stay afloat. Stabilize your money, eliminate chaos, and build your future.',
  keywords:
    'Life Command OS, survival mode, financial stability, AI coach, budget command center, productivity, masculine energy',
  authors: [
    { name: 'Steve Defendre', url: 'https://www.linkedin.com/in/joseph-m-defendre-a11a47225/' },
  ],
  creator: 'Steve Defendre',
  publisher: 'Life Command OS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://steve-os.vercel.app'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/api/rss', title: 'Life Command OS Blog RSS Feed' }],
    },
  },
  openGraph: {
    title: 'Life Command OS - Stop Surviving. Start Commanding.',
    description:
      'Life Command OS is your intelligent command center. An AI agent built for people who’ve spent too long fighting to stay afloat.',
    url: 'https://steve-os.vercel.app',
    siteName: 'Life Command OS',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Life Command OS - Stop Surviving. Start Commanding.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life Command OS - Stop Surviving. Start Commanding.',
    description:
      'Life Command OS is your intelligent command center. An AI agent built for people who’ve spent too long fighting to stay afloat.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
  generator: 'v0.app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <SkipLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            {children}
            <ScrollToTop />
            <Analytics />
          </ErrorBoundary>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Steve Defendre',
              jobTitle: 'Full-Stack Engineer',
              url: 'https://steve-os.vercel.app',
              sameAs: [
                'https://www.linkedin.com/in/joseph-m-defendre-a11a47225/',
                'https://github.com/Sdefendre',
                'https://www.youtube.com/@Stevedefendre',
              ],
              description:
                'Full-Stack Engineer and Veteran specializing in building high-performance web applications and resilient software systems.',
            }),
          }}
        />
      </body>
    </html>
  )
}
