import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MermaidDiagram } from './MermaidDiagram'

export function Markdown({ content }) {
  if (!content) return null

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''

          if (!inline && language === 'mermaid') {
            return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
          }

          return !inline && match ? (
            <div className="my-4 rounded-md overflow-hidden text-xs border border-border/50">
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 0, background: '#1e1e1e' }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground" {...props}>
              {children}
            </code>
          )
        },
        p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
        a: ({ ...props }) => <a className="text-primary hover:underline font-medium inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props} />,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4 text-foreground">{children}</h3>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-muted pl-4 italic my-4">{children}</blockquote>,
        table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full text-sm text-left border-collapse">{children}</table></div>,
        thead: ({ children }) => <thead className="text-xs uppercase bg-muted/50">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-2 font-medium text-foreground border-b border-border">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 border-b border-border/50">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
