import { useState, useMemo } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useChecklist } from '@/hooks/useChecklist'
import { useUrlState } from '@/hooks/useUrlState'
import { useItemStates } from '@/hooks/useItemStates'
import { usePriorityResolution } from '@/hooks/usePriorityResolution'
import { Sidebar } from '@/components/Sidebar'
import { ExportImport } from '@/components/ExportImport'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ItemPage } from '@/pages/ItemPage'
import { ChecklistProvider } from '@/lib/ChecklistContext'

export default function App() {
  const { data, error } = useChecklist()
  const { activeConfigs, activeTags, toggleConfig, toggleTag, setActiveConfigs } = useUrlState()
  const { getState, cycleState, importStates, rawStates } = useItemStates()
  const priorityMap = usePriorityResolution(data?.configs ?? [], activeConfigs)

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
  // Import handler
  // -------------------------------------------------------------------------

  function handleImport({ active_configs, states }) {
    setActiveConfigs(active_configs)
    importStates(states)
  }

  // -------------------------------------------------------------------------
  // Shared props passed to every page
  // -------------------------------------------------------------------------

  const pageProps = useMemo(() => ({
    data,
    activeConfigs,
    activeTags,
    priorityMap,
    getState,
    cycleState,
  }), [data, activeConfigs, activeTags, priorityMap, getState, cycleState])

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

            <Link
              to="/"
              className="font-mono text-base font-semibold tracking-tight hover:opacity-70 transition-opacity"
            >
              klist
            </Link>
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

        {/* Routed pages */}
        <ChecklistProvider value={pageProps}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:category" element={<CategoryPage />} />
            <Route path="/:category/:itemId" element={<ItemPage />} />
          </Routes>
        </ChecklistProvider>

      </div>
    </div>
  )
}
