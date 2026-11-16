"use client"

import { formatJoinedDate, type ManagedUser } from "../_data/users"
import {
  UserActions,
  UserEmail,
  UserIdentity,
  UserRoleBadge,
  UserStatusBadge,
} from "./user-parts"

const COLUMNS = [
  "User",
  "Email Address",
  "Role",
  "Join Date",
  "Status",
  "Actions",
]

type UsersTableProps = {
  users: ManagedUser[]
  onToggleSuspend: (user: ManagedUser) => void
  onDelete: (user: ManagedUser) => void
}

/** Desktop user table. The page handles filtering; this file only draws rows. */
export function UsersTable({
  users,
  onToggleSuspend,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="dark-scrollbar hidden overflow-x-auto lg:block">
      <table className="w-full min-w-270 border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/2">
            {COLUMNS.map((label) => (
              <th
                key={label}
                scope="col"
                className={`px-4 py-3 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase ${
                  label === "Actions" ? "text-right" : ""
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-white/5 transition last:border-0 hover:bg-white/2"
            >
              <td className="px-4 py-3.5">
                <UserIdentity user={user} />
              </td>

              <td className="max-w-60 px-4 py-3.5">
                <UserEmail user={user} />
              </td>

              <td className="px-4 py-3.5">
                <UserRoleBadge role={user.role} />
              </td>

              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-zinc-400">
                {formatJoinedDate(user.createdAt)}
              </td>

              <td className="px-4 py-3.5">
                <UserStatusBadge banned={user.banned} />
              </td>

              <td className="px-4 py-3.5">
                <UserActions
                  user={user}
                  onToggleSuspend={onToggleSuspend}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
