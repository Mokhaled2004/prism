"use client"

import { useEffect, useState } from "react"
import { X, Bell, AlertTriangle, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PrismSelect } from "@/components/ui/prism/Select"
import {
  OPERATOR_OPTIONS,
  WINDOW_OPTIONS,
  type Alert,
  type AlertChannel,
  type AlertOperator,
  type AlertWindow,
} from "./alert-types"

export interface AlertModalProps {
  open: boolean
  alert: Alert | null
  metricFields: { value: string; label: string }[]
  onClose: () => void
  onSave: (data: NewAlertData) => void
}

export interface NewAlertData {
  name: string
  description?: string
  metricField: string
  operator: AlertOperator
  threshold: number
  thresholdUnit: "absolute" | "percent"
  evaluationWindow: AlertWindow
  channels: AlertChannel[]
  recipientEmails: string[]
  slackChannel?: string
}

export function AlertModal({
  open,
  alert,
  metricFields,
  onClose,
  onSave,
}: AlertModalProps) {
  const isEditing = !!alert

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [metricField, setMetricField] = useState(
    metricFields[0]?.value ?? "revenue"
  )
  const [operator, setOperator] = useState<AlertOperator>("<")
  const [threshold, setThreshold] = useState(0)
  const [thresholdUnit, setThresholdUnit] = useState<"absolute" | "percent">(
    "absolute"
  )
  const [evaluationWindow, setEvaluationWindow] =
    useState<AlertWindow>("hourly")
  const [channels, setChannels] = useState<AlertChannel[]>(["email"])
  const [recipientInput, setRecipientInput] = useState("")
  const [recipientEmails, setRecipientEmails] = useState<string[]>([])
  const [slackChannel, setSlackChannel] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (alert) {
      setName(alert.name)
      setDescription(alert.description ?? "")
      setMetricField(alert.metricField)
      setOperator(alert.operator)
      setThreshold(alert.threshold)
      setThresholdUnit(alert.thresholdUnit)
      setEvaluationWindow(alert.evaluationWindow)
      setChannels(alert.channels)
      setRecipientEmails(alert.recipientEmails)
      setSlackChannel(alert.slackChannel ?? "")
    } else {
      setName("")
      setDescription("")
      setMetricField(metricFields[0]?.value ?? "revenue")
      setOperator("<")
      setThreshold(0)
      setThresholdUnit("absolute")
      setEvaluationWindow("hourly")
      setChannels(["email"])
      setRecipientEmails([])
      setSlackChannel("")
    }
    setRecipientInput("")
    setError(null)
  }, [open, alert, metricFields])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const toggleChannel = (channel: AlertChannel) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    )
  }

  const addRecipient = () => {
    const trimmed = recipientInput.trim().toLowerCase()
    if (!trimmed) return
    if (recipientEmails.includes(trimmed)) {
      setRecipientInput("")
      return
    }
    setRecipientEmails((prev) => [...prev, trimmed])
    setRecipientInput("")
  }

  const removeRecipientAt = (email: string) => {
    setRecipientEmails((prev) => prev.filter((e) => e !== email))
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    // ── Auto-commit any pending recipient in the input
    let finalRecipients = recipientEmails
    const pending = recipientInput.trim().toLowerCase()
    if (pending && !recipientEmails.includes(pending)) {
      finalRecipients = [...recipientEmails, pending]
      setRecipientEmails(finalRecipients)
      setRecipientInput("")
    }

    if (channels.length === 0) {
      setError("Select at least one delivery channel")
      return
    }
    if (channels.includes("email") && finalRecipients.length === 0) {
      setError("Add at least one email recipient")
      return
    }
    if (channels.includes("slack") && !slackChannel.trim()) {
      setError("Add a Slack channel (e.g. #ops)")
      return
    }

    setError(null)
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      metricField,
      operator,
      threshold,
      thresholdUnit,
      evaluationWindow,
      channels,
      recipientEmails: finalRecipients,
      slackChannel: slackChannel.trim() || undefined,
    })
  }

  // Compute the disabled state for the "+" button — should ONLY be
  // disabled when the field is empty
  const canAddRecipient = recipientInput.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-prism-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-prism-text-strong">
                {isEditing ? "Edit alert" : "New alert"}
              </h2>
              <p className="text-xs text-prism-muted mt-0.5">
                Get notified when a metric crosses a threshold
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
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          <Field label="Name">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="e.g. Revenue below target"
              className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
            />
          </Field>

          <Field label="Description (optional)">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this alert watch for?"
              className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
            />
          </Field>

          {/* Condition builder */}
          <div className="rounded-md border border-border bg-bg-hover/40 p-4">
            <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-3">
              Condition
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <PrismSelect
                  value={metricField}
                  onChange={setMetricField}
                  options={metricFields}
                />
              </div>
              <div className="w-44 shrink-0">
                <PrismSelect
                  value={operator}
                  onChange={(v) => setOperator(v as AlertOperator)}
                  options={OPERATOR_OPTIONS}
                />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-1">
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="flex-1 min-w-0 h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow tabular-nums"
                />
                <PrismSelect
                  value={thresholdUnit}
                  onChange={(v) =>
                    setThresholdUnit(v as "absolute" | "percent")
                  }
                  width="auto"
                  options={[
                    { value: "absolute", label: "Absolute" },
                    { value: "percent", label: "Percent" },
                  ]}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-2xs text-prism-muted shrink-0">When to check</p>
              <div className="w-44">
                <PrismSelect
                  size="sm"
                  value={evaluationWindow}
                  onChange={(v) => setEvaluationWindow(v as AlertWindow)}
                  options={WINDOW_OPTIONS}
                />
              </div>
            </div>
          </div>

          {/* Channels */}
          <Field label="Delivery channels">
            <div className="flex gap-2">
              <ChannelToggle
                label="Email"
                active={channels.includes("email")}
                onClick={() => toggleChannel("email")}
              />
              <ChannelToggle
                label="Slack"
                active={channels.includes("slack")}
                onClick={() => toggleChannel("slack")}
              />
              <ChannelToggle
                label="Webhook"
                active={channels.includes("webhook")}
                onClick={() => toggleChannel("webhook")}
              />
            </div>
          </Field>

          {/* Recipients */}
          {channels.includes("email") && (
            <Field label={`Email recipients (${recipientEmails.length})`}>
              <div className="rounded-md border border-border bg-bg">
                {recipientEmails.length === 0 ? (
                  <p className="px-3 py-2 text-2xs text-prism-muted">
                    No recipients yet — type an email and press Enter.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {recipientEmails.map((email) => (
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
                          className="w-5 h-5 rounded flex items-center justify-center text-prism-muted hover:text-prism-danger cursor-pointer"
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
                    onChange={(e) => {
                      setRecipientInput(e.target.value)
                      setError(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault()
                        addRecipient()
                      }
                    }}
                    onBlur={() => {
                      // Auto-commit on blur so the user doesn't lose typed text
                      if (recipientInput.trim()) addRecipient()
                    }}
                    placeholder="email@company.com — press Enter to add"
                    className="flex-1 min-w-0 h-7 px-2 rounded-md border border-border bg-bg text-2xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={addRecipient}
                    disabled={!canAddRecipient}
                    className={cn(
                      "h-7 w-7 rounded-md flex items-center justify-center cursor-pointer transition-colors",
                      canAddRecipient
                        ? "bg-accent text-prism-accent-text hover:bg-accent-hover"
                        : "bg-bg-hover text-prism-muted cursor-not-allowed"
                    )}
                    title={
                      canAddRecipient
                        ? "Add recipient"
                        : "Type an email first"
                    }
                  >
                    <Plus className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </Field>
          )}

          {/* Slack */}
          {channels.includes("slack") && (
            <Field label="Slack channel">
              <input
                type="text"
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
                placeholder="#ops"
                className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
              />
            </Field>
          )}

          {/* Webhook */}
          {channels.includes("webhook") && (
            <div className="flex items-start gap-2 p-3 rounded-md border border-warn bg-warn-subtle/40">
              <AlertTriangle
                className="w-3.5 h-3.5 text-prism-warn mt-0.5 shrink-0"
                strokeWidth={2}
              />
              <p className="text-2xs text-prism-text">
                Webhook delivery requires a backend endpoint. Configure this
                after connecting a backend.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-md border border-danger bg-danger-subtle p-3">
              <p className="text-2xs text-prism-danger">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg-hover flex items-center justify-end gap-2 shrink-0">
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
            {isEditing ? "Save changes" : "Create alert"}
          </button>
        </div>
      </div>
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

function ChannelToggle({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-md text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5",
        active
          ? "bg-accent-subtle text-prism-accent border-accent"
          : "bg-panel text-prism-text border-border hover:bg-bg-hover"
      )}
    >
      {active && <Check className="w-3 h-3" strokeWidth={2.5} />}
      {label}
    </button>
  )
}