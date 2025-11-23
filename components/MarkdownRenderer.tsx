import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-base font-bold mt-3 mb-2 first:mt-0" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-sm font-semibold mt-3 mb-1.5 first:mt-0" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="my-2 leading-relaxed first:mt-0 last:mb-0" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside my-2 space-y-1 ml-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside my-2 space-y-1 ml-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        code: ({ node, inline, className, children, ...props }: any) => {
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
        pre: ({ node, ...props }) => (
          <pre className="bg-muted p-2 rounded overflow-x-auto my-2" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-primary underline hover:text-primary/80 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary/30 pl-4 my-2 italic text-muted-foreground"
            {...props}
          />
        ),
        hr: ({ node, ...props }) => <hr className="my-4 border-border" {...props} />,
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border-collapse border border-border" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
        th: ({ node, ...props }) => (
          <th className="border border-border px-3 py-2 text-left font-semibold" {...props} />
        ),
        td: ({ node, ...props }) => <td className="border border-border px-3 py-2" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
