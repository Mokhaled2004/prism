import type { StateCreator } from "zustand"
import {
  genId,
  makeColumn,
  makeItem,
  updateActiveLayout,
} from "./helpers"
import type { EditorItem, LayoutRow } from "./types"
import type { SectionsSlice } from "./sections-slice"

export interface ItemsSlice {
  setLayout: (rows: LayoutRow[]) => void
  applyPreset: (rows: LayoutRow[]) => void
  addToCell: (cellId: string, type: string) => void
  removeItem: (id: string) => void
  moveItem: (id: string, direction: "up" | "down") => void
  updateProps: (id: string, patch: Record<string, unknown>) => void
  moveItemToCell: (itemId: string, targetCellId: string) => void
}

export const createItemsSlice: StateCreator<
  SectionsSlice & ItemsSlice,
  [],
  [],
  ItemsSlice
> = (set, get) => ({
  setLayout: (rows) =>
    set((state) => ({
      sections: updateActiveLayout(state.sections, state.activeId, () => rows),
      selectedId: null,
      selectedCellId: null,
    })),

  applyPreset: (rows) => {
    const state = get()
    const active = state.sections.find((s) => s.id === state.activeId)
    if (!active) return

    const existingItems: EditorItem[] = []
    for (const row of active.layout) {
      for (const col of row.columns) existingItems.push(...col.items)
    }

    const newLayout: LayoutRow[] = rows.map((r) => ({
      id: genId("row"),
      columns: r.map((c) => makeColumn(c.span, [])),
    }))

    let i = 0
    for (const row of newLayout) {
      for (const col of row.columns) {
        if (i >= existingItems.length) break
        col.items.push(existingItems[i++])
      }
    }
    if (i < existingItems.length && newLayout.length > 0) {
      const lastRow = newLayout[newLayout.length - 1]
      const lastCol = lastRow.columns[lastRow.columns.length - 1]
      while (i < existingItems.length) lastCol.items.push(existingItems[i++])
    }

    set((s) => ({
      sections: updateActiveLayout(s.sections, s.activeId, () => newLayout),
      selectedId: null,
      selectedCellId: null,
    }))
  },

  addToCell: (cellId, type) => {
    const item = makeItem(type)
    set((state) => ({
      sections: updateActiveLayout(state.sections, state.activeId, (layout) =>
        layout.map((row) => ({
          ...row,
          columns: row.columns.map((col) =>
            col.id === cellId ? { ...col, items: [...col.items, item] } : col
          ),
        }))
      ),
      selectedId: item.id,
      selectedCellId: null,
    }))
  },

  removeItem: (id) => {
    set((state) => ({
      sections: updateActiveLayout(state.sections, state.activeId, (layout) =>
        layout.map((row) => ({
          ...row,
          columns: row.columns.map((col) => ({
            ...col,
            items: col.items.filter((i) => i.id !== id),
          })),
        }))
      ),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }))
  },

  moveItem: (id, direction) => {
    set((state) => ({
      sections: updateActiveLayout(state.sections, state.activeId, (layout) =>
        layout.map((row) => {
          for (const col of row.columns) {
            const idx = col.items.findIndex((i) => i.id === id)
            if (idx === -1) continue
            const next = [...col.items]
            const to = direction === "up" ? idx - 1 : idx + 1
            if (to < 0 || to >= next.length) return row
            const [moved] = next.splice(idx, 1)
            next.splice(to, 0, moved)
            return {
              ...row,
              columns: row.columns.map((c) =>
                c.id === col.id ? { ...c, items: next } : c
              ),
            }
          }
          return row
        })
      ),
    }))
  },

  updateProps: (id, patch) => {
    set((state) => ({
      sections: updateActiveLayout(state.sections, state.activeId, (layout) =>
        layout.map((row) => ({
          ...row,
          columns: row.columns.map((col) => ({
            ...col,
            items: col.items.map((item) =>
              item.id === id
                ? { ...item, props: { ...item.props, ...patch } }
                : item
            ),
          })),
        }))
      ),
    }))
  },

  moveItemToCell: (itemId, targetCellId) => {
    set((state) => {
      const active = state.sections.find((s) => s.id === state.activeId)
      if (!active) return {}

      let found: EditorItem | null = null
      for (const row of active.layout) {
        for (const col of row.columns) {
          const item = col.items.find((i) => i.id === itemId)
          if (item) {
            found = item
            break
          }
        }
        if (found) break
      }
      if (!found) return {}

      const nextLayout = active.layout.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          const withoutItem = col.items.filter((i) => i.id !== itemId)
          if (col.id === targetCellId) {
            return { ...col, items: [...withoutItem, found!] }
          }
          return { ...col, items: withoutItem }
        }),
      }))

      return {
        sections: state.sections.map((s) =>
          s.id === state.activeId ? { ...s, layout: nextLayout } : s
        ),
        selectedId: itemId,
        selectedCellId: null,
      }
    })
  },
})