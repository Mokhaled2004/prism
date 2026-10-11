import type { LineChartProps, LineStyleConfig } from "./line"

export interface AreaStyleConfig extends LineStyleConfig {
  /** Area fill opacity — overrides line.areaOpacity */
  fillOpacity: number
  /** Whether to draw line on top of area */
  showStroke: boolean
}

export interface AreaChartProps extends Omit<LineChartProps, "line"> {
  line: AreaStyleConfig
}