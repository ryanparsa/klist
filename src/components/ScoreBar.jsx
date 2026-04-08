import { computeScore } from '@/hooks/usePriorityResolution'

export function ScoreBar({ label, items, priorityMap, getState }) {
  const score = computeScore(items, priorityMap, getState)

  const req = score.required
  const sug = score.suggested

  const reqPct = req.total > 0 ? (req.passed / req.total) * 100 : 0

  return (
    <div className="mb-2">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold w-24 shrink-0">{label}</h2>

        {req.total > 0 ? (
          <>
            {/* Progress bar */}
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${reqPct}%` }}
              />
            </div>
            <span className="text-sm tabular-nums text-muted-foreground shrink-0">
              {req.passed} / {req.total} required
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">no required items</span>
        )}

        {sug.total > 0 && (
          <span className="text-xs tabular-nums text-muted-foreground shrink-0 hidden sm:inline">
            {sug.passed} / {sug.total} suggested
          </span>
        )}
      </div>
    </div>
  )
}
