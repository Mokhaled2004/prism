import type { Schedule } from "./schedule-types"

function hoursAgo(h: number): number {
  return Date.now() - 1000 * 60 * 60 * h
}

function hoursFromNow(h: number): number {
  return Date.now() + 1000 * 60 * 60 * h
}

export const initialSchedules: Schedule[] = [
  {
    id: "s1",
    name: "Weekly to Sales Team",
    description: "Monday morning snapshot for the sales leadership team.",
    scheduledFromReportId: "r1",
    frequency: "weekly",
    time: "09:00",
    dayOfWeek: 1,
    format: "PDF",
    sectionIds: [],
    sectionCountAtCreation: 3,
    recipientEmails: ["sarah@acme.com", "omar@acme.com", "team@acme.com"],
    pageSize: "A4",
    orientation: "portrait",
    quality: "high",
    includeCoverPage: true,
    enabled: true,
    lastRunAt: hoursAgo(24 * 6),
    nextRunAt: hoursFromNow(24 * 1),
    createdAt: hoursAgo(24 * 21),
    activity: [
      {
        id: "act_s1a",
        kind: "sent",
        message: "Sent to 3 recipients",
        timestamp: hoursAgo(24 * 6),
      },
      {
        id: "act_s1b",
        kind: "sent",
        message: "Sent to 3 recipients",
        timestamp: hoursAgo(24 * 13),
      },
      {
        id: "act_s1c",
        kind: "created",
        message: "Schedule created",
        timestamp: hoursAgo(24 * 21),
      },
    ],
  },
  {
    id: "s2",
    name: "Monthly executive PDF",
    description: "First-of-month summary for the C-suite.",
    scheduledFromReportId: "r2",
    frequency: "monthly",
    time: "08:00",
    dayOfMonth: 1,
    format: "PDF",
    sectionIds: [],
    sectionCountAtCreation: 3,
    recipientEmails: ["cfo@acme.com"],
    pageSize: "A4",
    orientation: "landscape",
    quality: "high",
    includeCoverPage: true,
    enabled: true,
    lastRunAt: hoursAgo(24 * 5),
    nextRunAt: hoursFromNow(24 * 25),
    createdAt: hoursAgo(24 * 40),
    activity: [
      {
        id: "act_s2a",
        kind: "sent",
        message: "Sent to 1 recipient",
        timestamp: hoursAgo(24 * 5),
      },
      {
        id: "act_s2b",
        kind: "created",
        message: "Schedule created",
        timestamp: hoursAgo(24 * 40),
      },
    ],
  },
  {
    id: "s3",
    name: "Quarterly data dump",
    description: "Raw CSV export of every metric each quarter.",
    frequency: "monthly",
    time: "18:00",
    dayOfMonth: 15,
    format: "CSV",
    sectionIds: [],
    sectionCountAtCreation: 3,
    recipientEmails: ["ops@acme.com", "data@acme.com"],
    csvDelimiter: ",",
    csvIncludeHeaders: true,
    enabled: false,
    lastRunAt: hoursAgo(24 * 45),
    nextRunAt: hoursFromNow(24 * 15),
    createdAt: hoursAgo(24 * 60),
    activity: [
      {
        id: "act_s3a",
        kind: "sent",
        message: "Sent to 2 recipients",
        timestamp: hoursAgo(24 * 45),
      },
      {
        id: "act_s3b",
        kind: "updated",
        message: "Paused",
        timestamp: hoursAgo(24 * 10),
      },
      {
        id: "act_s3c",
        kind: "created",
        message: "Schedule created",
        timestamp: hoursAgo(24 * 60),
      },
    ],
  },
]