"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, ChevronDown, Check, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Report } from "./report-types"

export interface ScheduleReportPickerProps {
  reports: Report[]
  value: string | null
  onChange: (reportId: string | null) => void
  disabled?: boolean
}

export function ScheduleReportPicker({
  reports,
  value,
  onChange,
  disabled,
}: ScheduleReportPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open])

  const selected = reports.find((r) => r.id === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full h-10 px-3 rounded-md border bg-bg text-left flex items-center gap-2 transition-all cursor-pointer",
          open
            ? "border-accent ring-2 ring-accent-glow"
            : "border-border hover:border-border-strong",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {selected ? (
          <>
            <div className="w-7 h-7 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <FileText
                className="w-3.5 h-3.5 text-prism-accent"
                strokeWidth={1.75}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-prism-text-strong truncate">
                {selected.name}
              </p>
              <p className="text-2xs text-prism-muted mt-0.5">
                {selected.format} ·{" "}
                {selected.sectionIds.length === 0
                  ? selected.sectionCountAtCreation
                  : selected.sectionIds.length}{" "}
                sections ·{" "}
                {selected.recipientEmails.length}{" "}
                {selected.recipientEmails.length === 1
                  ? "recipient"
                  : "recipients"}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-md bg-bg-hover flex items-center justify-center shrink-0">
              <FileText
                className="w-3.5 h-3.5 text-prism-muted"
                strokeWidth={1.75}
              />
            </div>
            <span className="flex-1 text-xs text-prism-muted">
              Start from an existing report...
            </span>
          </>
        )}
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 shrink-0 text-prism-muted transition-transform",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-panel border border-border rounded-md shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
          {/* None option — build from scratch */}
          <button
            type="button"
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
            className={cn(
              "w-full px-3 py-2 text-left hover:bg-bg-hover transition-colors cursor-pointer flex items-center gap-2",
              !value && "bg-accent-subtle"
            )}
          >
            <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
              {!value && (
                <Check className="w-3 h-3 text-prism-accent" strokeWidth={2.5} />
              )}
            </div>
            <span className="text-xs text-prism-text">
              Configure from scratch
            </span>
          </button>

          <div className="my-1 border-t border-border" />

          <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Existing reports
          </p>

          {reports.length === 0 ? (
            <p className="px-3 py-3 text-2xs text-prism-muted">
              No reports yet — create one from the Reports section first.
            </p>
          ) : (
            reports.map((r) => {
              const isSelected = r.id === value
              const sectionCount =
                r.sectionIds.length === 0
                  ? r.sectionCountAtCreation
                  : r.sectionIds.length
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onChange(r.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-bg-hover transition-colors cursor-pointer flex items-center gap-2",
                    isSelected && "bg-accent-subtle"
                  )}
                >
                  <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                    {isSelected && (
                      <Check
                        className="w-3 h-3 text-prism-accent"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <FileText
                    className="w-3.5 h-3.5 text-prism-muted shrink-0"
                    strokeWidth={1.75}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-prism-text-strong truncate">
                      {r.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-2xs text-prism-muted mt-0.5">
                      <span>{r.format}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5" strokeWidth={2} />
                        {sectionCount}
                      </span>
                      {r.recipientEmails.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{r.recipientEmails.length} rec</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}