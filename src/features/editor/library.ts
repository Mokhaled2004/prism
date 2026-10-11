import {
  Heading1,
  Heading2,
  AlignLeft,
  Minus,
  Columns2,
  Rows3,
  LayoutGrid,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  Table2,
  ListOrdered,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface LibraryItem {
  type: string
  label: string
  description: string
  icon: LucideIcon
}

export interface LibraryGroup {
  id: string
  label: string
  description: string
  icon: LucideIcon
  items: LibraryItem[]
}

export const library: LibraryGroup[] = [
  {
    id: "headers",
    label: "Headers",
    description: "Titles and section headers",
    icon: Heading1,
    items: [
      { type: "Heading", label: "Heading", description: "Section title", icon: Heading1 },
      { type: "Subheading", label: "Subheading", description: "Smaller title", icon: Heading2 },
    ],
  },
  {
    id: "text",
    label: "Text",
    description: "Paragraphs and labels",
    icon: AlignLeft,
    items: [
      { type: "Text", label: "Text", description: "Paragraph of text", icon: AlignLeft },
      { type: "Label", label: "Label", description: "Small muted label", icon: AlignLeft },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    description: "Rows, columns, dividers",
    icon: Columns2,
    items: [
      { type: "Divider", label: "Divider", description: "Horizontal rule", icon: Minus },
      { type: "Columns2", label: "Two columns", description: "Split into two", icon: Columns2 },
      { type: "Rows3", label: "Three rows", description: "Stack three items", icon: Rows3 },
    ],
  },
  {
    id: "charts",
    label: "Charts",
    description: "Visualize your data",
    icon: BarChart3,
    items: [
      { type: "BarChart", label: "Bar chart", description: "Compare categories", icon: BarChart3 },
      { type: "LineChart", label: "Line chart", description: "Show trends over time", icon: LineChart },
      { type: "PieChart", label: "Pie chart", description: "Show proportions", icon: PieChart },
      { type: "AreaChart", label: "Area chart", description: "Show volume over time", icon: AreaChart },
    ],
  },
  {
    id: "data",
    label: "Data",
    description: "KPIs and tables",
    icon: LayoutGrid,
    items: [
      { type: "KPICard", label: "KPI card", description: "Single metric", icon: LayoutGrid },
      { type: "DataTable", label: "Table", description: "Rows and columns", icon: Table2 },
      { type: "RankingList", label: "Ranking list", description: "Top N items", icon: ListOrdered },
    ],
  },
]