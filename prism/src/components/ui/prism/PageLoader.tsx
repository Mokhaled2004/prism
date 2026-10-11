import { Spinner } from "./Spinner"

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <Spinner size="lg" />
      <p className="text-xs text-prism-muted">{label}</p>
    </div>
  )
}