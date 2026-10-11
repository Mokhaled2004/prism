"use client"

import { useEffect, useState } from "react"

export function RelativeTime({ ts, prefix }: { ts: number; prefix?: string }) {
  const [mounted, setMounted] = useState(false)
  const [label, setLabel] = useState("")

  useEffect(() => {
    setMounted(true)
    setLabel(relativeTime(ts))
    const id = setInterval(() => setLabel(relativeTime(ts)), 60000)
    return () => clearInterval(id)
  }, [ts])

  if (!mounted) {
    return <span>&nbsp;</span>
  }

  return (
    <span>
      {prefix ? `${prefix} ` : ""}
      {label}
    </span>
  )
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}