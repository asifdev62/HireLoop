"use client"

/**
 * Manage Jobs page.
 *
 * This file only does three things:
 *   1. Loads the jobs from the API.
 *   2. Deletes a job when the user asks.
 *   3. Draws the page layout (header, loading/error/empty states).
 *
 * The smaller UI pieces live in ./_components so they stay easy to read.
 */

import Link from "next/link"
import { useEffect, useState } from "react"
import { BriefcaseBusiness, ChevronRight, Plus } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { deleteJob, getJobs } from "@/lib/api/jobs"

import type { Job } from "../_data/jobData"
import { JobDetailsModal } from "./_components/job-details-modal"
import { JobTable } from "./_components/job-table"
import { MobileJobCard } from "./_components/mobile-job-card"

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Load every job once when the page opens.
  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs()

        const jobList: Job[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : []

        setJobs(jobList)
      } catch (loadError) {
        console.error("Failed to fetch jobs:", loadError)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  // Delete a job and remove it from the list on screen.
  async function handleDelete(id: string): Promise<boolean> {
    try {
      const data = await deleteJob(id)

      if (data?.deletedCount === 0) {
        toast.add({
          title: "Job Not Found!",
          description: "This job could not be found.",
          type: "error",
        })
        return false
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => (job._id || job.id) !== id)
      )

      toast.add({
        title: "Job Deleted",
        description: "The job has been permanently deleted.",
        type: "success",
      })
      return true
    } catch (deleteError) {
      console.error("Delete error:", deleteError)
      toast.add({
        title: "Delete Failed!",
        description: "This job could not be deleted.",
        type: "error",
      })
      return false
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-6 sm:px-6 lg:px-8 lg:pt-6 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
              Manage Jobs
              <ChevronRight className="size-3" aria-hidden="true" />
              Job Listings &amp; Postings
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Manage Job Posts
            </h1>

            <p className="mt-1.5 text-sm text-zinc-400">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/add-jobs"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition hover:bg-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] focus-visible:outline-none sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            New Job Post
          </Link>
        </div>

        {/* Job postings list */}
        <div className="mt-7 overflow-hidden rounded-xl border border-white/[0.07] bg-[#09090B]">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto size-7 animate-spin rounded-full border-2 border-[#5C53FE] border-t-transparent" />

              <p className="mt-3 text-sm text-zinc-400">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <BriefcaseBusiness className="mx-auto size-8 text-zinc-600" />

              <h2 className="mt-3 text-sm font-medium">Failed to load jobs</h2>

              <p className="mt-1 text-xs text-zinc-500">
                Please check your connection and try again.
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-10 text-center">
              <BriefcaseBusiness className="mx-auto size-8 text-zinc-600" />

              <h2 className="mt-3 text-sm font-medium">No jobs found</h2>

              <p className="mt-1 text-xs text-zinc-500">
                Create your first job post to start hiring.
              </p>

              <Link
                href="/dashboard/recruiter/add-jobs"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F46E5]"
              >
                <Plus className="size-4" aria-hidden="true" />
                New Job Post
              </Link>
            </div>
          ) : (
            <>
              {/* Table — xl and up */}
              <JobTable
                jobs={jobs}
                onView={setSelectedJob}
                onDelete={handleDelete}
              />

              {/* Cards — below xl */}
              <ul className="divide-y divide-white/[0.06] xl:hidden">
                {jobs.map((job) => (
                  <MobileJobCard
                    key={job._id || job.id}
                    job={job}
                    onView={setSelectedJob}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Details popup */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}
