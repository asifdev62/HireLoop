import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { avatarClass, formatAppliedAgo } from "@/lib/application-display"

import type { ApplicationRow } from "../_data/applications"

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
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold ${avatarClass(
            application.companyName
          )}`}
        >
          {application.companyName.charAt(0).toUpperCase() || "J"}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {application.jobTitle}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
            {application.companyName} <span aria-hidden="true">•</span>{" "}
            {application.location}
          </p>
        </div>

        <ApplicationStatusBadge status={application.status} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-500">
        <span className="truncate">
          {application.jobType} <span aria-hidden="true">•</span> Applied{" "}
          {formatAppliedAgo(application.appliedAt)}
        </span>

        <Link
          href={`/browse-jobs/${application.jobId}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 font-medium text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-[#7C65FF]/60 focus-visible:outline-none"
        >
          Details
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </li>
  )
}
