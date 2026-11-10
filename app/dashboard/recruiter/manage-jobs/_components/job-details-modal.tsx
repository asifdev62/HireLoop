"use client"

/**
 * The "View Details" popup.
 * It shows the full job information in one scrollable card.
 */

import Link from "next/link"
import { useEffect } from "react"
import { Globe, MapPin, Pencil, X } from "lucide-react"

import {
  formatLocation,
  formatSalary,
  getDepartment,
  getStatus,
  type Job,
} from "../../_data/jobData"
import {
  Applicants,
  Deadline,
  JobIcon,
  StatusBadge,
  TypeBadge,
} from "./job-parts"

export function JobDetailsModal({
  job,
  onClose,
}: {
  job: Job
  onClose: () => void
}) {
  const jobId = job._id || job.id
  const compensation = formatSalary(job)
  const status = getStatus(job)

  // Press Escape to close, and stop the page behind from scrolling.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101014] shadow-2xl shadow-black/60"
      >
        {/* Title + close button */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <JobIcon job={job} />

            <div className="min-w-0">
              <h2
                id="job-details-title"
                className="truncate text-lg font-semibold text-white"
              >
                {job.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#9B8CFF]">
                {getDepartment(job)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Job information */}
        <div className="space-y-6 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Company
              </p>
              <p className="mt-1 text-sm text-zinc-200">{job.companyName}</p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Location
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-200">
                {job.isRemote ? (
                  <Globe className="size-4 shrink-0 text-zinc-500" />
                ) : (
                  <MapPin className="size-4 shrink-0 text-zinc-500" />
                )}
                {formatLocation(job)}
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Job Type
              </p>
              <div className="mt-1.5">
                <TypeBadge jobType={job.jobType} />
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Compensation
              </p>
              <p className="mt-1 text-sm whitespace-nowrap text-zinc-200">
                {compensation.range}{" "}
                <span className="text-zinc-500">/ {compensation.unit}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Applicants
              </p>
              <div className="mt-1.5">
                <Applicants count={job.applicants ?? 0} />
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Status
              </p>
              <div className="mt-1.5">
                <StatusBadge status={status} />
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Deadline
              </p>
              <div className="mt-1">
                <Deadline job={job} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-zinc-400 uppercase">
              Key Responsibilities
            </h3>
            <p className="mt-2 text-sm leading-6 whitespace-pre-line text-zinc-300">
              {job.responsibilities || "No responsibilities added yet."}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-zinc-400 uppercase">
              Qualifications & Requirements
            </h3>
            <p className="mt-2 text-sm leading-6 whitespace-pre-line text-zinc-300">
              {job.qualifications || "No qualifications added yet."}
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 border-t border-white/[0.07] p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Close
          </button>

          {jobId && (
            <Link
              href={`/dashboard/recruiter/edit-jobs/${jobId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F46E5]"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Update Job
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
