import type React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeColorMeta } from '@/components/theme-color-meta'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { SkipLink } from '@/components/SkipLink'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ClientOnlyComponents } from '@/components/ClientOnlyComponents'
import './globals.css'

const inter = localFont({
  src: [
    {
      path: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const playfair = localFont({
  src: [
    {
      path: '../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2',
      weight: '400 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-playfair',
  preload: false, // Defer serif font as it's less critical
})

const jetbrainsMono = localFont({
  src: [
    {
      path: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
      weight: '100 800',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  preload: false, // Defer mono font as it's less critical
})

export const metadata: Metadata = {
  title: {
    default: 'Command - Stop Surviving. Start Commanding Your Benefits.',
    template: '%s | Command',
  },
  description:
    'AI-powered education for veterans ready to escape survival mode and unlock financial freedom. Navigate your DD-214, understand C&P exams, and master your service-connected benefits. Built by veterans, for veterans.',
  keywords:
    'veteran benefits, VA disability, service-connected, DD-214, C&P exam, veteran transition, financial freedom, veteran education, AI benefits navigator, veteran resources',
  authors: [
    { name: 'Steve Defendre', url: 'https://www.linkedin.com/in/joseph-m-defendre-a11a47225/' },
  ],
  creator: 'Steve Defendre',
  publisher: 'Command',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://steve-os.vercel.app'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/api/rss', title: 'Command Blog RSS Feed' }],
    },
  },
  openGraph: {
    title: 'Command - Stop Surviving. Start Commanding Your Benefits.',
    description:
      'AI-powered education for veterans ready to escape survival mode and unlock financial freedom. Built by veterans, for veterans.',
    url: 'https://steve-os.vercel.app',
    siteName: 'Command',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Command - Stop Surviving. Start Commanding.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Command - Stop Surviving. Start Commanding Your Benefits.',
    description:
      'AI-powered education for veterans ready to escape survival mode and unlock financial freedom. Built by veterans, for veterans.',
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
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <ThemeColorMeta />
          <ErrorBoundary>
            {children}
            <ClientOnlyComponents />
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
                'Full-Stack Engineer and Veteran specializing in building educational technology for veterans transitioning from service to financial freedom.',
            }),
          }}
        />
      </body>
    </html>
  )
}
