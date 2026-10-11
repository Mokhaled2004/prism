"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

export interface PrismSelectProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Optional leading icon */
  icon?: ReactNode
  /** Optional width */
  width?: "auto" | "full"
  size?: "sm" | "md"
}

export function PrismSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className,
  icon,
  width = "full",
  size = "md",
}: PrismSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState<number>(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const selectedIndex = options.findIndex((o) => o.value === value)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open])

  // Highlight selected on open
  useEffect(() => {
    if (open) {
      setHighlighted(selectedIndex >= 0 ? selectedIndex : 0)
    }
  }, [open, selectedIndex])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlighted((h) => {
        let next = h + 1
        while (next < options.length && options[next].disabled) next++
        return Math.min(next, options.length - 1)
      })
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlighted((h) => {
        let next = h - 1
        while (next >= 0 && options[next].disabled) next--
        return Math.max(next, 0)
      })
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      const opt = options[highlighted]
      if (opt && !opt.disabled) {
        onChange(opt.value)
        setOpen(false)
      }
    }
  }

  // Scroll highlighted into view
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.children[highlighted] as HTMLElement | undefined
    if (el) el.scrollIntoView({ block: "nearest" })
  }, [highlighted, open])

  const sizeClasses = {
    sm: "h-7 px-2.5 text-xs gap-1.5",
    md: "h-8 px-3 text-xs gap-2",
  }[size]

  const widthClasses = width === "full" ? "w-full" : "w-auto"

  return (
    <div
      ref={rootRef}
      className={cn("relative", widthClasses, className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        type="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "rounded-md border bg-bg text-left flex items-center transition-all cursor-pointer",
          sizeClasses,
          widthClasses,
          open
            ? "border-accent ring-2 ring-accent-glow"
            : "border-border hover:border-border-strong",
          disabled && "opacity-50 cursor-not-allowed",
          "focus:outline-none"
        )}
      >
        {icon && (
          <span className="shrink-0 text-prism-muted">{icon}</span>
        )}
        <span
          className={cn(
            "flex-1 truncate font-medium",
            selected ? "text-prism-text" : "text-prism-muted"
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 shrink-0 text-prism-muted transition-transform",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          className={cn(
            "absolute left-0 right-0 top-full mt-1 z-50",
            "bg-panel border border-border rounded-md shadow-lg",
            "py-1 max-h-64 overflow-y-auto",
            "animate-in fade-in slide-in-from-top-1 duration-100"
          )}
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-prism-muted">
              No options
            </p>
          ) : (
            options.map((opt, i) => {
              const isSelected = opt.value === value
              const isHighlighted = i === highlighted
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (opt.disabled) return
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  disabled={opt.disabled}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 transition-colors cursor-pointer",
                    isHighlighted && !opt.disabled && "bg-bg-hover",
                    opt.disabled && "opacity-40 cursor-not-allowed",
                    isSelected && "text-prism-accent font-medium"
                  )}
                >
                  <span className="w-3.5 shrink-0 flex items-center justify-center">
                    {isSelected && (
                      <Check
                        className="w-3 h-3 text-prism-accent"
                        strokeWidth={2.5}
                      />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{opt.label}</p>
                    {opt.description && (
                      <p className="text-2xs text-prism-muted truncate mt-0.5">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}