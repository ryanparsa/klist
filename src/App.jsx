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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

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

  // -------------------------------------------------------------------------
  // Loading / error states
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Filter predicate — used by every section (does NOT affect scoring)
  // -------------------------------------------------------------------------

  const searchLower = search.toLowerCase()

  function itemVisible(item) {
    if (activeTags.size > 0 && !item.tags.some(t => activeTags.has(t))) return false
    if (searchLower && !item.title.toLowerCase().includes(searchLower) && !item.description.toLowerCase().includes(searchLower) && !item.tags.some(t => t.toLowerCase().includes(searchLower))) return false
    return true
  }

  // -------------------------------------------------------------------------
  // Import handler
  // -------------------------------------------------------------------------

  function handleImport({ active_configs, states }) {
    setActiveConfigs(active_configs)
    importStates(states)
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex inset-y-0 left-0 z-30 w-64 border-r bg-sidebar flex-col overflow-hidden">
        <Sidebar
          configs={data.configs}
          allTags={data.all_tags}
          activeConfigs={activeConfigs}
          activeTags={activeTags}
          onToggleConfig={toggleConfig}
          onToggleTag={toggleTag}
          onClose={() => {}}
        />
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="no-print flex shrink-0 items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open sidebar">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <VisuallyHidden>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Configure active checklist filters and tags.</SheetDescription>
                </VisuallyHidden>
                <Sidebar
                  configs={data.configs}
                  allTags={data.all_tags}
                  activeConfigs={activeConfigs}
                  activeTags={activeTags}
                  onToggleConfig={toggleConfig}
                  onToggleTag={toggleTag}
                  onClose={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>

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

        {/* Search */}
        <div className="no-print shrink-0 border-b px-4 py-2">
          <Input
            type="search"
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Checklist */}
        <main className="flex-1 overflow-y-auto px-4 py-5">
          {CATEGORIES.map(({ id, label }) => (
            <ChecklistSection
              key={id}
              label={label}
              items={data.items.filter(i => i.category === id)}
              priorityMap={priorityMap}
              getState={getState}
              cycleState={cycleState}
              itemVisible={itemVisible}
            />
          ))}
        </main>
      </div>
    </div>
  )
}
