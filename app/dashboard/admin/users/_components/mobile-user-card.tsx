"use client"

import { formatJoinedDate, type ManagedUser } from "../_data/users"
import {
  UserActions,
  UserEmail,
  UserIdentity,
  UserRoleBadge,
  UserStatusBadge,
} from "./user-parts"

type MobileUserCardProps = {
  user: ManagedUser
  onToggleSuspend: (user: ManagedUser) => void
  onDelete: (user: ManagedUser) => void
}

/** Compact row used below the desktop breakpoint. */
export function MobileUserCard({
  user,
  onToggleSuspend,
  onDelete,
}: MobileUserCardProps) {
  return (
    <li className="space-y-3.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <UserIdentity user={user} />
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <UserRoleBadge role={user.role} />
          <UserStatusBadge banned={user.banned} />
        </div>
      </div>

      <UserEmail user={user} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-zinc-500">
          Joined {formatJoinedDate(user.createdAt)}
        </p>

        <UserActions
          user={user}
          onToggleSuspend={onToggleSuspend}
          onDelete={onDelete}
        />
      </div>
    </li>
  )
}
