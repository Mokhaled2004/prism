"use client"

import { useEffect, useState } from "react"
import {
  CalendarClock,
  Play,
  Pause,
  Trash2,
  Layers,
  UserPlus,
  X,
  Clock,
  Check,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { PrismSelect } from "@/components/ui/prism/Select"
import { ActivityTimeline } from "./ActivityTimeline"
import { ScheduleCalendar } from "./ScheduleCalendar"
import {
  DAY_SHORT,
  DAY_NAMES,
  MONTH_ORDINALS,
  type Schedule,
} from "./schedule-types"

export function ScheduleCanvas() {
  const schedules = useEditor((s) => s.schedules)
  const selectedScheduleId = useEditor((s) => s.selectedScheduleId)
  const setSelectedScheduleId = useEditor((s) => s.setSelectedScheduleId)
  const setActiveSection = useEditor((s) => s.setSection)

  const schedule =
    schedules.find((s) => s.id === selectedScheduleId) ?? null

  if (!schedule) {
    return (
      <ScheduleCalendar
        onSelectSchedule={(id) => setSelectedScheduleId(id)}
        onCreate={() => {
          // Switch to scheduler panel and trigger new schedule
          // (the panel handles modal open)
          setActiveSection("scheduler")
        }}
      />
    )
  }

  return (
    <ScheduleDetail
      schedule={schedule}
      onBack={() => setSelectedScheduleId(null)}
    />
  )
}

/* ─── Hero detail view ───────────────────────────────────── */

function ScheduleDetail({
  schedule,
  onBack,
}: {
  schedule: Schedule
  onBack: () => void
}) {
  const sections = useEditor((s) => s.sections)
  const reports = useEditor((s) => s.reports)
  const setSelectedReportId = useEditor((s) => s.setSelectedReportId)
  const setActiveSection = useEditor((s) => s.setSection)

  const toggleSchedule = useEditor((s) => s.toggleSchedule)
  const runScheduleNow = useEditor((s) => s.runScheduleNow)
  const removeSchedule = useEditor((s) => s.removeSchedule)
  const updateSchedule = useEditor((s) => s.updateSchedule)
  const addScheduleRecipient = useEditor((s) => s.addScheduleRecipient)
  const removeScheduleRecipient = useEditor((s) => s.removeScheduleRecipient)

  const [recipientInput, setRecipientInput] = useState("")
  const [showDelete, setShowDelete] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const includedSections = sections.filter(
    (s) => schedule.sectionIds.length === 0 || schedule.sectionIds.includes(s.id)
  )

  const sourceReport = schedule.scheduledFromReportId
    ? reports.find((r) => r.id === schedule.scheduledFromReportId)
    : null

  const countdown = formatCountdown(schedule.nextRunAt - now)
  const formattedTime = formatTime(schedule.time)

  const handleAddRecipient = () => {
    if (!recipientInput.trim()) return
    addScheduleRecipient(schedule.id, recipientInput.trim())
    setRecipientInput("")
  }

  const openSourceReport = () => {
    if (!sourceReport) return
    setActiveSection("reports")
    setSelectedReportId(sourceReport.id)
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-bg">
      <div className="p-8">
        <button
          onClick={onBack}
          className="text-2xs text-prism-muted hover:text-prism-text mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← Back to schedule
        </button>

        {/* Scheduled from breadcrumb */}
        {sourceReport && (
          <button
            onClick={openSourceReport}
            className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-panel hover:border-accent hover:bg-accent-subtle/30 transition-colors cursor-pointer group"
          >
            <FileText
              className="w-3 h-3 text-prism-muted group-hover:text-prism-accent"
              strokeWidth={1.75}
            />
            <span className="text-2xs text-prism-muted group-hover:text-prism-text">
              Scheduled from
            </span>
            <span className="text-2xs font-medium text-prism-text-strong">
              {sourceReport.name}
            </span>
          </button>
        )}

        {/* Hero card */}
        <div className="relative rounded-xl overflow-hidden mb-8 border border-border">
          <div
            className={cn(
              "absolute inset-0 transition-opacity",
              schedule.enabled
                ? "bg-gradient-to-br from-[var(--accent-subtle)] via-[var(--bg-panel)] to-[var(--bg-panel)]"
                : "bg-gradient-to-br from-[var(--bg-hover)] via-[var(--bg-panel)] to-[var(--bg-panel)]"
            )}
          />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-accent/10" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-accent/10" />

          <div className="relative p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      schedule.enabled ? "bg-prism-ok" : "bg-bg-hover"
                    )}
                  />
                  {schedule.enabled && (
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-prism-ok animate-ping opacity-60" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xs font-bold uppercase tracking-wider",
                      schedule.enabled ? "text-prism-ok" : "text-prism-muted"
                    )}
                  >
                    {schedule.enabled ? "Active" : "Paused"}
                  </p>
                  <p className="text-2xs text-prism-muted mt-0.5">
                    {describeCadence(schedule)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => runScheduleNow(schedule.id)}
                  className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Run now</span>
                </button>
                <button
                  onClick={() => toggleSchedule(schedule.id)}
                  className={cn(
                    "h-8 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors",
                    schedule.enabled
                      ? "border border-border bg-panel text-prism-text hover:bg-bg-hover"
                      : "bg-accent text-prism-accent-text hover:bg-accent-hover"
                  )}
                >
                  {schedule.enabled ? (
                    <>
                      <Pause className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" strokeWidth={2} />
                      <span>Resume</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="h-8 w-8 rounded-md border border-border bg-panel text-prism-muted hover:text-prism-danger hover:bg-danger-subtle flex items-center justify-center cursor-pointer"
                  title="Delete schedule"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-prism-text-strong leading-tight">
                {schedule.name}
              </h1>
              {schedule.description && (
                <p className="text-sm text-prism-muted mt-1.5 max-w-2xl">
                  {schedule.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="rounded-lg border border-border bg-panel/80 backdrop-blur-sm p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3 h-3 text-prism-accent" strokeWidth={2} />
                  <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                    Next run
                  </p>
                </div>
                <p className="text-lg font-bold text-prism-text-strong">
                  {countdown}
                </p>
                <p className="text-2xs text-prism-muted mt-1">
                  {formatDate(schedule.nextRunAt)} · {formattedTime}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-panel/80 backdrop-blur-sm p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Check className="w-3 h-3 text-prism-ok" strokeWidth={2} />
                  <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                    Last run
                  </p>
                </div>
                <p className="text-lg font-bold text-prism-text-strong">
                  {schedule.lastRunAt ? relativeTime(schedule.lastRunAt) : "Never"}
                </p>
                <p className="text-2xs text-prism-muted mt-1">
                  {schedule.lastRunAt
                    ? formatDate(schedule.lastRunAt)
                    : "Awaiting first run"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-panel/80 backdrop-blur-sm p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers className="w-3 h-3 text-prism-accent" strokeWidth={2} />
                  <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                    Sends
                  </p>
                </div>
                <p className="text-lg font-bold text-prism-text-strong">
                  {schedule.format}
                </p>
                <p className="text-2xs text-prism-muted mt-1">
                  to {schedule.recipientEmails.length}{" "}
                  {schedule.recipientEmails.length === 1
                    ? "recipient"
                    : "recipients"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly cadence strip */}
        {schedule.frequency === "weekly" &&
          schedule.dayOfWeek !== undefined && (
            <div className="mb-8">
              <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
                Weekly cadence
              </p>
              <div className="grid grid-cols-7 gap-2">
                {DAY_SHORT.map((day, i) => {
                  const isActive = i === schedule.dayOfWeek
                  return (
                    <div
                      key={i}
                      className={cn(
                        "rounded-lg border p-3 text-center transition-all",
                        isActive
                          ? "border-accent bg-accent-subtle shadow-md"
                          : "border-border bg-panel"
                      )}
                    >
                      <p
                        className={cn(
                          "text-2xs font-semibold uppercase tracking-wider",
                          isActive ? "text-prism-accent" : "text-prism-muted"
                        )}
                      >
                        {day}
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold mt-1",
                          isActive ? "text-prism-accent" : "text-prism-muted/40"
                        )}
                      >
                        {isActive ? "●" : "○"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        {/* Detail grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <Card title="Schedule">
              <div className="rounded-md border border-border bg-panel divide-y divide-border">
                <InfoRow
                  label="Frequency"
                  value={describeFrequency(schedule)}
                />
                {schedule.frequency === "weekly" && (
                  <InfoRow
                    label="Day"
                    value={DAY_NAMES[schedule.dayOfWeek ?? 0]}
                  />
                )}
                {schedule.frequency === "monthly" && (
                  <InfoRow
                    label="Day of month"
                    value={MONTH_ORDINALS[(schedule.dayOfMonth ?? 1) - 1]}
                  />
                )}
                <InfoRow label="Time" value={formattedTime} />
                <InfoRow
                  label="Next run"
                  value={`${formatDate(schedule.nextRunAt)} at ${formattedTime}`}
                />
                <InfoRow
                  label="Last run"
                  value={
                    schedule.lastRunAt
                      ? formatDate(schedule.lastRunAt)
                      : "Never"
                  }
                />
              </div>
            </Card>

            <Card
              title={`Sections included (${includedSections.length})`}
              subtitle={
                schedule.sectionIds.length === 0
                  ? "All sections (dynamic)"
                  : `${schedule.sectionIds.length} of ${sections.length}`
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
              </div>
            </Card>

            <Card title="Activity">
              <ActivityTimeline entries={schedule.activity} />
            </Card>
          </div>

          <div className="col-span-4 space-y-6">
            <Card title={`Recipients (${schedule.recipientEmails.length})`}>
              <div className="rounded-md border border-border bg-panel">
                {schedule.recipientEmails.length === 0 ? (
                  <p className="px-3 py-3 text-2xs text-prism-muted">
                    No recipients yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {schedule.recipientEmails.map((email) => (
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
                          onClick={() =>
                            removeScheduleRecipient(schedule.id, email)
                          }
                          className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted opacity-0 group-hover:opacity-100 hover:text-prism-danger hover:bg-bg-hover cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-border p-1.5 flex items-center gap-1.5">
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
            </Card>

            <Card title="Format options">
              <div className="space-y-3">
                {schedule.format === "PDF" ? (
                  <>
                    <PrismSelect
                      size="sm"
                      value={schedule.pageSize ?? "A4"}
                      onChange={(v) =>
                        updateSchedule(schedule.id, {
                          pageSize: v as Schedule["pageSize"],
                        })
                      }
                      options={[
                        { value: "A4", label: "A4" },
                        { value: "Letter", label: "Letter" },
                        { value: "Legal", label: "Legal" },
                      ]}
                    />
                    <PrismSelect
                      size="sm"
                      value={schedule.orientation ?? "portrait"}
                      onChange={(v) =>
                        updateSchedule(schedule.id, {
                          orientation: v as Schedule["orientation"],
                        })
                      }
                      options={[
                        { value: "portrait", label: "Portrait" },
                        { value: "landscape", label: "Landscape" },
                      ]}
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.includeCoverPage ?? false}
                        onChange={(e) =>
                          updateSchedule(schedule.id, {
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
                    <PrismSelect
                      size="sm"
                      value={schedule.csvDelimiter ?? ","}
                      onChange={(v) =>
                        updateSchedule(schedule.id, {
                          csvDelimiter: v as Schedule["csvDelimiter"],
                        })
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
                        checked={schedule.csvIncludeHeaders ?? true}
                        onChange={(e) =>
                          updateSchedule(schedule.id, {
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
            </Card>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirm
          scheduleName={schedule.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            removeSchedule(schedule.id)
            setShowDelete(false)
          }}
        />
      )}
    </div>
  )
}

/* ─── Small building blocks ──────────────────────────────── */

function Card({
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-2xs text-prism-muted">{label}</span>
      <span className="text-xs text-prism-text font-medium">{value}</span>
    </div>
  )
}

function DeleteConfirm({
  scheduleName,
  onCancel,
  onConfirm,
}: {
  scheduleName: string
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
          Delete this schedule?
        </p>
        <p className="text-xs text-prism-muted mt-1">
          "{scheduleName}" will stop running. Past reports stay available.
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

/* ─── Helpers ────────────────────────────────────────────── */

function describeFrequency(s: Schedule): string {
  if (s.frequency === "daily") return "Every day"
  if (s.frequency === "weekly") return `Every ${DAY_NAMES[s.dayOfWeek ?? 0]}`
  return `${MONTH_ORDINALS[(s.dayOfMonth ?? 1) - 1]} of each month`
}

function describeCadence(s: Schedule): string {
  const time = formatTime(s.time)
  if (s.frequency === "daily") return `Every day at ${time}`
  if (s.frequency === "weekly")
    return `Every ${DAY_NAMES[s.dayOfWeek ?? 0]} at ${time}`
  return `${MONTH_ORDINALS[(s.dayOfMonth ?? 1) - 1]} of each month at ${time}`
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  return new Date(0, 0, 0, h, m).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return "Now"
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
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