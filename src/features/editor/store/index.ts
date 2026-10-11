import { create } from "zustand"
import { initialSections } from "./initial"
import {
  createSectionsSlice,
  type SectionsSlice,
} from "./sections-slice"
import { createItemsSlice, type ItemsSlice } from "./items-slice"
import { createPanelSlice, type PanelSlice } from "./panel-slice"
import {
  createCalculationsSlice,
  type CalculationsSlice,
} from "./calculations-slice"
import {
  createAlertsSlice,
  type AlertsSlice,
} from "./alerts-slice"
import {
  createReportsSlice,
  type ReportsSlice,
} from "./reports-slice"
import {
  createSchedulesSlice,
  type SchedulesSlice,
} from "./schedules-slice"
import {
  createDataSourcesSlice,
  type DataSourcesSlice,
} from "./datasources-slice"

export type EditorStore = SectionsSlice &
  ItemsSlice &
  PanelSlice &
  CalculationsSlice &
  AlertsSlice &
  ReportsSlice &
  SchedulesSlice &
  DataSourcesSlice

export const useEditor = create<EditorStore>()((set, get, api) => ({
  ...createSectionsSlice(set, get, api),
  ...createItemsSlice(set, get, api),
  ...createPanelSlice(set, get, api),
  ...createCalculationsSlice(set, get, api),
  ...createAlertsSlice(set, get, api),
  ...createReportsSlice(set, get, api),
  ...createSchedulesSlice(set, get, api),
  ...createDataSourcesSlice(set, get, api),

  // Seed the store with the initial dashboard state.
  // createSectionsSlice sets these to empty defaults, so we override here.
  sections: initialSections,
  activeId: initialSections[0]?.id ?? "",
  selectedId: null,
  selectedCellId: null,
}))

export type {
  EditorItem,
  LayoutColumn,
  LayoutRow,
  DashboardSection,
  PanelSection,
} from "./types"

export * from "./sections-slice"
export * from "./items-slice"
export * from "./panel-slice"
export * from "./calculations-slice"
export * from "./alerts-slice"
export * from "./reports-slice"
export * from "./schedules-slice"
export * from "./datasources-slice"