import type { BarChartProps, BarStyleConfig } from "../types/bar"
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
import { defaultAxes, defaultDataLabels, defaultLegend } from "./line"

export const defaultBarStyle: BarStyleConfig = {
  orientation: "vertical",
  stacking: "none",
  width: 60,
  radius: 4,
  gap: 2,
}

export const defaultBarChartProps: BarChartProps = {
  title: "Bar Chart",
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
  bar: defaultBarStyle,
  colors: defaultColors,
  chartArea: defaultChartArea,
  layout: defaultLayout,
  responsive: defaultResponsive,
  interactions: defaultInteractions,
  animation: defaultAnimation,
  accessibility: defaultAccessibility,
}