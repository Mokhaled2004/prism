"use client"

import { useMemo, useEffect, useState } from "react"
import ReactECharts from "echarts-for-react"
import { topProducts } from "../mock-data"
import type { PieChartProps } from "../charts/types/pie"
import { defaultPieChartProps } from "../charts/defaults"

export interface PieChartRendererProps {
  config?: PieChartProps
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

export function PieChart({
  config = defaultPieChartProps,
  height,
}: PieChartRendererProps) {
  const {
    title,
    heading,
    legend,
    dataLabels,
    pie,
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

  const labelColor = resolveToken(heading.color, themeColors.text)

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
      tooltip: {
        show: true,
        trigger: "item",
        backgroundColor: themeColors.panel,
        borderColor: themeColors.border,
        textStyle: { fontSize: 11, color: themeColors.text },
      },
      legend: legend.show
        ? {
            show: true,
            top: legend.position === "top" ? 0 : undefined,
            bottom: legend.position === "bottom" ? 0 : undefined,
            icon: legend.iconType,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: legend.fontSize, color: themeColors.muted },
          }
        : { show: false },
      color: themeColors.palette,
      series: [
        {
          type: "pie",
          radius: [`${pie.innerRadius}%`, `${pie.outerRadius}%`],
          startAngle: pie.startAngle,
          center: [
            "50%",
            legend.show && legend.position === "bottom" ? "45%" : "50%",
          ],
          avoidLabelOverlap: true,
          label:
            pie.labelPosition === "none" || !dataLabels.show
              ? { show: false }
              : {
                  show: true,
                  position: pie.labelPosition,
                  fontSize: dataLabels.fontSize,
                  color: resolveToken(dataLabels.color, themeColors.muted),
                  formatter: (p: any) =>
                    pie.showPercent
                      ? `${p.name}\n${p.percent}%`
                      : pie.showValue
                        ? `${p.name}\n${p.value}`
                        : p.name,
                },
          labelLine:
            pie.labelPosition === "none"
              ? { show: false }
              : { length: 8, length2: 8 },
          data: topProducts.map((d) => ({
            name: d.product,
            value: d.revenue,
          })),
        },
      ],
      animation: animation.enabled,
      animationDuration: animation.duration,
    }),
    [title, heading, legend, dataLabels, pie, themeColors, labelColor, animation]
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