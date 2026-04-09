import { useState } from 'react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChecklist } from '@/hooks/useChecklist'
import { useUrlState } from '@/hooks/useUrlState'
import { useItemStates } from '@/hooks/useItemStates'
import { usePriorityResolution } from '@/hooks/usePriorityResolution'
import { Sidebar } from '@/components/Sidebar'
import { ChecklistSection } from '@/components/ChecklistSection'
import { ExportImport } from '@/components/ExportImport'
import { ChecklistProvider } from '@/contexts/ChecklistContext'
import { useMemo, useCallback } from 'react'

const CATEGORIES = [
  { id: 'cloud',     label: 'Cloud' },
  { id: 'cluster',   label: 'Cluster' },
  { id: 'container', label: 'Container' },
  { id: 'code',      label: 'Code' },
]

export default function App() {
  const { data, error } = useChecklist()
  const { activeConfigs, activeTags, toggleConfig, toggleTag, setActiveConfigs } = useUrlState()
  const { getState, cycleState, importStates, rawStates } = useItemStates()
  const priorityMap = usePriorityResolution(data?.configs ?? [], activeConfigs)

  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-8 text-center">
        <div>
          <p className="font-semibold text-destructive">Failed to load checklist</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  const searchLower = search.toLowerCase()

  const itemVisible = useCallback((item) => {
    if (activeTags.size > 0 && !item.tags.some(t => activeTags.has(t))) return false
    if (searchLower && !item.title.toLowerCase().includes(searchLower) && !item.description.toLowerCase().includes(searchLower)) return false
    return true
  }, [activeTags, searchLower])

  const contextValue = useMemo(() => ({
    priorityMap,
    getState,
    cycleState,
    itemVisible
  }), [priorityMap, getState, cycleState, itemVisible])

  function handleImport({ active_configs, states }) {
    setActiveConfigs(active_configs)
    importStates(states)
  }

  return (
    <ChecklistProvider value={contextValue}>
      <div className="flex h-screen overflow-hidden bg-background">
        {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 border-r bg-sidebar transition-transform duration-200',
        'lg:static lg:z-auto lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <Sidebar
          configs={data.configs}
          allTags={data.all_tags}
          activeConfigs={activeConfigs}
          activeTags={activeTags}
          onToggleConfig={toggleConfig}
          onToggleTag={toggleTag}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        <header className="no-print flex shrink-0 items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <button
              className="rounded p-1.5 hover:bg-muted transition-colors lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <span className="font-mono text-base font-semibold tracking-tight">klist</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Kubernetes Operational Checklist
            </span>
          </div>
          <ExportImport
            activeConfigs={activeConfigs}
            rawStates={rawStates}
            onImport={handleImport}
          />
        </header>

          <div className="no-print shrink-0 border-b px-4 py-2">
            <input
              type="search"
              aria-label="Search items"
              placeholder="Search items…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <main className="flex-1 overflow-y-auto px-4 py-5">
            {CATEGORIES.map(({ id, label }) => (
              <ChecklistSection
                key={id}
                label={label}
                items={data.items.filter(i => i.category === id)}
              />
            ))}
          </main>
        </div>
      </div>
    </ChecklistProvider>
  )
}
