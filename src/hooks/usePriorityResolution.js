import { useMemo } from 'react'

/**
 * Given the list of all configs and the set of active config IDs,
 * returns a Map<itemId, 'required' | 'suggested'>.
 * Items absent from the map are 'optional'.
 *
 * Rule: required always overrides suggested, regardless of source.
 */
export function usePriorityResolution(configs, activeConfigs) {
  return useMemo(() => {
    const map = new Map()

    for (const config of configs) {
      if (!activeConfigs.has(config.id)) continue

      for (const id of config.items.required) {
        map.set(id, 'required')
      }
      for (const id of config.items.suggested) {
        if (map.get(id) !== 'required') {
          map.set(id, 'suggested')
        }
      }
    }

    return map
  }, [configs, activeConfigs])
}
