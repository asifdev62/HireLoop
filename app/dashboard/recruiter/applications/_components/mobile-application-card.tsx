import Link from "next/link"

import { avatarClass, formatAppliedAgo } from "@/lib/application-display"
import type { ApplicationStatus } from "@/lib/actions/applications"

import {
  applicationKey,
  type RecruiterApplication,
} from "../_data/applications"
import { ApplicationStatusSelect } from "./application-status-select"

type MobileApplicationCardProps = {
  application: RecruiterApplication
  onStatusChange: (
    application: RecruiterApplication,
    status: ApplicationStatus
  ) => void
}

/** One candidate as a card, shown below the `lg` breakpoint. */
export function MobileApplicationCard({
  application,
  onStatusChange,
}: MobileApplicationCardProps) {
  return (
    <li className="p-4 sm:p-5" key={applicationKey(application)}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${avatarClass(
            application.applicantName
          )}`}
        >
          {application.applicantName.charAt(0).toUpperCase() || "A"}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {application.applicantName || "Unnamed candidate"}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
            {application.applicantEmail}
          </p>
        </div>

        <span className="shrink-0 text-[11px] text-zinc-500">
          {formatAppliedAgo(application.appliedAt)}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
        <p className="truncate text-xs font-medium text-zinc-200">
          {application.jobTitle}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
          {application.companyName}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <ApplicationStatusSelect
          value={application.status}
          label={`Status for ${application.applicantName}`}
          onChange={(status) => onStatusChange(application, status)}
          className="w-36"
        />

        <Link
          href={`/browse-jobs/${application.jobId}`}
          className="text-xs font-medium text-zinc-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
        >
          View job
        </Link>
      </div>
    </li>
  )
}
