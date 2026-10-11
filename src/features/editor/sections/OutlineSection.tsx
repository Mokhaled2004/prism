"use client"

import { cn } from "@/lib/utils"
import { useEditor } from "../store"

export function OutlineSection() {
  const sections = useEditor((s) => s.sections)
  const activeId = useEditor((s) => s.activeId)
  const selectedId = useEditor((s) => s.selectedId)
  const selectItem = useEditor((s) => s.selectItem)

  const active = sections.find((s) => s.id === activeId)
  const layout = active?.layout ?? []

  const flatItems = layout.flatMap((row) =>
    row.columns.flatMap((col) => col.items)
  )

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Outline
        </p>
        {active && (
          <p className="text-xs text-prism-text mt-1 truncate">
            {active.name}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {flatItems.length === 0 ? (
          <p className="px-2 py-4 text-xs text-prism-muted">
            Nothing on this section yet.
          </p>
        ) : (
          flatItems.map((item) => (
            <button
              key={item.id}
              onClick={() => selectItem(item.id)}
              className={cn(
                "w-full h-7 px-2 rounded-md flex items-center gap-2 text-xs transition-colors text-left",
                selectedId === item.id
                  ? "bg-accent-subtle text-prism-accent"
                  : "text-prism-text hover:bg-bg-hover"
              )}
            >
              <span className="w-3 text-center text-prism-muted">·</span>
              <span className="flex-1 truncate">{item.type}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}