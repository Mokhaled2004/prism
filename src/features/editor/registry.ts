import type { ComponentType } from "react"
import { BarChart } from "./components/BarChart"
import { LineChart } from "./components/LineChart"
import { AreaChart } from "./components/AreaChart"
import { PieChart } from "./components/PieChart"
import { Heading } from "./components/Heading"
import { Text } from "./components/Text"
import {
  defaultBarChartProps,
  defaultLineChartProps,
  defaultAreaChartProps,
  defaultPieChartProps,
} from "./charts/defaults"

export interface RegistryEntry {
  render: ComponentType<{ config?: any; height?: number }>
  defaultConfig: Record<string, unknown>
}

export const componentRegistry: Record<string, RegistryEntry> = {
  BarChart: {
    render: BarChart,
    defaultConfig: defaultBarChartProps as unknown as Record<string, unknown>,
  },
  LineChart: {
    render: LineChart,
    defaultConfig: defaultLineChartProps as unknown as Record<string, unknown>,
  },
  AreaChart: {
    render: AreaChart,
    defaultConfig: defaultAreaChartProps as unknown as Record<string, unknown>,
  },
  PieChart: {
    render: PieChart,
    defaultConfig: defaultPieChartProps as unknown as Record<string, unknown>,
  },
  Heading: {
    render: Heading,
    defaultConfig: { text: "Heading", level: 2 },
  },
  Text: {
    render: Text,
    defaultConfig: { text: "Add a description or note here." },
  },
}