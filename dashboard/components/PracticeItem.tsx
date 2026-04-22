'use client'

import { useRef, useState } from 'react'
import type { Practice } from '@/.velite'
import type { Priority } from '@/lib/filterPractices'
import { PracticeDetail } from './PracticeDetail'
import { cn } from '@/lib/utils'

interface PracticeItemProps {
  practice: Practice & { priority: Priority }
  isOpen: boolean
  isChecked: boolean
  onToggleOpen: (id: string) => void
  onToggleCheck: (id: string) => void
}

const PRIORITY_BADGE: Record<Priority, string> = {
  required: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  suggested: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  optional: 'bg-muted text-muted-foreground',
}

const STAGE_BADGE: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  review: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  deprecated: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
}

const CATEGORY_COLOR: Record<string, string> = {
  cloud: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  cluster: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  container: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  code: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export function PracticeItem({
  practice,
  isOpen,
  isChecked,
  onToggleOpen,
  onToggleCheck,
}: PracticeItemProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Copy raw JSON data — no conversion needed, LLMs read it fine
    const { hasMermaid: _hm, ...data } = practice as typeof practice & { hasMermaid?: boolean }
    const json = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div
      ref={rowRef}
      className={cn(
        'border-b border-border transition-colors last:border-b-0',
        isOpen && 'bg-muted/10',
      )}
    >
      {/* Row */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30',
          isOpen && 'bg-muted/20',
        )}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleCheck(practice.id)
          }}
          aria-label={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
          className={cn(
            'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
            isChecked
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/40 hover:border-primary',
          )}
        >
          {isChecked && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* ID badge */}
        <button
          onClick={() => onToggleOpen(practice.id)}
          className={cn(
            'flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-medium transition-colors',
            isChecked
              ? 'bg-primary/15 text-primary'
              : (CATEGORY_COLOR[practice.category] ?? 'bg-muted text-muted-foreground'),
          )}
        >
          {practice.id}
        </button>

        {/* Title */}
        <button
          onClick={() => onToggleOpen(practice.id)}
          className="flex-1 text-left text-sm font-medium text-foreground hover:text-primary"
        >
          {practice.title}
        </button>

        {/* Stage badge — only for non-active stages */}
        {practice.stage !== 'active' && (
          <span
            className={cn(
              'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              STAGE_BADGE[practice.stage] ?? 'bg-muted text-muted-foreground',
            )}
          >
            {practice.stage}
          </span>
        )}

        {/* Priority badge */}
        <span
          className={cn(
            'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
            PRIORITY_BADGE[practice.priority],
          )}
        >
          {practice.priority}
        </span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title="Copy to clipboard (for LLM)"
          className={cn(
            'flex-shrink-0 rounded p-1 transition-colors',
            copied
              ? 'text-primary'
              : 'text-muted-foreground/40 hover:text-muted-foreground',
          )}
        >
          {copied ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8l4 4 8-8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 11V3h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Expand chevron */}
        <button
          onClick={() => onToggleOpen(practice.id)}
          className="flex-shrink-0 text-muted-foreground transition-transform"
          aria-label={isOpen ? 'Collapse' : 'Expand'}
        >
          <svg
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      {isOpen && <PracticeDetail practice={practice} />}
    </div>
  )
}
