"use client"

import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "./store"
import { library, type LibraryItem } from "./library"

export interface ComponentPickerModalProps {
  groupId: string | null
  onClose: () => void
}

export function ComponentPickerModal({
  groupId,
  onClose,
}: ComponentPickerModalProps) {
  const [search, setSearch] = useState("")
  const addToCell = useEditor((s) => s.addToCell)
  const sections = useEditor((s) => s.sections)
  const activeId = useEditor((s) => s.activeId)
  const selectedCellId = useEditor((s) => s.selectedCellId)

  const active = sections.find((s) => s.id === activeId)
  const layout = active?.layout ?? []

  const group = library.find((g) => g.id === groupId) ?? null

  useEffect(() => {
    if (groupId) setSearch("")
  }, [groupId])

  useEffect(() => {
    if (!groupId) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [groupId, onClose])

  if (!group) return null

  const filtered = group.items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  )

  const resolveTargetCell = (): string | null => {
    if (selectedCellId) return selectedCellId

    // first empty cell
    for (const row of layout) {
      for (const col of row.columns) {
        if (col.items.length === 0) return col.id
      }
    }

    // first cell overall
    for (const row of layout) {
      for (const col of row.columns) return col.id
    }

    return null
  }

  const handlePick = (item: LibraryItem) => {
    const cellId = resolveTargetCell()
    if (!cellId) {
      // No layout on this section yet — silently do nothing rather than blocking with alert
      return
    }
    addToCell(cellId, item.type)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <group.icon
                className="w-4 h-4 text-prism-accent"
                strokeWidth={1.75}
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-prism-text-strong">
                {group.label}
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                {group.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-prism-muted" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${group.label.toLowerCase()}...`}
              className="w-full h-8 pl-9 pr-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs text-prism-muted">
                No results for "{search}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.type}
                    onClick={() => handlePick(item)}
                    className={cn(
                      "group text-left rounded-lg border border-border bg-panel p-3 transition-all",
                      "hover:border-accent hover:bg-accent-subtle"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-md bg-bg-hover flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-prism-accent-text transition-colors">
                        <Icon className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-prism-text-strong truncate">
                          {item.label}
                        </p>
                        <p className="text-xs text-prism-muted mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}