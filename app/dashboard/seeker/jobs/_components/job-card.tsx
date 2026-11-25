"use client"

/**
 * One job card in the seeker dashboard.
 *
 * The whole card is clickable through the title link (it stretches an invisible
 * overlay across the card). The bookmark button sits above that overlay so it
 * still receives its own clicks.
 */

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  Clock3,
  Globe2,
  Layers,
  MapPin,
} from "lucide-react"

import {
  formatDate,
  formatSalary,
  getStatus,
  type Job,
} from "@/app/dashboard/recruiter/_data/jobData"
import { cn } from "@/lib/utils"

const DAY_IN_MS = 86_400_000

const MONOGRAM_STYLES = [
  "border-[#7C65FF]/30 bg-[#7C65FF]/12 text-[#C3BCFF]",
  "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "border-rose-500/30 bg-rose-500/10 text-rose-300",
  "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
]

/** Same company always gets the same color. */
function monogramStyle(companyName: string) {
  let hash = 0

  for (let index = 0; index < companyName.length; index += 1) {
    hash = (hash + companyName.charCodeAt(index) * (index + 1)) % 997
  }

  return MONOGRAM_STYLES[hash % MONOGRAM_STYLES.length]
}

/**
 * Mongo ObjectIds start with the creation timestamp, so we can show a real
 * "posted" date even though the API does not send one.
 */
export function getPostedAt(job: Job): number | null {
  const id = job._id || job.id || ""

  if (!/^[a-f0-9]{24}$/i.test(id)) return null

  const timestamp = Number.parseInt(id.slice(0, 8), 16) * 1000

  return Number.isFinite(timestamp) ? timestamp : null
}

export function getPostedLabel(job: Job) {
  if (job.postedAgo) return `Posted ${job.postedAgo}`

  const postedAt = getPostedAt(job)
  if (!postedAt) return null

  const days = Math.floor((Date.now() - postedAt) / DAY_IN_MS)

  if (days <= 0) return "Posted today"
  if (days === 1) return "Posted yesterday"
  if (days < 30) return `Posted ${days}d ago`

  const months = Math.floor(days / 30)
  return months === 1 ? "Posted 1mo ago" : `Posted ${months}mo ago`
}

export function isNewJob(job: Job) {
  const postedAt = getPostedAt(job)
  if (!postedAt || getStatus(job) === "Expired") return false

  return Date.now() - postedAt < 3 * DAY_IN_MS
}

/** "Closes in 3 days" when the deadline is close, otherwise the date. */
export function getClosingLabel(job: Job) {
  if (getStatus(job) === "Expired") {
    return { label: "Closed", urgent: false }
  }

  if (!job.deadline) return { label: "No deadline", urgent: false }

  const deadline = new Date(`${job.deadline}T23:59:59Z`)

  if (Number.isNaN(deadline.getTime())) {
    return { label: "No deadline", urgent: false }
  }

  const days = Math.ceil((deadline.getTime() - Date.now()) / DAY_IN_MS)

  if (days <= 0) return { label: "Closes today", urgent: true }
  if (days <= 7) {
    return {
      label: days === 1 ? "Closes tomorrow" : `Closes in ${days} days`,
      urgent: true,
    }
  }

  return { label: `Closes ${formatDate(job.deadline)}`, urgent: false }
}

/** `formatLocation` would turn a plain "Remote" job into "Remote (Remote)". */
function jobLocation(job: Job) {
  const isJustRemote = (job.location ?? "").trim().toLowerCase() === "remote"

  return job.isRemote && isJustRemote
    ? "Remote"
    : job.isRemote
      ? `Remote (${job.location})`
      : job.location || "Location not set"
}

function Chip({
  icon: Icon,
  children,
  tone = "default",
}: {
  icon: LucideIcon
  children: React.ReactNode
  tone?: "default" | "success" | "accent"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap",
        tone === "success" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        tone === "accent" &&
          "border-[#7C65FF]/25 bg-[#7C65FF]/10 text-[#C3BCFF]",
        tone === "default" && "border-white/10 bg-white/[0.03] text-zinc-300"
      )}
    >
      <Icon className="size-3 opacity-70" aria-hidden="true" />
      {children}
    </span>
  )
}

type JobCardProps = {
  job: Job
  view: "grid" | "list"
  saved: boolean
  onToggleSave: (job: Job) => void
}

