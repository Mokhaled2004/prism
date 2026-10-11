/* ─────────────────────────────────────────────────────────────
   Query specification — what data a component needs.
   The component does NOT contain data. It contains a spec.
   ───────────────────────────────────────────────────────────── */

export type AggregationType =
  | "sum"
  | "avg"
  | "count"
  | "count_distinct"
  | "min"
  | "max"
  | "median"

export interface DimensionConfig {
  /** Field name from the selected dataset */
  field: string
  /** How the field is grouped / bucketed */
  groupBy?: "none" | "day" | "week" | "month" | "quarter" | "year"
  /** Optional alias for display */
  label?: string
}

export interface MetricConfig {
  /** Field name from the selected dataset, or a calculated field id */
  field: string
  aggregation: AggregationType
  label?: string
  format?: import("./common").NumberFormat
  /** Optional per-series color override */
  color?: import("./common").ColorValue
}

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "between"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null"

export interface FilterConfig {
  field: string
  operator: FilterOperator
  value: unknown
  /** For "between" operator */
  valueEnd?: unknown
}

export interface SortConfig {
  field: string
  direction: "asc" | "desc"
  /** Whether the sort field is a metric rather than a dimension */
  isMetric?: boolean
}

/**
 * Flat query spec — the same shape used by the future query engine.
 * Not the same as the API payload; that will be compiled from this.
 */
export interface QuerySpec {
  datasetId: string
  dimensions: DimensionConfig[]
  metrics: MetricConfig[]
  filters: FilterConfig[]
  sort: SortConfig[]
  limit?: number
}