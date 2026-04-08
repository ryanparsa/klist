import { useState, useCallback } from 'react'

const STORAGE_KEY = 'klist:states'
const CYCLE = ['unchecked', 'passed', 'na']

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(states) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
}

export function useItemStates() {
  const [states, setStates] = useState(load)

  const getState = useCallback((id) => states[id] ?? 'unchecked', [states])

  const cycleState = useCallback((id) => {
    setStates(prev => {
      const current = prev[id] ?? 'unchecked'
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]
      const updated = { ...prev }
      if (next === 'unchecked') {
        delete updated[id]
      } else {
        updated[id] = next
      }
      save(updated)
      return updated
    })
  }, [])

  const importStates = useCallback((incoming) => {
    // incoming may contain 'unchecked' keys — strip them (unchecked is the default)
    const cleaned = Object.fromEntries(
      Object.entries(incoming).filter(([, v]) => v !== 'unchecked')
    )
    save(cleaned)
    setStates(cleaned)
  }, [])

  return { getState, cycleState, importStates, rawStates: states }
}
