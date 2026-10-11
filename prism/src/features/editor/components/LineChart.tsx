"use client"

import { useMemo, useEffect, useState } from "react"
import ReactECharts from "echarts-for-react"
import { monthlyRevenue } from "../mock-data"
import type { LineChartProps } from "../charts/types/line"
import { defaultLineChartProps } from "../charts/defaults"

export interface LineChartRendererProps {
  config?: LineChartProps
  height?: number
}

function resolveColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  return v || fallback
}

function resolveToken(token: string, fallback: string): string {
  if (!token) return fallback
  const cssVar = token.startsWith("--") ? token : `--${token}`
  return resolveColor(cssVar, fallback)
}

export function LineChart({
  config = defaultLineChartProps,
  height,
}: LineChartRendererProps) {
  const {
    title,
    heading,
    axes,
    legend,
    dataLabels,
    line,
    colors,
    layout,
    animation,
  } = config

  const resolvedHeight = height ?? layout?.desktop?.height ?? 280

  const [themeColors, setThemeColors] = useState({
    text: "#0A0A0C",
    muted: "#52525B",
    border: "#E8E7EC",
    panel: "#FFFFFF",
    palette: ["#7C5CFF", "#4ADE80", "#F59E0B", "#EF4444", "#06B6D4", "#A855F7"],
  })

  useEffect(() => {
    setThemeColors({
      text: resolveColor("--text", "#0A0A0C"),
      muted: resolveColor("--muted", "#52525B"),
      border: resolveColor("--border", "#E8E7EC"),
      panel: resolveColor("--panel", "#FFFFFF"),
      palette: colors.colors.map((c) => resolveToken(c, "#7C5CFF")),
    })
  }, [colors.colors])

  const seriesColor = themeColors.palette[0] ?? "#7C5CFF"
  const labelColor = resolveToken(heading.color, themeColors.text)
  const lineDash =
    line.style === "dashed"
      ? "dashed"
      : line.style === "dotted"
        ? "dotted"
        : "solid"

  const option = useMemo(
    () => ({
      title:
        heading.show && title
          ? {
              text: title,
              textStyle: {
                fontSize: heading.fontSize,
                fontWeight: heading.fontWeight,
                color: labelColor,
              },
              left:
                heading.align === "left"
                  ? 0
                  : heading.align === "center"
                    ? "center"
                    : "right",
              top: 0,
            }
          : undefined,
      grid: {
        top: heading.show && title ? heading.fontSize + 20 : 12,
        left: 8,
        right: 8,
        bottom: 8,
        containLabel: true,
      },
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: themeColors.panel,
        borderColor: themeColors.border,
        textStyle: { fontSize: 11, color: themeColors.text },
      },
      legend: legend.show
        ? {
            show: true,
            bottom: legend.position === "bottom" ? 0 : undefined,
            top: legend.position === "top" ? 0 : undefined,
            icon: legend.iconType,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: legend.fontSize, color: themeColors.muted },
          }
        : { show: false },
      color: themeColors.palette,
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: monthlyRevenue.map((d) => d.month),
        axisLine: {
          show: axes.x.show,
          lineStyle: { color: themeColors.border },
        },
        axisLabel: {
          show: axes.x.show,
          fontSize: 10,
          color: themeColors.muted,
          rotate: axes.x.tickRotation,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        min: axes.y.min,
        max: axes.y.max,
        splitLine: axes.y.showGrid
          ? {
              lineStyle: {
                color: resolveToken(axes.y.gridColor, themeColors.border),
                type: axes.y.gridDash,
              },
            }
          : { show: false },
        axisLabel: {
          show: axes.y.show,
          fontSize: 10,
          color: themeColors.muted,
        },
      },
      series: [
        {
          type: "line",
          smooth: line.smooth,
          data: monthlyRevenue.map((d) => d.revenue),
          lineStyle: {
            color: seriesColor,
            width: line.width,
            type: lineDash,
          },
          itemStyle: { color: seriesColor },
          symbol: line.showPoints ? "circle" : "none",
          symbolSize: line.pointSize,
          areaStyle: line.areaFill
            ? {
                opacity: line.areaOpacity,
                color: line.areaGradient
                  ? {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: seriesColor },
                        { offset: 1, color: "rgba(0,0,0,0)" },
                      ],
                    }
                  : seriesColor,
              }
            : undefined,
          label: dataLabels.show
            ? {
                show: true,
                position: dataLabels.position,
                color: resolveToken(dataLabels.color, themeColors.muted),
                fontSize: dataLabels.fontSize,
                rotate: dataLabels.rotate,
              }
            : { show: false },
        },
      ],
      animation: animation.enabled,
      animationDuration: animation.duration,
    }),
    [
      title,
      heading,
      axes,
      legend,
      dataLabels,
      line,
      themeColors,
      labelColor,
      animation,
    ]
  )

  return (
    <ReactECharts
      option={option}
      style={{ height: resolvedHeight, width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
      opts={{ renderer: "canvas" }}
    />
  )
}