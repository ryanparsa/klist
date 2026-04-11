import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeConfigs = new Set(searchParams.get('configs')?.split(',').filter(Boolean) ?? [])
  const activeTags = new Set(searchParams.get('tags')?.split(',').filter(Boolean) ?? [])

  const toggleConfig = useCallback((id) => {
    setSearchParams(prev => {
      const configs = new Set(prev.get('configs')?.split(',').filter(Boolean) ?? [])
      configs.has(id) ? configs.delete(id) : configs.add(id)
      const next = new URLSearchParams(prev)
      if (configs.size > 0) next.set('configs', [...configs].join(','))
      else next.delete('configs')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const toggleTag = useCallback((tag) => {
    setSearchParams(prev => {
      const tags = new Set(prev.get('tags')?.split(',').filter(Boolean) ?? [])
      tags.has(tag) ? tags.delete(tag) : tags.add(tag)
      const next = new URLSearchParams(prev)
      if (tags.size > 0) next.set('tags', [...tags].join(','))
      else next.delete('tags')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setActiveConfigs = useCallback((ids) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      const configs = new Set(ids)
      if (configs.size > 0) next.set('configs', [...configs].join(','))
      else next.delete('configs')
      return next
    }, { replace: true })
  }, [setSearchParams])

  return { activeConfigs, activeTags, toggleConfig, toggleTag, setActiveConfigs }
}
