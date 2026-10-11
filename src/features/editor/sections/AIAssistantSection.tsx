"use client"

import { Sparkles, Send, Wand2 } from "lucide-react"
import { useState } from "react"

const suggestions = [
  "Add profit margin KPI to this section",
  "Compare this year vs last year",
  "Show top 5 products by region",
  "Make a new section for distributor performance",
]

export function AIAssistantSection() {
  const [input, setInput] = useState("")

  const submit = () => {
    if (!input.trim()) return
    // Placeholder — no backend yet
    console.log("AI prompt:", input)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-accent-subtle flex items-center justify-center shrink-0">
          <Sparkles className="w-3 h-3 text-prism-accent" strokeWidth={2} />
        </div>
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          AI Assistant
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-md bg-accent-subtle/50 border border-accent/20 p-3">
          <p className="text-xs text-prism-text leading-relaxed">
            Ask me to add charts, create sections, or compare data. I'll edit
            your dashboard for you.
          </p>
        </div>

        <div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted mb-2">
            Try asking
          </p>
          <div className="space-y-1">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="w-full text-left px-2.5 py-2 rounded-md border border-border bg-panel hover:border-accent hover:bg-accent-subtle/30 transition-colors text-xs text-prism-text flex items-start gap-2 cursor-pointer group"
              >
                <Wand2
                  className="w-3 h-3 text-prism-muted shrink-0 mt-0.5 group-hover:text-prism-accent transition-colors"
                  strokeWidth={1.75}
                />
                <span className="flex-1">{s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5 border-t border-border shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit()
            }}
            placeholder="Ask AI to edit your dashboard..."
            className="w-full h-9 pl-3 pr-9 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
          />
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="absolute right-1 top-1 w-7 h-7 rounded-md flex items-center justify-center bg-accent text-prism-accent-text hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Send"
          >
            <Send className="w-3 h-3" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  )
}