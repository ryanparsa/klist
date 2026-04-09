import { useMemo } from 'react'
import { ScoreBar } from './ScoreBar'
import { ChecklistItem } from './ChecklistItem'
import { useChecklistContext } from '@/contexts/ChecklistContext'

export function ChecklistSection({ label, items }) {
  const { itemVisible } = useChecklistContext()
  const visible = useMemo(() => items.filter(itemVisible), [items, itemVisible])

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
