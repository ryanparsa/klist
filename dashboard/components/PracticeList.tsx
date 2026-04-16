'use client'

import { useState } from 'react'
import type { Practice } from '@/.velite'
import type { Priority } from '@/lib/filterPractices'
import { PracticeItem } from './PracticeItem'

interface PracticeListProps {
  practices: Array<Practice & { priority: Priority }>
  checked: Record<string, boolean>
  onToggleCheck: (id: string) => void
  configsSelected: boolean
}

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'cloud', label: 'Cloud' },
  { key: 'cluster', label: 'Cluster' },
  { key: 'container', label: 'Container' },
  { key: 'code', label: 'Code' },
]

const CATEGORY_ACCENT: Record<string, string> = {
  cloud: 'border-l-sky-400',
  cluster: 'border-l-violet-400',
  container: 'border-l-orange-400',
  code: 'border-l-emerald-400',
}

export function PracticeList({
  practices,
  checked,
  onToggleCheck,
  configsSelected,
}: PracticeListProps) {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const handleToggleOpen = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id))
  }

  if (!practices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <svg className="mb-3 h-10 w-10 opacity-30" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m21 21-4.35-4.35"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm">No practices match the current filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {CATEGORIES.map(({ key, label }) => {
        const items = practices
          .filter((p) => p.category === key)
          .sort((a, b) => {
            const numA = parseInt(a.id.replace(/\D/g, ''), 10)
            const numB = parseInt(b.id.replace(/\D/g, ''), 10)
            return numA - numB
          })
        if (!items.length) return null

        const checkedCount = items.filter((p) => checked[p.id]).length
        const requiredCount = configsSelected
          ? items.filter((p) => p.priority === 'required').length
          : 0
        const checkedRequired = configsSelected
          ? items.filter((p) => p.priority === 'required' && checked[p.id]).length
          : 0

        return (
          <section key={key}>
            {/* Category header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
              <h2 className="text-sm font-semibold text-foreground">{label}</h2>

              {configsSelected ? (
                <>
                  <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width:
                          requiredCount > 0
                            ? `${(checkedRequired / requiredCount) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {checkedRequired}/{requiredCount} required
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width:
                          items.length > 0 ? `${(checkedCount / items.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {checkedCount}/{items.length} passed
                  </span>
                </>
              )}
            </div>

            {/* Practice rows */}
            <div className={`border-l-2 ${CATEGORY_ACCENT[key] ?? 'border-l-border'}`}>
              {items.map((practice) => (
                <PracticeItem
                  key={practice.id}
                  practice={practice}
                  isOpen={openItem === practice.id}
                  isChecked={!!checked[practice.id]}
                  onToggleOpen={handleToggleOpen}
                  onToggleCheck={onToggleCheck}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
