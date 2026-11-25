"use client"

/**
 * Seeker job discovery page.
 *
 * Every job comes from the server (`getJobs`) in one request and the filters
 * run in the browser, so typing in the search box feels instant and does not
 * cause a round trip. Filters that are not supported by the API (saved jobs,
 * "closing soon") stay client-side on purpose.
 */

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  ArrowDownUp,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Globe2,
  LayoutGrid,
  List,
  RefreshCw,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react"

import { getStatus, type Job } from "@/app/dashboard/recruiter/_data/jobData"
import { toast } from "@/components/ui/toast"
import { saveJobAction, unsaveJobAction } from "@/lib/actions/saved-job-actions"
import { cn } from "@/lib/utils"

import { getPostedAt, JobCard } from "./job-card"

const PAGE_SIZE = 8
const DAY_IN_MS = 86_400_000

type SortKey = "recommended" | "newest" | "deadline" | "salary"
type WorkMode = "all" | "remote" | "onsite"
type ViewMode = "grid" | "list"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest first" },
  { value: "deadline", label: "Closing soonest" },
  { value: "salary", label: "Highest salary" },
]

const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
]

const controlClass =
  "h-9 rounded-lg border border-white/10 bg-[#15151B] px-3 text-xs text-zinc-200 transition-colors hover:border-white/20 focus:border-[#7C65FF]/60 focus:ring-2 focus:ring-[#7C65FF]/20 focus:outline-none"

function getPageItems(current: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = [...new Set([1, totalPages, current - 1, current, current + 1])]
    .filter((item) => item > 0 && item <= totalPages)
    .sort((a, b) => a - b)

  const items: (number | "gap")[] = []
  let previous = 0

  for (const item of pages) {
    if (previous && item - previous > 1) items.push("gap")
    items.push(item)
    previous = item
  }

  return items
}

function deadlineTime(job: Job) {
  if (!job.deadline) return Number.POSITIVE_INFINITY

  const time = new Date(`${job.deadline}T23:59:59Z`).getTime()

  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}

