import type { DateFormat } from "../types/common"

const DEFAULT_PATTERN = "MMM D"

export function formatDate(
  value: Date | string | number | null | undefined,
  format: Partial<DateFormat> = {}
): string {
  if (value === null || value === undefined) return "—"

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  const type = format.type ?? "auto"
  const pattern = format.pattern ?? DEFAULT_PATTERN

  if (type === "day") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  if (type === "month") return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  if (type === "quarter") {
    const q = Math.floor(date.getMonth() / 3) + 1
    return `Q${q} ${date.getFullYear()}`
  }
  if (type === "year") return String(date.getFullYear())

  // "auto" or "custom" — for now, treat both as a simple pattern
  // (full pattern parsing comes later; this is enough for MVP)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}