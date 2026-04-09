import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

const TYPE_ORDER = ['baseline', 'provider', 'architecture', 'compliance']

export function Sidebar({ configs, allTags, activeConfigs, activeTags, onToggleConfig, onToggleTag, onClose }) {
  const sorted = useMemo(() => TYPE_ORDER.flatMap(type => configs.filter(c => c.type === type)), [configs])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Configs</span>
        <button
          onClick={onClose}
          className="rounded p-1 hover:bg-muted lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        <ul className="space-y-0.5">
          {sorted.map(config => (
            <li key={config.id}>
              <label
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
                title={config.description ?? ''}
              >
                <Checkbox
                  checked={activeConfigs.has(config.id)}
                  onChange={() => onToggleConfig(config.id)}
                  ariaLabel={`Toggle config ${config.label}`}
                />
                <span className={cn(activeConfigs.has(config.id) && 'font-medium')}>
                  {config.label}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <section>
          <h3 className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tags
          </h3>
          <ul className="space-y-0.5">
            {allTags.map(tag => (
              <li key={tag}>
                <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
                  <Checkbox
                    checked={activeTags.has(tag)}
                    onChange={() => onToggleTag(tag)}
                    ariaLabel={`Toggle tag ${tag}`}
                  />
                  <span className={cn('font-mono text-xs', activeTags.has(tag) && 'font-semibold')}>
                    {tag}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Checkbox({ checked, onChange, ariaLabel }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="h-3.5 w-3.5 rounded border-gray-300 accent-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  )
}