export function JobCard({ job, view, saved, onToggleSave }: JobCardProps) {
  const isClosed = getStatus(job) === "Expired"
  const salary = formatSalary(job)
  const hasSalary = Number(job.minSalary) > 0 || Number(job.maxSalary) > 0
  const posted = getPostedLabel(job)
  const closing = getClosingLabel(job)
  const newJob = isNewJob(job)
  const LocationIcon = job.isRemote ? Globe2 : MapPin
  const hasJobId = Boolean(job._id || job.id)
  const jobHref = hasJobId
    ? `/browse-jobs/${job._id || job.id}`
    : "/browse-jobs"

  const bookmark = (
    <button
      type="button"
      onClick={() => onToggleSave(job)}
      aria-label={
        saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`
      }
      aria-pressed={saved}
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-[#7C65FF]/60 focus-visible:outline-none",
        saved
          ? "border-[#7C65FF]/40 bg-[#7C65FF]/15 text-[#C3BCFF]"
          : "border-white/10 text-zinc-500 hover:border-white/25 hover:bg-white/[0.04] hover:text-white"
      )}
    >
      <Bookmark
        className={cn("size-3.5", saved && "fill-current")}
        aria-hidden="true"
      />
    </button>
  )

  const monogram = (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold",
        monogramStyle(job.companyName)
      )}
    >
      {job.companyName.charAt(0).toUpperCase() || "J"}
    </span>
  )

  if (view === "list") {
    return (
      <article
        className={cn(
          "group relative flex flex-col gap-4 rounded-2xl border bg-[#0F0F13] p-4 transition-all duration-300 sm:flex-row sm:items-center",
          isClosed
            ? "border-white/[0.05] opacity-65"
            : "border-white/[0.07] hover:border-[#7C65FF]/35 hover:bg-[#121218]"
        )}
      >
        <div className="flex min-w-0 items-start gap-3 sm:flex-1">
          {monogram}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="truncate text-sm font-semibold text-white">
                <Link
                  href={jobHref}
                  className="outline-none after:absolute after:inset-0 focus-visible:underline"
                >
                  {job.title}
                </Link>
              </h3>

              <span className="sm:hidden">{bookmark}</span>
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
              <span className="truncate text-zinc-400">{job.companyName}</span>
              <span aria-hidden="true" className="text-zinc-700">
                •
              </span>
              <span className="inline-flex items-center gap-1">
                <LocationIcon className="size-3" aria-hidden="true" />
                {jobLocation(job)}
              </span>
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {newJob && (
                <Chip icon={Clock3} tone="success">
                  New
                </Chip>
              )}
              <Chip icon={BriefcaseBusiness}>{job.jobType}</Chip>
              {job.category && <Chip icon={Layers}>{job.category}</Chip>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3 sm:min-w-[170px] sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">
              {hasSalary ? salary.range : "Salary not disclosed"}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {hasSalary
                ? salary.unit
                  ? `per ${salary.unit}`
                  : "Salary range"
                : job.jobType}
            </p>
          </div>

          <p
            className={cn(
              "text-[11px]",
              closing.urgent ? "text-amber-300" : "text-zinc-500"
            )}
          >
            {closing.label}
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {bookmark}
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition-colors group-hover:border-white/25 group-hover:text-white"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#0F0F13] p-5 transition-all duration-300",
        isClosed
          ? "border-white/[0.05] opacity-65"
          : "border-white/[0.07] hover:-translate-y-0.5 hover:border-[#7C65FF]/35 hover:shadow-[0_24px_50px_-24px_rgba(92,83,254,0.55)]"
      )}
    >
      {/* Accent line that appears on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7C65FF] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        {monogram}

        <div className="flex items-center gap-1.5">
          {newJob && (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-300 uppercase">
              New
            </span>
          )}
          {bookmark}
        </div>
      </div>

      <div className="mt-4 min-w-0">
        <h3 className="text-base leading-snug font-semibold text-white">
          <Link
            href={jobHref}
            className="line-clamp-2 outline-none after:absolute after:inset-0 focus-visible:underline"
          >
            {job.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-zinc-400">
          <span className="truncate">{job.companyName}</span>
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
          <LocationIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{jobLocation(job)}</span>
        </p>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        {hasSalary ? (
          <>
            <span className="text-lg font-semibold tracking-tight text-white">
              {salary.range}
            </span>
            {salary.unit && (
              <span className="text-[11px] text-zinc-500">/ {salary.unit}</span>
            )}
          </>
        ) : (
          <span className="text-sm text-zinc-400">Salary not disclosed</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip icon={BriefcaseBusiness}>{job.jobType}</Chip>
        <Chip icon={LocationIcon} tone={job.isRemote ? "accent" : "default"}>
          {job.isRemote ? "Remote" : "On-site"}
        </Chip>
        {job.category && <Chip icon={Layers}>{job.category}</Chip>}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <div className="min-w-0 text-[11px] text-zinc-500">
          {posted && <p className="truncate">{posted}</p>}

          <p
            className={cn(
              "mt-0.5 flex items-center gap-1",
              closing.urgent && "text-amber-300",
              isClosed && "text-zinc-500"
            )}
          >
            <CalendarClock className="size-3" aria-hidden="true" />
            {closing.label}
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-400 transition-colors group-hover:text-white">
          View job
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  )
}
