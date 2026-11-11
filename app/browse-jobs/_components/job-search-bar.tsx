"use client"

/**
 * The search bar at the top of the browse-jobs page.
 * It puts the typed keyword into the URL as `?search=...`, and page.tsx reads
 * that param on the server (see browse-jobs-view.tsx / page.tsx).
 */

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import type { FormEvent } from "react"

export function JobSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const search = String(formData.get("searchField") ?? "").trim()

    // Empty search = clear everything and show all jobs again.
    if (!search) {
      router.push("/browse-jobs")
      return
    }

    // Keep the other params (the active filter) and only change `search`.
    const params = new URLSearchParams(searchParams.toString())
    params.set("search", search)

    router.push(`/browse-jobs?${params.toString()}`)
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#141418] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2.5 px-2">
        <Search className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />

        <input
        name="searchField"
          type="text"
          placeholder="Search by job title, keywords..."
          aria-label="Search by job title or keywords"
          className="h-9 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="h-9 shrink-0 rounded-lg bg-white px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        Search Jobs
      </button>
    </form>
  )
}

