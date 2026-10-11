"use client"

import { useState } from "react"
import { FunctionSquare, Plus, Pencil, Trash2, Copy, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"
import { CalculationModal } from "../calculations/CalculationModal"
import type { Calculation } from "../calculations/types"

export function CalculationsSection() {
  const calculations = useEditor((s) => s.calculations)
  const addCalculation = useEditor((s) => s.addCalculation)
  const updateCalculation = useEditor((s) => s.updateCalculation)
  const removeCalculation = useEditor((s) => s.removeCalculation)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Calculation | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (calc: Calculation) => {
    setEditing(calc)
    setModalOpen(true)
  }

  const handleSave = (calc: Calculation) => {
    if (editing) {
      updateCalculation(calc.id, calc)
    } else {
      addCalculation(calc)
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDuplicate = (calc: Calculation) => {
    addCalculation({
      ...calc,
      id: `calc_${Math.random().toString(36).slice(2, 10)}`,
      name: `${calc.name} (copy)`,
      usedBy: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Calculations · {calculations.length}
          </p>
          <button
            onClick={openCreate}
            className="h-6 px-2 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover flex items-center gap-1 cursor-pointer"
            title="New calculation"
          >
            <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {calculations.length === 0 ? (
            <EmptyState onCreate={openCreate} />
          ) : (
            calculations.map((c) => (
              <CalcCard
                key={c.id}
                calc={c}
                onEdit={() => openEdit(c)}
                onDuplicate={() => handleDuplicate(c)}
                onDelete={() => setDeletingId(c.id)}
              />
            ))
          )}
        </div>
      </div>

      <CalculationModal
        open={modalOpen}
        calculation={editing}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      {deletingId && (
        <DeleteConfirm
          onCancel={() => setDeletingId(null)}
          onConfirm={() => {
            removeCalculation(deletingId)
            setDeletingId(null)
          }}
        />
      )}
    </>
  )
}

function CalcCard({
  calc,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  calc: Calculation
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <div className="group rounded-md border border-border bg-panel hover:border-accent/50 transition-all overflow-hidden">
      {/* Top — clickable */}
      <button
        onClick={onEdit}
        className="w-full text-left p-3 flex items-start gap-2.5 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
          <FunctionSquare
            className="w-4 h-4 text-prism-accent"
            strokeWidth={2}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-prism-text-strong truncate">
            {calc.name}
          </p>

          {/* Formula preview with syntax coloring */}
          <div className="mt-1 flex items-center gap-1 flex-wrap">
            {renderFormulaPreview(calc.formula)}
          </div>
        </div>
      </button>

      {/* Bottom — meta + actions */}
      <div className="px-3 py-2 border-t border-border bg-bg-hover/40 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-2xs text-prism-muted">
          <span className="px-1.5 py-0.5 rounded bg-panel border border-border font-medium">
            {calc.type}
          </span>
          <span>·</span>
          <span>{calc.usedBy}× used</span>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            title="Edit"
            className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover cursor-pointer"
          >
            <Pencil className="w-3 h-3" strokeWidth={1.75} />
          </button>
          <button
            onClick={onDuplicate}
            title="Duplicate"
            className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover cursor-pointer"
          >
            <Copy className="w-3 h-3" strokeWidth={1.75} />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-danger hover:bg-bg-hover cursor-pointer"
          >
            <Trash2 className="w-3 h-3" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}

/** Renders a formula string with {field} references highlighted */
function renderFormulaPreview(formula: string) {
  const parts = formula.split(/(\{[^}]+\})/g)
  return parts.map((part, i) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      const name = part.slice(1, -1)
      return (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-accent/40 bg-accent-subtle text-2xs font-mono text-prism-accent"
        >
          <Hash className="w-2.5 h-2.5" strokeWidth={2} />
          {name}
        </span>
      )
    }
    return (
      <span key={i} className="text-2xs font-mono text-prism-muted whitespace-pre">
        {part}
      </span>
    )
  })
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
        <FunctionSquare
          className="w-6 h-6 text-prism-accent"
          strokeWidth={1.75}
        />
      </div>
      <p className="text-sm font-medium text-prism-text-strong mb-1">
        No calculations yet
      </p>
      <p className="text-xs text-prism-muted mb-4 max-w-[220px]">
        Create a calculated field like Revenue or Profit Margin to use in charts.
      </p>
      <button
        onClick={onCreate}
        className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span>New calculation</span>
      </button>
    </div>
  )
}

function DeleteConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-panel border border-border rounded-lg shadow-xl p-5"
      >
        <p className="text-sm font-semibold text-prism-text-strong">
          Delete this calculation?
        </p>
        <p className="text-xs text-prism-muted mt-1">
          Components using this calculation will show an error until they're
          updated.
        </p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-3 rounded-md bg-danger text-white text-xs font-medium hover:brightness-110 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}