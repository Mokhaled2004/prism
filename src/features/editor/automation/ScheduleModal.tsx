"use client"

import { useEffect, useState } from "react"
import {
  X,
  CalendarClock,
  Check,
  Plus,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PrismSelect } from "@/components/ui/prism/Select"
import {
  DAY_NAMES,
  MONTH_ORDINALS,
  type Schedule,
  type ScheduleFrequency,
} from "./schedule-types"
import { ScheduleReportPicker } from "./ScheduleReportPicker"
import type { Report } from "./report-types"
import type { DashboardSection } from "../store/types"

export interface ScheduleModalProps {
  open: boolean
  schedule: Schedule | null
  sections: DashboardSection[]
  reports: Report[]
  onClose: () => void
  onSave: (data: NewScheduleData) => void
}

export interface NewScheduleData {
  name: string
  description?: string
  scheduledFromReportId?: string
  frequency: ScheduleFrequency
  time: string
  dayOfWeek?: number
  dayOfMonth?: number
  format: "PDF" | "CSV"
  sectionIds: string[]
  recipientEmails: string[]
  pageSize?: "A4" | "Letter" | "Legal"
  orientation?: "portrait" | "landscape"
  quality?: "standard" | "high"
  includeCoverPage?: boolean
  csvDelimiter?: "," | ";" | "\t"
  csvIncludeHeaders?: boolean
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily", description: "Every day" },
  { value: "weekly", label: "Weekly", description: "One day per week" },
  { value: "monthly", label: "Monthly", description: "One day per month" },
]

const FORMAT_OPTIONS = [
  { value: "PDF" as const, label: "PDF", description: "Best for sharing and printing" },
  { value: "CSV" as const, label: "CSV", description: "Best for Excel and data" },
]

