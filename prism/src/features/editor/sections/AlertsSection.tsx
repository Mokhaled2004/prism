"use client"

import { useState } from "react"
import {
  Bell,
  AlertTriangle,
  Trash2,
  Pencil,
  Play,
  Pause,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import {
  AutomationCard,
  CardAction,
} from "../automation/AutomationCard"
import {
  AutomationPanelHeader,
  PanelNewButton,
} from "../automation/AutomationPanelHeader"
import { AlertModal, type NewAlertData } from "../automation/AlertModal"
import type { Alert } from "../automation/alert-types"

const METRIC_FIELDS = [
  { value: "revenue", label: "Revenue" },
  { value: "profit_margin", label: "Profit margin" },
  { value: "orders", label: "Orders" },
  { value: "inventory_units", label: "Inventory units" },
  { value: "avg_order_value", label: "Average order value" },
]

export function AlertsSection() {
  const alerts = useEditor((s) => s.alerts)
  const selectedAlertId = useEditor((s) => s.selectedAlertId)
  const setSelectedAlertId = useEditor((s) => s.setSelectedAlertId)
  const addAlert = useEditor((s) => s.addAlert)
  const updateAlert = useEditor((s) => s.updateAlert)
  const removeAlert = useEditor((s) => s.removeAlert)
  const toggleAlertEnabled = useEditor((s) => s.toggleAlertEnabled)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Alert | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (alert: Alert) => {
    setEditing(alert)
    setModalOpen(true)
  }

  const handleSave = (data: NewAlertData) => {
    if (editing) {
      updateAlert(editing.id, data)
    } else {
      const now = Date.now()
      const next: Alert = {
        id: `a_${Math.random().toString(36).slice(2, 10)}`,
        ...data,
        enabled: true,
        state: "healthy",
        lastCheckedAt: now,
        triggeredCount30d: 0,
        createdAt: now,
        activity: [
          {
            id: `evt_${Math.random().toString(36).slice(2, 8)}`,
            kind: "created",
            message: "Alert created",
            timestamp: now,
          },
        ],
      }
      addAlert(next)
    }
    setModalOpen(false)
    setEditing(null)
  }

  const triggeredCount = alerts.filter((a) => a.state === "triggered").length

  return (
    <>
      <div className="flex flex-col h-full">
        <AutomationPanelHeader
          title="Alerts"
          count={alerts.length}
          icon={Bell}
          action={<PanelNewButton label="New" onClick={openCreate} />}
        />

        {triggeredCount > 0 && (
          <div className="px-3 py-2 border-b border-border bg-danger-subtle/30 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="w-3.5 h-3.5 text-prism-danger shrink-0"
                strokeWidth={2}
              />
              <p className="text-2xs font-medium text-prism-danger">
                {triggeredCount} alert
                {triggeredCount === 1 ? "" : "s"} currently triggered
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {alerts.length === 0 ? (
            <EmptyAlerts onCreate={openCreate} />
          ) : (
            alerts.map((a) => {
              const isActive = a.id === selectedAlertId
              const isTriggered = a.state === "triggered"
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-md transition-all",
                    isActive && "ring-2 ring-accent ring-offset-2 ring-offset-bg"
                  )}
                >
                  <AutomationCard
                    icon={isTriggered ? AlertTriangle : Bell}
                    iconTone={isTriggered ? "danger" : "muted"}
                    title={a.name}
                    badge={
                      isTriggered ? (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-danger-subtle text-prism-danger font-medium shrink-0">
                          Triggered
                        </span>
                      ) : !a.enabled ? (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-bg-hover text-prism-muted font-medium shrink-0">
                          Disabled
                        </span>
                      ) : undefined
                    }
                    meta={
                      <>
                        <span>
                          {a.metricField} {a.operator === "<" ? "<" : a.operator}{" "}
                          <span className="font-mono text-prism-text">
                            {a.thresholdUnit === "percent"
                              ? `${a.threshold}%`
                              : a.threshold.toLocaleString()}
                          </span>
                        </span>
                        <span className="text-border">·</span>
                        <span className="capitalize">
                          {a.channels.join(", ")}
                        </span>
                        {a.recipientEmails.length > 0 && (
                          <>
                            <span className="text-border">·</span>
                            <span>
                              {a.recipientEmails.length}{" "}
                              {a.recipientEmails.length === 1
                                ? "recipient"
                                : "recipients"}
                            </span>
                          </>
                        )}
                      </>
                    }
                    onClick={() =>
                      setSelectedAlertId(isActive ? null : a.id)
                    }
                    actions={
                      <>
                        <CardAction
                          icon={Pencil}
                          label="Edit"
                          onClick={() => openEdit(a)}
                        />
                        <CardAction
                          icon={a.enabled ? Pause : Play}
                          label={a.enabled ? "Disable" : "Enable"}
                          onClick={() => toggleAlertEnabled(a.id)}
                        />
                      </>
                    }
                    destructiveActions={
                      <CardAction
                        icon={Trash2}
                        label="Delete"
                        tone="danger"
                        onClick={() => removeAlert(a.id)}
                      />
                    }
                  />
                </div>
              )
            })
          )}
        </div>
      </div>

      <AlertModal
        open={modalOpen}
        alert={editing}
        metricFields={METRIC_FIELDS}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />
    </>
  )
}

function EmptyAlerts({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
        <Bell className="w-6 h-6 text-prism-accent" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-prism-text-strong mb-1">
        No alerts yet
      </p>
      <p className="text-xs text-prism-muted mb-4 max-w-[220px]">
        Get notified when a metric crosses a threshold.
      </p>
      <button
        onClick={onCreate}
        className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5 cursor-pointer"
      >
        <Bell className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span>New alert</span>
      </button>
    </div>
  )
}