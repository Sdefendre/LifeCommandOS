'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

interface HighlightJS {
  highlightAuto: (code: string) => { value: string; language?: string }
  highlightElement: (element: HTMLElement) => void
}

declare global {
  interface Window {
    hljs?: HighlightJS
  }
}

/**
 * Enhances <pre><code> blocks rendered from blog HTML with a copy button
 * and client-side syntax highlighting via highlight.js (CDN).
 */
export function CodeBlockEnhancer() {
  const { resolvedTheme } = useTheme()

  // Initial enhancement: add highlighting and copy buttons
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const pres = Array.from(document.querySelectorAll<HTMLElement>('article .prose pre'))
    pres.forEach((pre) => {
      if (pre.dataset.enhanced === 'true') return
      pre.dataset.enhanced = 'true'
      pre.style.position = pre.style.position || 'relative'

      const code = pre.querySelector('code') as HTMLElement | null
      if (!code) return

      // Load highlight.js and apply highlighting
      injectHljsTheme(resolvedTheme)
      const runHighlight = () => {
        try {
          if (!window.hljs) return
          if ((code as HTMLElement & { _hljsDone?: boolean })._hljsDone) return

          // Try to detect language from class or content
          const className = code.className || ''
          const hasLanguageClass = /language-\w+/.test(className)

          if (!hasLanguageClass) {
            // Auto-detect language if no language class
            const result = window.hljs.highlightAuto(code.textContent || '')
            code.innerHTML = result.value
            code.classList.add('hljs')
            if (result.language) {
              code.classList.add(`language-${result.language}`)
            }
          } else {
            // Use specified language
            window.hljs.highlightElement(code)
          }

          ;(code as HTMLElement & { _hljsDone?: boolean })._hljsDone = true
        } catch {
          /* no-op */
        }
      }
      if (window.hljs) runHighlight()
      else
        loadHljsFromCdn()
          .then(runHighlight)
          .catch(() => {})

      // Add copy button
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'code-copy-btn'
      btn.setAttribute('aria-label', 'Copy code to clipboard')
      btn.innerHTML = COPY_SVG
      btn.addEventListener('click', async () => {
        try {
          const text = code.textContent ?? ''
          await navigator.clipboard.writeText(text)
          const prev = btn.innerHTML
          btn.innerHTML = CHECK_SVG
          btn.classList.add('copied')
          setTimeout(() => {
            btn.innerHTML = prev || COPY_SVG
            btn.classList.remove('copied')
          }, 1500)
        } catch {
          // Fallback: select and copy
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(code)
          selection?.removeAllRanges()
          selection?.addRange(range)
          try {
            document.execCommand('copy')
            selection?.removeAllRanges()
          } catch {
            /* no-op */
          }
        }
      })
      pre.appendChild(btn)
    })
  }, [resolvedTheme])

  // Re-apply highlighting when theme changes
  useEffect(() => {
    if (!resolvedTheme || typeof window === 'undefined' || typeof document === 'undefined') return

    // Update theme
    injectHljsTheme(resolvedTheme)

    // Re-highlight all code blocks
    const pres = Array.from(document.querySelectorAll<HTMLElement>('article .prose pre code.hljs'))
    pres.forEach((code) => {
      try {
        if (window.hljs) {
          const language = code.className.match(/language-(\w+)/)?.[1]
          if (language) {
            window.hljs.highlightElement(code as HTMLElement)
          } else {
            const result = window.hljs.highlightAuto(code.textContent || '')
            code.innerHTML = result.value
          }
        }
      } catch {
        /* no-op */
      }
    })
  }, [resolvedTheme])

  return null
}

const COPY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <rect x="9" y="9" width="13" height="13" rx="2"/>
  <rect x="3" y="3" width="13" height="13" rx="2"/>
</svg>`

const CHECK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path d="M20 6 9 17l-5-5"/>
</svg>`

function injectHljsTheme(theme?: string | null) {
  if (typeof document === 'undefined') return

  const isDark = theme === 'dark'
  const themeName = isDark ? 'github-dark' : 'github'
  const themeUrl = `https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/${themeName}.min.css`

  // Remove existing theme link if it exists
  const existing = document.querySelector('link[data-hljs-theme]')
  if (existing) {
    const existingTheme = existing.getAttribute('data-hljs-theme')
    if (existingTheme === themeName) {
      // Theme already matches, no need to change
      return
    }
    existing.remove()
  }

  // Create and add new theme link
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = themeUrl
  link.setAttribute('data-hljs-theme', themeName)
  document.head.appendChild(link)
}

function loadHljsFromCdn(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('Window or document not available'))
  }

  if (window.hljs) return Promise.resolve()
  const existing = document.getElementById('hljs-script') as HTMLScriptElement | null
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject())
    })
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.id = 'hljs-script'
    s.src = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js'
    s.async = true
    s.onload = () => {
      try {
        ;(window.hljs as any)?.configure?.({
          ignoreUnescapedHTML: true,
          languages: [
            'javascript',
            'typescript',
            'jsx',
            'tsx',
            'css',
            'html',
            'json',
            'bash',
            'python',
            'java',
            'sql',
          ],
        })
      } catch {}
      resolve()
    }
    s.onerror = () => reject()
    document.body.appendChild(s)
  })
}