export function ScheduleModal({
  open,
  schedule,
  sections,
  reports,
  onClose,
  onSave,
}: ScheduleModalProps) {
  const isEditing = !!schedule

  // Report source
  const [sourceReportId, setSourceReportId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [frequency, setFrequency] = useState<ScheduleFrequency>("weekly")
  const [time, setTime] = useState("09:00")
  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [dayOfMonth, setDayOfMonth] = useState(1)
  const [format, setFormat] = useState<"PDF" | "CSV">("PDF")
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Format options
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Legal">("A4")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [quality, setQuality] = useState<"standard" | "high">("high")
  const [includeCoverPage, setIncludeCoverPage] = useState(true)
  const [csvDelimiter, setCsvDelimiter] = useState<"," | ";" | "\t">(",")
  const [csvIncludeHeaders, setCsvIncludeHeaders] = useState(true)

  // Initialize form
  useEffect(() => {
    if (!open) return
    if (schedule) {
      setSourceReportId(schedule.scheduledFromReportId ?? null)
      setName(schedule.name)
      setDescription(schedule.description ?? "")
      setFrequency(schedule.frequency)
      setTime(schedule.time)
      setDayOfWeek(schedule.dayOfWeek ?? 1)
      setDayOfMonth(schedule.dayOfMonth ?? 1)
      setFormat(schedule.format)
      setSelectedSectionIds(schedule.sectionIds)
      setRecipients(schedule.recipientEmails)
      setPageSize(schedule.pageSize ?? "A4")
      setOrientation(schedule.orientation ?? "portrait")
      setQuality(schedule.quality ?? "high")
      setIncludeCoverPage(schedule.includeCoverPage ?? true)
      setCsvDelimiter(schedule.csvDelimiter ?? ",")
      setCsvIncludeHeaders(schedule.csvIncludeHeaders ?? true)
    } else {
      setSourceReportId(null)
      setName("")
      setDescription("")
      setFrequency("weekly")
      setTime("09:00")
      setDayOfWeek(1)
      setDayOfMonth(1)
      setFormat("PDF")
      setSelectedSectionIds([])
      setRecipients([])
      setPageSize("A4")
      setOrientation("portrait")
      setQuality("high")
      setIncludeCoverPage(true)
      setCsvDelimiter(",")
      setCsvIncludeHeaders(true)
    }
    setError(null)
  }, [open, schedule])

  // Auto-fill when a report is picked
  const handleReportPick = (reportId: string | null) => {
    setSourceReportId(reportId)
    if (!reportId) return

    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    // Only fill empty fields — don't overwrite user edits
    if (!name.trim()) setName(report.name)
    if (!description.trim() && report.description) {
      setDescription(report.description)
    }
    setFormat(report.format)
    setSelectedSectionIds(report.sectionIds)
    if (recipients.length === 0) {
      setRecipients(report.recipientEmails)
    }
    if (report.pageSize) setPageSize(report.pageSize)
    if (report.orientation) setOrientation(report.orientation)
    if (report.quality) setQuality(report.quality)
    if (report.includeCoverPage !== undefined) {
      setIncludeCoverPage(report.includeCoverPage)
    }
    if (report.csvDelimiter) setCsvDelimiter(report.csvDelimiter)
    if (report.csvIncludeHeaders !== undefined) {
      setCsvIncludeHeaders(report.csvIncludeHeaders)
    }
  }

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

  const toggleSection = (id: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (allSelected) setSelectedSectionIds([])
    else setSelectedSectionIds(sections.map((s) => s.id))
  }

  const addRecipient = () => {
    const trimmed = recipientInput.trim().toLowerCase()
    if (!trimmed) return
    if (recipients.includes(trimmed)) return
    setRecipients((prev) => [...prev, trimmed])
    setRecipientInput("")
  }

  const removeRecipientAt = (email: string) => {
    setRecipients((prev) => prev.filter((e) => e !== email))
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      scheduledFromReportId: sourceReportId ?? undefined,
      frequency,
      time,
      dayOfWeek: frequency === "weekly" ? dayOfWeek : undefined,
      dayOfMonth: frequency === "monthly" ? dayOfMonth : undefined,
      format,
      sectionIds: allSelected ? [] : selectedSectionIds,
      recipientEmails: recipients,
      pageSize: format === "PDF" ? pageSize : undefined,
      orientation: format === "PDF" ? orientation : undefined,
      quality: format === "PDF" ? quality : undefined,
      includeCoverPage: format === "PDF" ? includeCoverPage : undefined,
      csvDelimiter: format === "CSV" ? csvDelimiter : undefined,
      csvIncludeHeaders: format === "CSV" ? csvIncludeHeaders : undefined,
    })
  }

  const nextRunPreview = buildNextRunPreview({
    frequency,
    time,
    dayOfWeek,
    dayOfMonth,
  })

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <CalendarClock
                className="w-4 h-4 text-prism-accent"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-prism-text-strong">
                {isEditing ? "Edit schedule" : "New scheduled report"}
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                {isEditing
                  ? "Update when and how this report runs"
                  : "Start from an existing report, or configure manually"}
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

        {/* Report picker — full width at top */}
        {!isEditing && (
          <div className="px-6 py-4 border-b border-border shrink-0 bg-bg-hover/40">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-accent-subtle flex items-center justify-center shrink-0 mt-0.5">
                <FileText
                  className="w-3.5 h-3.5 text-prism-accent"
                  strokeWidth={1.75}
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
                  From report (optional)
                </label>
                <ScheduleReportPicker
                  reports={reports}
                  value={sourceReportId}
                  onChange={handleReportPick}
                />
                <p className="text-2xs text-prism-muted mt-2">
                  {sourceReportId
                    ? "Fields below are auto-filled — you can still override anything."
                    : "Pick a report to auto-fill name, format, sections, and recipients."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Body — two columns */}
        <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-2 divide-x divide-border">
          {/* Left — the form */}
          <div className="p-6 space-y-5">
            <Field label="Name">
              <input
                autoFocus={isEditing}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="e.g. Weekly to Sales Team"
                className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
              />
              {error && (
                <p className="text-2xs text-prism-danger mt-1">{error}</p>
              )}
            </Field>

            <Field label="Description (optional)">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this report for?"
                className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
              />
            </Field>

            <Field label="Frequency">
              <PrismSelect
                value={frequency}
                onChange={(v) => setFrequency(v as ScheduleFrequency)}
                options={FREQUENCY_OPTIONS}
              />
            </Field>

            {frequency === "weekly" && (
              <Field label="Day of week">
                <div className="grid grid-cols-7 gap-1">
                  {DAY_NAMES.map((day, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDayOfWeek(i)}
                      className={cn(
                        "h-8 rounded-md text-2xs font-medium border transition-colors cursor-pointer",
                        dayOfWeek === i
                          ? "bg-accent text-prism-accent-text border-accent"
                          : "bg-panel text-prism-text border-border hover:bg-bg-hover"
                      )}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </Field>
            )}

            {frequency === "monthly" && (
              <Field label="Day of month">
                <PrismSelect
                  value={String(dayOfMonth)}
                  onChange={(v) => setDayOfMonth(Number(v))}
                  options={MONTH_ORDINALS.map((label, i) => ({
                    value: String(i + 1),
                    label,
                  }))}
                />
              </Field>
            )}

            <Field label="Time of day">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
              />
            </Field>

            <Field label="Format">
              <PrismSelect
                value={format}
                onChange={(v) => setFormat(v as "PDF" | "CSV")}
                options={FORMAT_OPTIONS}
              />
            </Field>
          </div>

          {/* Right — sections, recipients, format options */}
          <div className="p-6 space-y-5">
            <Field label="Include sections">
              <div className="rounded-md border border-border bg-bg overflow-hidden">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-bg-hover transition-colors cursor-pointer border-b border-border"
                >
                  <Checkbox
                    state={
                      allSelected ? "checked" : someSelected ? "mixed" : "empty"
                    }
                  />
                  <span className="text-xs font-medium text-prism-text-strong">
                    All sections
                  </span>
                  <span className="text-2xs text-prism-muted ml-auto">
                    {sections.length}
                  </span>
                </button>
                <div className="max-h-32 overflow-y-auto">
                  {sections.map((s) => {
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
                  })}
                </div>
              </div>
            </Field>

            <Field label={`Recipients (${recipients.length})`}>
              <div className="rounded-md border border-border bg-bg">
                {recipients.length === 0 ? (
                  <p className="px-3 py-2 text-2xs text-prism-muted">
                    No recipients yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {recipients.map((email) => (
                      <div
                        key={email}
                        className="px-3 py-1.5 flex items-center gap-2 group"
                      >
                        <div className="w-5 h-5 rounded-full bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold shrink-0">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-xs text-prism-text truncate flex-1">
                          {email}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeRecipientAt(email)}
                          className="w-5 h-5 rounded flex items-center justify-center text-prism-muted opacity-0 group-hover:opacity-100 hover:text-prism-danger cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-border p-1.5 flex items-center gap-1">
                  <input
                    type="email"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addRecipient()
                      }
                    }}
                    placeholder="email@company.com"
                    className="flex-1 min-w-0 h-7 px-2 rounded-md border border-border bg-bg text-2xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={addRecipient}
                    disabled={!recipientInput.trim()}
                    className="h-7 w-7 rounded-md bg-accent text-prism-accent-text hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    title="Add recipient"
                  >
                    <Plus className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </Field>

            {format === "PDF" && (
              <Field label="PDF options">
                <div className="space-y-3">
                  <PrismSelect
                    size="sm"
                    value={pageSize}
                    onChange={(v) =>
                      setPageSize(v as "A4" | "Letter" | "Legal")
                    }
                    options={[
                      { value: "A4", label: "A4" },
                      { value: "Letter", label: "Letter" },
                      { value: "Legal", label: "Legal" },
                    ]}
                  />
                  <PrismSelect
                    size="sm"
                    value={orientation}
                    onChange={(v) =>
                      setOrientation(v as "portrait" | "landscape")
                    }
                    options={[
                      { value: "portrait", label: "Portrait" },
                      { value: "landscape", label: "Landscape" },
                    ]}
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCoverPage}
                      onChange={(e) => setIncludeCoverPage(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border accent-[var(--accent)]"
                    />
                    <span className="text-xs text-prism-text">
                      Include cover page
                    </span>
                  </label>
                </div>
              </Field>
            )}

            {format === "CSV" && (
              <Field label="CSV options">
                <div className="space-y-3">
                  <PrismSelect
                    size="sm"
                    value={csvDelimiter}
                    onChange={(v) =>
                      setCsvDelimiter(v as "," | ";" | "\t")
                    }
                    options={[
                      { value: ",", label: "Comma (,)" },
                      { value: ";", label: "Semicolon (;)" },
                      { value: "\t", label: "Tab" },
                    ]}
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={csvIncludeHeaders}
                      onChange={(e) => setCsvIncludeHeaders(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border accent-[var(--accent)]"
                    />
                    <span className="text-xs text-prism-text">
                      Include column headers
                    </span>
                  </label>
                </div>
              </Field>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg-hover shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-prism-accent animate-pulse" />
            <p className="text-2xs text-prism-muted">
              Next run:{" "}
              <span className="text-prism-text font-medium">
                {nextRunPreview}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover cursor-pointer"
            >
              {isEditing ? "Save changes" : "Create schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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

function buildNextRunPreview({
  frequency,
  time,
  dayOfWeek,
  dayOfMonth,
}: {
  frequency: ScheduleFrequency
  time: string
  dayOfWeek: number
  dayOfMonth: number
}): string {
  const [hours, minutes] = time.split(":").map(Number)
  const now = new Date()

  const formattedTime = new Date(0, 0, 0, hours, minutes).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  )

  if (frequency === "daily") {
    const next = new Date(now)
    next.setHours(hours, minutes, 0, 0)
    if (next <= now) next.setDate(next.getDate() + 1)
    return `Tomorrow at ${formattedTime}`
  }

  if (frequency === "weekly") {
    const next = new Date(now)
    next.setHours(hours, minutes, 0, 0)
    const diff = (dayOfWeek - next.getDay() + 7) % 7
    next.setDate(next.getDate() + (diff === 0 && next <= now ? 7 : diff))
    const dayName = DAY_NAMES[dayOfWeek]
    return `${dayName}, ${next.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} at ${formattedTime}`
  }

  const next = new Date(now)
  next.setHours(hours, minutes, 0, 0)
  next.setDate(dayOfMonth)
  if (next <= now) next.setMonth(next.getMonth() + 1)
  return `${MONTH_ORDINALS[dayOfMonth - 1]} of ${next.toLocaleDateString(
    "en-US",
    { month: "long" }
  )} at ${formattedTime}`
}