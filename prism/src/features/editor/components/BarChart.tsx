"use client"

import { useMemo, useEffect, useState } from "react"
import ReactECharts from "echarts-for-react"
import { topProducts } from "../mock-data"
import type { BarChartProps } from "../charts/types/bar"
import { defaultBarChartProps } from "../charts/defaults"

export interface BarChartRendererProps {
  config?: BarChartProps
  height?: number
}

function resolveColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  return value || fallback
}

function resolveToken(token: string, fallback: string): string {
  if (!token) return fallback
  const cssVar = token.startsWith("--") ? token : `--${token}`
  return resolveColor(cssVar, fallback)
}

export function BarChart({
  config = defaultBarChartProps,
  height,
}: BarChartRendererProps) {
  const {
    title,
    heading,
    axes,
    legend,
    dataLabels,
    bar,
    colors,
    layout,
    animation,
  } = config

  const resolvedHeight = height ?? layout?.desktop?.height ?? 280

  const [themeColors, setThemeColors] = useState({
    text: "#0A0A0C",
    textStrong: "#000000",
    muted: "#52525B",
    border: "#E8E7EC",
    panel: "#FFFFFF",
    palette: ["#7C5CFF", "#4ADE80", "#F59E0B", "#EF4444", "#06B6D4", "#A855F7"],
  })

  useEffect(() => {
    setThemeColors({
      text: resolveColor("--text", "#0A0A0C"),
      textStrong: resolveColor("--text-strong", "#000000"),
      muted: resolveColor("--muted", "#52525B"),
      border: resolveColor("--border", "#E8E7EC"),
      panel: resolveColor("--panel", "#FFFFFF"),
      palette: colors.colors.map((c) => resolveToken(c, "#7C5CFF")),
    })
  }, [colors.colors])

  const isHorizontal = bar.orientation === "horizontal"
  const seriesColor = themeColors.palette[0] ?? "#7C5CFF"
  const labelColor = resolveToken(heading.color, themeColors.textStrong)

  const option = useMemo(() => {
    const categories = topProducts.map((d) => d.product)
    const values = topProducts.map((d) => d.revenue)

    const valueAxis = {
      type: "value" as const,
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
    }

    const categoryAxis = {
      type: "category" as const,
      data: categories,
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
    }

    return {
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
        axisPointer: { type: "shadow" },
        backgroundColor: themeColors.panel,
        borderColor: themeColors.border,
        textStyle: { fontSize: 11, color: themeColors.text },
      },
      legend: legend.show
        ? {
            show: true,
            top: legend.position === "top" ? 0 : undefined,
            bottom: legend.position === "bottom" ? 0 : undefined,
            left:
              legend.position === "left"
                ? 0
                : legend.position === "right"
                  ? undefined
                  : legend.align === "start"
                    ? 0
                    : legend.align === "end"
                      ? "right"
                      : "center",
            right: legend.position === "right" ? 0 : undefined,
            orient:
              legend.position === "left" || legend.position === "right"
                ? "vertical"
                : "horizontal",
            icon: legend.iconType,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: legend.fontSize, color: themeColors.muted },
          }
        : { show: false },
      color: themeColors.palette,
      xAxis: isHorizontal ? valueAxis : categoryAxis,
      yAxis: isHorizontal ? categoryAxis : valueAxis,
      series: [
        {
          type: "bar",
          data: values,
          stack: bar.stacking !== "none" ? "total" : undefined,
          itemStyle: {
            color: seriesColor,
            borderRadius: isHorizontal
              ? [0, bar.radius, bar.radius, 0]
              : [bar.radius, bar.radius, 0, 0],
          },
          barWidth: `${bar.width}%`,
          barCategoryGap: `${bar.gap}%`,
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
    }
  }, [
    title,
    heading,
    axes,
    legend,
    dataLabels,
    bar,
    isHorizontal,
    themeColors,
    labelColor,
    animation,
  ])

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