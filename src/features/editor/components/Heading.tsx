"use client"

export interface HeadingRendererProps {
  config?: { text?: string; level?: 1 | 2 | 3 }
}

export function Heading({ config }: HeadingRendererProps) {
  const text = config?.text ?? "Heading"
  const level = config?.level ?? 2

  const cls =
    level === 1
      ? "text-xl font-semibold text-prism-text-strong"
      : level === 3
        ? "text-sm font-medium text-prism-text-strong"
        : "text-lg font-semibold text-prism-text-strong"

  return <div className={cls}>{text}</div>
}