"use client"

import Link from "next/link"
import { useDeferredValue, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Globe2,
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  SearchX,
  Sparkles,
  X,
} from "lucide-react"

import { getStatus } from "@/app/dashboard/recruiter/_data/jobData"
import { JobCard } from "@/app/dashboard/seeker/jobs/_components/job-card"
import { toast } from "@/components/ui/toast"
import { unsaveJobAction } from "@/lib/actions/saved-job-actions"
import type { SavedJob } from "@/lib/actions/saved-jobs"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 8
const DAY_IN_MS = 86_400_000

type ViewMode = "grid" | "list"

function jobId(job: SavedJob) {
  return job._id || job.id || ""
}

function deadlineTime(job: SavedJob) {
  if (!job.deadline) return Number.POSITIVE_INFINITY

  const time = new Date(`${job.deadline}T23:59:59Z`).getTime()

  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}

/** Saved jobs whose deadline is within a week and not already gone. */
function closesThisWeek(job: SavedJob) {
  if (!job.deadline || getStatus(job) === "Expired") return false

  const days = Math.ceil((deadlineTime(job) - Date.now()) / DAY_IN_MS)

  return days >= 0 && days <= 7
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: LucideIcon
  label: string
  value: number
  hint: string
  accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-4 transition-colors hover:border-white/15">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ background: accent }}
      />

      <div className="relative flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium tracking-[0.14em] text-zinc-500 uppercase">
          {label}
        </span>
        <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      <p className="relative mt-3 text-2xl font-semibold tracking-tight text-white">
        {value.toLocaleString()}
      </p>
      <p className="relative mt-0.5 truncate text-[11px] text-zinc-500">
        {hint}
      </p>
    </div>
  )
}

