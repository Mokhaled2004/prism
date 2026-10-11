import type { StateCreator } from "zustand"
import type { Alert, AlertTriggerEvent } from "../automation/alert-types"

export interface AlertsSlice {
  alerts: Alert[]
  selectedAlertId: string | null

  setSelectedAlertId: (id: string | null) => void
  addAlert: (alert: Alert) => void
  updateAlert: (id: string, patch: Partial<Alert>) => void
  removeAlert: (id: string) => void
  toggleAlertEnabled: (id: string) => void
  triggerAlert: (id: string, metricValue: number) => void
  resolveAlert: (id: string) => void
  snoozeAlert: (id: string, hours: number) => void
  unsnoozeAlert: (id: string) => void
  addAlertRecipient: (id: string, email: string) => void
  removeAlertRecipient: (id: string, email: string) => void
}

function genEventId(): string {
  return `evt_${Math.random().toString(36).slice(2, 8)}`
}

function makeEvent(
  kind: AlertTriggerEvent["kind"],
  message: string,
  metricValue?: number,
  threshold?: number
): AlertTriggerEvent {
  return {
    id: genEventId(),
    kind,
    message,
    metricValue,
    threshold,
    timestamp: Date.now(),
  }
}

export const createAlertsSlice: StateCreator<
  AlertsSlice,
  [],
  [],
  AlertsSlice
> = (set, get) => ({
  alerts: [],
  selectedAlertId: null,

  setSelectedAlertId: (id) => set({ selectedAlertId: id }),

  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),

  updateAlert: (id, patch) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
      selectedAlertId:
        state.selectedAlertId === id ? null : state.selectedAlertId,
    })),

  toggleAlertEnabled: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        const nowEnabled = !a.enabled
        return {
          ...a,
          enabled: nowEnabled,
          state: nowEnabled ? "healthy" : "muted",
          activity: [
            ...a.activity,
            makeEvent(
              nowEnabled ? "unsnoozed" : "snoozed",
              nowEnabled ? "Alert enabled" : "Alert disabled"
            ),
          ],
        }
      }),
    }))
  },

  triggerAlert: (id, metricValue) => {
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        return {
          ...a,
          state: "triggered",
          lastTriggeredAt: Date.now(),
          lastCheckedAt: Date.now(),
          triggeredCount30d: a.triggeredCount30d + 1,
          activity: [
            ...a.activity,
            makeEvent(
              "triggered",
              `${a.metricField} crossed threshold`,
              metricValue,
              a.threshold
            ),
          ],
        }
      }),
    }))
  },

  resolveAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        return {
          ...a,
          state: "healthy",
          lastCheckedAt: Date.now(),
          activity: [
            ...a.activity,
            makeEvent("resolved", "Alert resolved"),
          ],
        }
      }),
    }))
  },

  snoozeAlert: (id, hours) => {
    const until = Date.now() + hours * 60 * 60 * 1000
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        return {
          ...a,
          state: "snoozed",
          snoozedUntil: until,
          activity: [
            ...a.activity,
            makeEvent("snoozed", `Snoozed for ${hours} hour${hours === 1 ? "" : "s"}`),
          ],
        }
      }),
    }))
  },

  unsnoozeAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        return {
          ...a,
          state: "healthy",
          snoozedUntil: undefined,
          activity: [
            ...a.activity,
            makeEvent("unsnoozed", "Snooze lifted"),
          ],
        }
      }),
    }))
  },

  addAlertRecipient: (id, email) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        if (a.recipientEmails.includes(trimmed)) return a
        return {
          ...a,
          recipientEmails: [...a.recipientEmails, trimmed],
        }
      }),
    }))
  },

  removeAlertRecipient: (id, email) => {
    set((state) => ({
      alerts: state.alerts.map((a) => {
        if (a.id !== id) return a
        return {
          ...a,
          recipientEmails: a.recipientEmails.filter((e) => e !== email),
        }
      }),
    }))
  },
})