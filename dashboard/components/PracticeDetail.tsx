'use client'

import { memo, useEffect, useRef } from 'react'
import { useTheme } from '@/components/theme-provider'
import type { Practice } from '@/.velite'
import type { Priority } from '@/lib/filterPractices'
import { cn, inlineMarkdown } from '@/lib/utils'

interface PracticeDetailProps {
  practice: Practice & { priority: Priority }
}

export const PracticeDetail = memo(function PracticeDetail({ practice }: PracticeDetailProps) {
  const { resolvedTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!practice.hasMermaid || !ref.current) return
    // Only process nodes that haven't been rendered yet (no SVG child)
    const nodes = Array.from(ref.current.querySelectorAll<HTMLElement>('.mermaid')).filter(
      (n) => !n.querySelector('svg'),
    )
    if (!nodes.length) return
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: resolvedTheme === 'dark' ? 'dark' : 'default' })
      mermaid.run({ nodes: Array.from(nodes) })
    })
  }, [practice.hasMermaid, resolvedTheme])

  return (
    <div className="border-t border-border bg-muted/10 px-6 py-6">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Description */}
        <div
          ref={ref}
          className={cn(
            'prose max-w-none dark:prose-invert',
            'prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-6 prose-headings:mb-2',
            'prose-p:text-foreground/80 prose-p:leading-7 prose-p:text-base',
            'prose-strong:text-foreground prose-strong:font-semibold',
            'prose-li:text-foreground/80 prose-li:leading-7',
            'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
            'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
            'prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-transparent prose-pre:p-0 prose-pre:overflow-hidden',
            '[&_.shiki]:rounded-lg [&_.shiki]:p-5 [&_.shiki]:text-sm [&_.shiki]:leading-relaxed [&_.shiki]:overflow-x-auto',
            'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
          )}
          dangerouslySetInnerHTML={{ __html: practice.description }}
        />

        {/* Mitigations */}
        {practice.mitigations.length > 0 && (
          <div>
            <SectionLabel>Mitigations</SectionLabel>
            <ul className="mt-3 space-y-3">
              {practice.mitigations.map((m, i) => (
                <li key={i} className="flex gap-3 text-base leading-7 text-foreground/80">
                  <span className="mt-1 flex-shrink-0 text-primary">→</span>
                  <div
                    className={cn(
                      'min-w-0 [&_strong]:font-semibold [&_strong]:text-foreground',
                      '[&_em]:italic',
                      '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono',
                      '[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline',
                      '[&_.inline-code-block]:mt-2 [&_.inline-code-block]:block [&_.inline-code-block]:rounded [&_.inline-code-block]:border [&_.inline-code-block]:border-border [&_.inline-code-block]:bg-muted/50 [&_.inline-code-block]:p-3 [&_.inline-code-block]:text-xs [&_.inline-code-block]:font-mono [&_.inline-code-block]:leading-relaxed [&_.inline-code-block]:overflow-x-auto',
                      '[&_.inline-code-block_code]:bg-transparent [&_.inline-code-block_code]:p-0 [&_.inline-code-block_code]:rounded-none',
                    )}
                    dangerouslySetInnerHTML={{ __html: inlineMarkdown(m) }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {practice.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {practice.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tools */}
        {practice.tools.length > 0 && (
          <div>
            <SectionLabel>Tools</SectionLabel>
            <ul className="mt-3 space-y-3">
              {practice.tools.map((tool) => (
                <li key={tool.url} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {tool.title}
                    </a>
                    <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                      {tool.url}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* References */}
        {practice.references.length > 0 && (
          <div>
            <SectionLabel>References</SectionLabel>
            <ul className="mt-3 space-y-3">
              {practice.references.map((ref) => (
                <li key={ref.url} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50" />
                  <div className="min-w-0">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {ref.title}
                    </a>
                    <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                      {ref.url}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  )
})

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h4>
  )
}
