/* ─────────────────────────────────────────────────────────────
   Shared primitives used across every chart config.
   ───────────────────────────────────────────────────────────── */

/**
 * A color value is either:
 *  - a raw hex string ("#7C5CFF", "#7C5CFF80")
 *  - a theme token name that resolves against the current theme
 *    (see `resolveToken.ts` for the full list)
 */
export type ColorValue = string

/**
 * Every chart accepts a palette. Tokens and hex can mix freely.
 */
export interface ColorPaletteConfig {
  colors: ColorValue[]
  useThemePalette: boolean
  /** Optional per-series override, keyed by field name */
  perSeries?: Record<string, ColorValue>
}

/* ── Number + date formatting ───────────────────────────────── */

export type NumberFormatType =
  | "number"
  | "currency"
  | "percent"
  | "compact"
  | "custom"

export interface NumberFormat {
  type: NumberFormatType
  decimals: number
  thousandsSeparator: boolean
  /** Only used when type === "currency" */
  currencySymbol?: string
  /** 1.24M instead of 1,240,000 */
  compactNotation: boolean
  prefix?: string
  suffix?: string
}

export type DateFormatType =
  | "auto"
  | "day"
  | "month"
  | "quarter"
  | "year"
  | "custom"

export interface DateFormat {
  type: DateFormatType
  /** Only used when type === "custom", e.g. "MMM YYYY" */
  pattern?: string
}

/* ── Appearance primitives ──────────────────────────────────── */

export interface BorderConfig {
  show: boolean
  width: number
  style: "solid" | "dashed" | "dotted"
  color: ColorValue
  radius: number
}

export type ShadowSize = "none" | "sm" | "md" | "lg"

export interface AppearanceConfig {
  background: ColorValue
  border: BorderConfig
  padding: number
  shadow: ShadowSize
  opacity: number
}

/* ── Heading / title block ──────────────────────────────────── */

export interface HeadingConfig {
  show: boolean
  fontSize: number
  fontWeight: 400 | 500 | 600 | 700
  color: ColorValue
  align: "left" | "center" | "right"
  /** Small metadata line below the title (e.g. "Last 30 days") */
  showSubtitle: boolean
  subtitleFontSize: number
  subtitleColor: ColorValue
}

/* ── Layout (grid units + pixel height) ─────────────────────── */

export interface LayoutBreakpoint {
  /** Grid columns out of 12 */
  width: number
  /** Pixel height */
  height: number
}

export interface LayoutConfig {
  desktop: LayoutBreakpoint
  tablet: LayoutBreakpoint
  mobile: LayoutBreakpoint
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

export interface ResponsiveConfig {
  hideOnMobile: boolean
  hideOnTablet: boolean
  hideOnDesktop: boolean
  /** Percentage scaling on mobile, 100 = no scale */
  mobileScale: number
}

/* ── Accessibility ──────────────────────────────────────────── */

export interface AccessibilityConfig {
  ariaLabel?: string
  /** Alt text or fallback summary for screen readers */
  fallbackText?: string
}

/* ── Chart canvas padding ──────────────────────────────────── */

export interface ChartAreaConfig {
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  aspectRatio: "auto" | "16:9" | "4:3" | "1:1"
}