"use client"

import { useState } from "react"
import { UserPlus, MoreHorizontal, Shield, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PrismSelect } from "@/components/ui/prism/Select"

interface Member {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Editor" | "Viewer"
  initial: string
  you?: boolean
}

const members: Member[] = [
  { id: "u1", name: "Youssef", email: "youssef@acme.com", role: "Owner", initial: "Y", you: true },
  { id: "u2", name: "Sara Ahmed", email: "sara@acme.com", role: "Admin", initial: "S" },
  { id: "u3", name: "Omar Khaled", email: "omar@acme.com", role: "Editor", initial: "O" },
  { id: "u4", name: "Layla Hassan", email: "layla@acme.com", role: "Viewer", initial: "L" },
]

const roleIcon = {
  Owner: Crown,
  Admin: Shield,
  Editor: Shield,
  Viewer: Shield,
}

export function MembersSection() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteRole, setInviteRole] = useState<"Admin" | "Editor" | "Viewer">("Editor")

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
        <p className="text-2xs font-semibold uppercase tracking-wider text-prism-muted">
          Members · {members.length}
        </p>
        <button
          onClick={() => setInviteOpen(true)}
          className="h-6 px-2 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover flex items-center gap-1 cursor-pointer"
        >
          <UserPlus className="w-2.5 h-2.5" strokeWidth={2.25} />
          <span>Invite</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {inviteOpen && (
          <div className="rounded-md border border-accent bg-accent-subtle/40 p-2.5 space-y-2">
            <input
              type="email"
              placeholder="colleague@acme.com"
              className="w-full h-8 px-3 rounded-md border border-border bg-bg text-xs text-prism-text placeholder:text-prism-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-glow"
            />
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <PrismSelect
                  value={inviteRole}
                  onChange={(v) => setInviteRole(v as typeof inviteRole)}
                  size="sm"
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "Editor", label: "Editor" },
                    { value: "Viewer", label: "Viewer" },
                  ]}
                />
              </div>
              <button className="h-7 px-2.5 rounded-md bg-accent text-prism-accent-text text-2xs font-medium hover:bg-accent-hover cursor-pointer">
                Send
              </button>
              <button
                onClick={() => setInviteOpen(false)}
                className="h-7 px-2 rounded-md text-2xs text-prism-muted hover:bg-bg-hover cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          {members.map((m) => {
            const RoleIcon = roleIcon[m.role]
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-bg-hover group"
              >
                <div className="w-7 h-7 rounded-full bg-accent-subtle text-prism-accent flex items-center justify-center text-2xs font-semibold shrink-0">
                  {m.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-prism-text-strong truncate">
                    {m.name} {m.you && <span className="text-prism-muted">(you)</span>}
                  </p>
                  <p className="text-2xs text-prism-muted truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={cn(
                      "text-2xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1",
                      m.role === "Owner"
                        ? "bg-accent-subtle text-prism-accent"
                        : "bg-bg-hover text-prism-muted"
                    )}
                  >
                    <RoleIcon className="w-2.5 h-2.5" strokeWidth={2.25} />
                    {m.role}
                  </span>
                  {!m.you && (
                    <button
                      className="w-5 h-5 rounded-md flex items-center justify-center text-prism-muted opacity-0 group-hover:opacity-100 hover:bg-bg-hover cursor-pointer"
                      title="Member actions"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}