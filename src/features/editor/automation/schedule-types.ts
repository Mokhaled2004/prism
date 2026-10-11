import type { ActivityEntry } from "./report-types"

export type ScheduleFrequency = "daily" | "weekly" | "monthly"

export interface Schedule {
  id: string
  name: string
  description?: string

  /** When set, this schedule was created from an existing report */
  scheduledFromReportId?: string

  // When
  frequency: ScheduleFrequency
  /** "HH:MM" 24-hour format */
  time: string
  /** 0 = Sunday, 1 = Monday, ... for weekly */
  dayOfWeek?: number
  /** 1-31 for monthly */
  dayOfMonth?: number

  // What
  format: "PDF" | "CSV"
  sectionIds: string[]
  sectionCountAtCreation: number

  // Who
  recipientEmails: string[]

  // Format options
  pageSize?: "A4" | "Letter" | "Legal"
  orientation?: "portrait" | "landscape"
  quality?: "standard" | "high"
  includeCoverPage?: boolean
  csvDelimiter?: "," | ";" | "\t"
  csvIncludeHeaders?: boolean

  // State
  enabled: boolean
  lastRunAt?: number
  nextRunAt: number
  createdAt: number
  activity: ActivityEntry[]
}

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const MONTH_ORDINALS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
  "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th",
  "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th",
  "29th", "30th", "31st",
]