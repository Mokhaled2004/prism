import type {
  AppearanceConfig,
  AccessibilityConfig,
  ChartAreaConfig,
  ColorPaletteConfig,
  HeadingConfig,
  LayoutConfig,
  ResponsiveConfig,
} from "../types/common"
import type { AnimationConfig } from "../types/animation"
import type { InteractionConfig } from "../types/interactions"

export const defaultAppearance: AppearanceConfig = {
  background: "panel",
  border: {
    show: true,
    width: 1,
    style: "solid",
    color: "border",
    radius: 8,
  },
  padding: 16,
  shadow: "sm",
  opacity: 1,
}

export const defaultHeading: HeadingConfig = {
  show: true,
  fontSize: 13,
  fontWeight: 600,
  color: "text-strong",
  align: "left",
  showSubtitle: false,
  subtitleFontSize: 11,
  subtitleColor: "muted",
}

export const defaultLayout: LayoutConfig = {
  desktop: { width: 6, height: 320 },
  tablet: { width: 12, height: 300 },
  mobile: { width: 12, height: 260 },
  minWidth: 200,
  minHeight: 200,
}

export const defaultResponsive: ResponsiveConfig = {
  hideOnMobile: false,
  hideOnTablet: false,
  hideOnDesktop: false,
  mobileScale: 100,
}

export const defaultInteractions: InteractionConfig = {
  clickBehavior: "none",
  crossFilter: false,
  tooltip: {
    show: true,
    followCursor: true,
    showSeries: true,
  },
}

export const defaultAnimation: AnimationConfig = {
  enabled: true,
  duration: 400,
  easing: "ease-out",
  delay: 0,
  entrance: "fadeIn",
  onDataChange: "fadeUpdate",
}

export const defaultAccessibility: AccessibilityConfig = {
  ariaLabel: undefined,
  fallbackText: undefined,
}

export const defaultChartArea: ChartAreaConfig = {
  paddingTop: 8,
  paddingRight: 8,
  paddingBottom: 8,
  paddingLeft: 8,
  aspectRatio: "auto",
}

export const defaultColors: ColorPaletteConfig = {
  colors: [
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "chart-6",
    "chart-7",
    "chart-8",
  ],
  useThemePalette: true,
}