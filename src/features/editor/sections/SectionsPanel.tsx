"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEditor } from "../store"

export function SectionsPanel() {
  const sections = useEditor((s) => s.sections)
  const activeId = useEditor((s) => s.activeId)
  const setActiveId = useEditor((s) => s.setActiveId)
  const addSection = useEditor((s) => s.addSection)
  const renameSection = useEditor((s) => s.renameSection)
  const removeSection = useEditor((s) => s.removeSection)
  const moveSection = useEditor((s) => s.moveSection)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const startRename = (id: string, currentName: string) => {
    setEditingId(id)
    setDraftName(currentName)
  }

  const commitRename = () => {
    if (!editingId) return
    const name = draftName.trim()
    if (name) renameSection(editingId, name)
    setEditingId(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Sections · {sections.length}
        </p>
        <button
          onClick={() => addSection()}
          className="h-6 px-2 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover flex items-center gap-1"
          title="New section"
        >
          <Plus className="w-2.5 h-2.5" strokeWidth={2.5} />
          <span>New</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sections.map((section, index) => {
          const isActive = section.id === activeId
          const isEditing = editingId === section.id
          const isDeleting = deleteTarget === section.id

          return (
            <div
              key={section.id}
              className={cn(
                "group relative rounded-md border transition-colors",
                isActive
                  ? "border-accent bg-accent-subtle"
                  : "border-transparent hover:bg-bg-hover hover:border-border"
              )}
            >
              {isDeleting ? (
                <div className="p-2 flex items-center gap-1.5">
                  <p className="flex-1 text-2xs text-prism-danger">
                    Delete "{section.name}"?
                  </p>
                  <button
                    onClick={() => {
                      removeSection(section.id)
                      setDeleteTarget(null)
                    }}
                    className="h-6 px-2 rounded-md bg-danger text-white text-2xs font-medium hover:brightness-110"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="h-6 w-6 rounded-md flex items-center justify-center text-prism-muted hover:bg-bg-hover"
                  >
                    <X className="w-3 h-3" strokeWidth={2} />
                  </button>
                </div>
              ) : isEditing ? (
                <div className="p-1.5 flex items-center gap-1">
                  <input
                    autoFocus
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename()
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    className="flex-1 h-6 px-2 rounded-md border border-accent bg-bg text-xs text-prism-text focus:outline-none focus:ring-2 focus:ring-accent-glow"
                  />
                  <button
                    onClick={commitRename}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-prism-ok hover:bg-bg-hover"
                  >
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:bg-bg-hover"
                  >
                    <X className="w-3 h-3" strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveId(section.id)}
                    onDoubleClick={() => startRename(section.id, section.name)}
                    className="flex-1 h-9 px-3 flex items-center gap-2 text-left min-w-0"
                  >
                    <span
                      className={cn(
                        "w-1 h-5 rounded-full shrink-0",
                        isActive ? "bg-accent" : "bg-transparent"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs truncate",
                        isActive
                          ? "font-medium text-prism-accent"
                          : "text-prism-text"
                      )}
                    >
                      {section.name}
                    </span>
                  </button>

                  {/* Row actions */}
                  <div
                    className={cn(
                      "flex items-center gap-0.5 pr-1.5",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <button
                      onClick={() => moveSection(section.id, "up")}
                      disabled={index === 0}
                      title="Move up"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-3 h-3" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, "down")}
                      disabled={index === sections.length - 1}
                      title="Move down"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-3 h-3" strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => startRename(section.id, section.name)}
                      title="Rename"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-text hover:bg-bg-hover"
                    >
                      <Pencil className="w-3 h-3" strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(section.id)}
                      disabled={sections.length === 1}
                      title="Delete"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-prism-muted hover:text-prism-danger hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2.5 border-t border-border shrink-0">
        <p className="text-2xs text-prism-muted">
          Double-click a section to rename it
        </p>
      </div>
    </div>
  )
}