"use client"

import { useMemo } from "react"
import { CalendarClock, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import type { Schedule } from "./schedule-types"

export interface ScheduleCalendarProps {
  onSelectSchedule: (id: string) => void
  onCreate: () => void
}

interface UpcomingRun {
  id: string
  scheduleId: string
  scheduleName: string
  format: "PDF" | "CSV"
  recipientCount: number
  runAt: number
}

const DAY_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function ScheduleCalendar({
  onSelectSchedule,
  onCreate,
}: ScheduleCalendarProps) {
  const schedules = useEditor((s) => s.schedules)

  const enabledSchedules = schedules.filter((s) => s.enabled)

  // Compute upcoming runs for the next 14 days from enabled schedules
  const upcomingRuns = useMemo(() => {
    const runs: UpcomingRun[] = []
    const now = Date.now()
    const horizon = now + 14 * 24 * 60 * 60 * 1000

    for (const schedule of enabledSchedules) {
      // Generate runs from lastRunAt or now until horizon
      let next = schedule.nextRunAt
      while (next <= horizon) {
        if (next >= now) {
          runs.push({
            id: `${schedule.id}_${next}`,
            scheduleId: schedule.id,
            scheduleName: schedule.name,
            format: schedule.format,
            recipientCount: schedule.recipientEmails.length,
            runAt: next,
          })
        }
        // Advance to next occurrence
        next = addInterval(next, schedule)
      }
    }

    return runs.sort((a, b) => a.runAt - b.runAt)
  }, [enabledSchedules])

  // Group runs by day
  const days = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return Array.from({ length: 14 }).map((_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      const dayStart = date.getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1

      const dayRuns = upcomingRuns.filter(
        (r) => r.runAt >= dayStart && r.runAt <= dayEnd
      )

      return {
        date,
        dayStart,
        runs: dayRuns,
      }
    })
  }, [upcomingRuns])

  const totalUpcoming = upcomingRuns.length

  if (schedules.length === 0) {
    return <EmptyCalendar onCreate={onCreate} />
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-bg p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-prism-text-strong">
            Schedule
          </h1>
          <p className="text-xs text-prism-muted mt-1">
            {enabledSchedules.length}{" "}
            {enabledSchedules.length === 1
              ? "active schedule"
              : "active schedules"}{" "}
            · {totalUpcoming} upcoming{" "}
            {totalUpcoming === 1 ? "run" : "runs"} in next 14 days
          </p>
        </div>
      </div>

      {/* Timeline strip */}
      <div className="mb-8">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
          Next 14 days
        </p>
        <div className="grid grid-cols-14 gap-1.5">
          {days.map((day, i) => {
            const isToday = i === 0
            const hasRuns = day.runs.length > 0
            const dayName = DAY_HEADER[day.date.getDay()]
            const dayNum = day.date.getDate()
            const monthShort = day.date.toLocaleDateString("en-US", {
              month: "short",
            })

            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-2 flex flex-col items-center gap-1 transition-all",
                  isToday
                    ? "border-accent bg-accent-subtle"
                    : hasRuns
                      ? "border-border bg-panel"
                      : "border-border bg-panel/40"
                )}
                title={`${day.runs.length} run${day.runs.length === 1 ? "" : "s"}`}
              >
                <p
                  className={cn(
                    "text-2xs font-semibold uppercase tracking-wider",
                    isToday
                      ? "text-prism-accent"
                      : hasRuns
                        ? "text-prism-text"
                        : "text-prism-muted"
                  )}
                >
                  {dayName}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold leading-none",
                    isToday
                      ? "text-prism-accent"
                      : hasRuns
                        ? "text-prism-text-strong"
                        : "text-prism-muted/50"
                  )}
                >
                  {dayNum}
                </p>
                <p
                  className={cn(
                    "text-2xs",
                    isToday ? "text-prism-accent" : "text-prism-muted"
                  )}
                >
                  {monthShort}
                </p>
                {/* Dots */}
                <div className="flex items-center gap-0.5 h-4 mt-0.5">
                  {day.runs.slice(0, 3).map((_, ri) => (
                    <span
                      key={ri}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isToday ? "bg-prism-accent" : "bg-prism-ok"
                      )}
                    />
                  ))}
                  {day.runs.length > 3 && (
                    <span className="text-2xs text-prism-muted">
                      +{day.runs.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming runs list */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
          Upcoming runs
        </p>

        {upcomingRuns.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-8 text-center">
            <p className="text-xs text-prism-text mb-1">
              No scheduled runs in the next 14 days
            </p>
            <p className="text-2xs text-prism-muted">
              Enable a schedule or create a new one to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {days.map((day, di) => {
              if (day.runs.length === 0) return null
              const isToday = di === 0
              const isTomorrow = di === 1

              const dateLabel = isToday
                ? "Today"
                : isTomorrow
                  ? "Tomorrow"
                  : day.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })

              return (
                <div key={di}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                      {dateLabel}
                    </p>
                    <span className="text-2xs text-prism-border">·</span>
                    <p className="text-2xs text-prism-muted">
                      {day.runs.length}{" "}
                      {day.runs.length === 1 ? "run" : "runs"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {day.runs.map((run) => (
                      <button
                        key={run.id}
                        onClick={() => onSelectSchedule(run.scheduleId)}
                        className="w-full text-left rounded-md border border-border bg-panel px-3 py-2.5 flex items-center gap-3 hover:border-accent hover:bg-accent-subtle/30 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
                          <Play
                            className="w-3.5 h-3.5 text-prism-accent"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-prism-text-strong truncate">
                            {run.scheduleName}
                          </p>
                          <p className="text-2xs text-prism-muted mt-0.5">
                            {run.format} · {run.recipientCount}{" "}
                            {run.recipientCount === 1
                              ? "recipient"
                              : "recipients"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-prism-text-strong tabular-nums">
                            {formatTime(run.runAt)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCalendar({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 min-w-0 flex items-center justify-center bg-bg">
      <div className="text-center max-w-sm px-6">
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 bg-accent-subtle rounded-full blur-2xl opacity-60" />
          <div className="relative w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center">
            <CalendarClock
              className="w-7 h-7 text-prism-accent"
              strokeWidth={1.5}
            />
          </div>
        </div>
        <p className="text-sm font-medium text-prism-text-strong mb-1">
          No schedules yet
        </p>
        <p className="text-xs text-prism-muted mb-5">
          Create a schedule to send this dashboard automatically.
        </p>
        <button
          onClick={onCreate}
          className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover inline-flex items-center gap-1.5 cursor-pointer"
        >
          <CalendarClock className="w-3.5 h-3.5" strokeWidth={2.25} />
          <span>New schedule</span>
        </button>
      </div>
    </div>
  )
}

/* ─── Helpers ────────────────────────────────────────────── */

function addInterval(ts: number, schedule: Schedule): number {
  const date = new Date(ts)
  if (schedule.frequency === "daily") {
    date.setDate(date.getDate() + 1)
  } else if (schedule.frequency === "weekly") {
    date.setDate(date.getDate() + 7)
  } else {
    date.setMonth(date.getMonth() + 1)
  }
  return date.getTime()
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}