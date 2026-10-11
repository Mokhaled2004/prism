"use client"

import { X } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { layoutPresets, type LayoutPreset } from "./layouts"
import { useEditor } from "./store"

export interface LayoutPickerModalProps {
  open: boolean
  onClose: () => void
}

export function LayoutPickerModal({ open, onClose }: LayoutPickerModalProps) {
  const applyPreset = useEditor((s) => s.applyPreset)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const handlePick = (preset: LayoutPreset) => {
    applyPreset(preset.rows)
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
        className="relative w-full max-w-2xl bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-prism-text-strong">
              Choose a layout
            </h2>
            <p className="text-xs text-prism-muted mt-0.5">
              Existing components stay on the canvas and get reflowed
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            {layoutPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePick(preset)}
                className={cn(
                  "text-left rounded-lg border border-border bg-panel p-3 transition-all",
                  "hover:border-accent hover:bg-accent-subtle/40"
                )}
              >
                <PresetThumbnail preset={preset} />
                <p className="text-sm font-medium text-prism-text-strong mt-3">
                  {preset.label}
                </p>
                <p className="text-2xs text-prism-muted mt-0.5">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Thumbnail ───────────────────────────────────────────── */

function PresetThumbnail({ preset }: { preset: LayoutPreset }) {
  if (preset.rows.length === 0) {
    return (
      <div className="h-20 rounded-md border border-dashed border-border flex items-center justify-center bg-bg-hover/40">
        <span className="text-2xs text-prism-muted">Empty</span>
      </div>
    )
  }

  return (
    <div className="h-20 flex flex-col gap-1">
      {preset.rows.map((row, ri) => (
        <div
          key={ri}
          className="flex-1 grid grid-cols-12 gap-1"
        >
          {row.map((col, ci) => (
            <div
              key={ci}
              style={{ gridColumn: `span ${col.span}` }}
              className="rounded-sm bg-accent-subtle border border-accent/20"
            />
          ))}
        </div>
      ))}
    </div>
  )
}