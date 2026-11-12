"use client"

/**
 * Browse Jobs view (client side).
 *
 * The search term and the filters are stored in the URL, so page.tsx can read
 * them on the server and pass them to the jobs API:
 *
 *   ?search=react        -> req.query.search
 *   ?jobType=Full-time   -> req.query.jobType
 *   ?category=Design     -> req.query.category
 *   ?isRemote=true       -> req.query.isRemote ("true" | "false")
 *
 * Every change builds a new query string and calls router.push(), which makes
 * the server page fetch the filtered jobs again.
 *
 * Only one filter group is active at a time: picking a job type clears the
 * category and work mode, and so on.
 */

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BriefcaseBusiness } from "lucide-react"

import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type Job,
} from "@/app/dashboard/recruiter/_data/jobData"

import { JobCard } from "./job-card"
import { JobFilters, type FilterGroup } from "./job-filters"
import { JobSearchBar } from "./job-search-bar"
import { Pagination } from "./pagination"

/** How many jobs are shown on one page. */
const PAGE_SIZE = 5

/** Work mode is stored in the URL as the boolean `isRemote`. */
const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
]

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
]

type FilterGroupId = "jobType" | "category" | "workMode"

/** Each group is single-select, so it holds one value or nothing. */
type SelectedFilters = Record<FilterGroupId, string | null>

/**
 * Combine the shared option lists with values that only exist in the jobs,
 * without adding the same option twice.
 */
function uniqueValues(sharedValues: string[], jobValues: string[]) {
  const values = [...sharedValues]

  for (const value of jobValues) {
    if (value && !values.includes(value)) {
      values.push(value)
    }
  }

  return values
}

/** The URL stores work mode as true/false, but the sidebar shows remote/onsite. */
function toWorkMode(isRemote: string | null) {
  if (isRemote === "true") return "remote"
  if (isRemote === "false") return "onsite"
  return null
}

/** Count the jobs that have the given value in the given field. */
function countJobs(
  jobs: Job[],
  field: "jobType" | "category" | "isRemote",
  value: string | boolean
) {
  let count = 0

  for (const job of jobs) {
    if (job[field] === value) {
      count += 1
    }
  }

  return count
}

export function BrowseJobsView({
  jobs,
  allJobs,
}: {
  jobs: Job[]
  allJobs: Job[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // The sort choice is kept in local state (it is not sent to the API).
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value)
  const [page, setPage] = useState(1)

  // One selected value per group, read straight from the URL.
  const filters: SelectedFilters = {
    jobType: searchParams.get("jobType"),
    category: searchParams.get("category"),
    workMode: toWorkMode(searchParams.get("isRemote")),
  }

  function handleFilterToggle(groupId: FilterGroupId, value: string) {
    const params = new URLSearchParams()

    // Keep the search term when a filter changes.
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    // Filters are single-select, so clicking the selected option clears it.
    const isSelected = filters[groupId] === value

    if (!isSelected) {
      // Work mode is a boolean on the API side, so map it to `isRemote`.
      if (groupId === "workMode") {
        params.set("isRemote", value === "remote" ? "true" : "false")
      } else {
        params.set(groupId, value)
      }
    }

    // A new filter means the old page number no longer makes sense.
    setPage(1)

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  // Build the sidebar from the unfiltered jobs so the counts stay stable
  // while a filter is selected.
  const jobTypeValues = uniqueValues(
    JOB_TYPES,
    allJobs.map((job) => job.jobType)
  )

  const categoryValues = uniqueValues(
    JOB_CATEGORIES,
    allJobs.map((job) => job.category)
  )

  const filterGroups: FilterGroup[] = [
    {
      id: "jobType",
      title: "Job Type",
      options: jobTypeValues.map((value) => ({
        value,
        label: value,
        count: countJobs(allJobs, "jobType", value),
        checked: filters.jobType === value,
      })),
    },
    {
      id: "category",
      title: "Category",
      options: categoryValues.map((value) => ({
        value,
        label: value,
        count: countJobs(allJobs, "category", value),
        checked: filters.category === value,
      })),
    },
    {
      id: "workMode",
      title: "Work Mode",
      options: WORK_MODES.map(({ value, label }) => ({
        value,
        label,
        count: countJobs(allJobs, "isRemote", value === "remote"),
        checked: filters.workMode === value,
      })),
    },
  ]

  // Show only the jobs for the current page.
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleJobs = jobs.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
      <h1 className="sr-only">Browse Jobs</h1>

      <JobSearchBar />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <JobFilters
          groups={filterGroups}
          onToggle={(groupId, value) =>
            handleFilterToggle(groupId as FilterGroupId, value)
          }
        />

        <section aria-label="Job results">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium text-zinc-300">
              Found{" "}
              <span className="font-semibold text-white">
                {jobs.length.toLocaleString()}
              </span>{" "}
              Professional {jobs.length === 1 ? "Job" : "Jobs"}
            </h2>

            <label className="flex items-center gap-2 text-xs text-zinc-500">
              Sort by:
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-md border border-white/10 bg-[#141418] px-2 py-1.5 text-xs text-zinc-200 focus:border-[#5C53FE]/60 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {visibleJobs.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#101014] p-10 text-center">
              <BriefcaseBusiness
                className="mx-auto size-8 text-zinc-600"
                aria-hidden="true"
              />

              <h3 className="mt-3 text-sm font-medium text-white">
                No jobs found
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Try a different keyword or remove some filters.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {visibleJobs.map((job) => (
                <li key={job._id || job.id || job.title}>
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </div>
    </div>
  )
}


