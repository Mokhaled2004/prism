import type { StateCreator } from "zustand"
import type { PanelSection } from "./types"

export interface PanelSlice {
  activeSection: PanelSection
  panelOpen: boolean

  setSection: (section: PanelSection) => void
  togglePanel: () => void
}

export const createPanelSlice: StateCreator<
  PanelSlice,
  [],
  [],
  PanelSlice
> = (set) => ({
  activeSection: "sections",
  panelOpen: true,

  setSection: (section) =>
    set((state) => ({
      activeSection: section,
      panelOpen: state.activeSection === section ? !state.panelOpen : true,
    })),

  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
})