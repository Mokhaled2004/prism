import type { AreaChartProps, AreaStyleConfig } from "../types/area"
import { defaultLineChartProps } from "./line"

export const defaultAreaStyle: AreaStyleConfig = {
  ...defaultLineChartProps.line,
  areaFill: true,
  areaOpacity: 0.35,
  fillOpacity: 0.35,
  showStroke: true,
}

export const defaultAreaChartProps: AreaChartProps = {
  ...defaultLineChartProps,
  title: "Area Chart",
  line: defaultAreaStyle,
}