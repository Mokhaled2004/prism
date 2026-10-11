"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  RotateCw,
  Trash2,
  Layers,
  UserPlus,
  X,
  AlertCircle,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { PrismSelect } from "@/components/ui/prism/Select"
import { ActivityTimeline } from "./ActivityTimeline"
import { ResendDropdown } from "./ResendDropdown"
import type { Report } from "./report-types"

export function ReportsCanvas() {
  const reports = useEditor((s) => s.reports)
  const selectedReportId = useEditor((s) => s.selectedReportId)
  const setSelectedReportId = useEditor((s) => s.setSelectedReportId)

  const report = reports.find((r) => r.id === selectedReportId) ?? null

  if (!report) return <EmptyState />

  return <ReportDetail report={report} onBack={() => setSelectedReportId(null)} />
}

/* ─── Empty state ────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex-1 min-w-0 flex items-center justify-center bg-bg">
      <div className="text-center max-w-sm px-6">
        <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-prism-accent" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-prism-text-strong mb-1">
          Select a report
        </p>
        <p className="text-xs text-prism-muted">
          Pick a report from the list to see its details, or click "+ New" to
          generate one.
        </p>
      </div>
    </div>
  )
}

/* ─── Detail view ────────────────────────────────────────── */

function ReportDetail({
  report,
  onBack,
}: {
  report: Report
  onBack: () => void
}) {
  const sections = useEditor((s) => s.sections)
  const rerunReport = useEditor((s) => s.rerunReport)
  const resendReport = useEditor((s) => s.resendReport)
  const removeReport = useEditor((s) => s.removeReport)
  const updateReport = useEditor((s) => s.updateReport)
  const addRecipient = useEditor((s) => s.addRecipient)
  const removeRecipient = useEditor((s) => s.removeRecipient)

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(report.name)
  const [editingDescription, setEditingDescription] = useState(false)
  const [descriptionDraft, setDescriptionDraft] = useState(report.description ?? "")
  const [recipientInput, setRecipientInput] = useState("")
  const [showDelete, setShowDelete] = useState(false)

  const includedSections = sections.filter(
    (s) => report.sectionIds.length === 0 || report.sectionIds.includes(s.id)
  )

  const commitName = () => {
    const trimmed = nameDraft.trim()
    if (trimmed) updateReport(report.id, { name: trimmed })
    setEditingName(false)
  }

  const commitDescription = () => {
    updateReport(report.id, { description: descriptionDraft.trim() || undefined })
    setEditingDescription(false)
  }

  const handleAddRecipient = () => {
    if (!recipientInput.trim()) return
    addRecipient(report.id, recipientInput.trim())
    setRecipientInput("")
  }

  const handleBoth = () => {
    rerunReport(report.id)
    // Small delay so rerun finishes first, then resend
    setTimeout(() => resendReport(report.id), 100)
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-bg">
      <div className="p-8">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="text-2xs text-prism-muted hover:text-prism-text mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← Back to reports
        </button>

        {/* Failed banner */}
        {report.status === "failed" && (
          <div className="rounded-md border border-danger bg-danger-subtle p-3 mb-5 flex items-start gap-3">
            <AlertCircle
              className="w-4 h-4 text-prism-danger shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-prism-danger">
                Last send failed
              </p>
              <p className="text-2xs text-prism-text mt-0.5">
                The mail server rejected some recipients. Retry to send again.
              </p>
            </div>
            <button
              onClick={() => resendReport(report.id)}
              className="h-7 px-2.5 rounded-md bg-danger text-white text-2xs font-medium hover:brightness-110 shrink-0 cursor-pointer"
            >
              Retry sending
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="min-w-0 flex-1">
            {editingName ? (
              <input
                autoFocus
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitName()
                  if (e.key === "Escape") {
                    setNameDraft(report.name)
                    setEditingName(false)
                  }
                }}
                className="w-full h-10 px-2 -mx-2 rounded-md border border-accent bg-bg text-2xl font-semibold text-prism-text-strong outline-none ring-2 ring-accent-glow"
              />
            ) : (
              <button
                onClick={() => {
                  setNameDraft(report.name)
                  setEditingName(true)
                }}
                className="text-2xl font-semibold text-prism-text-strong hover:bg-bg-hover px-2 -mx-2 py-0.5 rounded-md cursor-pointer inline-flex items-center gap-2 group"
                title="Click to rename"
              >
                {report.name}
                <Pencil className="w-4 h-4 text-prism-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge status={report.status} />
              <FormatBadge format={report.format} />
              <span className="text-xs text-prism-muted">
                Created {relativeTime(report.createdAt)}
              </span>
              {report.lastSentAt && (
                <>
                  <span className="text-xs text-prism-border">·</span>
                  <span className="text-xs text-prism-muted">
                    Last sent {relativeTime(report.lastSentAt)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ActionButton
              icon={Download}
              label="Download"
              onClick={() => console.log("download", report.id)}
            />
            <ActionButton
              icon={RotateCw}
              label="Re-run"
              onClick={() => rerunReport(report.id)}
            />
            <ResendDropdown
              onResend={() => resendReport(report.id)}
              onRerun={() => rerunReport(report.id)}
              onBoth={handleBoth}
            />
            <ActionButton
              icon={Trash2}
              label="Delete"
              tone="danger"
              onClick={() => setShowDelete(true)}
            />
          </div>
        </div>

        {/* Grid for detail cards */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main column */}
          <div className="col-span-8 space-y-6">
            {/* Description */}
            <Section title="Description">
              {editingDescription ? (
                <textarea
                  autoFocus
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  onBlur={commitDescription}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setDescriptionDraft(report.description ?? "")
                      setEditingDescription(false)
                    }
                  }}
                  rows={2}
                  placeholder="Add a description..."
                  className="w-full px-3 py-2 rounded-md border border-accent bg-bg text-xs text-prism-text resize-none focus:outline-none focus:ring-2 focus:ring-accent-glow"
                />
              ) : (
                <button
                  onClick={() => {
                    setDescriptionDraft(report.description ?? "")
                    setEditingDescription(true)
                  }}
                  className="w-full text-left px-3 py-2 rounded-md border border-border bg-panel hover:border-border-strong text-xs text-prism-text cursor-pointer min-h-[44px]"
                >
                  {report.description || (
                    <span className="text-prism-muted">
                      Click to add a description…
                    </span>
                  )}
                </button>
              )}
            </Section>

            {/* Sections included */}
            <Section
              title={`Sections included (${includedSections.length})`}
              subtitle={
                report.sectionIds.length === 0
                  ? "All sections (dynamic)"
                  : `${report.sectionIds.length} of ${sections.length} sections`
              }
            >
              <div className="grid grid-cols-3 gap-3">
                {includedSections.map((s) => {
                  const items = s.layout.reduce(
                    (acc, row) =>
                      acc +
                      row.columns.reduce((c, col) => c + col.items.length, 0),
                    0
                  )
                  return (
                    <div
                      key={s.id}
                      className="rounded-md border border-border bg-panel p-3"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
                          <Layers
                            className="w-3 h-3 text-prism-accent"
                            strokeWidth={2}
                          />
                        </div>
                        <p className="text-xs font-medium text-prism-text-strong truncate">
                          {s.name}
                        </p>
                      </div>
                      <p className="text-2xs text-prism-muted">
                        {items} {items === 1 ? "component" : "components"}
                      </p>
                    </div>
                  )
                })}
                {includedSections.length === 0 && (
                  <p className="text-2xs text-prism-muted col-span-3 py-4 text-center">
                    No sections included.
                  </p>
                )}
              </div>
            </Section>

            {/* Activity */}
            <Section title="Activity">
              <ActivityTimeline entries={report.activity} />
            </Section>
          </div>

          {/* Side column */}
          <div className="col-span-4 space-y-6">
            {/* Recipients */}
            <Section title={`Recipients (${report.recipientEmails.length})`}>
              <div className="rounded-md border border-border bg-panel">
                {report.recipientEmails.length === 0 ? (
                  <p className="px-3 py-3 text-2xs text-prism-muted">
                    No recipients yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {report.recipientEmails.map((email) => (
                      <div
                        key={email}
                        className="px-3 py-2 flex items-center gap-2 group"
                      >
                        <div className="w-6 h-6 rounded-full bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold shrink-0">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-xs text-prism-text truncate flex-1">
                          {email}
                        </p>
                        <button
                          onClick={() => removeRecipient(report.id, email)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted opacity-0 group-hover:opacity-100 hover:text-prism-danger hover:bg-bg-hover cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add recipient */}
                <div className="px-3 py-2 border-t border-border flex items-center gap-1.5">
                  <input
                    type="email"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddRecipient()
                    }}
                    placeholder="email@company.com"
                    className="flex-1 min-w-0 h-7 px-2 rounded-md border border-border bg-bg text-2xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={handleAddRecipient}
                    disabled={!recipientInput.trim()}
                    className="h-7 w-7 rounded-md bg-accent text-prism-accent-text hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    title="Add"
                  >
                    <UserPlus className="w-3 h-3" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </Section>

            {/* Format options */}
            <Section title="Format options">
              <div className="space-y-3">
                {report.format === "PDF" ? (
                  <>
                    <Field label="Page size">
                      <PrismSelect
                        size="sm"
                        value={report.pageSize ?? "A4"}
                        onChange={(v) =>
                          updateReport(report.id, {
                            pageSize: v as Report["pageSize"],
                          })
                        }
                        options={[
                          { value: "A4", label: "A4" },
                          { value: "Letter", label: "Letter" },
                          { value: "Legal", label: "Legal" },
                        ]}
                      />
                    </Field>
                    <Field label="Orientation">
                      <PrismSelect
                        size="sm"
                        value={report.orientation ?? "portrait"}
                        onChange={(v) =>
                          updateReport(report.id, {
                            orientation: v as Report["orientation"],
                          })
                        }
                        options={[
                          { value: "portrait", label: "Portrait" },
                          { value: "landscape", label: "Landscape" },
                        ]}
                      />
                    </Field>
                    <Field label="Quality">
                      <PrismSelect
                        size="sm"
                        value={report.quality ?? "high"}
                        onChange={(v) =>
                          updateReport(report.id, {
                            quality: v as Report["quality"],
                          })
                        }
                        options={[
                          { value: "standard", label: "Standard" },
                          { value: "high", label: "High" },
                        ]}
                      />
                    </Field>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={report.includeCoverPage ?? false}
                        onChange={(e) =>
                          updateReport(report.id, {
                            includeCoverPage: e.target.checked,
                          })
                        }
                        className="w-3.5 h-3.5 rounded border-border accent-[var(--accent)]"
                      />
                      <span className="text-xs text-prism-text">
                        Include cover page
                      </span>
                    </label>
                  </>
                ) : (
                  <>
                    <Field label="Delimiter">
                      <PrismSelect
                        size="sm"
                        value={report.csvDelimiter ?? ","}
                        onChange={(v) =>
                          updateReport(report.id, {
                            csvDelimiter: v as Report["csvDelimiter"],
                          })
                        }
                        options={[
                          { value: ",", label: "Comma (,)" },
                          { value: ";", label: "Semicolon (;)" },
                          { value: "\t", label: "Tab" },
                        ]}
                      />
                    </Field>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={report.csvIncludeHeaders ?? true}
                        onChange={(e) =>
                          updateReport(report.id, {
                            csvIncludeHeaders: e.target.checked,
                          })
                        }
                        className="w-3.5 h-3.5 rounded border-border accent-[var(--accent)]"
                      />
                      <span className="text-xs text-prism-text">
                        Include headers
                      </span>
                    </label>
                  </>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirm
          reportName={report.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            removeReport(report.id)
            setShowDelete(false)
          }}
        />
      )}
    </div>
  )
}

/* ─── Small building blocks ──────────────────────────────── */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2.5">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          {title}
        </p>
        {subtitle && (
          <p className="text-2xs text-prism-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
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

function ActionButton({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  icon: any
  label: string
  onClick: () => void
  tone?: "default" | "danger"
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-2.5 rounded-md border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors",
        tone === "danger"
          ? "border-border bg-panel text-prism-danger hover:bg-bg-hover"
          : "border-border bg-panel text-prism-text hover:bg-bg-hover"
      )}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span>{label}</span>
    </button>
  )
}

function StatusBadge({ status }: { status: Report["status"] }) {
  const tone =
    status === "sent"
      ? "bg-ok-subtle text-prism-ok"
      : status === "failed"
        ? "bg-danger-subtle text-prism-danger"
        : "bg-bg-hover text-prism-muted"
  return (
    <span
      className={cn(
        "text-2xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
        tone
      )}
    >
      {status}
    </span>
  )
}

function FormatBadge({ format }: { format: Report["format"] }) {
  return (
    <span className="text-2xs px-2 py-0.5 rounded-full font-medium bg-bg-hover text-prism-muted uppercase tracking-wider">
      {format}
    </span>
  )
}

function DeleteConfirm({
  reportName,
  onCancel,
  onConfirm,
}: {
  reportName: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-panel border border-border rounded-lg shadow-xl p-5"
      >
        <p className="text-sm font-semibold text-prism-text-strong">
          Delete this report?
        </p>
        <p className="text-xs text-prism-muted mt-1">
          "{reportName}" will be permanently removed.
        </p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-3 rounded-md bg-danger text-white text-xs font-medium hover:brightness-110 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}