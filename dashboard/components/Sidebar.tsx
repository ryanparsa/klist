'use client'

import type { Config, Practice } from '@/.velite'
import { getAllTags } from '@/lib/filterPractices'
import { cn } from '@/lib/utils'

interface SidebarProps {
  configs: Config[]
  allPractices: Practice[]
  selectedConfigs: string[]
  selectedTags: string[]
  onConfigToggle: (id: string) => void
  onTagToggle: (tag: string) => void
  onClearAll: () => void
  isOpen?: boolean
  onClose?: () => void
}

const CONFIG_SECTIONS: Array<{ type: string; label: string }> = [
  { type: 'baseline', label: 'Baseline' },
  { type: 'provider', label: 'Provider' },
  { type: 'architecture', label: 'Architecture' },
  { type: 'compliance', label: 'Compliance' },
]

export function Sidebar({
  configs,
  allPractices,
  selectedConfigs,
  selectedTags,
  onConfigToggle,
  onTagToggle,
  onClearAll,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const allTags = getAllTags(allPractices)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
    <aside className={cn(
      "flex h-full w-56 flex-shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar",
      "fixed inset-y-0 left-0 z-30 transition-transform duration-200 md:static md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full",
    )}>
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Configs
        </p>
      </div>

      <div className="flex-1 space-y-5 px-3 pb-6">
        {/* Config sections */}
        {CONFIG_SECTIONS.map(({ type, label }) => {
          const items = configs.filter((c) => c.type === type)
          if (!items.length) return null
          return (
            <div key={type}>
              <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <ul className="space-y-0.5">
                {items.map((config) => {
                  const active = selectedConfigs.includes(config.id)
                  return (
                    <li key={config.id}>
                      <button
                        onClick={() => onConfigToggle(config.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors',
                          active
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-foreground hover:bg-muted',
                        )}
                        title={config.description}
                      >
                        {/* Checkbox indicator */}
                        <span
                          className={cn(
                            'flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-sm border transition-colors',
                            active
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40',
                          )}
                        >
                          {active && (
                            <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M1.5 5l2.5 2.5 4.5-4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="truncate">{config.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}

        {/* Tags */}
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Tags
          </p>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-xs transition-colors',
                    active
                      ? 'border-primary bg-primary/10 font-medium text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* Clear filters */}
        {(selectedConfigs.length > 0 || selectedTags.length > 0) && (
          <div className="pt-1">
            <button
              onClick={onClearAll}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
