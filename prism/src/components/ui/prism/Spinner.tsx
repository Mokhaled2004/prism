import { cn } from "@/lib/utils"

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  const sizeClass = {
    xs: "w-3 h-3 border",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
  }[size]

  return (
    <span
      className={cn(
        "inline-block rounded-full border-border border-t-accent animate-spin",
        sizeClass,
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}