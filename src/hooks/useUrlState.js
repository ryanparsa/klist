import { useState, useCallback, useEffect } from 'react'

function parseUrl() {
  const params = new URLSearchParams(window.location.search)
  const configs = params.get('configs')?.split(',').filter(Boolean) ?? []
  const tags = params.get('tags')?.split(',').filter(Boolean) ?? []
  return { activeConfigs: new Set(configs), activeTags: new Set(tags) }
}

function writeUrl(activeConfigs, activeTags) {
  const params = new URLSearchParams()
  if (activeConfigs.size > 0) params.set('configs', [...activeConfigs].join(','))
  if (activeTags.size > 0) params.set('tags', [...activeTags].join(','))
  const search = params.toString()
  window.history.replaceState(null, '', search ? `?${search}` : window.location.pathname)
}

export function useUrlState() {
  const [state, setState] = useState(parseUrl)

  const toggleConfig = useCallback((id) => {
    setState(prev => {
      const next = new Set(prev.activeConfigs)
      next.has(id) ? next.delete(id) : next.add(id)
      writeUrl(next, prev.activeTags)
      return { ...prev, activeConfigs: next }
    })
  }, [])

  const toggleTag = useCallback((tag) => {
    setState(prev => {
      const next = new Set(prev.activeTags)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      writeUrl(prev.activeConfigs, next)
      return { ...prev, activeTags: next }
    })
  }, [])

  const setActiveConfigs = useCallback((ids) => {
    setState(prev => {
      const next = new Set(ids)
      writeUrl(next, prev.activeTags)
      return { ...prev, activeConfigs: next }
    })
  }, [])

  // Sync on browser back/forward
  useEffect(() => {
    const handler = () => setState(parseUrl())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return { ...state, toggleConfig, toggleTag, setActiveConfigs }
}
