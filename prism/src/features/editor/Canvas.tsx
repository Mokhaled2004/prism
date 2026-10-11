"use client"

import { useState } from "react"
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Settings2,
  Plus,
  LayoutGrid,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "./store"
import { componentRegistry } from "./registry"
import type { EditorItem, LayoutColumn, LayoutRow } from "./store"
import { PropertiesModal } from "./PropertiesModal"

export function Canvas() {
  const sections = useEditor((s) => s.sections)
  const activeId = useEditor((s) => s.activeId)
  const selectedId = useEditor((s) => s.selectedId)
  const selectedCellId = useEditor((s) => s.selectedCellId)
  const selectItem = useEditor((s) => s.selectItem)
  const selectCell = useEditor((s) => s.selectCell)

  const [propsModalItemId, setPropsModalItemId] = useState<string | null>(null)

  const active = sections.find((s) => s.id === activeId)
  const layout = active?.layout ?? []

  return (
    <>
      <main
        className="flex-1 min-w-0 overflow-auto bg-bg p-6"
        onClick={() => {
          selectItem(null)
          selectCell(null)
        }}
      >
        {/* Section title */}
        {active && (
          <div className="mb-5">
            <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-1">
              Section
            </p>
            <h1 className="text-lg font-semibold text-prism-text-strong">
              {active.name}
            </h1>
          </div>
        )}

        <div className="space-y-4">
          {layout.length === 0 && (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-4">
                <LayoutGrid
                  className="w-6 h-6 text-prism-accent"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-sm font-medium text-prism-text-strong mb-1">
                Empty section
              </p>
              <p className="text-xs text-prism-muted">
                Apply a layout preset to get started.
              </p>
            </div>
          )}

          {layout.map((row) => (
            <Row
              key={row.id}
              row={row}
              selectedId={selectedId}
              selectedCellId={selectedCellId}
              onSelectItem={(id) => selectItem(id)}
              onSelectCell={(id) => selectCell(id)}
              onOpenProperties={(id) => setPropsModalItemId(id)}
            />
          ))}
        </div>
      </main>

      <PropertiesModal
        open={!!propsModalItemId}
        itemId={propsModalItemId}
        onClose={() => setPropsModalItemId(null)}
      />
    </>
  )
}

/* ─── Row ──────────────────────────────────────────────────── */

function Row({
  row,
  selectedId,
  selectedCellId,
  onSelectItem,
  onSelectCell,
  onOpenProperties,
}: {
  row: LayoutRow
  selectedId: string | null
  selectedCellId: string | null
  onSelectItem: (id: string) => void
  onSelectCell: (id: string) => void
  onOpenProperties: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-12 gap-3">
      {row.columns.map((col) => (
        <div key={col.id} style={{ gridColumn: `span ${col.span}` }}>
          <Cell
            column={col}
            selectedItemId={selectedId}
            isSelected={selectedCellId === col.id}
            onSelectItem={onSelectItem}
            onSelectCell={() => onSelectCell(col.id)}
            onOpenProperties={onOpenProperties}
          />
        </div>
      ))}
    </div>
  )
}

/* ─── Cell ─────────────────────────────────────────────────── */

function Cell({
  column,
  selectedItemId,
  isSelected,
  onSelectItem,
  onSelectCell,
  onOpenProperties,
}: {
  column: LayoutColumn
  selectedItemId: string | null
  isSelected: boolean
  onSelectItem: (id: string) => void
  onSelectCell: () => void
  onOpenProperties: (id: string) => void
}) {
  const isEmpty = column.items.length === 0

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onSelectCell()
      }}
      className={cn(
        "relative rounded-lg border min-h-[120px] p-3 transition-all cursor-pointer",
        isEmpty
          ? "border-dashed border-border bg-bg-hover/40 hover:border-accent hover:bg-accent-subtle/30"
          : isSelected
            ? "border-accent ring-2 ring-accent-glow bg-bg-hover/20"
            : "border-transparent hover:border-border-strong"
      )}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 py-6 pointer-events-none">
          <div className="w-8 h-8 rounded-md bg-panel border border-border flex items-center justify-center">
            <Plus className="w-4 h-4 text-prism-muted" strokeWidth={1.75} />
          </div>
          <p className="text-2xs text-prism-muted">
            {isSelected ? "Click a component to insert" : "Empty cell"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {column.items.map((item, index) => (
            <CellItem
              key={item.id}
              item={item}
              index={index}
              total={column.items.length}
              selected={selectedItemId === item.id}
              onSelect={() => onSelectItem(item.id)}
              onOpenProperties={() => onOpenProperties(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Cell item ────────────────────────────────────────────── */

function CellItem({
  item,
  index,
  total,
  selected,
  onSelect,
  onOpenProperties,
}: {
  item: EditorItem
  index: number
  total: number
  selected: boolean
  onSelect: () => void
  onOpenProperties: () => void
}) {
  const removeItem = useEditor((s) => s.removeItem)
  const moveItem = useEditor((s) => s.moveItem)

  const entry = componentRegistry[item.type]

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onOpenProperties()
      }}
      className={cn(
        "relative group rounded-md transition-all",
        selected
          ? "ring-2 ring-accent ring-offset-2 ring-offset-bg"
          : "hover:ring-1 hover:ring-border-strong hover:ring-offset-2 hover:ring-offset-bg"
      )}
    >
      <Toolbar
        item={item}
        index={index}
        total={total}
        visible={selected}
        onEdit={onOpenProperties}
        onMoveUp={() => moveItem(item.id, "up")}
        onMoveDown={() => moveItem(item.id, "down")}
        onDelete={() => removeItem(item.id)}
      />

      <div className="bg-panel border border-border rounded-md p-4">
        {entry ? (
          <entry.render config={item.props} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-xs text-prism-muted">
              {item.type} — not implemented yet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Toolbar ──────────────────────────────────────────────── */

function Toolbar({
  item,
  index,
  total,
  visible,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  item: EditorItem
  index: number
  total: number
  visible: boolean
  onEdit: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={cn(
        "absolute -top-3 right-2 z-30 flex items-center gap-0.5 rounded-md border border-border bg-panel shadow-md px-1 py-0.5 transition-opacity",
        visible
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
      )}
    >
      <span className="px-2 h-6 flex items-center text-2xs font-medium text-prism-muted">
        {item.type}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        title="Edit properties"
        className="h-6 px-2 flex items-center gap-1 rounded-md text-2xs font-medium text-prism-text hover:bg-bg-hover"
      >
        <Settings2 className="w-3 h-3" strokeWidth={2} />
        <span>Edit</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onMoveUp()
        }}
        disabled={index === 0}
        title="Move up"
        className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronUp className="w-3 h-3" strokeWidth={2} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onMoveDown()
        }}
        disabled={index === total - 1}
        title="Move down"
        className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronDown className="w-3 h-3" strokeWidth={2} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        title="Delete"
        className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-danger hover:bg-bg-hover"
      >
        <Trash2 className="w-3 h-3" strokeWidth={2} />
      </button>
    </div>
  )
}