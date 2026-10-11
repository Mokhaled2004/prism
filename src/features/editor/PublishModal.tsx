"use client"

import { useEffect } from "react"
import { X, Upload, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "./store"

export interface PublishModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PublishModal({ open, onClose, onConfirm }: PublishModalProps) {
  const sections = useEditor((s) => s.sections)

  const totalItems = sections.reduce(
    (acc, s) =>
      acc +
      s.layout.reduce(
        (sum, row) =>
          sum + row.columns.reduce((c, col) => c + col.items.length, 0),
        0
      ),
    0
  )

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-panel border border-border rounded-lg shadow-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4 text-prism-accent" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-prism-text-strong">
                Publish dashboard?
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                Make it available to your team
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

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <div className="rounded-md border border-border bg-bg p-3 space-y-2">
            <SummaryRow label="Dashboard" value="Sales Overview" />
            <SummaryRow label="Sections" value={String(sections.length)} />
            <SummaryRow label="Components" value={String(totalItems)} />
            <SummaryRow
              label="Last saved"
              value="Just now"
              muted
            />
          </div>

          {totalItems === 0 && (
            <div className="flex items-start gap-2 p-3 rounded-md border border-warn bg-warn-subtle/40">
              <AlertCircle
                className="w-4 h-4 text-prism-warn mt-0.5 shrink-0"
                strokeWidth={1.75}
              />
              <p className="text-xs text-prism-text">
                This dashboard has no components yet. Publish anyway?
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-md bg-bg-hover">
            <Check
              className="w-4 h-4 text-prism-ok mt-0.5 shrink-0"
              strokeWidth={2}
            />
            <p className="text-xs text-prism-text">
              Publishing snapshots the current state. Team members with access
              will see this version.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-bg-hover flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>Publish now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-prism-muted">{label}</span>
      <span
        className={cn(
          "font-medium",
          muted ? "text-prism-muted" : "text-prism-text-strong"
        )}
      >
        {value}
      </span>
    </div>
  )
}