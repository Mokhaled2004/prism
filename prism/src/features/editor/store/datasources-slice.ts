import type { StateCreator } from "zustand"
import type { DataSource, Dataset } from "../data-sources/types"

export interface DataSourcesSlice {
  dataSources: DataSource[]
  datasets: Dataset[]
  activeSourceId: string | null

  addDataSource: (source: DataSource) => void
  removeDataSource: (id: string) => void
  setActiveSourceId: (id: string | null) => void
  addDataset: (dataset: Dataset) => void
  removeDataset: (id: string) => void
}

export const createDataSourcesSlice: StateCreator<
  DataSourcesSlice,
  [],
  [],
  DataSourcesSlice
> = (set) => ({
  dataSources: [],
  datasets: [],
  activeSourceId: null,

  addDataSource: (source) =>
    set((state) => ({
      dataSources: [...state.dataSources, source],
      activeSourceId: source.id,
    })),

  removeDataSource: (id) =>
    set((state) => ({
      dataSources: state.dataSources.filter((s) => s.id !== id),
      datasets: state.datasets.filter((d) => d.sourceId !== id),
      activeSourceId: state.activeSourceId === id ? null : state.activeSourceId,
    })),

  setActiveSourceId: (id) => set({ activeSourceId: id }),

  addDataset: (dataset) =>
    set((state) => ({ datasets: [...state.datasets, dataset] })),

  removeDataset: (id) =>
    set((state) => ({
      datasets: state.datasets.filter((d) => d.id !== id),
    })),
})