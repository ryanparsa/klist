'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface UrlState {
  configs: string[]
  tags: string[]
}

const DEFAULT: UrlState = { configs: [], tags: [] }

function parse(): UrlState {
  if (typeof window === 'undefined') return DEFAULT
  const params = new URLSearchParams(window.location.search)
  return {
    configs: params.get('config')?.split(',').filter(Boolean) ?? [],
    tags: params.get('tags')?.split(',').filter(Boolean) ?? [],
  }
}

function toUrl(state: UrlState): string {
  const params = new URLSearchParams()
  if (state.configs.length) params.set('config', state.configs.join(','))
  if (state.tags.length) params.set('tags', state.tags.join(','))
  return params.toString() ? `?${params.toString()}` : window.location.pathname
}

export function useUrlState(): [UrlState, (partial: Partial<UrlState>) => void] {
  const [state, setState] = useState<UrlState>(DEFAULT)
  const stateRef = useRef(DEFAULT)

  useEffect(() => {
    const initial = parse()
    stateRef.current = initial
    setState(initial)

    const sync = () => {
      const next = parse()
      stateRef.current = next
      setState(next)
    }
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const update = useCallback((partial: Partial<UrlState>) => {
    const next = { ...stateRef.current, ...partial }
    stateRef.current = next
    history.pushState(null, '', toUrl(next))
    setState(next)
  }, [])

  return [state, update]
}
