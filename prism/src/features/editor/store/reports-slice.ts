import type { StateCreator } from "zustand"
import type { ActivityEntry, Report } from "../automation/report-types"

export interface ReportsSlice {
  reports: Report[]
  selectedReportId: string | null

  setSelectedReportId: (id: string | null) => void
  addReport: (report: Report) => void
  updateReport: (id: string, patch: Partial<Report>) => void
  removeReport: (id: string) => void
  duplicateReportSettings: (id: string) => Report | null
  rerunReport: (id: string) => void
  resendReport: (id: string) => void
  addRecipient: (id: string, email: string) => void
  removeRecipient: (id: string, email: string) => void
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

export const createReportsSlice: StateCreator<
  ReportsSlice,
  [],
  [],
  ReportsSlice
> = (set, get) => ({
  reports: [],
  selectedReportId: null,

  setSelectedReportId: (id) => set({ selectedReportId: id }),

  addReport: (report) =>
    set((state) => ({ reports: [report, ...state.reports] })),

  updateReport: (id, patch) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    })),

  removeReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
      selectedReportId:
        state.selectedReportId === id ? null : state.selectedReportId,
    })),

  duplicateReportSettings: (id) => {
    const original = get().reports.find((r) => r.id === id)
    if (!original) return null
    return {
      ...original,
      id: `r_${Math.random().toString(36).slice(2, 10)}`,
      name: `${original.name} (copy)`,
      createdAt: Date.now(),
      lastSentAt: undefined,
      status: "sent",
      activity: [],
    }
  },

  rerunReport: (id) => {
    const report = get().reports.find((r) => r.id === id)
    if (!report) return
    // Simulate regeneration
    const entry = makeActivity(
      "generated",
      report.format === "PDF" ? "PDF regenerated" : "CSV regenerated"
    )
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "sent",
              activity: [...r.activity, entry],
            }
          : r
      ),
    }))
  },

  resendReport: (id) => {
    const report = get().reports.find((r) => r.id === id)
    if (!report) return
    const entry = makeActivity(
      "sent",
      `Sent to ${report.recipientEmails.length} recipient${
        report.recipientEmails.length === 1 ? "" : "s"
      }`
    )
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "sent",
              lastSentAt: Date.now(),
              activity: [...r.activity, entry],
            }
          : r
      ),
    }))
  },

  addRecipient: (id, email) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    set((state) => ({
      reports: state.reports.map((r) => {
        if (r.id !== id) return r
        if (r.recipientEmails.includes(trimmed)) return r
        return {
          ...r,
          recipientEmails: [...r.recipientEmails, trimmed],
          activity: [
            ...r.activity,
            makeActivity("recipient-added", `Added ${trimmed}`),
          ],
        }
      }),
    }))
  },

  removeRecipient: (id, email) => {
    set((state) => ({
      reports: state.reports.map((r) => {
        if (r.id !== id) return r
        return {
          ...r,
          recipientEmails: r.recipientEmails.filter((e) => e !== email),
          activity: [
            ...r.activity,
            makeActivity("recipient-removed", `Removed ${email}`),
          ],
        }
      }),
    }))
  },
})