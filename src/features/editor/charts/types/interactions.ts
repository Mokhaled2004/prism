export type ClickBehavior =
  | "none"
  | "filterDashboard"
  | "drillDown"
  | "openUrl"

export interface TooltipConfig {
  show: boolean
  followCursor: boolean
  showSeries: boolean
  /** Optional custom template, e.g. "{value} units" */
  valueTemplate?: string
}

export interface InteractionConfig {
  clickBehavior: ClickBehavior
  /** Enable cross-filtering with other components */
  crossFilter: boolean
  /** Which field triggers drill-down */
  drillDownField?: string
  /** Drill-down hierarchy (field names, in order) */
  drillDownHierarchy?: string[]
  /** URL template for openUrl behavior */
  openUrlTemplate?: string
  tooltip: TooltipConfig
}