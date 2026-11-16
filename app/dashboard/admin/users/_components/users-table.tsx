
"use client"

import { formatJoinedDate, type ManagedUser } from "../_data/users"
import {
  UserActions,
  UserEmail,
  UserIdentity,
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
  onRoleChange: (
    id: string,
    role: ManagedUser["role"]
  ) => void
  updatingUserId: string | null
}

/** Desktop user table. */
export function UsersTable({
  users,
  onToggleSuspend,
  onDelete,
  onRoleChange,
  updatingUserId,
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
                className={`px-4 py-3 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase ${label === "Actions" ? "text-right" : ""
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
              {/* User */}
              <td className="px-4 py-3.5">
                <UserIdentity user={user} />
              </td>

              {/* Email */}
              <td className="max-w-60 px-4 py-3.5">
                <UserEmail user={user} />
              </td>

              {/* Role */}

              <td className="px-4 py-3.5">
                <select
                  value={user.role}
                  disabled={updatingUserId === user.id}
                  onChange={(e) =>
                    onRoleChange(
                      user.id,
                      e.target.value as ManagedUser["role"]
                    )
                  }
                  className="h-8 w-32 cursor-pointer rounded-md border border-white/10 bg-[#18181B] px-2 text-xs text-white outline-none focus:border-[#5C53FE] disabled:opacity-50"
                >
                  <option value="seeker" className="bg-[#18181B]">
                    Make Seeker
                  </option>

                  <option value="recruiter" className="bg-[#18181B]">
                    Make Recruiter
                  </option>

                  <option value="admin" className="bg-[#18181B]">
                    Make Admin
                  </option>
                </select>
              </td>


              {/* Join Date */}
              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-zinc-400">
                {formatJoinedDate(user.createdAt)}
              </td>

              {/* Status */}
              <td className="px-4 py-3.5">
                <UserStatusBadge banned={user.banned} />
              </td>

              {/* Actions */}
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
