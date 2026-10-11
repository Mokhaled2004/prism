export interface EditorItem {
  id: string
  type: string
  props: Record<string, unknown>
}

export interface LayoutColumn {
  id: string
  span: number
  items: EditorItem[]
}

export interface LayoutRow {
  id: string
  columns: LayoutColumn[]
}

export interface DashboardSection {
  id: string
  name: string
  layout: LayoutRow[]
}

export type PanelSection =
  | "sections"
  | "components"
  | "outline"
  | "data"
  | "calculations"
  | "templates"
  | "members"
  | "billing"
  | "audit"
  | "reports"
  | "scheduler"
  | "alerts"
  | "ai"
  | "settings"
  | "themes"