'use client'

import { useEffect } from 'react'

/**
 * GlobalErrorHandler
 *
 * This component sets up global event listeners to catch unhandled errors
 * and promise rejections that might otherwise crash the application or
 * show confusing error overlays.
 *
 * It doesn't render anything visible but works in the background.
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Handler for unhandled promise rejections (async errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log the error for debugging
      console.error('⚠️ Unhandled Promise Rejection caught by GlobalErrorHandler:', {
        reason: event.reason,
        promise: event.promise,
      })

      // Prevent the default browser handler (which might show an overlay or crash)
      // Note: In Next.js dev mode, the overlay might still appear.
      // event.preventDefault()
    }

    // Handler for uncaught exceptions (sync errors)
    const handleError = (event: ErrorEvent) => {
      console.error('⚠️ Uncaught Exception caught by GlobalErrorHandler:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      })

      // You can prevent the default action if desired, but usually
      // we want standard browser behavior unless we have a custom UI.
      // event.preventDefault()
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup listeners when component unmounts
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
