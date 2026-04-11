import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const TYPE_ORDER = ['baseline', 'provider', 'architecture', 'compliance']

export function Sidebar({ configs, allTags, activeConfigs, activeTags, onToggleConfig, onToggleTag, onClose }) {
  const sorted = TYPE_ORDER.flatMap(type => configs.filter(c => c.type === type))

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Filters</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-3 space-y-5">
          {/* Configs grouped by type */}
          {TYPE_ORDER.map(type => {
            const typeConfigs = configs.filter(c => c.type === type)
            if (typeConfigs.length === 0) return null

            return (
              <section key={type}>
                <h3 className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {type}
                </h3>
                <ul className="space-y-0.5">
                  {typeConfigs.map(config => (
                    <li key={config.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                          activeConfigs.has(config.id) ? "bg-muted/60 font-medium text-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                        title={config.description ?? ''}
                      >
                        <Checkbox
                          checked={activeConfigs.has(config.id)}
                          onCheckedChange={() => onToggleConfig(config.id)}
                        />
                        <span className={cn(activeConfigs.has(config.id) && 'font-medium')}>
                          {config.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}

          {/* Tags */}
          <section>
            <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5 px-1">
              {allTags.map(tag => {
                const isActive = activeTags.has(tag)
                return (
                  <Badge
                    key={tag}
                    variant={isActive ? "default" : "secondary"}
                    className="cursor-pointer font-mono font-normal hover:bg-primary/90"
                    onClick={() => onToggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                )
              })}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
