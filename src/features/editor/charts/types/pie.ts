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
import type { DataLabelsConfig, LegendConfig } from "./axes"

export interface PieStyleConfig {
  /** Inner radius as % of outer (0 = pie, 60 = donut) */
  innerRadius: number
  /** Outer radius as % of container */
  outerRadius: number
  startAngle: number
  labelPosition: "outside" | "inside" | "none"
  showPercent: boolean
  showValue: boolean
}

export interface PieChartProps {
  title?: string
  subtitle?: string
  description?: string

  data: QuerySpec

  appearance: AppearanceConfig
  heading: HeadingConfig
  legend: LegendConfig
  dataLabels: DataLabelsConfig
  pie: PieStyleConfig
  colors: ColorPaletteConfig
  chartArea: ChartAreaConfig
  layout: LayoutConfig
  responsive: ResponsiveConfig
  interactions: InteractionConfig
  animation: AnimationConfig
  accessibility: AccessibilityConfig
}