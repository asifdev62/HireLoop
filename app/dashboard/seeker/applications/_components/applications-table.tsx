import Link from "next/link"

import {
  companyLogoClass,
  formatAppliedAgo,
  type ApplicationRow,
} from "../_data/applications"
import { ApplicationStatusBadge } from "./application-status-badge"

const COLUMNS = ["Job Title", "Company", "Applied", "Status", "Action"]

export function ApplicationsTable({
  applications,
}: {
  applications: ApplicationRow[]
}) {
  return (
    <div className="dark-scrollbar hidden overflow-x-auto md:block">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/[0.02]">
            {COLUMNS.map((label) => (
              <th
                key={label}
                scope="col"
                className={`px-4 py-3 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase ${
                  label === "Action" ? "text-right" : ""
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
              key={application._id ?? application.jobId}
              className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.02]"
            >
              <td className="px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${companyLogoClass(
                      application.companyName
                    )}`}
                  >
                    {application.companyName.charAt(0).toUpperCase() || "J"}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {application.jobTitle}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {application.jobType} <span aria-hidden="true">•</span>{" "}
                      {application.location}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-zinc-300">
                {application.companyName}
              </td>

              <td className="px-4 py-3.5 text-xs whitespace-nowrap text-zinc-400">
                {formatAppliedAgo(application.appliedAt)}
              </td>

              <td className="px-4 py-3.5">
                <ApplicationStatusBadge status={application.status} />
              </td>

              <td className="px-4 py-3.5 text-right">
                <Link
                  href={`/browse-jobs/${application.jobId}`}
                  className="text-xs font-medium text-zinc-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
