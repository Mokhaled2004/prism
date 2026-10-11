import type { ColorValue, DateFormat, NumberFormat } from "./common"

export type AxisType = "category" | "time" | "linear" | "log"

export interface AxisConfig {
  show: boolean
  type: AxisType
  label?: string
  showLabel: boolean
  showGrid: boolean
  gridColor: ColorValue
  gridDash: "solid" | "dashed" | "dotted"
  tickRotation: number
  /** Number axis only */
  min?: number
  max?: number
  /** Number of ticks on the axis */
  tickCount: number
  format: NumberFormat | DateFormat
}

export interface AxesConfig {
  x: AxisConfig
  y: AxisConfig
}

/* ── Legend ─────────────────────────────────────────────────── */

export interface LegendConfig {
  show: boolean
  position: "top" | "right" | "bottom" | "left"
  align: "start" | "center" | "end"
  orientation: "horizontal" | "vertical"
  iconType: "circle" | "rect" | "roundRect"
  fontSize: number
}

/* ── Data labels ───────────────────────────────────────────── */

export interface DataLabelsConfig {
  show: boolean
  format: import("./common").NumberFormat
  position: "top" | "center" | "inside" | "outside"
  rotate: number
  color: ColorValue
  fontSize: number
}