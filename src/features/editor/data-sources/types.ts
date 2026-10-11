export type DataSourceKind = "postgres" | "mysql" | "file" | "rest"

export type DataSourceStatus = "connected" | "testing" | "error" | "ready"

export interface DataSource {
  id: string
  name: string
  kind: DataSourceKind
  status: DataSourceStatus
  /** For database sources */
  host?: string
  port?: number
  database?: string
  username?: string
  ssl?: boolean
  /** For file sources */
  fileName?: string
  fileSize?: number
  columns?: number
  rows?: number
  /** Metadata */
  createdAt: number
  lastTestedAt?: number
  tableCount?: number
}

export interface Dataset {
  id: string
  name: string
  sourceId: string
  fieldCount: number
  rowCount: number
  createdAt: number
}

export const KIND_LABELS: Record<DataSourceKind, string> = {
  postgres: "PostgreSQL",
  mysql: "MySQL",
  file: "CSV / Excel",
  rest: "REST API",
}