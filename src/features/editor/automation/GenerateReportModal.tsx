"use client"

import { useEffect, useState } from "react"
import { X, FileText, Upload, Check, Square, CheckSquare, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { PrismSelect } from "@/components/ui/prism/Select"

export interface ReportSectionInfo {
  id: string
  name: string
}

export interface GenerateReportModalProps {
  open: boolean
  onClose: () => void
  sections: ReportSectionInfo[]
  onCreate: (data: {
    name: string
    format: "PDF" | "CSV"
    recipientEmails: string[]
    sectionIds: string[]
  }) => void
}

const FORMAT_OPTIONS = [
  { value: "PDF" as const, label: "PDF", description: "Best for sharing and printing" },
  { value: "CSV" as const, label: "CSV", description: "Best for Excel and data analysis" },
]

export function GenerateReportModal({
  open,
  onClose,
  sections,
  onCreate,
}: GenerateReportModalProps) {
  const [name, setName] = useState("")
  const [format, setFormat] = useState<"PDF" | "CSV">("PDF")
  const [recipientsInput, setRecipientsInput] = useState("")
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Reset when opening
  useEffect(() => {
    if (!open) {
      setName("")
      setFormat("PDF")
      setRecipientsInput("")
      setSelectedSectionIds([])
      setError(null)
    }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const allSelected =
    sections.length > 0 && selectedSectionIds.length === sections.length
  const someSelected =
    selectedSectionIds.length > 0 && selectedSectionIds.length < sections.length
  const noneSelected = selectedSectionIds.length === 0

  const toggleSection = (id: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelectedSectionIds([])
    } else {
      setSelectedSectionIds(sections.map((s) => s.id))
    }
  }

  const parseEmails = (input: string): string[] => {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    onCreate({
      name: name.trim(),
      format,
      recipientEmails: parseEmails(recipientsInput),
      // Empty array = "all sections"
      sectionIds: allSelected ? [] : selectedSectionIds,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-prism-text-strong">
                Generate report
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                Snapshot this dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0 cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
          <Field label="Report name">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="e.g. Weekly Sales Report"
              className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
            />
            {error && (
              <p className="text-2xs text-prism-danger mt-1">{error}</p>
            )}
          </Field>

          <Field label="Format">
            <PrismSelect
              value={format}
              onChange={(v) => setFormat(v as "PDF" | "CSV")}
              options={FORMAT_OPTIONS}
            />
          </Field>

          <Field label="Include sections">
            <div className="rounded-md border border-border bg-bg overflow-hidden">
              {/* Header row — Select all */}
              <button
                type="button"
                onClick={toggleAll}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-bg-hover transition-colors cursor-pointer border-b border-border"
              >
                <Checkbox
                  state={allSelected ? "checked" : someSelected ? "mixed" : "empty"}
                />
                <span className="text-xs font-medium text-prism-text-strong">
                  All sections
                </span>
                <span className="text-2xs text-prism-muted ml-auto">
                  {sections.length}
                </span>
              </button>

              {/* Section list */}
              <div className="max-h-48 overflow-y-auto">
                {sections.length === 0 ? (
                  <p className="px-3 py-4 text-2xs text-prism-muted text-center">
                    No sections in this dashboard yet.
                  </p>
                ) : (
                  sections.map((s) => {
                    const isSelected = selectedSectionIds.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSection(s.id)}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-bg-hover transition-colors cursor-pointer"
                      >
                        <Checkbox state={isSelected ? "checked" : "empty"} />
                        <span className="text-xs text-prism-text truncate flex-1 text-left">
                          {s.name}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Status line */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <Layers
                className="w-3 h-3 text-prism-muted shrink-0"
                strokeWidth={1.75}
              />
              <p className="text-2xs text-prism-muted">
                {noneSelected && "All sections will be included"}
                {allSelected && `All ${sections.length} sections will be included`}
                {someSelected &&
                  `${selectedSectionIds.length} of ${sections.length} sections will be included`}
              </p>
            </div>
          </Field>

          <Field label="Send to (optional)">
            <input
              type="text"
              value={recipientsInput}
              onChange={(e) => setRecipientsInput(e.target.value)}
              placeholder="email@company.com, another@company.com"
              className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
            />
            {recipientsInput.trim() && (
              <p className="text-2xs text-prism-muted mt-1">
                {parseEmails(recipientsInput).length} recipient
                {parseEmails(recipientsInput).length === 1 ? "" : "s"}
              </p>
            )}
          </Field>

          <div className="flex items-start gap-2 p-3 rounded-md bg-bg-hover">
            <Check
              className="w-3.5 h-3.5 text-prism-ok mt-0.5 shrink-0"
              strokeWidth={2.5}
            />
            <p className="text-2xs text-prism-text">
              The report captures the selected sections as they appear right
              now.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-bg-hover flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>Generate now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Checkbox ─────────────────────────────────────────────── */

function Checkbox({ state }: { state: "checked" | "empty" | "mixed" }) {
  if (state === "checked") {
    return (
      <span className="w-3.5 h-3.5 rounded-sm bg-accent flex items-center justify-center shrink-0">
        <Check className="w-2.5 h-2.5 text-prism-accent-text" strokeWidth={3} />
      </span>
    )
  }
  if (state === "mixed") {
    return (
      <span className="w-3.5 h-3.5 rounded-sm bg-accent flex items-center justify-center shrink-0">
        <span className="w-2 h-0.5 bg-prism-accent-text" />
      </span>
    )
  }
  return (
    <span className="w-3.5 h-3.5 rounded-sm border border-border-strong bg-bg shrink-0" />
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
        {label}
      </label>
      {children}
    </div>
  )
}