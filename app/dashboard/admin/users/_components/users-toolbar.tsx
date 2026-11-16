"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ROLE_FILTER_OPTIONS, type UserRoleFilter } from "../_data/users"

type UsersToolbarProps = {
  search: string
  role: UserRoleFilter
  onSearchChange: (value: string) => void
  onRoleChange: (role: UserRoleFilter) => void
}

/** Search and role filter shown above the user table. */
export function UsersToolbar({
  search,
  role,
  onSearchChange,
  onRoleChange,
}: UsersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />

        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or email..."
          aria-label="Search users by name or email"
          className="border-white/10 bg-[#1C1C20] pl-9 text-white placeholder:text-zinc-500 focus-visible:ring-[#5C53FE]"
        />
      </div>

      <div className="w-full sm:w-44">
        <Select
          value={role}
          onValueChange={(value) =>
            onRoleChange((value ?? "all") as UserRoleFilter)
          }
        >
          <SelectTrigger
            className="w-full border-white/10 bg-[#1C1C20] text-white data-placeholder:text-zinc-500"
            aria-label="Filter users by role"
          >
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>

          <SelectContent className="border-white/10 bg-[#1C1C20] text-white ring-white/10">
            {ROLE_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
