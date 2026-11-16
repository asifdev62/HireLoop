"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ChevronRight, Plus, Users } from "lucide-react"

import { TablePagination } from "@/components/table-pagination"
import { toast } from "@/components/ui/toast"

import type { ManagedUser, UserRoleFilter } from "../_data/users"
import { MobileUserCard } from "./mobile-user-card"
import { UsersStats } from "./users-stats"
import { UsersTable } from "./users-table"
import { UsersToolbar } from "./users-toolbar"

const PAGE_SIZE = 8

type UsersManagementProps = {
  initialUsers: ManagedUser[]
  /** Set when the server could not read the Better Auth user list. */
  loadError?: string | null
}

export function UsersManagement({
  initialUsers,
  loadError = null,
}: UsersManagementProps) {
  const router = useRouter()

  // Role changes are local until the admin API write is added. Keeping the
  // whole list in state makes the table, mobile cards, and stats agree.
  const [users] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("all")
  const [page, setPage] = useState(1)

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()

    return users
      .filter((user) => roleFilter === "all" || user.role === roleFilter)
      .filter((user) => {
        if (!term) return true

        return (
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [users, roleFilter, search])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleRows = rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )
  const hasFilters = search.trim().length > 0 || roleFilter !== "all"

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleRoleFilterChange(value: UserRoleFilter) {
    setRoleFilter(value)
    setPage(1)
  }

  function handleToggleSuspend(user: ManagedUser) {
    toast.add({
      title: user.banned ? "Unsuspend user" : "Suspend user",
      description: `${user.name} was not changed yet. Connect the admin API to enable this action.`,
      type: "info",
    })
  }

  function handleDelete(user: ManagedUser) {
    toast.add({
      title: "Delete user",
      description: `Deleting ${user.name} is not connected yet.`,
      type: "info",
    })
  }

  function handleInviteUser() {
    // TODO: open the invite dialog and call the admin create-user endpoint.
    toast.add({
      title: "Invite user",
      description: "The invite flow is not connected yet.",
      type: "info",
    })
  }

  function resetFilters() {
    setSearch("")
    setRoleFilter("all")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-350 px-4 pt-4 pb-6 sm:px-6 lg:px-8 lg:pt-6 lg:pb-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
              Admin
              <ChevronRight className="size-3" aria-hidden="true" />
              Manage Users
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              User Management
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-zinc-400">
              Review, filter, and manage platform access for all users.
            </p>
          </div>

          <button
            type="button"
            onClick={handleInviteUser}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5C53FE] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#6D65FF] focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
          >
            <Plus className="size-4" aria-hidden="true" />
            Invite User
          </button>
        </header>

        {loadError ? (
          <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#101014] p-10 text-center">
            <AlertCircle
              className="mx-auto size-8 text-rose-400/80"
              aria-hidden="true"
            />

            <h2 className="mt-3 text-sm font-medium">Could not load users</h2>

            <p className="mt-1 text-xs text-zinc-500">{loadError}</p>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-4 inline-flex rounded-lg border border-white/10 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <UsersStats users={users} />
            </div>

            <div className="mt-6">
              <UsersToolbar
                search={search}
                role={roleFilter}
                onSearchChange={handleSearchChange}
                onRoleChange={handleRoleFilterChange}
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.07] bg-[#101014]">
              {visibleRows.length === 0 ? (
                <div className="p-10 text-center">
                  <Users
                    className="mx-auto size-8 text-zinc-600"
                    aria-hidden="true"
                  />

                  <h2 className="mt-3 text-sm font-medium">
                    {hasFilters ? "No matching users" : "No users yet"}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    {hasFilters
                      ? "Try a different name, email, or role."
                      : "User accounts will appear here after they sign up."}
                  </p>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 inline-flex rounded-lg border border-white/10 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <UsersTable
                    users={visibleRows}
                    onToggleSuspend={handleToggleSuspend}
                    onDelete={handleDelete}
                  />

                  <ul className="divide-y divide-white/6 lg:hidden">
                    {visibleRows.map((user) => (
                      <MobileUserCard
                        key={user.id}
                        user={user}
                        onToggleSuspend={handleToggleSuspend}
                        onDelete={handleDelete}
                      />
                    ))}
                  </ul>

                  <TablePagination
                    page={currentPage}
                    pageSize={PAGE_SIZE}
                    total={rows.length}
                    itemLabel="user"
                    onPageChange={setPage}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
