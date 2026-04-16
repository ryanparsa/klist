'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY = 'klist-progress'

type ProgressMap = Record<string, boolean>

export function useProgress() {
  const [checked, setChecked] = useState<ProgressMap>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {}
  }, [])

  const persist = useCallback((map: ProgressMap) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(map))
    } catch {}
  }, [])

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const getProgress = useCallback(
    (ids: string[]) => {
      const done = ids.filter((id) => checked[id]).length
      return { done, total: ids.length }
    },
    [checked],
  )

  const importProgress = useCallback(
    (map: ProgressMap) => {
      setChecked(map)
      persist(map)
    },
    [persist],
  )

  const exportProgress = useCallback(() => {
    return { ...checked }
  }, [checked])

  return { checked, toggle, getProgress, importProgress, exportProgress }
}
