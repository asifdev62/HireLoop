"use client"

/**
 * Small display pieces shared by the desktop user table and the mobile cards.
 * Each component only renders one part of a user row.
 */

import type { LucideIcon } from "lucide-react"
import { BriefcaseBusiness, Check, ShieldCheck, User } from "lucide-react"

import { avatarClass } from "@/lib/application-display"

import { ROLE_OPTIONS, type ManagedUser, type UserRole } from "../_data/users"

const ROLE_META: Record<UserRole, { icon: LucideIcon; activeClass: string }> = {
  seeker: {
    icon: User,
    activeClass: "border-[#5C53FE]/30 bg-[#5C53FE]/15 text-[#C8C2FF]",
  },
  recruiter: {
    icon: BriefcaseBusiness,
    activeClass: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  },
  admin: {
    icon: ShieldCheck,
    activeClass: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  },
}

export function UserAvatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${avatarClass(
        name
      )}`}
    >
      {name.charAt(0).toUpperCase() || "U"}
    </span>
  )
}

export function UserIdentity({ user }: { user: ManagedUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={user.name} />

      <p className="truncate text-sm font-medium text-white">{user.name}</p>
    </div>
  )
}

export function UserEmail({ user }: { user: ManagedUser }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="truncate text-xs text-zinc-400">{user.email}</span>

      {user.emailVerified ? (
        <span title="Email verified" className="shrink-0 text-emerald-400">
          <Check className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Email verified</span>
        </span>
      ) : null}
    </div>
  )
}

export function UserRoleBadge({
  role,
  className = "",
}: {
  role: UserRole
  className?: string
}) {
  const meta = ROLE_META[role] ?? ROLE_META.seeker
  const Icon = meta.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap capitalize ${meta.activeClass} ${className}`}
    >
      <Icon className="size-3" aria-hidden="true" />
      {role}
    </span>
  )
}

export function UserStatusBadge({ banned }: { banned: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
        banned
          ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          banned ? "bg-rose-400" : "bg-emerald-400"
        }`}
      />
      {banned ? "Suspended" : "Active"}
    </span>
  )
}

type UserRoleToggleProps = {
  value: UserRole
  userName: string
  onChange: (role: UserRole) => void
  className?: string
}

/**
 * Three-way role picker for one user.
 *
 * The page owns the selection for now; the database write is added later, so
 * this component only reports the chosen role upwards.
 */
export function UserRoleToggle({
  value,
  userName,
  onChange,
  className = "",
}: UserRoleToggleProps) {
  return (
    <div
      role="group"
      aria-label={`Role for ${userName}`}
      className={`inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/2 p-0.5 ${className}`}
    >
      {ROLE_OPTIONS.map(({ value: role, label }) => {
        const Icon = ROLE_META[role].icon
        const isActive = role === value

        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            aria-pressed={isActive}
            aria-label={`Change ${userName}'s role to ${label}`}
            title={`Make ${label}`}
            className={`inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-md border px-2 text-[11px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none ${
              isActive
                ? ROLE_META[role].activeClass
                : "border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            <Icon className="size-3" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

type UserActionsProps = {
  user: ManagedUser
  onToggleSuspend: (user: ManagedUser) => void
  onDelete: (user: ManagedUser) => void
}

export function UserActions({
  user,
  onToggleSuspend,
  onDelete,
}: UserActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => onToggleSuspend(user)}
        aria-label={`${user.banned ? "Unsuspend" : "Suspend"} ${user.name}`}
        className={`text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none ${
          user.banned
            ? "text-emerald-400 hover:text-emerald-300"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        {user.banned ? "Unsuspend" : "Suspend"}
      </button>

      <button
        type="button"
        onClick={() => onDelete(user)}
        aria-label={`Delete ${user.name}`}
        className="text-[11px] font-medium text-rose-400 transition-colors hover:text-rose-300 focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
      >
        Delete
      </button>
    </div>
  )
}
