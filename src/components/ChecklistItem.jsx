import { useState } from 'react'
import { Square, CheckSquare, MinusSquare, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className={cn(
      'rounded-md border bg-card transition-colors',
      state === 'passed' && 'opacity-60',
      state === 'na' && 'opacity-40',
    )}>
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
        <button
          className="flex-1 text-left text-sm font-medium truncate hover:text-primary transition-colors"
          onClick={() => setExpanded(e => !e)}
        >
          {item.title}
        </button>

        {/* Priority badge */}
        <span className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
          PRIORITY_STYLES[priority]
        )}>
          {priority}
        </span>

        {/* Expand chevron */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Expandable panel */}
      {expanded && (
        <div className="border-t px-3 py-3 space-y-3 text-sm">
          {/* Description — render markdown-ish bold */}
          <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {formatDescription(item.description)}
          </div>

          {/* References */}
          {item.references?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">References</p>
              <ul className="space-y-1">
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
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map(tag => (
                <span key={tag} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Very minimal inline markdown: **bold** → <strong> */
function formatDescription(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
