"use client"

import { useEffect, useState } from "react"
import { X, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PrismSelect } from "@/components/ui/prism/Select"
import { FormulaBuilder, type FormulaToken } from "./FormulaBuilder"
import { tokensToString, stringToTokens } from "./tokenToString"
import { mockDatasetFields, formulaFunctions } from "./mock"
import type { Calculation, CalculationType } from "./types"

export interface CalculationModalProps {
  open: boolean
  calculation: Calculation | null
  onClose: () => void
  onSave: (calc: Calculation) => void
}

const TYPE_OPTIONS: { value: CalculationType; label: string }[] = [
  { value: "number", label: "Number" },
  { value: "currency", label: "Currency" },
  { value: "percent", label: "Percent" },
  { value: "string", label: "Text" },
  { value: "boolean", label: "Boolean" },
]

export function CalculationModal({
  open,
  calculation,
  onClose,
  onSave,
}: CalculationModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [datasetId, setDatasetId] = useState("ds_1")
  const [tokens, setTokens] = useState<FormulaToken[]>([])
  const [type, setType] = useState<CalculationType>("number")
  const [decimals, setDecimals] = useState(2)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!calculation

  useEffect(() => {
    if (!open) return
    if (calculation) {
      setName(calculation.name)
      setDescription(calculation.description ?? "")
      setDatasetId(calculation.datasetId)
      setTokens(stringToTokens(calculation.formula))
      setType(calculation.type)
      setDecimals(calculation.decimals)
    } else {
      setName("")
      setDescription("")
      setDatasetId("ds_1")
      setTokens([])
      setType("number")
      setDecimals(2)
    }
    setError(null)
  }, [open, calculation])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const dataset = mockDatasetFields.find((d) => d.datasetId === datasetId)
  const fields = dataset?.fields ?? []

  const formula = tokensToString(tokens)

  const validate = (): string | null => {
    if (!name.trim()) return "Name is required"
    if (tokens.length === 0) return "Build a formula using the buttons below"
    for (const t of tokens) {
      if (t.kind === "field") {
        if (!fields.some((f) => f.name === t.fieldName)) {
          return `Unknown field: ${t.fieldName}`
        }
      }
    }
    const first = tokens[0]
    const last = tokens[tokens.length - 1]
    if (first.kind === "operator") return "Cannot start with an operator"
    if (last.kind === "operator") return "Formula ends with an operator"
    return null
  }

  const handleSave = () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    const now = Date.now()
    const next: Calculation = {
      id: calculation?.id ?? `calc_${Math.random().toString(36).slice(2, 10)}`,
      name: name.trim(),
      description: description.trim() || undefined,
      datasetId,
      formula,
      type,
      decimals,
      usedBy: calculation?.usedBy ?? 0,
      createdAt: calculation?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(next)
  }

  const previewValue = getPreviewValue(formula, type, decimals)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-prism-text-strong">
              {isEditing ? "Edit calculation" : "New calculation"}
            </h2>
            <p className="text-xs text-prism-muted mt-0.5">
              {isEditing
                ? "Update the formula and formatting"
                : "Pick fields and operators to build the formula"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0 cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 grid grid-cols-2 divide-x divide-border overflow-hidden">
          {/* Left */}
          <div className="flex flex-col min-h-0 overflow-y-auto p-6 space-y-4">
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(null)
                }}
                placeholder="e.g. Revenue"
                className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
              />
            </Field>

            <Field label="Description (optional)">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this calculation do?"
                className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
              />
            </Field>

            <Field label="Dataset">
              <PrismSelect
                value={datasetId}
                onChange={(v) => {
                  setDatasetId(v)
                  setError(null)
                }}
                options={mockDatasetFields.map((d) => ({
                  value: d.datasetId,
                  label: d.datasetName,
                }))}
              />
            </Field>

            <Field label="Formula">
              <FormulaBuilder
                tokens={tokens}
                onChange={(t) => {
                  setTokens(t)
                  setError(null)
                }}
                fields={fields}
                functions={formulaFunctions}
                error={error}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <PrismSelect
                  value={type}
                  onChange={(v) => setType(v as CalculationType)}
                  options={TYPE_OPTIONS}
                />
              </Field>

              <Field label="Decimal places">
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
                />
              </Field>
            </div>
          </div>

          {/* Right — preview */}
          <div className="flex flex-col min-h-0 bg-bg-hover/40">
            <div className="px-6 py-3 border-b border-border shrink-0">
              <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
                Preview
              </p>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
              <div>
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
                  Result (sample)
                </p>
                <div className="rounded-md border border-border bg-panel p-4">
                  <p className="text-3xl font-semibold text-prism-text-strong font-mono">
                    {previewValue}
                  </p>
                  <p className="text-2xs text-prism-muted mt-1">
                    Evaluated against sample row
                  </p>
                </div>
              </div>

              <div>
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
                  Formula
                </p>
                <div className="rounded-md border border-border bg-panel p-3 min-h-[44px]">
                  <p className="text-xs font-mono text-prism-text break-all">
                    {formula || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
                  Validation
                </p>
                {error ? (
                  <div className="rounded-md border border-danger bg-danger-subtle p-3 flex items-start gap-2">
                    <AlertCircle
                      className="w-3.5 h-3.5 text-prism-danger shrink-0 mt-0.5"
                      strokeWidth={2}
                    />
                    <p className="text-2xs text-prism-danger">{error}</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-border bg-panel p-3 flex items-start gap-2">
                    <Check
                      className="w-3.5 h-3.5 text-prism-ok shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <p className="text-2xs text-prism-text">
                      {tokens.length === 0
                        ? "Waiting for formula"
                        : "Valid expression"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
                  Available fields
                </p>
                <div className="rounded-md border border-border bg-panel divide-y divide-border">
                  {fields.map((f) => (
                    <div
                      key={f.id}
                      className="px-3 py-1.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-prism-text">
                        {f.name}
                      </span>
                      <span className="text-2xs text-prism-muted">
                        {f.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg-hover flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md border border-border bg-panel text-xs font-medium text-prism-text hover:bg-bg-hover cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover cursor-pointer"
          >
            {isEditing ? "Save changes" : "Create calculation"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-2xs font-semibold uppercase tracking-wider text-prism-muted">
        {label}
      </label>
      {children}
    </div>
  )
}

function getPreviewValue(
  formula: string,
  type: CalculationType,
  decimals: number
): string {
  if (!formula.trim()) return "—"
  const samples: Record<CalculationType, number> = {
    number: 247.5,
    currency: 2476.5,
    percent: 24.8,
    string: 0,
    boolean: 1,
  }
  if (type === "string") return '"Coffee"'
  if (type === "boolean") return "true"
  const value = samples[type]
  if (type === "currency") {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`
  }
  if (type === "percent") return `${value.toFixed(decimals)}%`
  return value.toFixed(decimals)
}