"use client"

import { useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { useProgress } from "@/hooks/useProgress"
import { cn } from "@/lib/utils"

interface TopbarProps {
  totalChecked: number
  onReset: () => void
  onMenuToggle: () => void
}

export function Topbar({ totalChecked, onReset, onMenuToggle }: TopbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { exportProgress, importProgress } = useProgress()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = exportProgress()
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "klist-progress.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        importProgress(data)
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:hidden"
          title="Toggle sidebar"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-foreground">
          <span className="text-primary">k</span>list
          <span className="ml-2 font-normal text-muted-foreground">
            Kubernetes Operational Checklist
          </span>
        </h1>
        {totalChecked > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {totalChecked} checked
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        <ActionButton onClick={handleImport} label="Import" />
        <span className="hidden md:contents">
          <ActionButton onClick={handleExport} label="Export" />
          <ActionButton onClick={() => window.print()} label="PDF" />
        </span>

        <span className="h-4 w-px bg-border" />

        <button
          onClick={onReset}
          title="Reset all progress and filters"
          className={cn(
            "rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground",
            "transition-colors hover:border-destructive/50 hover:text-destructive"
          )}
        >
          Reset
        </button>

        <button
          suppressHydrationWarning
          onClick={handleToggleTheme}
          title={
            resolvedTheme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded border border-border text-muted-foreground",
            "transition-colors hover:border-primary/50 hover:text-foreground"
          )}
        >
          {resolvedTheme === "dark" ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 9A6 6 0 0 1 7 2.5a6 6 0 1 0 6.5 6.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

function ActionButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground",
        "transition-colors hover:border-primary/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}
