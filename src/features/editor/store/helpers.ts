import { componentRegistry } from "../registry"
import type {
  DashboardSection,
  EditorItem,
  LayoutColumn,
  LayoutRow,
} from "./types"

export function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function makeColumn(
  span: number,
  items: EditorItem[] = []
): LayoutColumn {
  return { id: genId("col"), span, items }
}

export function makeRow(
  spans: number[],
  items: EditorItem[][] = []
): LayoutRow {
  return {
    id: genId("row"),
    columns: spans.map((span, i) => makeColumn(span, items[i] ?? [])),
  }
}

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value)
  return JSON.parse(JSON.stringify(value)) as T
}

export function makeItem(type: string): EditorItem {
  const def = componentRegistry[type]
  return {
    id: genId("item"),
    type,
    props: def?.defaultConfig ? deepClone(def.defaultConfig) : {},
  }
}

export function makeSection(
  name: string,
  layout: LayoutRow[] = []
): DashboardSection {
  return { id: genId("sec"), name, layout }
}

export function updateActiveLayout(
  sections: DashboardSection[],
  activeId: string,
  updater: (layout: LayoutRow[]) => LayoutRow[]
): DashboardSection[] {
  return sections.map((s) =>
    s.id === activeId ? { ...s, layout: updater(s.layout) } : s
  )
}