"use client"

import { useState, useRef, useEffect } from "react"
import {
  Plus,
  X,
  ChevronDown,
  Hash,
  FunctionSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CalculationField, FormulaFunction } from "./types"

/* ─── Tokens ──────────────────────────────────────────────── */

export type FormulaToken =
  | { kind: "field"; fieldId: string; fieldName: string; fieldType: string }
  | { kind: "operator"; value: string }
  | { kind: "number"; value: string }
  | { kind: "paren"; value: "(" | ")" }
  | { kind: "function"; name: string; args: FormulaToken[] }

export interface FormulaBuilderProps {
  tokens: FormulaToken[]
  onChange: (tokens: FormulaToken[]) => void
  fields: CalculationField[]
  functions: FormulaFunction[]
  error?: string | null
}

const OPERATORS = [
  { value: "+", label: "Add" },
  { value: "-", label: "Subtract" },
  { value: "*", label: "Multiply" },
  { value: "/", label: "Divide" },
  { value: "=", label: "Equals" },
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: ">=", label: "Greater or equal" },
  { value: "<=", label: "Less or equal" },
]

export function FormulaBuilder({
  tokens,
  onChange,
  fields,
  functions,
  error,
}: FormulaBuilderProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<null | "field" | "operator" | "number" | "function">(null)
  const [numberDraft, setNumberDraft] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const appendToken = (token: FormulaToken) => {
    onChange([...tokens, token])
    closePicker()
  }

  const replaceToken = (index: number, token: FormulaToken) => {
    const next = [...tokens]
    next[index] = token
    onChange(next)
  }

  const removeToken = (index: number) => {
    onChange(tokens.filter((_, i) => i !== index))
  }

  const closePicker = () => {
    setPickerOpen(false)
    setPickerMode(null)
    setNumberDraft("")
  }

  // Close on outside click
  useEffect(() => {
    if (!pickerOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePicker()
      }
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [pickerOpen])

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Formula canvas */}
      <div
        className={cn(
          "rounded-md border bg-bg p-2 min-h-[52px] flex flex-wrap items-center gap-1.5 transition-colors",
          error
            ? "border-danger ring-2 ring-danger/20"
            : "border-border"
        )}
      >
        {tokens.length === 0 ? (
          <p className="text-xs text-prism-muted px-2 py-1.5">
            Click "+ Add" below to start building the formula
          </p>
        ) : (
          tokens.map((token, i) => (
            <TokenChip
              key={i}
              token={token}
              fields={fields}
              onRemove={() => removeToken(i)}
            />
          ))
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => {
            setPickerOpen(true)
            setPickerMode("field")
          }}
          className="h-7 px-2.5 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
        >
          <Hash className="w-3 h-3 text-prism-muted" strokeWidth={2} />
          <span>Field</span>
        </button>

        <button
          onClick={() => {
            setPickerOpen(true)
            setPickerMode("operator")
          }}
          className="h-7 px-2.5 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
        >
          <span className="font-mono text-sm text-prism-muted leading-none">+</span>
          <span>Operator</span>
        </button>

        <button
          onClick={() => {
            setPickerOpen(true)
            setPickerMode("number")
          }}
          className="h-7 px-2.5 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
        >
          <span className="font-mono text-xs text-prism-muted leading-none">123</span>
          <span>Number</span>
        </button>

        <button
          onClick={() => {
            setPickerOpen(true)
            setPickerMode("function")
          }}
          className="h-7 px-2.5 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover flex items-center gap-1.5 cursor-pointer"
        >
          <FunctionSquare className="w-3 h-3 text-prism-muted" strokeWidth={2} />
          <span>Function</span>
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={() => appendToken({ kind: "paren", value: "(" })}
          className="h-7 w-7 rounded-md border border-border bg-panel text-xs font-mono text-prism-text hover:bg-bg-hover cursor-pointer"
          title="Open parenthesis"
        >
          (
        </button>
        <button
          onClick={() => appendToken({ kind: "paren", value: ")" })}
          className="h-7 w-7 rounded-md border border-border bg-panel text-xs font-mono text-prism-text hover:bg-bg-hover cursor-pointer"
          title="Close parenthesis"
        >
          )
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-2xs text-prism-danger">{error}</p>}

      {/* Picker popover */}
      {pickerOpen && pickerMode && (
        <PickerPopover
          mode={pickerMode}
          fields={fields}
          functions={functions}
          numberDraft={numberDraft}
          setNumberDraft={setNumberDraft}
          onPick={appendToken}
          onClose={closePicker}
        />
      )}
    </div>
  )
}

/* ─── Chip ────────────────────────────────────────────────── */

