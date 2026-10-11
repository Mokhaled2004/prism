"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { library } from "../library"
import { ComponentPickerModal } from "../ComponentPickerModal"

export function ComponentsSection() {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
            Components
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-0.5">
            {library.map((group) => {
              const Icon = group.icon
              return (
                <button
                  key={group.id}
                  onClick={() => setOpenGroupId(group.id)}
                  className="w-full h-10 px-2 rounded-md flex items-center gap-2.5 text-xs text-prism-text hover:bg-bg-hover transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-md bg-bg-hover flex items-center justify-center shrink-0">
                    <Icon
                      className="w-3.5 h-3.5 text-prism-muted"
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="flex-1 font-medium">{group.label}</span>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-prism-muted shrink-0"
                    strokeWidth={1.75}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <ComponentPickerModal
        groupId={openGroupId}
        onClose={() => setOpenGroupId(null)}
      />
    </>
  )
}