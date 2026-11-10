"use client"

/**
 * Small display pieces shared by the manage-jobs table, cards, and modal.
 * Each component only renders one little part of a job row.
 */

import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  Code2,
  Globe,
  MapPin,
  Megaphone,
  PenTool,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react"

import {
  formatDate,
  formatLocation,
  getDepartment,
  getStatus,
  type Job,
} from "../../_data/jobData"

/** Icon + colors for the department square on the left of a job title. */
const departmentStyles: Record<
  string,
  { icon: LucideIcon; iconClass: string }
> = {
  Engineering: {
    icon: Code2,
    iconClass: "border-[#7C65FF]/25 bg-[#7C65FF]/10 text-[#A79EFF]",
  },
  Design: {
    icon: PenTool,
    iconClass: "border-orange-500/25 bg-orange-500/10 text-orange-400",
  },
  Infrastructure: {
    icon: Server,
    iconClass: "border-sky-500/25 bg-sky-500/10 text-sky-400",
  },
  Backend: {
    icon: Server,
    iconClass: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
  },
  Marketing: {
    icon: Megaphone,
    iconClass: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300",
  },
  Quality: {
    icon: ShieldCheck,
    iconClass: "border-teal-500/25 bg-teal-500/10 text-teal-300",
  },
}

function getDepartmentStyle(department: string) {
  const match = Object.keys(departmentStyles).find((key) =>
    department.toLowerCase().includes(key.toLowerCase())
  )

  return (
    (match ? departmentStyles[match] : undefined) ?? {
      icon: BriefcaseBusiness,
      iconClass: "border-white/10 bg-white/5 text-zinc-300",
    }
  )
}

export function JobIcon({ job }: { job: Job }) {
  const { icon: Icon, iconClass } = getDepartmentStyle(getDepartment(job))

  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${iconClass}`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}

export function TypeBadge({ jobType }: { jobType: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] whitespace-nowrap text-zinc-300">
      {jobType}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active"

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
        isActive
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-white/5 text-zinc-400"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? "bg-emerald-400" : "bg-zinc-500"
        }`}
      />
      {status}
    </span>
  )
}

export function Applicants({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-zinc-400">
      <Users className="size-3.5 text-zinc-500" aria-hidden="true" />
      <span className="font-medium text-zinc-200">{count}</span> Candidates
    </span>
  )
}

export function LocationLine({ job }: { job: Job }) {
  const Icon = job.isRemote ? Globe : MapPin

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{formatLocation(job)}</span>
    </p>
  )
}

export function Deadline({ job }: { job: Job }) {
  const status = getStatus(job)

  return (
    <>
      <p className="text-xs whitespace-nowrap text-zinc-200">
        {formatDate(job.deadline)}
      </p>
      <p className="mt-1 text-[11px] whitespace-nowrap text-zinc-500">
        {status === "Active"
          ? job.postedAgo
            ? `Posted ${job.postedAgo}`
            : "Posted recently"
          : "Closed"}
      </p>
    </>
  )
}
