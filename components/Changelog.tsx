import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getSectionDisplayName,
  getSectionIcon,
  type ChangelogEntry as ChangelogEntryType,
} from '@/lib/changelog-parser'

/**
 * Formats a markdown-style list item to HTML
 * Handles bold text (**text**), code (`text`), and links [text](url)
 */
function formatChangelogItem(item: string): JSX.Element {
  // Split by markdown patterns
  const parts: (string | JSX.Element)[] = []

  // Process links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let linkMatch
  let lastIndex = 0

  const linkMatches: Array<{ start: number; end: number; text: string; url: string }> = []
  while ((linkMatch = linkRegex.exec(item)) !== null) {
    linkMatches.push({
      start: linkMatch.index,
      end: linkMatch.index + linkMatch[0].length,
      text: linkMatch[1],
      url: linkMatch[2],
    })
  }

  // Process bold **text**
  const boldRegex = /\*\*([^*]+)\*\*/g
  const boldMatches: Array<{ start: number; end: number; text: string }> = []
  let boldMatch
  while ((boldMatch = boldRegex.exec(item)) !== null) {
    boldMatches.push({
      start: boldMatch.index,
      end: boldMatch.index + boldMatch[0].length,
      text: boldMatch[1],
    })
  }

  // Process code `text`
  const codeRegex = /`([^`]+)`/g
  const codeMatches: Array<{ start: number; end: number; text: string }> = []
  let codeMatch
  while ((codeMatch = codeRegex.exec(item)) !== null) {
    codeMatches.push({
      start: codeMatch.index,
      end: codeMatch.index + codeMatch[0].length,
      text: codeMatch[1],
    })
  }

  // Combine all matches and sort by position
  const allMatches = [
    ...linkMatches.map((m) => ({ ...m, type: 'link' as const })),
    ...boldMatches.map((m) => ({ ...m, type: 'bold' as const, url: '' })),
    ...codeMatches.map((m) => ({ ...m, type: 'code' as const, url: '' })),
  ].sort((a, b) => a.start - b.start)

  // Build the parts array
  lastIndex = 0
  for (const match of allMatches) {
    if (match.start > lastIndex) {
      parts.push(item.slice(lastIndex, match.start))
    }

    if (match.type === 'link') {
      parts.push(
        <a
          key={`link-${match.start}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {match.text}
        </a>
      )
    } else if (match.type === 'bold') {
      parts.push(
        <strong key={`bold-${match.start}`} className="font-semibold">
          {match.text}
        </strong>
      )
    } else if (match.type === 'code') {
      parts.push(
        <code key={`code-${match.start}`} className="px-1.5 py-0.5 rounded text-sm font-mono">
          {match.text}
        </code>
      )
    }

    lastIndex = match.end
  }

  if (lastIndex < item.length) {
    parts.push(item.slice(lastIndex))
  }

  return <>{parts.length > 0 ? parts : item}</>
}

/**
 * Renders a changelog entry section
 */
function ChangelogSection({
  title,
  items,
  icon,
}: {
  title: string
  items: string[]
  icon: string
}) {
  if (!items || items.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-2 ml-6">
        {items.map((item, idx) => {
          // Split by newlines to handle nested items
          const parts = item.split('\n')
          const mainItem = parts[0]
          const nestedItems = parts.slice(1)

          return (
            <li key={idx} className="text-foreground leading-relaxed list-disc mb-3">
              {formatChangelogItem(mainItem)}
              {nestedItems.length > 0 && (
                <ul className="mt-2 ml-6 space-y-1.5 list-none">
                  {nestedItems.map((nested, nestedIdx) => (
                    <li key={nestedIdx} className="text-sm text-foreground leading-relaxed">
                      {formatChangelogItem(nested.replace(/^  •\s*/, ''))}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Renders a single changelog entry
 */
export function ChangelogEntry({ entry }: { entry: ChangelogEntryType }) {
  const isUnreleased = entry.version.toLowerCase() === 'unreleased'

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-2xl">
            {isUnreleased ? '🚧 ' : ''}
            {entry.version}
          </CardTitle>
          {entry.date && (
            <Badge variant="outline" className="text-sm">
              {new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(entry.sections).map(([section, items]) => {
            if (!items || items.length === 0) return null
            return (
              <ChangelogSection
                key={section}
                title={getSectionDisplayName(section)}
                items={items}
                icon={getSectionIcon(section)}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
