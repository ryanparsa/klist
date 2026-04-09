import { useState } from 'react'
import { Square, CheckSquare, MinusSquare, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Markdown } from './Markdown'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

const PRIORITY_STYLES = {
  required:  'bg-red-50 text-red-700 ring-red-200',
  suggested: 'bg-amber-50 text-amber-700 ring-amber-200',
  optional:  'bg-gray-50 text-gray-500 ring-gray-200',
}

const STATE_ICONS = {
  unchecked: Square,
  passed:    CheckSquare,
  na:        MinusSquare,
}

const STATE_ICON_STYLES = {
  unchecked: 'text-muted-foreground/40 hover:text-muted-foreground',
  passed:    'text-green-600',
  na:        'text-muted-foreground/60',
}

export function ChecklistItem({ item, priority, state, onCycle }) {
  const [expanded, setExpanded] = useState(false)

  const Icon = STATE_ICONS[state]
  const iconStyle = STATE_ICON_STYLES[state]

  return (
    <Collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className={cn(
        'rounded-md border bg-card transition-colors',
        state === 'passed' && 'opacity-60',
        state === 'na' && 'opacity-40',
      )}
    >
      {/* Row */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Tri-state toggle */}
        <button
          onClick={() => onCycle(item.id)}
          className={cn('shrink-0 transition-colors', iconStyle)}
          aria-label={`State: ${state}. Click to cycle.`}
        >
          <Icon size={18} />
        </button>

        {/* ID */}
        <span className="shrink-0 font-mono text-xs text-muted-foreground w-16">{item.id}</span>

        {/* Title — click to expand */}
        <CollapsibleTrigger asChild>
          <button className="flex-1 text-left text-sm font-medium truncate hover:text-primary transition-colors">
            {item.title}
          </button>
        </CollapsibleTrigger>

        {/* Priority badge */}
        <span className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
          PRIORITY_STYLES[priority]
        )}>
          {priority}
        </span>

        {/* Expand chevron */}
        <CollapsibleTrigger asChild>
          <button
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        </CollapsibleTrigger>
      </div>

      {/* Expandable panel */}
      <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
        <div className="border-t px-3 py-3 space-y-4 text-sm">
          {/* Description */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Description</p>
            <Markdown content={item.description} />
          </div>

          {/* Mitigations */}
          {item.mitigations?.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Mitigations</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  {item.mitigations.map((m, i) => (
                    <li key={i}>
                      <Markdown content={m} />
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {/* Tools */}
          {item.tools?.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tools</p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  {item.tools.map((tool, i) => (
                    <li key={i}>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {tool.title}
                        <ExternalLink size={11} />
                      </a>
                      <span className="ml-2 text-xs text-muted-foreground">{tool.url}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {/* References */}
          {item.references?.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">References</p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  {item.references.map((ref, i) => (
                    <li key={i}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {ref.title}
                        <ExternalLink size={11} />
                      </a>
                      <span className="ml-2 text-xs text-muted-foreground">{ref.url}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <span key={tag} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

