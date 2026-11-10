"use client"

/**
 * One job as a card. Shown on phones and tablets
 * (the table is only used on very wide screens).
 */

import {
  formatSalary,
  getDepartment,
  getStatus,
  type Job,
} from "../../_data/jobData"
import { JobActions } from "./job-actions"
import {
  Applicants,
  Deadline,
  JobIcon,
  LocationLine,
  StatusBadge,
  TypeBadge,
} from "./job-parts"

type MobileJobCardProps = {
  job: Job
  onView: (job: Job) => void
  onDelete: (id: string) => Promise<boolean>
}

export function MobileJobCard({ job, onView, onDelete }: MobileJobCardProps) {
  const compensation = formatSalary(job)
  const status = getStatus(job)

  return (
    <li className="p-4 sm:p-5">
      {/* Title row + actions menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <JobIcon job={job} />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {job.title}
            </p>
            <p className="mt-0.5 text-[11px] text-[#9B8CFF]">
              {getDepartment(job)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <StatusBadge status={status} />
          <JobActions job={job} onView={onView} onDelete={onDelete} />
        </div>
      </div>

      {/* Job details */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="col-span-2">
          <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
            Company &amp; Location
          </p>
          <p className="mt-1 text-xs text-zinc-200">{job.companyName}</p>
          <LocationLine job={job} />
        </div>

        <div>
          <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
            Type
          </p>
          <div className="mt-1.5">
            <TypeBadge jobType={job.jobType} />
          </div>
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
            Compensation
          </p>
          <p className="mt-1 text-xs whitespace-nowrap text-zinc-200">
            {compensation.range}{" "}
            <span className="text-zinc-500">/ {compensation.unit}</span>
          </p>
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
    </li>
  )
}
