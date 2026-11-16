import Link from "next/link"

import { avatarClass, formatAppliedAgo } from "@/lib/application-display"
import type { ApplicationStatus } from "@/lib/actions/applications"

import {
  applicationKey,
  type RecruiterApplication,
} from "../_data/applications"
import { ApplicationStatusSelect } from "./application-status-select"

const COLUMNS = ["Candidate", "Applied For", "Applied", "Status", "Details"]

type ApplicationsTableProps = {
  applications: RecruiterApplication[]
  savingId?: string | null
  onStatusChange: (
    application: RecruiterApplication,
    status: ApplicationStatus
  ) => void | Promise<void>
}

/** Desktop candidate table. The page handles loading; this file only draws rows. */
export function ApplicationsTable({
  applications,
  savingId,
  onStatusChange,
}: ApplicationsTableProps) {
  return (
    <div className="dark-scrollbar hidden overflow-x-auto lg:block">
      <table className="w-full min-w-205 border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/2">
            {COLUMNS.map((label) => (
              <th
                key={label}
                scope="col"
                className={`px-4 py-3 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase ${
                  label === "Details" ? "text-right" : ""
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr
              key={applicationKey(application)}
              className="border-b border-white/5 transition last:border-0 hover:bg-white/2"
            >
              <td className="px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${avatarClass(
                      application.applicantName
                    )}`}
                  >
                    {application.applicantName.charAt(0).toUpperCase() || "A"}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {application.applicantName || "Unnamed candidate"}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                      {application.applicantEmail}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3.5">
                <p className="max-w-55 truncate text-xs font-medium text-zinc-200">
                  {application.jobTitle}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                  {application.companyName}
                </p>
              </td>

              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-zinc-400">
                {formatAppliedAgo(application.appliedAt)}
              </td>

              <td className="px-4 py-3.5">
                <ApplicationStatusSelect
                  value={application.status}
                  disabled={savingId === applicationKey(application)}
                  label={`Status for ${application.applicantName}`}
                  onChange={(status) => onStatusChange(application, status)}
                />
              </td>

              <td className="px-4 py-3.5 text-right">
                <Link
                  href={`/browse-jobs/${application.jobId}`}
                  className="text-xs font-medium text-zinc-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
                >
                  View job
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
