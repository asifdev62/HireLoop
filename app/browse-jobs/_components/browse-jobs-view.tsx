"use client"

/**
 * Browse Jobs view (client side).
 *
 * This file owns the small amount of UI state (search text, selected filters,
 * sort option, current page) and assembles the reusable pieces:
 *
 *   JobSearchBar  -> the search input + button
 *   JobFilters    -> the filter sidebar
 *   JobCard       -> one job listing
 *   Pagination    -> page switcher
 *
 * NOTE: the search and filter handlers do not change the URL yet. That is
 * marked with TODO below, so the query params can be implemented in one place.
 */

import { useState, type FormEvent } from "react"
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
const PAGE_SIZE = 4

/** Work mode is stored as a boolean (`isRemote`), so the options are local. */
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

const NO_FILTERS: SelectedFilters = {
  jobType: null,
  category: null,
  workMode: null,
}

/** Merge the shared option lists with values that only exist in the data. */
function uniqueValues(shared: string[], fromJobs: string[]) {
  return Array.from(new Set([...shared, ...fromJobs.filter(Boolean)]))
}

export function BrowseJobsView({ jobs }: { jobs: Job[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<SelectedFilters>(NO_FILTERS)
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value)
  const [page, setPage] = useState(1)

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // TODO: put `searchTerm` into the URL search params here.
  }

  function handleFilterToggle(groupId: FilterGroupId, value: string) {
    // Single-select: pick the new value, or clear it when it is already
    // selected (the radio itself cannot be unchecked).
    const nextValue = filters[groupId] === value ? null : value

    setFilters((previous) => ({ ...previous, [groupId]: nextValue }))

    // TODO: put `nextValue` into the URL search params here.
  }

  // Build the filter sidebar from the job fields + the shared option lists.
  const jobTypeValues = uniqueValues(
    JOB_TYPES,
    jobs.map((job) => job.jobType)
  )

  const categoryValues = uniqueValues(
    JOB_CATEGORIES,
    jobs.map((job) => job.category)
  )

  const filterGroups: FilterGroup[] = [
    {
      id: "jobType",
      title: "Job Type",
      options: jobTypeValues.map((value) => ({
        value,
        label: value,
        count: jobs.filter((job) => job.jobType === value).length,
        checked: filters.jobType === value,
      })),
    },
    {
      id: "category",
      title: "Category",
      options: categoryValues.map((value) => ({
        value,
        label: value,
        count: jobs.filter((job) => job.category === value).length,
        checked: filters.category === value,
      })),
    },
    {
      id: "workMode",
      title: "Work Mode",
      options: WORK_MODES.map(({ value, label }) => ({
        value,
        label,
        count: jobs.filter((job) =>
          value === "remote" ? job.isRemote : !job.isRemote
        ).length,
        checked: filters.workMode === value,
      })),
    },
  ]

  // Keep the list simple: slice the fetched jobs into pages.
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const firstJobIndex = (currentPage - 1) * PAGE_SIZE
  const visibleJobs = jobs.slice(firstJobIndex, firstJobIndex + PAGE_SIZE)

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
      <h1 className="sr-only">Browse Jobs</h1>

      <JobSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSubmit={handleSearch}
      />

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
