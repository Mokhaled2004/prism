import type { NumberFormat } from "../types/common"

const DEFAULT_FORMAT: NumberFormat = {
  type: "number",
  decimals: 0,
  thousandsSeparator: true,
  compactNotation: false,
}

export function formatNumber(
  value: number | null | undefined,
  format: Partial<NumberFormat> = {}
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"

  const f: NumberFormat = { ...DEFAULT_FORMAT, ...format }
  const abs = Math.abs(value)

  // Compact notation (1.24M, 42.8K)
  if (f.compactNotation) {
    const sign = value < 0 ? "-" : ""
    if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(f.decimals)}B`
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(f.decimals)}M`
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(f.decimals)}K`
    return `${sign}${abs.toFixed(f.decimals)}`
  }

  // Currency
  if (f.type === "currency") {
    const symbol = f.currencySymbol ?? "$"
    const formatted = abs.toLocaleString("en-US", {
      minimumFractionDigits: f.decimals,
      maximumFractionDigits: f.decimals,
      useGrouping: f.thousandsSeparator,
    })
    return `${value < 0 ? "-" : ""}${symbol}${formatted}`
  }

  // Percent
  if (f.type === "percent") {
    const pct = abs.toFixed(f.decimals)
    return `${value < 0 ? "-" : ""}${pct}%`
  }

  // Plain number with optional thousands separator
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: f.decimals,
    maximumFractionDigits: f.decimals,
    useGrouping: f.thousandsSeparator,
  })

  const prefix = f.prefix ?? ""
  const suffix = f.suffix ?? ""
  return `${value < 0 ? "-" : ""}${prefix}${formatted}${suffix}`
}