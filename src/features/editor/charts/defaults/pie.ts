import type { PieChartProps, PieStyleConfig } from "../types/pie"
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
import { defaultDataLabels, defaultLegend } from "./line"

export const defaultPieStyle: PieStyleConfig = {
  innerRadius: 0,
  outerRadius: 80,
  startAngle: 90,
  labelPosition: "outside",
  showPercent: true,
  showValue: false,
}

export const defaultPieChartProps: PieChartProps = {
  title: "Pie Chart",
  data: {
    datasetId: "",
    dimensions: [],
    metrics: [],
    filters: [],
    sort: [],
  },
  appearance: defaultAppearance,
  heading: defaultHeading,
  legend: defaultLegend,
  dataLabels: defaultDataLabels,
  pie: defaultPieStyle,
  colors: defaultColors,
  chartArea: defaultChartArea,
  layout: defaultLayout,
  responsive: defaultResponsive,
  interactions: defaultInteractions,
  animation: defaultAnimation,
  accessibility: defaultAccessibility,
}