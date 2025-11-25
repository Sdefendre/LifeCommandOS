'use client'

import { useEffect } from 'react'
import './globals.css' // Import global styles as this replaces the root layout

/**
 * Global Error Component
 *
 * This component handles errors that happen in the root layout or template.
 * It is the final safety net for the application.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased font-sans">
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-8 max-w-lg text-center">
            <h1 className="text-3xl font-serif mb-3">System Error</h1>
            <p className="text-muted-foreground mb-6">
              A critical system error occurred. We apologize for the inconvenience.
            </p>
            <button
              onClick={() => reset()}
              className="glass-button-primary px-6 py-2 rounded-full transition-all hover:scale-105"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
