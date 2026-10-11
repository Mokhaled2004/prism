export interface ActivityEntry {
  id: string
  kind: "created" | "generated" | "sent" | "failed" | "updated" | "recipient-added" | "recipient-removed"
  message: string
  timestamp: number
}

export interface Report {
  id: string
  name: string
  description?: string
  format: "PDF" | "CSV"
  recipientEmails: string[]
  /** IDs of the dashboard sections to include. Empty array = include ALL sections. */
  sectionIds: string[]
  createdAt: number
  /** Snapshot of how many sections existed when the report was made */
  sectionCountAtCreation: number
  status: "sent" | "failed" | "scheduled"

  // ── Format options
  pageSize?: "A4" | "Letter" | "Legal"
  orientation?: "portrait" | "landscape"
  quality?: "standard" | "high"
  includeCoverPage?: boolean
  csvDelimiter?: "," | ";" | "\t"
  csvIncludeHeaders?: boolean

  // ── Delivery
  lastSentAt?: number
  nextScheduledAt?: number

  // ── Activity
  activity: ActivityEntry[]
}