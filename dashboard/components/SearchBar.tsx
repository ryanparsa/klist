"use client"

import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex-shrink-0 border-b border-border px-6 py-3">
      <div className="relative">
        <svg
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m13 13-2.5-2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          placeholder="Search practices..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded border border-border bg-background py-2 pr-4 pl-9 text-sm",
            "placeholder:text-muted-foreground",
            "focus:ring-1 focus:ring-ring focus:outline-none"
          )}
        />
      </div>
    </div>
  )
}
