"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { useEditor } from "./store"
import type { EditorItem } from "./store"

export interface PropertiesModalProps {
  open: boolean
  itemId: string | null
  onClose: () => void
}

export function PropertiesModal({ open, itemId, onClose }: PropertiesModalProps) {
  const sections = useEditor((s) => s.sections)
  const activeId = useEditor((s) => s.activeId)

  const active = sections.find((s) => s.id === activeId)
  const layout = active?.layout ?? []

  let item: EditorItem | null = null
  if (itemId) {
    outer: for (const row of layout) {
      for (const col of row.columns) {
        const found = col.items.find((i) => i.id === itemId)
        if (found) {
          item = found
          break outer
        }
      }
    }
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null
  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-panel border border-border rounded-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-prism-text-strong">
              {item.type}
            </h2>
            <p className="text-xs text-prism-muted mt-0.5">
              Edit component properties
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-prism-muted hover:text-prism-text hover:bg-bg-hover shrink-0"
            title="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          <PropertyForm item={item} />
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-hover flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Panel schema types ───────────────────────────────────── */

type BooleanOption = { label: string; value: boolean }
type StringOption = { label: string; value: string }
type AnyOption = BooleanOption | StringOption

type FieldDef =
  | { kind: "text"; label: string; path: string; placeholder?: string }
  | { kind: "number"; label: string; path: string; min?: number; max?: number; step?: number }
  | { kind: "radio"; label: string; path: string; options: AnyOption[] }
  | { kind: "group"; label: string; fields: FieldDef[] }

const panels: Record<string, FieldDef[]> = {
  BarChart: [
    { kind: "text", label: "Title", path: "title" },
    {
      kind: "group",
      label: "Heading",
      fields: [
        { kind: "number", label: "Font size", path: "heading.fontSize", min: 8, max: 32 },
        {
          kind: "radio",
          label: "Align",
          path: "heading.align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        {
          kind: "radio",
          label: "Show heading",
          path: "heading.show",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Bar",
      fields: [
        {
          kind: "radio",
          label: "Orientation",
          path: "bar.orientation",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        },
        {
          kind: "radio",
          label: "Stacking",
          path: "bar.stacking",
          options: [
            { label: "None", value: "none" },
            { label: "Normal", value: "normal" },
            { label: "Percent", value: "percent" },
          ],
        },
        { kind: "number", label: "Width %", path: "bar.width", min: 10, max: 100 },
        { kind: "number", label: "Corner radius", path: "bar.radius", min: 0, max: 40 },
      ],
    },
    {
      kind: "group",
      label: "Axes",
      fields: [
        {
          kind: "radio",
          label: "X grid",
          path: "axes.x.showGrid",
          options: [
            { label: "On", value: true },
            { label: "Off", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Y grid",
          path: "axes.y.showGrid",
          options: [
            { label: "On", value: true },
            { label: "Off", value: false },
          ],
        },
        { kind: "number", label: "X tick rotation", path: "axes.x.tickRotation", min: -90, max: 90 },
      ],
    },
    {
      kind: "group",
      label: "Legend",
      fields: [
        {
          kind: "radio",
          label: "Show",
          path: "legend.show",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Position",
          path: "legend.position",
          options: [
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Data labels",
      fields: [
        {
          kind: "radio",
          label: "Show",
          path: "dataLabels.show",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Position",
          path: "dataLabels.position",
          options: [
            { label: "Top", value: "top" },
            { label: "Center", value: "center" },
            { label: "Inside", value: "inside" },
            { label: "Outside", value: "outside" },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Layout",
      fields: [
        { kind: "number", label: "Desktop height", path: "layout.desktop.height", min: 120, max: 1200 },
        { kind: "number", label: "Desktop width (cols)", path: "layout.desktop.width", min: 1, max: 12 },
      ],
    },
  ],

  LineChart: [
    { kind: "text", label: "Title", path: "title" },
    {
      kind: "group",
      label: "Line",
      fields: [
        {
          kind: "radio",
          label: "Smooth",
          path: "line.smooth",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Style",
          path: "line.style",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
        },
        { kind: "number", label: "Width", path: "line.width", min: 1, max: 8, step: 0.5 },
        {
          kind: "radio",
          label: "Show points",
          path: "line.showPoints",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Area fill",
          path: "line.areaFill",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        { kind: "number", label: "Area opacity", path: "line.areaOpacity", min: 0, max: 1, step: 0.05 },
      ],
    },
    {
      kind: "group",
      label: "Axes",
      fields: [
        {
          kind: "radio",
          label: "X grid",
          path: "axes.x.showGrid",
          options: [
            { label: "On", value: true },
            { label: "Off", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Y grid",
          path: "axes.y.showGrid",
          options: [
            { label: "On", value: true },
            { label: "Off", value: false },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Layout",
      fields: [
        { kind: "number", label: "Desktop height", path: "layout.desktop.height", min: 120, max: 1200 },
        { kind: "number", label: "Desktop width (cols)", path: "layout.desktop.width", min: 1, max: 12 },
      ],
    },
  ],

  AreaChart: [
    { kind: "text", label: "Title", path: "title" },
    {
      kind: "group",
      label: "Area",
      fields: [
        {
          kind: "radio",
          label: "Smooth",
          path: "line.smooth",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        { kind: "number", label: "Fill opacity", path: "line.fillOpacity", min: 0, max: 1, step: 0.05 },
        {
          kind: "radio",
          label: "Show stroke",
          path: "line.showStroke",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Stacked",
          path: "line.stack",
          options: [
            { label: "None", value: "none" },
            { label: "Normal", value: "normal" },
            { label: "Percent", value: "percent" },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Layout",
      fields: [
        { kind: "number", label: "Desktop height", path: "layout.desktop.height", min: 120, max: 1200 },
        { kind: "number", label: "Desktop width (cols)", path: "layout.desktop.width", min: 1, max: 12 },
      ],
    },
  ],

  PieChart: [
    { kind: "text", label: "Title", path: "title" },
    {
      kind: "group",
      label: "Pie",
      fields: [
        { kind: "number", label: "Inner radius %", path: "pie.innerRadius", min: 0, max: 90 },
        { kind: "number", label: "Outer radius %", path: "pie.outerRadius", min: 10, max: 100 },
        { kind: "number", label: "Start angle", path: "pie.startAngle", min: -360, max: 360 },
        {
          kind: "radio",
          label: "Label position",
          path: "pie.labelPosition",
          options: [
            { label: "Outside", value: "outside" },
            { label: "Inside", value: "inside" },
            { label: "None", value: "none" },
          ],
        },
        {
          kind: "radio",
          label: "Show percent",
          path: "pie.showPercent",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Show value",
          path: "pie.showValue",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Legend",
      fields: [
        {
          kind: "radio",
          label: "Show",
          path: "legend.show",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        {
          kind: "radio",
          label: "Position",
          path: "legend.position",
          options: [
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
      ],
    },
    {
      kind: "group",
      label: "Layout",
      fields: [
        { kind: "number", label: "Desktop height", path: "layout.desktop.height", min: 120, max: 1200 },
        { kind: "number", label: "Desktop width (cols)", path: "layout.desktop.width", min: 1, max: 12 },
      ],
    },
  ],
}

/* ─── Deep get / set helpers ───────────────────────────────── */

function getPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

function setPath(obj: any, path: string, value: any): Record<string, unknown> {
  const keys = path.split(".")
  const clone = { ...obj }
  let cur: any = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    cur[k] = cur[k] != null ? { ...cur[k] } : {}
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
  return clone
}

/* ─── Property form (schema-driven) ────────────────────────── */

function PropertyForm({ item }: { item: EditorItem }) {
  const updateProps = useEditor((s) => s.updateProps)
  const schema = panels[item.type]

  if (!schema) {
    return (
      <p className="text-xs text-prism-muted py-4">
        No editable properties for this component yet.
      </p>
    )
  }

  const update = (path: string, value: unknown) => {
    const next = setPath(item.props, path, value)
    updateProps(item.id, next as Record<string, unknown>)
  }

  return (
    <div className="space-y-5">
      {schema.map((field, i) => (
        <FieldRenderer
          key={i}
          field={field}
          props={item.props}
          update={update}
        />
      ))}
    </div>
  )
}

function FieldRenderer({
  field,
  props,
  update,
}: {
  field: FieldDef
  props: Record<string, unknown>
  update: (path: string, value: unknown) => void
}) {
  if (field.kind === "group") {
    return (
      <div className="space-y-3">
        <div className="text-2xs font-semibold uppercase tracking-wider text-prism-muted border-b border-border pb-1">
          {field.label}
        </div>
        <div className="space-y-3">
          {field.fields.map((f, i) => (
            <FieldRenderer key={i} field={f} props={props} update={update} />
          ))}
        </div>
      </div>
    )
  }

  const value = getPath(props, field.path)

  if (field.kind === "text") {
    return (
      <Field label={field.label}>
        <TextInput
          value={String(value ?? "")}
          onChange={(v) => update(field.path, v)}
          placeholder={field.placeholder}
        />
      </Field>
    )
  }

  if (field.kind === "number") {
    return (
      <Field label={field.label}>
        <NumberInput
          value={Number(value ?? 0)}
          onChange={(v) => update(field.path, v)}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      </Field>
    )
  }

  if (field.kind === "radio") {
    return (
      <Field label={field.label}>
        <RadioGroup
          value={value}
          onChange={(v) => update(field.path, v)}
          options={field.options}
        />
      </Field>
    )
  }

  return null
}

/* ─── Field primitives ─────────────────────────────────────── */

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

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
    />
  )
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
    />
  )
}

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: unknown
  onChange: (v: string | boolean) => void
  options: AnyOption[]
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={
              "h-7 px-3 rounded-md text-xs font-medium border transition-colors " +
              (isActive
                ? "bg-accent text-prism-accent-text border-accent"
                : "bg-panel text-prism-text border-border hover:bg-bg-hover")
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}