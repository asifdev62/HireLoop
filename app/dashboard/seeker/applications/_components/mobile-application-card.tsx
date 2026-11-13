import Link from "next/link"

import {
  companyLogoClass,
  formatAppliedAgo,
  type ApplicationRow,
} from "../_data/applications"
import { ApplicationStatusBadge } from "./application-status-badge"

export function MobileApplicationCard({
  application,
}: {
  application: ApplicationRow
}) {
  return (
    <li className="p-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${companyLogoClass(
            application.companyName
          )}`}
        >
          {application.companyName.charAt(0).toUpperCase() || "J"}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {application.jobTitle}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
            {application.companyName}
          </p>
        </div>

        <ApplicationStatusBadge status={application.status} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-zinc-500">
        <span className="truncate">
          {application.jobType} <span aria-hidden="true">•</span>{" "}
          {application.location}
        </span>

        <span className="shrink-0">
          {formatAppliedAgo(application.appliedAt)}
        </span>
      </div>

      <Link
        href={`/browse-jobs/${application.jobId}`}
        className="mt-3 inline-flex text-xs font-medium text-zinc-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
      >
        Details
      </Link>
    </li>
  )
}
