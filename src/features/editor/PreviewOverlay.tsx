"use client"

import { useEffect } from "react"
import { X, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "./store"
import { componentRegistry } from "./registry"
import type { LayoutRow } from "./store"

export interface PreviewOverlayProps {
  open: boolean
  onClose: () => void
}

export function PreviewOverlay({ open, onClose }: PreviewOverlayProps) {
  const sections = useEditor((s) => s.sections)
  const activeId = useEditor((s) => s.activeId)
  const setActiveId = useEditor((s) => s.setActiveId)

  const active = sections.find((s) => s.id === activeId)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open || !active) return null

  return (
    <div className="fixed inset-0 z-[70] bg-bg flex overflow-hidden">
      {/* ─── Section sidebar ─────────────────────────────── */}
      <aside className="w-[240px] shrink-0 bg-panel border-r border-border flex flex-col">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center gap-2 border-b border-border shrink-0">
          <img
            src="/logo.png"
            alt="Prism"
            className="w-6 h-6 object-contain shrink-0"
          />
          <span className="text-sm font-semibold text-prism-text-strong">
            Prism
          </span>
        </div>

        {/* Sections list */}
        <nav className="flex-1 overflow-y-auto py-3">
          <p className="px-4 mb-2 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Sections
          </p>
          <div className="px-2 space-y-0.5">
            {sections.map((s) => {
              const isActive = s.id === activeId
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "w-full h-8 px-2.5 rounded-md flex items-center gap-2.5 text-xs text-left transition-colors",
                    isActive
                      ? "bg-accent-subtle text-prism-accent font-medium"
                      : "text-prism-text hover:bg-bg-hover"
                  )}
                >
                  <LayoutGrid
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      isActive ? "text-prism-accent" : "text-prism-muted"
                    )}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  <span className="flex-1 truncate">{s.name}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <p className="text-2xs text-prism-muted">
            Preview · {sections.length}{" "}
            {sections.length === 1 ? "section" : "sections"}
          </p>
        </div>
      </aside>

      {/* ─── Content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Exit button — floats top-right inside the content area */}
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-gradient-to-b from-bg via-bg to-transparent pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto h-8 px-3 rounded-md bg-panel border border-border shadow-lg text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
            title="Exit preview (Esc)"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Exit preview</span>
          </button>
        </div>

        <div className="px-8 pb-12 -mt-8">
          <div className="space-y-5">
            {active.layout.map((row) => (
              <PreviewRow key={row.id} row={row} />
            ))}
            {active.layout.length === 0 && (
              <p className="text-sm text-prism-muted text-center py-20">
                This section has no content yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function PreviewRow({ row }: { row: LayoutRow }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {row.columns.map((col) => (
        <div key={col.id} style={{ gridColumn: `span ${col.span}` }}>
          <div className="space-y-4">
            {col.items.map((item) => {
              const entry = componentRegistry[item.type]
              if (!entry) return null
              return (
                <div
                  key={item.id}
                  className="bg-panel border border-border rounded-lg p-4"
                >
                  <entry.render {...item.props} />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}