"use client"

import { useState } from "react"
import {
  CalendarClock,
  Pencil,
  Trash2,
  Play,
  Pause,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { AutomationCard, CardAction } from "../automation/AutomationCard"
import {
  AutomationPanelHeader,
  PanelNewButton,
} from "../automation/AutomationPanelHeader"
import { ScheduleModal, type NewScheduleData } from "../automation/ScheduleModal"
import type { Schedule } from "../automation/schedule-types"
import { DAY_NAMES, MONTH_ORDINALS } from "../automation/schedule-types"

export function SchedulerSection() {
  const sections = useEditor((s) => s.sections)
  const schedules = useEditor((s) => s.schedules)
  const selectedScheduleId = useEditor((s) => s.selectedScheduleId)
  const setSelectedScheduleId = useEditor((s) => s.setSelectedScheduleId)
  const addSchedule = useEditor((s) => s.addSchedule)
  const updateSchedule = useEditor((s) => s.updateSchedule)
  const removeSchedule = useEditor((s) => s.removeSchedule)
  const toggleSchedule = useEditor((s) => s.toggleSchedule)
  const runScheduleNow = useEditor((s) => s.runScheduleNow)
  const reports = useEditor((s) => s.reports)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Schedule | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (s: Schedule) => {
    setEditing(s)
    setModalOpen(true)
  }

  const handleSave = (data: NewScheduleData) => {
    if (editing) {
      updateSchedule(editing.id, {
        ...data,
        nextRunAt: computeNextRun(data),
      })
    } else {
      const now = Date.now()
      const next: Schedule = {
        id: `s_${Math.random().toString(36).slice(2, 10)}`,
        ...data,
        sectionCountAtCreation:
          data.sectionIds.length === 0 ? sections.length : data.sectionIds.length,
        enabled: true,
        nextRunAt: computeNextRun(data),
        createdAt: now,
        activity: [
          {
            id: `act_${Math.random().toString(36).slice(2, 8)}`,
            kind: "created",
            message: "Schedule created",
            timestamp: now,
          },
        ],
      }
      addSchedule(next)
    }
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <AutomationPanelHeader
          title="Scheduled"
          count={schedules.length}
          icon={CalendarClock}
          action={<PanelNewButton label="New" onClick={openCreate} />}
        />

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {schedules.length === 0 ? (
            <EmptySchedules onCreate={openCreate} />
          ) : (
            schedules.map((s) => {
              const isActive = s.id === selectedScheduleId
              return (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-md transition-all",
                    isActive && "ring-2 ring-accent ring-offset-2 ring-offset-bg"
                  )}
                >
                  <AutomationCard
                    icon={CalendarClock}
                    iconTone={s.enabled ? "accent" : "muted"}
                    title={s.name}
                    badge={
                      !s.enabled ? (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-bg-hover text-prism-muted font-medium shrink-0">
                          Paused
                        </span>
                      ) : undefined
                    }
                    meta={
                      <>
                        <span>{describeCadence(s)}</span>
                        <span className="text-border">·</span>
                        <span>{s.format}</span>
                        <span className="text-border">·</span>
                        <span>
                          {s.recipientEmails.length}{" "}
                          {s.recipientEmails.length === 1
                            ? "recipient"
                            : "recipients"}
                        </span>
                      </>
                    }
                    onClick={() =>
                      setSelectedScheduleId(isActive ? null : s.id)
                    }
                    actions={
                      <>
                        <CardAction
                          icon={Pencil}
                          label="Edit"
                          onClick={() => openEdit(s)}
                        />
                        <CardAction
                          icon={Play}
                          label="Run now"
                          onClick={() => runScheduleNow(s.id)}
                        />
                        <CardAction
                          icon={s.enabled ? Pause : Play}
                          label={s.enabled ? "Pause" : "Resume"}
                          onClick={() => toggleSchedule(s.id)}
                        />
                      </>
                    }
                    destructiveActions={
                      <CardAction
                        icon={Trash2}
                        label="Delete"
                        tone="danger"
                        onClick={() => removeSchedule(s.id)}
                      />
                    }
                  />
                </div>
              )
            })
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-border shrink-0">
          <p className="text-2xs text-prism-muted">
            Scheduled reports are emailed automatically.
          </p>
        </div>
      </div>

      <ScheduleModal
        open={modalOpen}
        schedule={editing}
        sections={sections}
        reports={reports}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />
    </>
  )
}

function EmptySchedules({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
        <CalendarClock
          className="w-6 h-6 text-prism-accent"
          strokeWidth={1.75}
        />
      </div>
      <p className="text-sm font-medium text-prism-text-strong mb-1">
        No scheduled reports
      </p>
      <p className="text-xs text-prism-muted mb-4 max-w-[220px]">
        Schedule a report to be emailed automatically.
      </p>
      <button
        onClick={onCreate}
        className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5 cursor-pointer"
      >
        <CalendarClock className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span>New schedule</span>
      </button>
    </div>
  )
}

function describeCadence(s: Schedule): string {
  const time = formatTime(s.time)
  if (s.frequency === "daily") return `Daily at ${time}`
  if (s.frequency === "weekly")
    return `${DAY_NAMES[s.dayOfWeek ?? 0]} at ${time}`
  return `${MONTH_ORDINALS[(s.dayOfMonth ?? 1) - 1]} of month`
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  return new Date(0, 0, 0, h, m).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function computeNextRun(data: NewScheduleData): number {
  const [hours, minutes] = data.time.split(":").map(Number)
  const now = new Date()
  const next = new Date(now)
  next.setHours(hours, minutes, 0, 0)

  if (data.frequency === "daily") {
    if (next <= now) next.setDate(next.getDate() + 1)
    return next.getTime()
  }

  if (data.frequency === "weekly") {
    const target = data.dayOfWeek ?? 1
    const diff = (target - next.getDay() + 7) % 7
    next.setDate(next.getDate() + (diff === 0 && next <= now ? 7 : diff))
    return next.getTime()
  }

  // monthly
  next.setDate(data.dayOfMonth ?? 1)
  if (next <= now) next.setMonth(next.getMonth() + 1)
  return next.getTime()
}