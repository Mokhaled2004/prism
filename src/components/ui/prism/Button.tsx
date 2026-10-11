"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "./Spinner"

export interface PrismButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md"
  loading?: boolean
  children: ReactNode
}

export function PrismButton({
  variant = "outline",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: PrismButtonProps) {
  const sizeClass = {
    sm: "h-7 px-2.5 text-xs gap-1.5",
    md: "h-8 px-3 text-xs gap-2",
  }[size]

  const variantClass = {
    primary:
      "bg-accent text-prism-accent-text border border-accent hover:bg-accent-hover hover:border-accent-hover active:brightness-95",
    outline:
      "bg-panel text-prism-text border border-border hover:bg-bg-hover hover:border-border-strong active:bg-bg-hover",
    ghost:
      "bg-transparent text-prism-text border border-transparent hover:bg-bg-hover active:bg-bg-hover",
    danger:
      "bg-danger text-white border border-danger hover:brightness-110 active:brightness-95",
  }[variant]

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium select-none",
        "transition-[background-color,border-color,color,filter,box-shadow] duration-100",
        "cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100",
        sizeClass,
        variantClass,
        className
      )}
      {...rest}
    >
      {loading && <Spinner size="xs" />}
      {children}
    </button>
  )
}