/** Deadlines that are within a week (and not already gone). */
function closesThisWeek(job: Job) {
  if (!job.deadline) return false

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

export function JobsBrowser({
  jobs,
  savedJobIds,
  loadError,
}: {
  jobs: Job[]
  savedJobIds: string[]
  loadError: string | null
}) {
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLElement>(null)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [workMode, setWorkMode] = useState<WorkMode>("all")
  const [includeClosed, setIncludeClosed] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>("recommended")
  const [view, setView] = useState<ViewMode>("grid")
  const [page, setPage] = useState(1)
  const [savedIds, setSavedIds] = useState<string[]>(savedJobIds)
  const [savingIds, setSavingIds] = useState<string[]>([])

  const deferredSearch = useDeferredValue(search)

  // "/" focuses the search box, like on most job boards.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable

      if (isTyping) return

      event.preventDefault()
      searchRef.current?.focus()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const activeJobs = useMemo(
    () => jobs.filter((job) => getStatus(job) === "Active"),
    [jobs]
  )

  const jobTypeOptions = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.jobType).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [jobs]
  )

  const categoryOptions = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b)
      ),
    [jobs]
  )

  const stats = useMemo(() => {
    const companies = new Set(
      activeJobs.map((job) => job.companyName.trim()).filter(Boolean)
    ).size

    const remote = activeJobs.filter((job) => job.isRemote).length

    const closingSoon = activeJobs.filter(closesThisWeek).length

    return [
      {
        label: "Open roles",
        value: activeJobs.length,
        hint: "ready for applications",
        icon: BriefcaseBusiness,
        accent: "rgba(124,101,255,0.55)",
      },
      {
        label: "Remote friendly",
        value: remote,
        hint: "work from anywhere",
        icon: Globe2,
        accent: "rgba(56,189,248,0.5)",
      },
      {
        label: "Companies hiring",
        value: companies,
        hint: "teams looking for talent",
        icon: Building2,
        accent: "rgba(52,211,153,0.45)",
      },
      {
        label: "Closing this week",
        value: closingSoon,
        hint: "apply before time runs out",
        icon: CalendarClock,
        accent: "rgba(251,191,36,0.5)",
      },
    ]
  }, [activeJobs])

  const hasFilters =
    search.trim().length > 0 ||
    category !== "all" ||
    jobTypes.length > 0 ||
    workMode !== "all" ||
    includeClosed

  const filteredJobs = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase()

    return jobs.filter((job) => {
      if (!includeClosed && getStatus(job) === "Expired") return false
      if (jobTypes.length > 0 && !jobTypes.includes(job.jobType)) return false
      if (workMode === "remote" && !job.isRemote) return false
      if (workMode === "onsite" && job.isRemote) return false
      if (category !== "all" && job.category !== category) return false

      if (!term) return true

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
  }, [jobs, deferredSearch, jobTypes, workMode, category, includeClosed])

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs]

    if (sortBy === "salary") {
      return list.sort(
        (a, b) => Number(b.maxSalary || 0) - Number(a.maxSalary || 0)
      )
    }

    if (sortBy === "deadline") {
      return list.sort((a, b) => deadlineTime(a) - deadlineTime(b))
    }

    if (sortBy === "newest") {
      return list.sort((a, b) => (getPostedAt(b) ?? 0) - (getPostedAt(a) ?? 0))
    }

    // Recommended: open roles first, then the freshest ones.
    return list.sort((a, b) => {
      const aClosed = getStatus(a) === "Expired" ? 1 : 0
      const bClosed = getStatus(b) === "Expired" ? 1 : 0

      if (aClosed !== bClosed) return aClosed - bClosed

      return (getPostedAt(b) ?? 0) - (getPostedAt(a) ?? 0)
    })
  }, [filteredJobs, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleJobs = sortedJobs.slice(startIndex, startIndex + PAGE_SIZE)

  // Any change to the filters starts the list from page one again.
  function chooseSearch(value: string) {
    setPage(1)
    setSearch(value)
  }

  function chooseCategory(value: string) {
    setPage(1)
    setCategory(value)
  }

  function chooseWorkMode(value: WorkMode) {
    setPage(1)
    setWorkMode(value)
  }

  function chooseSort(value: SortKey) {
    setPage(1)
    setSortBy(value)
  }

  function chooseIncludeClosed(value: boolean) {
    setPage(1)
    setIncludeClosed(value)
  }

  function toggleJobType(value: string) {
    setPage(1)
    setJobTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  function resetFilters() {
    setPage(1)
    setSearch("")
    setCategory("all")
    setJobTypes([])
    setWorkMode("all")
    setIncludeClosed(false)
    setSortBy("recommended")
  }

  async function toggleSaved(job: Job) {
    const id = job._id || job.id
    if (!id || savingIds.includes(id)) return

    const wasSaved = savedIds.includes(id)

    // Update the icon right away; roll it back if the API rejects the call.
    setSavedIds((current) =>
      wasSaved ? current.filter((item) => item !== id) : [...current, id]
    )
    setSavingIds((current) => [...current, id])

    try {
      if (wasSaved) {
        await unsaveJobAction(id)
      } else {
        await saveJobAction(id)
      }

      toast.add({
        title: wasSaved ? "Removed from saved jobs" : "Job saved",
        description: wasSaved
          ? `${job.title} was removed from your saved list.`
          : `${job.title} is saved to your account.`,
        type: wasSaved ? "info" : "success",
      })
    } catch (error) {
      setSavedIds((current) =>
        wasSaved
          ? current.includes(id)
            ? current
            : [...current, id]
          : current.filter((item) => item !== id)
      )

      toast.add({
        title: wasSaved ? "Could not remove the job" : "Could not save the job",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setSavingIds((current) => current.filter((item) => item !== id))
    }
  }

  function goToPage(nextPage: number) {
    setPage(nextPage)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const quickSuggestions = [
    workMode === "remote"
      ? null
      : { label: "Remote", onClick: () => chooseWorkMode("remote") },
    ...jobTypeOptions.slice(0, 2).map((value) => ({
      label: value,
      onClick: () => toggleJobType(value),
    })),
    categoryOptions[0]
      ? {
          label: categoryOptions[0],
          onClick: () => chooseCategory(categoryOptions[0]),
        }
      : null,
  ]
    .filter((item): item is { label: string; onClick: () => void } =>
      Boolean(item)
    )
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-6">
        {/* Hero + search ------------------------------------------------- */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0C0C11] px-5 py-8 sm:px-8 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,101,255,0.28),transparent_55%),radial-gradient(ellipse_at_80%_120%,rgba(56,189,248,0.18),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] [background-size:36px_36px] opacity-[0.12]"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C65FF]/30 bg-[#7C65FF]/10 px-3 py-1 text-[11px] font-medium text-[#C3BCFF]">
              <Sparkles className="size-3" aria-hidden="true" />
              Job discovery
            </span>

            <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              Find work that fits{" "}
              <span className="bg-gradient-to-r from-[#C3BCFF] via-[#8B7BFF] to-[#38BDF8] bg-clip-text text-transparent">
                your life
              </span>
              .
            </h1>

            <p className="mt-2.5 max-w-xl text-sm leading-6 text-zinc-400">
              {activeJobs.length > 0
                ? `${activeJobs.length.toLocaleString()} open ${
                    activeJobs.length === 1 ? "role" : "roles"
                  } from ${stats[2].value.toLocaleString()} ${
                    stats[2].value === 1 ? "company" : "companies"
                  }. Search, filter, and save the ones that feel right.`
                : "New roles land here as soon as recruiters publish them. Check back soon."}
            </p>

            <div className="mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">
              <div className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-[#111118]/90 px-3.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] transition-colors focus-within:border-[#7C65FF]/50 focus-within:ring-4 focus-within:ring-[#7C65FF]/10">
                <Search
                  className="size-4 shrink-0 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(event) => chooseSearch(event.target.value)}
                  type="search"
                  placeholder="Job title, company, skill, or city..."
                  aria-label="Search jobs"
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
                ) : (
                  <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:block">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {quickSuggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-zinc-500">
                  Quick filters:
                </span>

                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={suggestion.onClick}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-[#7C65FF]/40 hover:bg-[#7C65FF]/10 hover:text-white"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats ----------------------------------------------------------- */}
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

        {/* Filters --------------------------------------------------------- */}
        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0F0F13]">
          <div className="flex flex-col gap-3 p-3.5 sm:p-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                Filters
              </span>

              <label className="sr-only" htmlFor="job-category">
                Filter by category
              </label>
              <select
                id="job-category"
                value={category}
                onChange={(event) => chooseCategory(event.target.value)}
                className={controlClass}
              >
                <option value="all">All categories</option>
                {categoryOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <span
                aria-hidden="true"
                className="mx-1 hidden h-5 w-px bg-white/10 sm:block"
              />

              <div className="flex flex-wrap items-center gap-1.5">
                {jobTypeOptions.map((value) => {
                  const selected = jobTypes.includes(value)

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleJobType(value)}
                      aria-pressed={selected}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                        selected
                          ? "border-[#7C65FF]/50 bg-[#7C65FF]/15 text-white"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/25 hover:text-white"
                      )}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>

              <div
                role="group"
                aria-label="Work mode"
                className="flex items-center gap-0.5 rounded-full border border-white/10 bg-[#15151B] p-0.5"
              >
                {WORK_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => chooseWorkMode(mode.value)}
                    aria-pressed={workMode === mode.value}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      workMode === mode.value
                        ? "bg-white text-[#09090B]"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200">
                <input
                  type="checkbox"
                  checked={includeClosed}
                  onChange={(event) =>
                    chooseIncludeClosed(event.target.checked)
                  }
                  className="size-3.5 cursor-pointer accent-[#7C65FF]"
                />
                Include closed
              </label>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  Reset
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-500" aria-live="polite">
                {deferredSearch.trim() && deferredSearch !== search ? (
                  "Searching..."
                ) : (
                  <>
                    <span className="font-semibold text-white">
                      {sortedJobs.length.toLocaleString()}
                    </span>{" "}
                    {sortedJobs.length === 1 ? "role matches" : "roles match"}{" "}
                    {hasFilters ? "your filters" : "right now"}
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-2 text-[11px] text-zinc-500">
                  <ArrowDownUp className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">Sort jobs</span>
                  <select
                    value={sortBy}
                    onChange={(event) =>
                      chooseSort(event.target.value as SortKey)
                    }
                    className={controlClass}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

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
          </div>
        </div>

        {/* Results --------------------------------------------------------- */}
        <section
          ref={resultsRef}
          aria-label="Job results"
          className="mt-5 scroll-mt-6"
        >
          {loadError ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <AlertTriangle className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                Could not load jobs
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
          ) : visibleJobs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-500">
                <SearchX className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                {hasFilters
                  ? "No jobs match those filters"
                  : "No open roles right now"}
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                {hasFilters
                  ? "Try a shorter keyword, a different category, or reset the filters to see every open role again."
                  : "New roles land here as soon as recruiters publish them. Check back soon."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#7C65FF] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#6C5CFF]"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Reset filters
                </button>
              )}
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
                {visibleJobs.map((job, index) => {
                  const id = job._id || job.id || `${job.title}-${index}`
                  const jobId = job._id || job.id || ""

                  return (
                    <li key={id} className="min-w-0">
                      <JobCard
                        job={job}
                        view={view}
                        saved={jobId !== "" && savedIds.includes(jobId)}
                        onToggleSave={toggleSaved}
                      />
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-[11px] text-zinc-500">
                  Showing{" "}
                  <span className="font-medium text-zinc-300">
                    {startIndex + 1}-
                    {Math.min(startIndex + PAGE_SIZE, sortedJobs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-zinc-300">
                    {sortedJobs.length.toLocaleString()}
                  </span>{" "}
                  {sortedJobs.length === 1 ? "role" : "roles"}
                </p>

                {totalPages > 1 && (
                  <nav
                    aria-label="Job result pages"
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

                    {getPageItems(currentPage, totalPages).map((item, index) =>
                      item === "gap" ? (
                        <span
                          key={`gap-${index}`}
                          aria-hidden="true"
                          className="px-1 text-[11px] text-zinc-600"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          onClick={() => goToPage(item)}
                          aria-label={`Page ${item}`}
                          aria-current={
                            item === currentPage ? "page" : undefined
                          }
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                            item === currentPage
                              ? "border-[#7C65FF] bg-[#7C65FF] text-white"
                              : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                          )}
                        >
                          {item}
                        </button>
                      )
                    )}

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
