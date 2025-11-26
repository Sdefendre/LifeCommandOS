import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

export function MarkdownRenderer({ content }: { content: string }) {
  const components: Partial<Components> = {
    h1: ({ children, ...props }) => (
      <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-base font-bold mt-3 mb-2 first:mt-0" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-sm font-semibold mt-3 mb-1.5 first:mt-0" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="my-2 leading-relaxed first:mt-0 last:mb-0" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside my-2 space-y-1 ml-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside my-2 space-y-1 ml-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean
      className?: string
      children?: React.ReactNode
    }) => {
      return !inline ? (
        <pre className="bg-muted p-2 rounded my-2 overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => (
      <pre className="bg-muted p-2 rounded overflow-x-auto my-2" {...props}>
        {children}
      </pre>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-primary underline hover:text-primary/80 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-primary/30 pl-4 my-2 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),
    hr: (props) => <hr className="my-4 border-border" {...props} />,
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full border-collapse border border-border" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => (
      <th className="border border-border px-3 py-2 text-left font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border px-3 py-2" {...props}>
        {children}
      </td>
    ),
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
