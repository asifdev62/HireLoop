"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, FileText, Users } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { ApplicationsPagination } from "@/components/applications-pagination"
import { authClient } from "@/lib/auth-client"
import { getJobs } from "@/lib/api/jobs"
import {
  getApplicationsByJobIds,
  type ApplicationStatus,
  type JobApplication,
} from "@/lib/actions/applications"

import type { Job } from "../../_data/jobData"
import {
  applicationKey,
  type RecruiterApplication,
} from "../_data/applications"
import { ApplicationsStats } from "./applications-stats"
import { ApplicationsTable } from "./applications-table"
import { ApplicationsToolbar } from "./applications-toolbar"
import { MobileApplicationCard } from "./mobile-application-card"

const PAGE_SIZE = 8

const APPLICATIONS_URL = "/dashboard/recruiter/applications"

export function ApplicationsView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = authClient.useSession()
  const recruiterId = session?.user?.id

  // The selected job lives in the URL (?jobId=…), so links from Manage Jobs and
  // browser back/forward both keep working.
  const jobFilter = searchParams.get("jobId") ?? "all"

  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  // Status choices are local until the database write is added.
  const [statusById, setStatusById] = useState<
    Record<string, ApplicationStatus>
  >({})
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (isPending) return

    // Signed-out visitors have nothing to review.
    if (!recruiterId) return

    // Ignore the response if the user changes while it is still loading.
    let active = true

    async function loadApplications() {
      setLoading(true)
      setError(null)

      try {
        const jobsData = await getJobs()

        const jobList: Job[] = Array.isArray(jobsData)
          ? jobsData
          : Array.isArray(jobsData?.jobs)
            ? jobsData.jobs
            : []

        // Only the jobs this recruiter posted.
        const myJobs = jobList.filter((job) => job.recruiterId === recruiterId)

        const jobIds = myJobs
          .map((job) => job._id || job.id)
          .filter((id): id is string => Boolean(id))

        const data = await getApplicationsByJobIds(jobIds)
        const myJobIds = new Set(jobIds)

        if (active) {
          setJobs(myJobs)
          // Guard against an older API that ignores the `jobIds` query.
          setApplications(
            data.filter((application) => myJobIds.has(application.jobId))
          )
        }
      } catch (loadError) {
        console.error("Failed to load applications:", loadError)

        if (active) {
          setApplications([])
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load applications."
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadApplications()

    return () => {
      active = false
    }
  }, [isPending, recruiterId, reloadToken])

  // Search + job filter + the local status overrides, newest application first.
  const rows = useMemo<RecruiterApplication[]>(() => {
    const term = search.trim().toLowerCase()

    return applications
      .map((application) => ({
        ...application,
        status: statusById[applicationKey(application)] ?? application.status,
      }))
      .filter(
        (application) => jobFilter === "all" || application.jobId === jobFilter
      )
      .filter((application) => {
        if (!term) return true

        return (
          application.applicantName.toLowerCase().includes(term) ||
          application.applicantEmail.toLowerCase().includes(term) ||
          application.jobTitle.toLowerCase().includes(term)
        )
      })
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      )
  }, [applications, statusById, jobFilter, search])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleRows = rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Signed-out visitors are not loading anything.
  const isLoading = isPending || (loading && Boolean(recruiterId))
  const hasFilters = jobFilter !== "all" || search.trim().length > 0

  function handleJobFilterChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      params.delete("jobId")
    } else {
      params.set("jobId", value)
    }

    const query = params.toString()

    router.replace(query ? `${APPLICATIONS_URL}?${query}` : APPLICATIONS_URL, {
      scroll: false,
    })
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleStatusChange(
    application: RecruiterApplication,
    status: ApplicationStatus
  ) {
    setStatusById((previous) => ({
      ...previous,
      [applicationKey(application)]: status,
    }))

    toast.add({
      title: "Status updated",
      description: `${application.applicantName} is now "${status}". Database save is coming next.`,
      type: "success",
    })
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-350 px-4 pt-4 pb-6 sm:px-6 lg:px-8 lg:pt-6 lg:pb-8">
        {/* Header */}
        <header>
          <p className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
            Applicants
            <ChevronRight className="size-3" aria-hidden="true" />
            Application Review
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Job Applications
          </h1>

          <p className="mt-1.5 text-sm text-zinc-400">
            Review every candidate who applied to your job posts and move them
            through the hiring pipeline.
          </p>
        </header>

        <div className="mt-6">
          <ApplicationsStats applications={rows} />
        </div>

        <div className="mt-6">
          <ApplicationsToolbar
            jobs={jobs}
            jobFilter={jobFilter}
            search={search}
            onJobFilterChange={handleJobFilterChange}
            onSearchChange={handleSearchChange}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.07] bg-[#101014]">
          {isLoading ? (
            <p className="p-10 text-center text-sm text-zinc-400">
              Loading applications...
            </p>
          ) : error ? (
            <div className="p-10 text-center">
              <FileText
                className="mx-auto size-8 text-zinc-600"
                aria-hidden="true"
              />

              <h2 className="mt-3 text-sm font-medium">
                Could not load applications
              </h2>

              <p className="mt-1 text-xs text-zinc-500">{error}</p>

              <button
                type="button"
                onClick={() => setReloadToken((token) => token + 1)}
                className="mt-4 inline-flex rounded-lg border border-white/10 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : visibleRows.length === 0 ? (
            <div className="p-10 text-center">
              <Users
                className="mx-auto size-8 text-zinc-600"
                aria-hidden="true"
              />

              <h2 className="mt-3 text-sm font-medium">
                {hasFilters
                  ? "No matching applications"
                  : "No applications yet"}
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                {hasFilters
                  ? "Try a different job or search term."
                  : "Applications will appear here as candidates apply to your jobs."}
              </p>
            </div>
          ) : (
            <>
              <ApplicationsTable
                applications={visibleRows}
                onStatusChange={handleStatusChange}
              />

              <ul className="divide-y divide-white/6 lg:hidden">
                {visibleRows.map((application) => (
                  <MobileApplicationCard
                    key={applicationKey(application)}
                    application={application}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </ul>

              <ApplicationsPagination
                page={currentPage}
                pageSize={PAGE_SIZE}
                total={rows.length}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
