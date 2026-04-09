/**
 * Compute per-priority scores for a list of items.
 * na items are excluded from both numerator and denominator.
 * unchecked counts against the score (not passed).
 */
export function computeScore(items, priorityMap, getState) {
  const buckets = {
    required:  { passed: 0, total: 0 },
    suggested: { passed: 0, total: 0 },
    optional:  { passed: 0, total: 0 },
  }

  for (const item of items) {
    const priority = priorityMap.get(item.id) ?? 'optional'
    const state = getState(item.id)
    if (state === 'na') continue
    buckets[priority].total++
    if (state === 'passed') buckets[priority].passed++
  }

  return buckets
}
