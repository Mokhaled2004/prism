import type { ActivityEntry } from "./report-types"

export type AlertOperator = "<" | ">" | "=" | "<=" | ">=" | "!="
export type AlertWindow = "instant" | "hourly" | "daily" | "weekly"
export type AlertChannel = "email" | "slack" | "webhook"
export type AlertState = "healthy" | "triggered" | "muted" | "snoozed"

export interface AlertTriggerEvent {
  id: string
  kind: "triggered" | "resolved" | "snoozed" | "unsnoozed" | "created"
  message: string
  /** Actual metric value at the moment of the event */
  metricValue?: number
  /** Threshold at the moment of the event */
  threshold?: number
  timestamp: number
}

export interface Alert {
  id: string
  name: string
  description?: string

  // ── Rule
  metricField: string
  operator: AlertOperator
  threshold: number
  thresholdUnit: "absolute" | "percent"
  evaluationWindow: AlertWindow

  // ── Delivery
  channels: AlertChannel[]
  recipientEmails: string[]
  slackChannel?: string
  webhookUrl?: string

  // ── State
  enabled: boolean
  state: AlertState
  lastTriggeredAt?: number
  lastCheckedAt: number
  triggeredCount30d: number
  snoozedUntil?: number

  createdAt: number
  activity: AlertTriggerEvent[]
}

export const OPERATOR_LABELS: Record<AlertOperator, string> = {
  "<": "is below",
  ">": "is above",
  "=": "equals",
  "<=": "is at most",
  ">=": "is at least",
  "!=": "is not",
}

export const OPERATOR_OPTIONS: { value: AlertOperator; label: string }[] = [
  { value: "<", label: "Less than (<)" },
  { value: ">", label: "Greater than (>)" },
  { value: "=", label: "Equals (=)" },
  { value: "<=", label: "Less or equal (≤)" },
  { value: ">=", label: "Greater or equal (≥)" },
  { value: "!=", label: "Not equal (≠)" },
]

export const WINDOW_LABELS: Record<AlertWindow, string> = {
  instant: "On every update",
  hourly: "Checked hourly",
  daily: "Checked daily",
  weekly: "Checked weekly",
}

export const WINDOW_OPTIONS: { value: AlertWindow; label: string }[] = [
  { value: "instant", label: "Instant" },
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
]

export const CHANNEL_LABELS: Record<AlertChannel, string> = {
  email: "Email",
  slack: "Slack",
  webhook: "Webhook",
}