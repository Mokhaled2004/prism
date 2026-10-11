import type {
  AppearanceConfig,
  AccessibilityConfig,
  ChartAreaConfig,
  ColorPaletteConfig,
  HeadingConfig,
  LayoutConfig,
  ResponsiveConfig,
} from "./common"
import type { QuerySpec } from "./data"
import type { AnimationConfig } from "./animation"
import type { InteractionConfig } from "./interactions"
import type { AxesConfig, DataLabelsConfig, LegendConfig } from "./axes"

export interface LineStyleConfig {
  smooth: boolean
  width: number
  style: "solid" | "dashed" | "dotted"
  showPoints: boolean
  pointSize: number
  areaFill: boolean
  areaOpacity: number
  areaGradient: boolean
  /** "linear" or a stack id for area charts */
  stack?: "none" | "normal" | "percent"
}

export interface LineChartProps {
  // Meta
  title?: string
  subtitle?: string
  description?: string

  // Data
  data: QuerySpec

  // Config
  appearance: AppearanceConfig
  heading: HeadingConfig
  axes: AxesConfig
  legend: LegendConfig
  dataLabels: DataLabelsConfig
  line: LineStyleConfig
  colors: ColorPaletteConfig
  chartArea: ChartAreaConfig
  layout: LayoutConfig
  responsive: ResponsiveConfig
  interactions: InteractionConfig
  animation: AnimationConfig
  accessibility: AccessibilityConfig
}