export type Priority = 'required' | 'suggested' | 'optional'

interface ConfigItems {
  items: { required: string[]; suggested: string[] }
}

export function getPriority(id: string, selectedConfigs: ConfigItems[]): Priority {
  if (!selectedConfigs.length) return 'optional'
  if (selectedConfigs.some((c) => c.items.required.includes(id))) return 'required'
  if (selectedConfigs.some((c) => c.items.suggested.includes(id))) return 'suggested'
  return 'optional'
}

export function filterAndPrioritize<P extends { id: string; tags: string[] }>(
  practices: P[],
  selectedConfigs: ConfigItems[],
  selectedTags: string[],
): Array<P & { priority: Priority }> {
  return practices
    .filter((p) => !selectedTags.length || selectedTags.every((tag) => p.tags.includes(tag)))
    .map((p) => ({ ...p, priority: getPriority(p.id, selectedConfigs) }))
}

export function getAllTags<P extends { tags: string[] }>(practices: P[]): string[] {
  const tags = new Set<string>()
  practices.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}
