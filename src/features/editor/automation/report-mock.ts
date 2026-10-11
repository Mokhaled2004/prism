import type { Report, ActivityEntry } from "./report-types"

function ago(hours: number): number {
  return Date.now() - 1000 * 60 * 60 * hours
}

function makeActivity(
  createdAt: number,
  kind: "sent" | "failed"
): ActivityEntry[] {
  const base = createdAt
  return [
    {
      id: `act_${Math.random().toString(36).slice(2, 8)}`,
      kind: "created",
      message: "Report created",
      timestamp: base,
    },
    {
      id: `act_${Math.random().toString(36).slice(2, 8)}`,
      kind: "generated",
      message: "PDF generated",
      timestamp: base + 30000,
    },
    {
      id: `act_${Math.random().toString(36).slice(2, 8)}`,
      kind: kind,
      message:
        kind === "sent"
          ? "Sent to recipients"
          : "Send failed — mail server rejected 2 recipients",
      timestamp: base + 45000,
    },
  ]
}

export const initialReports: Report[] = [
  {
    id: "r1",
    name: "Weekly Sales Report",
    description: "Weekly snapshot for the sales leadership team.",
    format: "PDF",
    recipientEmails: ["sarah@acme.com", "omar@acme.com", "team@acme.com"],
    sectionIds: [],
    createdAt: ago(2),
    sectionCountAtCreation: 3,
    status: "sent",
    pageSize: "A4",
    orientation: "portrait",
    quality: "high",
    includeCoverPage: true,
    lastSentAt: ago(2),
    activity: makeActivity(ago(2), "sent"),
  },
  {
    id: "r2",
    name: "Monthly Executive Summary",
    description: "High-level monthly metrics for the C-suite.",
    format: "PDF",
    recipientEmails: ["cfo@acme.com"],
    sectionIds: [],
    createdAt: ago(24),
    sectionCountAtCreation: 3,
    status: "sent",
    pageSize: "A4",
    orientation: "landscape",
    quality: "high",
    includeCoverPage: true,
    lastSentAt: ago(24),
    activity: makeActivity(ago(24), "sent"),
  },
  {
    id: "r3",
    name: "Distributor Breakdown",
    description: "Detailed CSV export of distributor performance.",
    format: "CSV",
    recipientEmails: [
      "ops@acme.com",
      "logistics@acme.com",
      "wh@acme.com",
      "sales@acme.com",
      "pm@acme.com",
    ],
    sectionIds: [],
    createdAt: ago(24 * 3),
    sectionCountAtCreation: 2,
    status: "failed",
    csvDelimiter: ",",
    csvIncludeHeaders: true,
    lastSentAt: ago(24 * 3),
    activity: makeActivity(ago(24 * 3), "failed"),
  },
  {
    id: "r4",
    name: "Q4 Forecast",
    description: "Projected Q4 revenue and units.",
    format: "PDF",
    recipientEmails: ["finance@acme.com", "ceo@acme.com"],
    sectionIds: [],
    createdAt: ago(24 * 7),
    sectionCountAtCreation: 3,
    status: "sent",
    pageSize: "Letter",
    orientation: "portrait",
    quality: "standard",
    includeCoverPage: false,
    lastSentAt: ago(24 * 7),
    activity: makeActivity(ago(24 * 7), "sent"),
  },
]