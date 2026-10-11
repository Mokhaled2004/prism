import { makeItem, makeRow, makeSection } from "./helpers"
import type { DashboardSection } from "./types"

export const initialSections: DashboardSection[] = [
  makeSection("Executive Summary", [
    makeRow([12], [[makeItem("Heading")]]),
    makeRow([12], [[makeItem("Text")]]),
    makeRow([6, 6], [[makeItem("BarChart")], [makeItem("LineChart")]]),
  ]),
  makeSection("Product Performance", [
    makeRow([12], [[makeItem("Heading")]]),
    makeRow([12], [[makeItem("BarChart")]]),
  ]),
  makeSection("Regional Breakdown", [
    makeRow([12], [[makeItem("Heading")]]),
    makeRow([6, 6], [[makeItem("PieChart")], [makeItem("AreaChart")]]),
  ]),
]