function TokenChip({
  token,
  fields,
  onRemove,
}: {
  token: FormulaToken
  fields: CalculationField[]
  onRemove: () => void
}) {
  if (token.kind === "field") {
    return (
      <span className="group inline-flex items-center gap-1 h-7 pl-2 pr-1 rounded-md border border-accent/40 bg-accent-subtle text-prism-accent text-xs font-medium">
        <Hash className="w-3 h-3 shrink-0" strokeWidth={2} />
        <span className="font-mono">{token.fieldName}</span>
        <button
          onClick={onRemove}
          className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent/20 cursor-pointer"
          title="Remove"
        >
          <X className="w-2.5 h-2.5" strokeWidth={2.5} />
        </button>
      </span>
    )
  }

  if (token.kind === "operator") {
    return (
      <span className="group inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-md border border-border bg-panel text-xs font-mono font-semibold text-prism-text">
        {token.value}
        <button
          onClick={onRemove}
          className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-bg-hover cursor-pointer"
          title="Remove"
        >
          <X className="w-2.5 h-2.5" strokeWidth={2.5} />
        </button>
      </span>
    )
  }

  if (token.kind === "number") {
    return (
      <span className="group inline-flex items-center gap-1 h-7 pl-2 pr-1 rounded-md border border-border bg-bg-hover text-xs font-mono text-prism-text">
        {token.value}
        <button
          onClick={onRemove}
          className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-panel cursor-pointer"
          title="Remove"
        >
          <X className="w-2.5 h-2.5" strokeWidth={2.5} />
        </button>
      </span>
    )
  }

  if (token.kind === "paren") {
    return (
      <span className="group inline-flex items-center h-7 rounded-md text-sm font-mono font-semibold text-prism-muted px-1">
        {token.value}
      </span>
    )
  }

  if (token.kind === "function") {
    return (
      <span className="group inline-flex items-center gap-1 h-7 pl-2 pr-1 rounded-md border border-info/40 bg-info-subtle text-prism-info text-xs font-medium">
        <FunctionSquare className="w-3 h-3 shrink-0" strokeWidth={2} />
        <span className="font-mono">{token.name}</span>
        <span className="text-prism-muted">(...)</span>
        <button
          onClick={onRemove}
          className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-info/20 cursor-pointer"
          title="Remove"
        >
          <X className="w-2.5 h-2.5" strokeWidth={2.5} />
        </button>
      </span>
    )
  }

  return null
}

/* ─── Picker popover ─────────────────────────────────────── */

function PickerPopover({
  mode,
  fields,
  functions,
  numberDraft,
  setNumberDraft,
  onPick,
  onClose,
}: {
  mode: "field" | "operator" | "number" | "function"
  fields: CalculationField[]
  functions: FormulaFunction[]
  numberDraft: string
  setNumberDraft: (v: string) => void
  onPick: (token: FormulaToken) => void
  onClose: () => void
}) {
  const [functionSearch, setFunctionSearch] = useState("")

  if (mode === "field") {
    return (
      <div className="rounded-md border border-border bg-panel shadow-lg max-h-64 overflow-y-auto">
        <p className="px-3 py-2 text-2xs font-semibold uppercase tracking-wider text-prism-muted border-b border-border">
          Pick a field
        </p>
        {fields.map((f) => (
          <button
            key={f.id}
            onClick={() =>
              onPick({
                kind: "field",
                fieldId: f.id,
                fieldName: f.name,
                fieldType: f.type,
              })
            }
            className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-bg-hover cursor-pointer"
          >
            <span className="font-mono text-xs text-prism-text-strong">
              {f.name}
            </span>
            <span className="text-2xs text-prism-muted">{f.type}</span>
          </button>
        ))}
      </div>
    )
  }

  if (mode === "operator") {
    return (
      <div className="rounded-md border border-border bg-panel shadow-lg max-h-64 overflow-y-auto">
        <p className="px-3 py-2 text-2xs font-semibold uppercase tracking-wider text-prism-muted border-b border-border">
          Pick an operator
        </p>
        <div className="grid grid-cols-2">
          {OPERATORS.map((op) => (
            <button
              key={op.value}
              onClick={() => onPick({ kind: "operator", value: op.value })}
              className="px-3 py-2 flex items-center gap-2 text-left hover:bg-bg-hover cursor-pointer"
            >
              <span className="font-mono text-sm font-semibold text-prism-text-strong w-6 text-center">
                {op.value}
              </span>
              <span className="text-2xs text-prism-muted">{op.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (mode === "number") {
    return (
      <div className="rounded-md border border-border bg-panel shadow-lg p-3">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
          Enter a number
        </p>
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="number"
            value={numberDraft}
            onChange={(e) => setNumberDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && numberDraft.trim()) {
                onPick({ kind: "number", value: numberDraft.trim() })
              }
              if (e.key === "Escape") onClose()
            }}
            placeholder="e.g. 100"
            className="flex-1 h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
          />
          <button
            onClick={() => {
              if (numberDraft.trim()) {
                onPick({ kind: "number", value: numberDraft.trim() })
              }
            }}
            disabled={!numberDraft.trim()}
            className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover disabled:opacity-40 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    )
  }

  if (mode === "function") {
    const filtered = functions.filter(
      (f) =>
        f.name.toLowerCase().includes(functionSearch.toLowerCase()) ||
        f.description.toLowerCase().includes(functionSearch.toLowerCase())
    )
    return (
      <div className="rounded-md border border-border bg-panel shadow-lg max-h-72 overflow-hidden flex flex-col">
        <div className="px-3 py-2 border-b border-border shrink-0">
          <input
            autoFocus
            type="text"
            value={functionSearch}
            onChange={(e) => setFunctionSearch(e.target.value)}
            placeholder="Search functions..."
            className="w-full h-7 px-2 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-2xs text-prism-muted">
              No matches
            </p>
          ) : (
            filtered.map((fn) => (
              <button
                key={fn.name}
                onClick={() =>
                  onPick({ kind: "function", name: fn.name, args: [] })
                }
                className="w-full px-3 py-2 flex items-start gap-2 text-left hover:bg-bg-hover cursor-pointer"
              >
                <span className="font-mono text-xs text-prism-text-strong shrink-0 pt-0.5">
                  {fn.name}()
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-2xs text-prism-text">
                    {fn.description}
                  </p>
                  <p className="text-2xs text-prism-muted font-mono">
                    {fn.args}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    )
  }

  return null
}