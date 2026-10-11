"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  AlertTriangle,
  Check,
  Trash2,
  Pencil,
  Zap,
  Clock,
  TrendingUp,
  AlarmClockOff as Snooze,
  Play,
  Pause,
  Mail,
  MessageSquare as Slack,
  Globe as Webhook,
  X,
  UserPlus,
  Activity as ActivityIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { AlertFeed } from "./AlertFeed"
import {
  OPERATOR_LABELS,
  WINDOW_LABELS,
  type Alert,
  type AlertChannel,
} from "./alert-types"

export function AlertCanvas() {
  const alerts = useEditor((s) => s.alerts)
  const selectedAlertId = useEditor((s) => s.selectedAlertId)
  const setSelectedAlertId = useEditor((s) => s.setSelectedAlertId)

  const alert = alerts.find((a) => a.id === selectedAlertId) ?? null

  if (!alert) {
    return (
      <AlertFeed
        onSelectAlert={(id) => setSelectedAlertId(id)}
        onCreate={() => {
          /* Panel handles modal */
        }}
      />
    )
  }

  return (
    <AlertDetail
      alert={alert}
      onBack={() => setSelectedAlertId(null)}
    />
  )
}

/* ─── Detail view ────────────────────────────────────────── */

function AlertDetail({
  alert,
  onBack,
}: {
  alert: Alert
  onBack: () => void
}) {
  const removeAlert = useEditor((s) => s.removeAlert)
  const toggleAlertEnabled = useEditor((s) => s.toggleAlertEnabled)
  const triggerAlert = useEditor((s) => s.triggerAlert)
  const resolveAlert = useEditor((s) => s.resolveAlert)
  const snoozeAlert = useEditor((s) => s.snoozeAlert)
  const unsnoozeAlert = useEditor((s) => s.unsnoozeAlert)
  const addAlertRecipient = useEditor((s) => s.addAlertRecipient)
  const removeAlertRecipient = useEditor((s) => s.removeAlertRecipient)

  const [recipientInput, setRecipientInput] = useState("")
  const [showDelete, setShowDelete] = useState(false)

  const isTriggered = alert.state === "triggered"
  const isSnoozed = alert.state === "snoozed"

  const handleAddRecipient = () => {
    if (!recipientInput.trim()) return
    addAlertRecipient(alert.id, recipientInput.trim())
    setRecipientInput("")
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-bg">
      <div className="p-8">
        <button
          onClick={onBack}
          className="text-2xs text-prism-muted hover:text-prism-text mb-4 flex items-center gap-1 cursor-pointer"
        >
          ← Back to alerts
        </button>

        {/* Status banner for triggered alerts */}
        {isTriggered && (
          <div className="rounded-md border border-danger bg-danger-subtle p-3 mb-5 flex items-start gap-3">
            <AlertTriangle
              className="w-4 h-4 text-prism-danger shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-prism-danger">
                Currently triggered
              </p>
              <p className="text-2xs text-prism-text mt-0.5">
                {alert.metricField} is below the configured threshold.
              </p>
            </div>
            <button
              onClick={() => snoozeAlert(alert.id, 4)}
              className="h-7 px-2.5 rounded-md border border-danger bg-panel text-prism-danger text-2xs font-medium hover:bg-danger-subtle shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Snooze className="w-3 h-3" strokeWidth={2} />
              <span>Snooze 4h</span>
            </button>
            <button
              onClick={() => resolveAlert(alert.id)}
              className="h-7 px-2.5 rounded-md bg-danger text-white text-2xs font-medium hover:brightness-110 shrink-0 cursor-pointer"
            >
              Mark resolved
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StatePill state={alert.state} enabled={alert.enabled} />
            </div>
            <h1 className="text-2xl font-semibold text-prism-text-strong leading-tight">
              {alert.name}
            </h1>
            {alert.description && (
              <p className="text-sm text-prism-muted mt-1.5 max-w-2xl">
                {alert.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-2xs text-prism-muted">
              <span>Checked {relativeTime(alert.lastCheckedAt)}</span>
              {alert.lastTriggeredAt && (
                <>
                  <span className="text-prism-border">·</span>
                  <span>
                    Last triggered {relativeTime(alert.lastTriggeredAt)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isTriggered && (
              <button
                onClick={() => triggerAlert(alert.id, alert.threshold - 100_000)}
                className="h-8 px-2.5 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
                title="Simulate a trigger (dev only)"
              >
                <Zap className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Test</span>
              </button>
            )}
            <button
              onClick={() => toggleAlertEnabled(alert.id)}
              className={cn(
                "h-8 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors",
                alert.enabled
                  ? "border border-border bg-panel text-prism-text hover:bg-bg-hover"
                  : "bg-accent text-prism-accent-text hover:bg-accent-hover"
              )}
            >
              {alert.enabled ? (
                <>
                  <Pause className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Disable</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Enable</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="h-8 w-8 rounded-md border border-border bg-panel text-prism-muted hover:text-prism-danger hover:bg-danger-subtle flex items-center justify-center cursor-pointer"
              title="Delete alert"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-8 space-y-6">
            {/* Condition */}
            <Card title="Condition">
              <div className="rounded-md border border-border bg-panel p-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-md bg-bg-hover text-xs font-mono text-prism-text">
                    {alert.metricField}
                  </span>
                  <span className="text-xs text-prism-muted">
                    {OPERATOR_LABELS[alert.operator]}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-accent-subtle text-xs font-mono font-medium text-prism-accent">
                    {alert.thresholdUnit === "percent"
                      ? `${alert.threshold}%`
                      : alert.threshold.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-2xs text-prism-muted">
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  <span>{WINDOW_LABELS[alert.evaluationWindow]}</span>
                </div>
              </div>
            </Card>

            {/* Health */}
            <Card title="Health (last 30 days)">
              <div className="grid grid-cols-3 gap-3">
                <HealthTile
                  icon={Zap}
                  label="Triggers"
                  value={String(alert.triggeredCount30d)}
                  tone={alert.triggeredCount30d > 0 ? "warn" : "muted"}
                />
                <HealthTile
                  icon={TrendingUp}
                  label="Uptime"
                  value="99.2%"
                  tone="ok"
                />
                <HealthTile
                  icon={Clock}
                  label="Check latency"
                  value="12m"
                  tone="muted"
                />
              </div>
            </Card>

            {/* Trigger history */}
            <Card title="Trigger history">
              {alert.activity.length === 0 ? (
                <p className="text-2xs text-prism-muted py-4">
                  No events yet.
                </p>
              ) : (
                <div className="space-y-0">
                  {[...alert.activity]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((evt, i, arr) => (
                      <div key={evt.id} className="flex gap-3">
                        <div className="relative flex flex-col items-center shrink-0">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center",
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
                              <ActivityIcon className="w-3 h-3" strokeWidth={2.5} />
                            )}
                          </div>
                          {i < arr.length - 1 && (
                            <div className="w-px flex-1 bg-border my-1 min-h-[16px]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pb-3">
                          <p className="text-xs text-prism-text leading-snug">
                            {evt.message}
                          </p>
                          {evt.metricValue !== undefined && (
                            <p className="text-2xs text-prism-muted mt-0.5 font-mono">
                              {alert.metricField} was{" "}
                              {alert.thresholdUnit === "percent"
                                ? `${evt.metricValue}%`
                                : evt.metricValue.toLocaleString()}
                              {evt.threshold !== undefined && (
                                <span className="text-prism-border">
                                  {" "}
                                  (threshold:{" "}
                                  {alert.thresholdUnit === "percent"
                                    ? `${evt.threshold}%`
                                    : evt.threshold.toLocaleString()}
                                  )
                                </span>
                              )}
                            </p>
                          )}
                          <p className="text-2xs text-prism-muted mt-1">
                            {relativeTime(evt.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div className="col-span-4 space-y-6">
            {/* Delivery */}
            <Card title="Delivery channels">
              <div className="rounded-md border border-border bg-panel p-3 space-y-2">
                {alert.channels.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
                      {c === "email" ? (
                        <Mail
                          className="w-3 h-3 text-prism-accent"
                          strokeWidth={2}
                        />
                      ) : c === "slack" ? (
                        <Slack
                          className="w-3 h-3 text-prism-accent"
                          strokeWidth={2}
                        />
                      ) : (
                        <Webhook
                          className="w-3 h-3 text-prism-accent"
                          strokeWidth={2}
                        />
                      )}
                    </div>
                    <span className="text-xs text-prism-text capitalize">
                      {c}
                    </span>
                    {c === "slack" && alert.slackChannel && (
                      <span className="text-2xs text-prism-muted ml-auto font-mono">
                        {alert.slackChannel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Recipients */}
            {alert.channels.includes("email") && (
              <Card title={`Email recipients (${alert.recipientEmails.length})`}>
                <div className="rounded-md border border-border bg-panel">
                  {alert.recipientEmails.length === 0 ? (
                    <p className="px-3 py-3 text-2xs text-prism-muted">
                      No recipients yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {alert.recipientEmails.map((email) => (
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
                              removeAlertRecipient(alert.id, email)
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
            )}

            {/* Snooze state */}
            {isSnoozed && alert.snoozedUntil && (
              <Card title="Snoozed">
                <div className="rounded-md border border-warn bg-warn-subtle/40 p-3">
                  <p className="text-2xs text-prism-text">
                    Snoozed until{" "}
                    <span className="font-medium">
                      {new Date(alert.snoozedUntil).toLocaleString()}
                    </span>
                  </p>
                  <button
                    onClick={() => unsnoozeAlert(alert.id)}
                    className="mt-2 h-7 px-2.5 rounded-md bg-warn text-white text-2xs font-medium hover:brightness-110 cursor-pointer"
                  >
                    Un-snooze
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirm
          alertName={alert.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            removeAlert(alert.id)
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
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2.5">
        {title}
      </p>
      {children}
    </div>
  )
}

function HealthTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any
  label: string
  value: string
  tone: "ok" | "warn" | "danger" | "muted"
}) {
  const toneClass = {
    ok: "bg-ok-subtle text-prism-ok",
    warn: "bg-warn-subtle text-prism-warn",
    danger: "bg-danger-subtle text-prism-danger",
    muted: "bg-bg-hover text-prism-muted",
  }[tone]

  return (
    <div className="rounded-md border border-border bg-panel p-3">
      <div
        className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center mb-2",
          toneClass
        )}
      >
        <Icon className="w-3 h-3" strokeWidth={2} />
      </div>
      <p className="text-xs text-prism-muted">{label}</p>
      <p className="text-lg font-semibold text-prism-text-strong tabular-nums mt-0.5">
        {value}
      </p>
    </div>
  )
}

function StatePill({
  state,
  enabled,
}: {
  state: Alert["state"]
  enabled: boolean
}) {
  if (!enabled) {
    return (
      <span className="text-2xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-bg-hover text-prism-muted">
        Disabled
      </span>
    )
  }
  if (state === "triggered") {
    return (
      <span className="text-2xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-danger-subtle text-prism-danger flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-prism-danger animate-pulse" />
        Triggered
      </span>
    )
  }
  if (state === "snoozed") {
    return (
      <span className="text-2xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-warn-subtle text-prism-warn">
        Snoozed
      </span>
    )
  }
  return (
    <span className="text-2xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-ok-subtle text-prism-ok">
      Healthy
    </span>
  )
}

function DeleteConfirm({
  alertName,
  onCancel,
  onConfirm,
}: {
  alertName: string
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
          Delete this alert?
        </p>
        <p className="text-xs text-prism-muted mt-1">
          "{alertName}" will stop monitoring.
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