"use client"

export interface TextRendererProps {
  config?: { text?: string }
}

export function Text({ config }: TextRendererProps) {
  return (
    <p className="text-xs text-prism-muted leading-relaxed">
      {config?.text ?? "Add a description or note here."}
    </p>
  )
}