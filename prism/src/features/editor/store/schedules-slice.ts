import type { StateCreator } from "zustand"
import type { ActivityEntry } from "../automation/report-types"
import type { Schedule } from "../automation/schedule-types"

export interface SchedulesSlice {
  schedules: Schedule[]
  selectedScheduleId: string | null

  setSelectedScheduleId: (id: string | null) => void
  addSchedule: (schedule: Schedule) => void
  updateSchedule: (id: string, patch: Partial<Schedule>) => void
  removeSchedule: (id: string) => void
  toggleSchedule: (id: string) => void
  runScheduleNow: (id: string) => void
  addScheduleRecipient: (id: string, email: string) => void
  removeScheduleRecipient: (id: string, email: string) => void
}

function genActivityId(): string {
  return `act_${Math.random().toString(36).slice(2, 8)}`
}

function makeActivity(
  kind: ActivityEntry["kind"],
  message: string
): ActivityEntry {
  return {
    id: genActivityId(),
    kind,
    message,
    timestamp: Date.now(),
  }
}

export const createSchedulesSlice: StateCreator<
  SchedulesSlice,
  [],
  [],
  SchedulesSlice
> = (set, get) => ({
  schedules: [],
  selectedScheduleId: null,

  setSelectedScheduleId: (id) => set({ selectedScheduleId: id }),

  addSchedule: (schedule) =>
    set((state) => ({ schedules: [schedule, ...state.schedules] })),

  updateSchedule: (id, patch) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    })),

  removeSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
      selectedScheduleId:
        state.selectedScheduleId === id ? null : state.selectedScheduleId,
    })),

  toggleSchedule: (id) => {
    const schedule = get().schedules.find((s) => s.id === id)
    if (!schedule) return
    const nowEnabled = !schedule.enabled
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              enabled: nowEnabled,
              activity: [
                ...s.activity,
                makeActivity("updated", nowEnabled ? "Resumed" : "Paused"),
              ],
            }
          : s
      ),
    }))
  },

  runScheduleNow: (id) => {
    const schedule = get().schedules.find((s) => s.id === id)
    if (!schedule) return
    const entry = makeActivity(
      "sent",
      `Sent to ${schedule.recipientEmails.length} recipient${
        schedule.recipientEmails.length === 1 ? "" : "s"
      }`
    )
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              lastRunAt: Date.now(),
              activity: [...s.activity, entry],
            }
          : s
      ),
    }))
  },

  addScheduleRecipient: (id, email) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    set((state) => ({
      schedules: state.schedules.map((s) => {
        if (s.id !== id) return s
        if (s.recipientEmails.includes(trimmed)) return s
        return {
          ...s,
          recipientEmails: [...s.recipientEmails, trimmed],
          activity: [
            ...s.activity,
            makeActivity("recipient-added", `Added ${trimmed}`),
          ],
        }
      }),
    }))
  },

  removeScheduleRecipient: (id, email) => {
    set((state) => ({
      schedules: state.schedules.map((s) => {
        if (s.id !== id) return s
        return {
          ...s,
          recipientEmails: s.recipientEmails.filter((e) => e !== email),
          activity: [
            ...s.activity,
            makeActivity("recipient-removed", `Removed ${email}`),
          ],
        }
      }),
    }))
  },
})