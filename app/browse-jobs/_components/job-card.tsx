"use client"

/**
 * One public job listing card.
 *
 * Shows the company initial, title, company + location, and a row of small
 * chips (salary, job type, work mode, status). The top-right button is only a
 * placeholder for the job details page.
 */

import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  BriefcaseBusiness,
  DollarSign,
  Globe,
  MapPin,
} from "lucide-react"

import {
  formatLocation,
  formatSalary,
  getStatus,
  type Job,
} from "@/app/dashboard/recruiter/_data/jobData"
import Link from "next/link"

function Chip({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] whitespace-nowrap text-zinc-300">
      <Icon className="size-3 text-zinc-500" aria-hidden="true" />
      {children}
    </span>
  )
}

/** `formatLocation` would turn a plain "Remote" job into "Remote (Remote)". */
function jobLocation(job: Job) {
  const isJustRemote = (job.location ?? "").trim().toLowerCase() === "remote"

  return job.isRemote && isJustRemote ? "Remote" : formatLocation(job)
}

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job)
  const status = getStatus(job)
  const LocationIcon = job.isRemote ? Globe : MapPin

  return (
    <Link href={`/browse-jobs/${job._id}`}>
    <article className="rounded-xl border border-white/[0.07] bg-[#101014] p-4 transition-colors hover:border-white/15 hover:bg-[#141418] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {/* Company "logo" placeholder */}
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#5C53FE]/25 bg-[#5C53FE]/10 text-sm font-semibold text-[#A79EFF]"
          >
            {job.companyName.charAt(0).toUpperCase() || "J"}
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white sm:text-base">
              {job.title}
            </h3>

            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-zinc-500">
              <span className="truncate">{job.companyName}</span>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1">
                <LocationIcon className="size-3" aria-hidden="true" />
                {jobLocation(job)}
              </span>
            </p>
          </div>
        </div>

        {/* TODO: link to the job details page when it exists. */}
        <button
          type="button"
          aria-label={`Open ${job.title}`}
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-500 transition-colors hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Chip icon={DollarSign}>
          {salary.range} <span className="text-zinc-500">/ {salary.unit}</span>
        </Chip>

        <Chip icon={BriefcaseBusiness}>{job.jobType}</Chip>

        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
            status === "Active"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-white/10 bg-white/[0.03] text-zinc-400"
          }`}
        >
          {status}
        </span>
      </div>
    </article>
  </Link>
  )
}
