"use client"

/**
 * The desktop job table (only visible on xl screens and wider).
 * The page itself handles loading jobs; this file only draws the rows.
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

type JobTableProps = {
  jobs: Job[]
  onView: (job: Job) => void
  onDelete: (id: string) => Promise<boolean>
}

const COLUMNS = [
  { label: "Job Title & Dept" },
  { label: "Company & Location" },
  { label: "Type" },
  { label: "Compensation" },
  { label: "Applicants", className: "hidden 2xl:table-cell" },
  { label: "Status" },
  { label: "Deadline", className: "hidden 2xl:table-cell" },
]

export function JobTable({ jobs, onView, onDelete }: JobTableProps) {
  return (
    <div className="dark-scrollbar hidden overflow-x-auto xl:block">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.07]">
            {COLUMNS.map(({ label, className = "" }) => (
              <th
                key={label}
                scope="col"
                className={`px-4 py-3.5 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase ${className}`}
              >
                {label}
              </th>
            ))}

            <th
              scope="col"
              className="px-4 py-3.5 text-right text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => {
            const compensation = formatSalary(job)

            return (
              <tr
                key={job._id || job.id}
                className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
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
                </td>

                <td className="px-4 py-4">
                  <p className="text-xs font-medium whitespace-nowrap text-zinc-200">
                    {job.companyName}
                  </p>
                  <LocationLine job={job} />
                </td>

                <td className="px-4 py-4">
                  <TypeBadge jobType={job.jobType} />
                </td>

                <td className="px-4 py-4 text-xs whitespace-nowrap text-zinc-200">
                  {compensation.range}{" "}
                  <span className="text-zinc-500">/ {compensation.unit}</span>
                </td>

                <td className="hidden px-4 py-4 2xl:table-cell">
                  <Applicants count={job.applicants ?? 0} />
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={getStatus(job)} />
                </td>

                <td className="hidden px-4 py-4 2xl:table-cell">
                  <Deadline job={job} />
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end">
                    <JobActions job={job} onView={onView} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
