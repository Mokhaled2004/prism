import type { StateCreator } from "zustand"
import type { Calculation } from "../calculations/types"

export interface CalculationsSlice {
  calculations: Calculation[]
  activeCalculationId: string | null

  addCalculation: (calc: Calculation) => void
  updateCalculation: (id: string, patch: Partial<Calculation>) => void
  removeCalculation: (id: string) => void
  setActiveCalculationId: (id: string | null) => void
}

export const createCalculationsSlice: StateCreator<
  CalculationsSlice,
  [],
  [],
  CalculationsSlice
> = (set) => ({
  calculations: [],
  activeCalculationId: null,

  addCalculation: (calc) =>
    set((state) => ({ calculations: [...state.calculations, calc] })),

  updateCalculation: (id, patch) =>
    set((state) => ({
      calculations: state.calculations.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c
      ),
    })),

  removeCalculation: (id) =>
    set((state) => ({
      calculations: state.calculations.filter((c) => c.id !== id),
      activeCalculationId:
        state.activeCalculationId === id ? null : state.activeCalculationId,
    })),

  setActiveCalculationId: (id) => set({ activeCalculationId: id }),
})