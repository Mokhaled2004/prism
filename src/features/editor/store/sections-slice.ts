import type { StateCreator } from "zustand"
import { makeSection } from "./helpers"
import type { DashboardSection } from "./types"

export interface SectionsSlice {
  sections: DashboardSection[]
  activeId: string
  selectedId: string | null
  selectedCellId: string | null

  setActiveId: (id: string) => void
  addSection: (name?: string) => void
  renameSection: (id: string, name: string) => void
  removeSection: (id: string) => void
  moveSection: (id: string, direction: "up" | "down") => void

  selectItem: (id: string | null) => void
  selectCell: (id: string | null) => void
}

export const createSectionsSlice: StateCreator<
  SectionsSlice,
  [],
  [],
  SectionsSlice
> = (set, get) => ({
  sections: [],
  activeId: "",
  selectedId: null,
  selectedCellId: null,

  setActiveId: (id) =>
    set({ activeId: id, selectedId: null, selectedCellId: null }),

  addSection: (name) => {
    const currentSections = get().sections
    const newSection = makeSection(
      name || `Section ${currentSections.length + 1}`
    )
    set({
      sections: [...currentSections, newSection],
      activeId: newSection.id,
      selectedId: null,
      selectedCellId: null,
    })
  },

  renameSection: (id, name) => {
    set({
      sections: get().sections.map((s) =>
        s.id === id ? { ...s, name } : s
      ),
    })
  },

  removeSection: (id) => {
    const remaining = get().sections.filter((s) => s.id !== id)
    if (remaining.length === 0) return
    const wasActive = get().activeId === id
    set({
      sections: remaining,
      activeId: wasActive ? remaining[0].id : get().activeId,
      selectedId: null,
      selectedCellId: null,
    })
  },

  moveSection: (id, direction) => {
    const sections = [...get().sections]
    const from = sections.findIndex((s) => s.id === id)
    if (from === -1) return
    const to = direction === "up" ? from - 1 : from + 1
    if (to < 0 || to >= sections.length) return
    const [moved] = sections.splice(from, 1)
    sections.splice(to, 0, moved)
    set({ sections })
  },

  selectItem: (id) => set({ selectedId: id, selectedCellId: null }),
  selectCell: (id) => set({ selectedCellId: id, selectedId: null }),
})