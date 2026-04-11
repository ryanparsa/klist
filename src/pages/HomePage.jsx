import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ChecklistSection } from '@/components/ChecklistSection'
import { CATEGORIES } from '@/lib/categories'

export function HomePage({ data, activeTags, priorityMap, getState, cycleState }) {
  const [search, setSearch] = useState('')
  const searchLower = search.toLowerCase()

  function itemVisible(item) {
    if (activeTags.size > 0 && !item.tags.some(t => activeTags.has(t))) return false
    if (searchLower && !item.title.toLowerCase().includes(searchLower) && !item.description.toLowerCase().includes(searchLower) && !item.tags.some(t => t.toLowerCase().includes(searchLower))) return false
    return true
  }

  return (
    <>
      <div className="no-print shrink-0 border-b px-4 py-2">
        <Input
          type="search"
          placeholder="Search items…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
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
    </>
  )
}
