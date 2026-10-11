"use client"

import { Bell, AlertTriangle, Check, Activity, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import type { Alert } from "./alert-types"

export interface AlertFeedProps {
  onSelectAlert: (id: string) => void
  onCreate: () => void
}

export function AlertFeed({ onSelectAlert, onCreate }: AlertFeedProps) {
  const alerts = useEditor((s) => s.alerts)

  const triggered = alerts.filter((a) => a.state === "triggered")
  const healthy = alerts.filter((a) => a.state === "healthy" && a.enabled)
  const totalTriggers = alerts.reduce((acc, a) => acc + a.triggeredCount30d, 0)

  if (alerts.length === 0) {
    return <EmptyFeed onCreate={onCreate} />
  }

  // Sort all events across alerts for the activity feed
  const recentEvents = alerts
    .flatMap((a) =>
      a.activity.map((evt) => ({
        alertId: a.id,
        alertName: a.name,
        evt,
      }))
    )
    .sort((a, b) => b.evt.timestamp - a.evt.timestamp)
    .slice(0, 10)

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-prism-text-strong">
          Alerts overview
        </h1>
        <p className="text-xs text-prism-muted mt-1">
          {alerts.length} {alerts.length === 1 ? "alert" : "alerts"} ·{" "}
          {triggered.length} triggered · {healthy.length} healthy
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatTile
          icon={AlertTriangle}
          tone={triggered.length > 0 ? "danger" : "muted"}
          label="Triggered"
          value={String(triggered.length)}
          hint={triggered.length > 0 ? "Needs attention" : "All clear"}
        />
        <StatTile
          icon={Check}
          tone="ok"
          label="Healthy"
          value={String(healthy.length)}
          hint="No trigger conditions met"
        />
        <StatTile
          icon={Zap}
          tone="accent"
          label="Triggers (30d)"
          value={String(totalTriggers)}
          hint="Across all alerts"
        />
      </div>

      {/* Active triggers */}
      {triggered.length > 0 && (
        <div className="mb-8">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
            Active triggers ({triggered.length})
          </p>
          <div className="space-y-2">
            {triggered.map((a) => (
              <button
                key={a.id}
                onClick={() => onSelectAlert(a.id)}
                className="w-full text-left rounded-md border border-danger bg-danger-subtle p-4 hover:brightness-95 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-danger flex items-center justify-center shrink-0">
                    <AlertTriangle
                      className="w-4 h-4 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-prism-text-strong">
                      {a.name}
                    </p>
                    <p className="text-xs text-prism-text mt-0.5">
                      {describeCondition(a)}
                      {a.activity[0]?.metricValue !== undefined && (
                        <span className="ml-1 font-mono">
                          (was {formatMetric(a.activity[0].metricValue)})
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-2xs text-prism-danger font-medium shrink-0">
                    {a.lastTriggeredAt ? relativeTime(a.lastTriggeredAt) : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
          Recent activity
        </p>
        {recentEvents.length === 0 ? (
          <p className="text-2xs text-prism-muted py-4">
            No activity yet.
          </p>
        ) : (
          <div className="rounded-md border border-border bg-panel divide-y divide-border">
            {recentEvents.map(({ alertId, alertName, evt }) => (
              <button
                key={evt.id}
                onClick={() => onSelectAlert(alertId)}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                    evt.kind === "triggered"
                      ? "bg-danger-subtle text-prism-danger"
                      : evt.kind === "resolved"
                        ? "bg-ok-subtle text-prism-ok"
                        : "bg-bg-hover text-prism-muted"
                  )}
                >
                  {evt.kind === "triggered" ? (
                    <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                  ) : evt.kind === "resolved" ? (
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  ) : (
                    <Activity className="w-3 h-3" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-prism-text truncate">
                    <span className="font-medium">{alertName}</span>
                    <span className="text-prism-muted"> — {evt.message}</span>
                  </p>
                </div>
                <p className="text-2xs text-prism-muted shrink-0">
                  {relativeTime(evt.timestamp)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatTile({
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: any
  tone: "accent" | "ok" | "danger" | "muted"
  label: string
  value: string
  hint: string
}) {
  const toneClass = {
    accent: "bg-accent-subtle text-prism-accent",
    ok: "bg-ok-subtle text-prism-ok",
    danger: "bg-danger-subtle text-prism-danger",
    muted: "bg-bg-hover text-prism-muted",
  }[tone]

  return (
    <div className="rounded-md border border-border bg-panel p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center",
            toneClass
          )}
        >
          <Icon className="w-3 h-3" strokeWidth={2} />
        </div>
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-prism-text-strong tabular-nums">
        {value}
      </p>
      <p className="text-2xs text-prism-muted mt-1">{hint}</p>
    </div>
  )
}

function EmptyFeed({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 min-w-0 flex items-center justify-center bg-bg">
      <div className="text-center max-w-sm px-6">
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 bg-accent-subtle rounded-full blur-2xl opacity-60" />
          <div className="relative w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center">
            <Bell className="w-7 h-7 text-prism-accent" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-sm font-medium text-prism-text-strong mb-1">
          No alerts yet
        </p>
        <p className="text-xs text-prism-muted mb-5">
          Get notified when a metric crosses a threshold.
        </p>
        <button
          onClick={onCreate}
          className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" strokeWidth={2.25} />
          <span>New alert</span>
        </button>
      </div>
    </div>
  )
}

/* ─── Helpers ────────────────────────────────────────────── */

function describeCondition(a: Alert): string {
  const op = {
    "<": "is below",
    ">": "is above",
    "=": "equals",
    "<=": "is at most",
    ">=": "is at least",
    "!=": "is not",
  }[a.operator]

  const threshold =
    a.thresholdUnit === "percent"
      ? `${a.threshold}%`
      : formatMetric(a.threshold)

  return `${a.metricField} ${op} ${threshold}`
}

function formatMetric(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return String(value)
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