export function SavedJobsBrowser({
  jobs,
  loadError,
}: {
  jobs: SavedJob[]
  loadError: string | null
}) {
  const router = useRouter()

  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [view, setView] = useState<ViewMode>("grid")
  const [page, setPage] = useState(1)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const deferredSearch = useDeferredValue(search)

  // The server list minus the jobs removed in this session. Keeping this as a
  // derived value means a re-render with fresh props never overwrites it.
  const items = useMemo(
    () => jobs.filter((job) => !removedIds.includes(jobId(job))),
    [jobs, removedIds]
  )

  const stats = useMemo(() => {
    const active = items.filter((job) => getStatus(job) !== "Expired")
    const remote = active.filter((job) => job.isRemote).length
    const closingSoon = items.filter(closesThisWeek).length

    return [
      {
        label: "Saved roles",
        value: items.length,
        hint: "kept for later",
        icon: Bookmark,
        accent: "rgba(124,101,255,0.55)",
      },
      {
        label: "Still open",
        value: active.length,
        hint: "ready to apply",
        icon: BriefcaseBusiness,
        accent: "rgba(52,211,153,0.45)",
      },
      {
        label: "Remote friendly",
        value: remote,
        hint: "work from anywhere",
        icon: Globe2,
        accent: "rgba(56,189,248,0.5)",
      },
      {
        label: "Closing this week",
        value: closingSoon,
        hint: "apply before time runs out",
        icon: CalendarClock,
        accent: "rgba(251,191,36,0.5)",
      },
    ]
  }, [items])

  const filteredJobs = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase()
    if (!term) return items

    return items.filter((job) => {
      const haystack = [
        job.title,
        job.companyName,
        job.location,
        job.category,
        job.jobType,
        job.responsibilities,
        job.qualifications,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [items, deferredSearch])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleJobs = filteredJobs.slice(startIndex, startIndex + PAGE_SIZE)

  function chooseSearch(value: string) {
    setPage(1)
    setSearch(value)
  }

  async function removeSaved(job: SavedJob) {
    const id = jobId(job)
    if (!id || removingId === id) return

    setRemovingId(id)
    // Remove it right away; restore the card if the API rejects the request.
    setRemovedIds((current) => [...current, id])

    try {
      await unsaveJobAction(id)

      toast.add({
        title: "Removed from saved jobs",
        description: `${job.title} was removed from your saved jobs.`,
        type: "info",
      })
    } catch (error) {
      setRemovedIds((current) => current.filter((item) => item !== id))

      toast.add({
        title: "Could not remove the job",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setRemovingId(null)
    }
  }

  function goToPage(nextPage: number) {
    setPage(nextPage)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-6">
        {/* Hero ----------------------------------------------------------- */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0C0C11] px-5 py-8 sm:px-8 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,101,255,0.28),transparent_55%),radial-gradient(ellipse_at_80%_120%,rgba(56,189,248,0.18),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] [background-size:36px_36px] opacity-[0.12]"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C65FF]/30 bg-[#7C65FF]/10 px-3 py-1 text-[11px] font-medium text-[#C3BCFF]">
                <Sparkles className="size-3" aria-hidden="true" />
                Saved jobs
              </span>

              <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Keep the roles that{" "}
                <span className="bg-gradient-to-r from-[#C3BCFF] via-[#8B7BFF] to-[#38BDF8] bg-clip-text text-transparent">
                  caught your eye
                </span>
                .
              </h1>

              <p className="mt-2.5 max-w-xl text-sm leading-6 text-zinc-400">
                {items.length > 0
                  ? `${items.length.toLocaleString()} saved ${
                      items.length === 1 ? "role" : "roles"
                    } waiting for you. Open one to apply, or remove the ones that are not a fit.`
                  : "Tap the bookmark on any job to keep it here for later."}
              </p>
            </div>

            <Link
              href="/dashboard/seeker/jobs"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
            >
              <Search className="size-3.5" aria-hidden="true" />
              Find more jobs
            </Link>
          </div>
        </section>

        {/* Stats ---------------------------------------------------------- */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              accent={stat.accent}
            />
          ))}
        </div>

        {/* Toolbar -------------------------------------------------------- */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex h-10 flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-[#111118]/90 px-3.5 transition-colors focus-within:border-[#7C65FF]/50 focus-within:ring-4 focus-within:ring-[#7C65FF]/10 sm:max-w-md">
            <Search
              className="size-4 shrink-0 text-zinc-500"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => chooseSearch(event.target.value)}
              type="search"
              placeholder="Search your saved jobs..."
              aria-label="Search saved jobs"
              className="h-full w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />

            {search ? (
              <button
                type="button"
                onClick={() => chooseSearch("")}
                aria-label="Clear search"
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-[11px] text-zinc-500" aria-live="polite">
              <span className="font-semibold text-white">
                {filteredJobs.length.toLocaleString()}
              </span>{" "}
              {filteredJobs.length === 1 ? "job" : "jobs"}
            </p>

            <div
              role="group"
              aria-label="Layout"
              className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#15151B] p-0.5"
            >
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md transition-colors",
                  view === "grid"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-white"
                )}
              >
                <LayoutGrid className="size-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md transition-colors",
                  view === "list"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-white"
                )}
              >
                <List className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Results -------------------------------------------------------- */}
        <section aria-label="Saved jobs" className="mt-5">
          {loadError ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <AlertTriangle className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                Could not load saved jobs
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                {loadError} Try again in a moment.
              </p>

              <button
                type="button"
                onClick={() => router.refresh()}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#7C65FF]/25 bg-[#7C65FF]/10 text-[#C3BCFF]">
                <Bookmark className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                No saved jobs yet
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                Open any job and press the bookmark icon to keep it here. Saved
                jobs are tied to your account, on every device.
              </p>

              <Link
                href="/dashboard/seeker/jobs"
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#7C65FF] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#6C5CFF]"
              >
                <Search className="size-3.5" aria-hidden="true" />
                Browse jobs
              </Link>
            </div>
          ) : visibleJobs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-500">
                <SearchX className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                No saved jobs match that search
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                Try a shorter keyword, or clear the search to see every saved
                job again.
              </p>

              <button
                type="button"
                onClick={() => chooseSearch("")}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
              >
                <X className="size-3.5" aria-hidden="true" />
                Clear search
              </button>
            </div>
          ) : (
            <>
              <ul
                className={cn(
                  view === "grid"
                    ? "grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                    : "flex flex-col gap-3"
                )}
              >
                {visibleJobs.map((job, index) => (
                  <li
                    key={jobId(job) || `${job.title}-${index}`}
                    className="min-w-0"
                  >
                    <JobCard
                      job={job}
                      view={view}
                      saved
                      onToggleSave={removeSaved}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-[11px] text-zinc-500">
                  Showing{" "}
                  <span className="font-medium text-zinc-300">
                    {startIndex + 1}-
                    {Math.min(startIndex + PAGE_SIZE, filteredJobs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-zinc-300">
                    {filteredJobs.length.toLocaleString()}
                  </span>{" "}
                  {filteredJobs.length === 1 ? "saved job" : "saved jobs"}
                </p>

                {totalPages > 1 && (
                  <nav
                    aria-label="Saved job pages"
                    className="flex items-center gap-1"
                  >
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                      className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>

                    <span className="px-2 text-[11px] text-zinc-400">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      aria-label="Next page"
                      className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
