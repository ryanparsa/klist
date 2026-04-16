"use client"

import { useMemo, useState } from "react"
import type { Practice, Config } from "@/.velite"
import { useUrlState } from "@/hooks/useUrlState"
import { useProgress } from "@/hooks/useProgress"
import { filterAndPrioritize } from "@/lib/filterPractices"
import { Sidebar } from "./Sidebar"
import { PracticeList } from "./PracticeList"
import { Footer } from "./Footer"
import { Topbar } from "./Topbar"
import { SearchBar } from "./SearchBar"

interface DashboardProps {
  practices: Practice[]
  configs: Config[]
}

export function Dashboard({ practices, configs }: DashboardProps) {
  const [urlState, setUrlState] = useUrlState()
  const { checked, toggle, importProgress } = useProgress()
  const [search, setSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { configs: selectedConfigIds, tags: selectedTags } = urlState

  const selectedConfigs = useMemo(
    () => configs.filter((c) => selectedConfigIds.includes(c.id)),
    [configs, selectedConfigIds]
  )

  const filtered = useMemo(() => {
    let items = filterAndPrioritize(practices, selectedConfigs, selectedTags)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      )
    }
    return items
  }, [practices, selectedConfigs, selectedTags, search])

  const handleConfigToggle = (id: string) => {
    const next = selectedConfigIds.includes(id)
      ? selectedConfigIds.filter((c) => c !== id)
      : [...selectedConfigIds, id]
    setUrlState({ configs: next })
  }

  const handleTagToggle = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    setUrlState({ tags: next })
  }

  const handleClearAll = () => {
    setUrlState({ configs: [], tags: [] })
  }

  const handleReset = () => {
    importProgress({})
    setUrlState({ configs: [], tags: [] })
    setSearch("")
  }

  const totalChecked = Object.values(checked).filter(Boolean).length

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        configs={configs}
        allPractices={practices}
        selectedConfigs={selectedConfigIds}
        selectedTags={selectedTags}
        onConfigToggle={handleConfigToggle}
        onTagToggle={handleTagToggle}
        onClearAll={handleClearAll}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar totalChecked={totalChecked} onReset={handleReset} onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <SearchBar value={search} onChange={setSearch} />

        <main className="flex-1 overflow-y-auto">
          <PracticeList
            practices={filtered}
            checked={checked}
            onToggleCheck={toggle}
            configsSelected={selectedConfigIds.length > 0}
          />
          <Footer practices={practices} configs={configs} />
        </main>
      </div>
    </div>
  )
}
