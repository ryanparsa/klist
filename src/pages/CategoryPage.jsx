import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { ChecklistSection } from '@/components/ChecklistSection'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CATEGORIES } from '@/lib/categories'
import { useChecklistContext } from '@/lib/ChecklistContext'
import { useMemo } from 'react'

export function CategoryPage() {
  const { data, activeTags } = useChecklistContext()
  const { category } = useParams()
  const [search, setSearch] = useState('')

  const cat = CATEGORIES.find(c => c.id === category)
  if (!cat) return <Navigate to="/" replace />

  const searchLower = search.toLowerCase()

  const itemVisible = (item) => {
    if (activeTags.size > 0 && !item.tags.some(t => activeTags.has(t))) return false
    if (searchLower && !item.title.toLowerCase().includes(searchLower) && !item.description.toLowerCase().includes(searchLower) && !item.tags.some(t => t.toLowerCase().includes(searchLower))) return false
    return true
  }

  return (
    <>
      <div className="no-print shrink-0 border-b px-4 py-2 space-y-2">
        <Breadcrumb items={[{ label: cat.label }]} />
        <Input
          type="search"
          placeholder="Search items…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <ChecklistSection
          label={cat.label}
          category={category}
          itemVisible={itemVisible}
        />
      </main>
    </>
  )
}
