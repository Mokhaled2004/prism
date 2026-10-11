"use client"

import { LineChart } from "./LineChart"
import type { AreaChartProps } from "../charts/types/area"
import { defaultAreaChartProps } from "../charts/defaults"

export interface AreaChartRendererProps {
  config?: AreaChartProps
  height?: number
}

export function AreaChart({
  config = defaultAreaChartProps,
  height,
}: AreaChartRendererProps) {
  const lineConfig = {
    ...config,
    line: {
      ...config.line,
      areaFill: true,
      areaOpacity: config.line.fillOpacity ?? config.line.areaOpacity,
    },
  } as any
  return <LineChart config={lineConfig} height={height} />
}