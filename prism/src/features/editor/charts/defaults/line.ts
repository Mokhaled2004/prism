import type { LineChartProps, LineStyleConfig } from "../types/line"
import type { AxesConfig, AxisConfig, DataLabelsConfig, LegendConfig } from "../types/axes"
import type { NumberFormat } from "../types/common"
import {
  defaultAccessibility,
  defaultAnimation,
  defaultAppearance,
  defaultChartArea,
  defaultColors,
  defaultHeading,
  defaultInteractions,
  defaultLayout,
  defaultResponsive,
} from "./common"

const defaultNumberFormat: NumberFormat = {
  type: "number",
  decimals: 0,
  thousandsSeparator: true,
  compactNotation: false,
}

const defaultAxis: AxisConfig = {
  show: true,
  type: "category",
  showLabel: true,
  showGrid: true,
  gridColor: "border",
  gridDash: "dashed",
  tickRotation: 0,
  tickCount: 5,
  format: defaultNumberFormat,
}

export const defaultAxes: AxesConfig = {
  x: { ...defaultAxis, type: "category" },
  y: { ...defaultAxis, type: "linear" },
}

export const defaultLegend: LegendConfig = {
  show: false,
  position: "bottom",
  align: "center",
  orientation: "horizontal",
  iconType: "circle",
  fontSize: 11,
}

export const defaultDataLabels: DataLabelsConfig = {
  show: false,
  format: defaultNumberFormat,
  position: "top",
  rotate: 0,
  color: "muted",
  fontSize: 10,
}

export const defaultLineStyle: LineStyleConfig = {
  smooth: true,
  width: 2,
  style: "solid",
  showPoints: false,
  pointSize: 6,
  areaFill: false,
  areaOpacity: 0.2,
  areaGradient: true,
  stack: "none",
}

export const defaultLineChartProps: LineChartProps = {
  title: "Monthly Revenue",
  data: {
    datasetId: "",
    dimensions: [],
    metrics: [],
    filters: [],
    sort: [],
  },
  appearance: defaultAppearance,
  heading: defaultHeading,
  axes: defaultAxes,
  legend: defaultLegend,
  dataLabels: defaultDataLabels,
  line: defaultLineStyle,
  colors: defaultColors,
  chartArea: defaultChartArea,
  layout: defaultLayout,
  responsive: defaultResponsive,
  interactions: defaultInteractions,
  animation: defaultAnimation,
  accessibility: defaultAccessibility,
}