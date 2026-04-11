import { ScoreBar } from './ScoreBar'
import { ChecklistItem } from './ChecklistItem'
import { useChecklistContext } from '@/lib/ChecklistContext'
import { useMemo } from 'react'

export function ChecklistSection({ label, category, itemVisible }) {
  const { data } = useChecklistContext()
  const items = useMemo(() => data.items.filter(i => i.category === category), [data.items, category])

  const visible = items.filter(itemVisible)

  // Always render the section header + score bar.
  // Only skip if the section has no items at all.
  if (items.length === 0) return null

  return (
    <section className="mb-8">
      <ScoreBar
        label={label}
        items={items}
      />

      {visible.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No items match the current filters.
        </p>
      ) : (
        <div className="space-y-1.5 mt-3">
          {visible.map(item => (
            <ChecklistItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </section>
  )
}
