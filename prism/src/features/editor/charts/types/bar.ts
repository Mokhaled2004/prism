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

export interface BarStyleConfig {
  orientation: "vertical" | "horizontal"
  stacking: "none" | "normal" | "percent"
  /** Percentage of category width, e.g. 60 = 60% */
  width: number
  /** Corner radius in px */
  radius: number
  /** Optional inner gap between stacked segments, in px */
  gap: number
}

export interface BarChartProps {
  title?: string
  subtitle?: string
  description?: string

  data: QuerySpec

  appearance: AppearanceConfig
  heading: HeadingConfig
  axes: AxesConfig
  legend: LegendConfig
  dataLabels: DataLabelsConfig
  bar: BarStyleConfig
  colors: ColorPaletteConfig
  chartArea: ChartAreaConfig
  layout: LayoutConfig
  responsive: ResponsiveConfig
  interactions: InteractionConfig
  animation: AnimationConfig
  accessibility: AccessibilityConfig
}