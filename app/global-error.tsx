'use client'

import { useEffect } from 'react'

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
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="mb-8 text-muted-foreground max-w-md">
            A critical error occurred. We apologize for the inconvenience.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-full bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
