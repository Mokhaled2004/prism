export interface LayoutColumnDef {
  span: number
}

export interface LayoutPreset {
  id: string
  label: string
  description: string
  /** Rows of columns. Each column is a span out of 12. */
  rows: LayoutColumnDef[][]
}

export const layoutPresets: LayoutPreset[] = [
  {
    id: "blank",
    label: "Blank",
    description: "Start empty and add rows as you go",
    rows: [],
  },
  {
    id: "1",
    label: "Full width",
    description: "One column across the whole page",
    rows: [[{ span: 12 }]],
  },
  {
    id: "1-1",
    label: "Two equal",
    description: "Two columns side by side",
    rows: [[{ span: 6 }, { span: 6 }]],
  },
  {
    id: "1-2",
    label: "Wide + narrow",
    description: "8/4 split",
    rows: [[{ span: 8 }, { span: 4 }]],
  },
  {
    id: "2-1",
    label: "Narrow + wide",
    description: "4/8 split",
    rows: [[{ span: 4 }, { span: 8 }]],
  },
  {
    id: "1-1-1",
    label: "Three equal",
    description: "Three columns side by side",
    rows: [[{ span: 4 }, { span: 4 }, { span: 4 }]],
  },
  {
    id: "1-1-1-1",
    label: "Four equal",
    description: "Four KPI tiles in a row",
    rows: [[{ span: 3 }, { span: 3 }, { span: 3 }, { span: 3 }]],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Full header + three KPIs + wide chart",
    rows: [
      [{ span: 12 }],
      [{ span: 4 }, { span: 4 }, { span: 4 }],
      [{ span: 12 }],
    ],
  },
]