import { useRef } from 'react'
import { Download, Upload, Printer } from 'lucide-react'

export function ExportImport({ activeConfigs, rawStates, onImport }) {
  const fileInputRef = useRef(null)

  function handleExport() {
    const payload = {
      exported_at: new Date().toISOString(),
      active_configs: [...activeConfigs],
      states: rawStates,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `klist-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data.active_configs || !data.states) {
          alert('Invalid export file.')
          return
        }
        onImport({ active_configs: data.active_configs, states: data.states })
      } catch {
        alert('Failed to parse export file.')
      }
    }
    reader.readAsText(file)
    // Reset so the same file can be re-imported
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-1">
      <IconButton onClick={handleImportClick} title="Import session">
        <Upload size={16} />
        <span className="hidden sm:inline">Import</span>
      </IconButton>

      <IconButton onClick={handleExport} title="Export session">
        <Download size={16} />
        <span className="hidden sm:inline">Export</span>
      </IconButton>

      <IconButton onClick={() => window.print()} title="Print / Save as PDF">
        <Printer size={16} />
        <span className="hidden sm:inline">PDF</span>
      </IconButton>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

function IconButton({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
    >
      {children}
    </button>
  )
}
