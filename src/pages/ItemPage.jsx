import { useParams, Navigate } from 'react-router-dom'
import { Square, CheckSquare, MinusSquare, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/Markdown'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Separator } from '@/components/ui/separator'
import { CATEGORIES } from '@/lib/categories'

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

export function ItemPage({ data, priorityMap, getState, cycleState }) {
  const { category, itemId } = useParams()

  const cat = CATEGORIES.find(c => c.id === category)
  const item = data.items.find(i => i.id === itemId)

  if (!cat || !item || item.category !== category) return <Navigate to="/" replace />

  const priority = priorityMap.get(item.id) ?? 'optional'
  const state = getState(item.id)
  const Icon = STATE_ICONS[state]
  const iconStyle = STATE_ICON_STYLES[state]

  return (
    <main className="flex-1 overflow-y-auto px-4 py-5">
      <Breadcrumb items={[
        { label: cat.label, href: `/${category}` },
        { label: item.id },
      ]} />

      <div className={cn(
        'mt-4 rounded-md border bg-card transition-colors',
        state === 'passed' && 'opacity-60',
        state === 'na' && 'opacity-40',
      )}>
        {/* Title row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => cycleState(item.id)}
            className={cn('shrink-0 transition-colors', iconStyle)}
            aria-label={`State: ${state}. Click to cycle.`}
          >
            <Icon size={20} />
          </button>
          <span className="shrink-0 font-mono text-sm text-muted-foreground">{item.id}</span>
          <h1 className="flex-1 text-base font-semibold">{item.title}</h1>
          <span className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
            PRIORITY_STYLES[priority]
          )}>
            {priority}
          </span>
        </div>

        {/* Content */}
        <div className="border-t px-4 py-4 space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Description</p>
            <Markdown content={item.description} />
          </div>

          {item.mitigations?.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Mitigations</p>
                <ol className="list-decimal pl-5 space-y-2">
                  {item.mitigations.map((m, i) => (
                    <li key={i}><Markdown content={m} /></li>
                  ))}
                </ol>
              </div>
            </>
          )}

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
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

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
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

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
      </div>
    </main>
  )
}
