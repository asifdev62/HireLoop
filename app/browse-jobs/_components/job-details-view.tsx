import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ChartNoAxesColumn,
  Clock,
  Globe,
  HeartPulse,
  Laptop,
  Layers,
  MapPin,
  PiggyBank,
  Plane,
  Tag,
  Wallet,
} from "lucide-react"

import {
  formatSalary,
  getDepartment,
  type Job,
} from "@/app/dashboard/recruiter/_data/jobData"

import { JobDetailsActions, VisitWebsiteButton } from "./job-details-actions"

/** The API does not store experience yet, so show a fixed range. */
const EXPERIENCE = "5+ Years"

/** Company facts that the jobs API does not store yet. */
const COMPANY_SIZE = "250 - 500 Employees"

/** Shown on every job until the API stores real benefits. */
const BENEFITS: { icon: LucideIcon; label: string }[] = [
  { icon: HeartPulse, label: "Full Health & Dental" },
  { icon: PiggyBank, label: "Competitive 401k" },
  { icon: Laptop, label: "Latest Hardware Stipend" },
  { icon: Plane, label: "Unlimited PTO" },
]

/** `formatLocation` would turn a plain "Remote" job into "Remote (Remote)". */
function formatJobLocation(job: Job) {
  const location = (job.location ?? "").trim()
  const isJustRemote = location.toLowerCase() === "remote"

  if (job.isRemote) {
    return isJustRemote ? "Remote" : `Remote (${location})`
  }

  return location || "Not specified"
}

/** The API stores responsibilities and qualifications as one text blob. */
function toBullets(text?: string) {
  return (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
}

/** Reads naturally in the summary: "is based in Dhaka" vs "is fully remote". */
function describeWorkplace(job: Job) {
  const location = (job.location ?? "").trim()

  if (!job.isRemote) {
    return location ? `based in ${location}` : "based wherever you are"
  }

  return location.toLowerCase() === "remote"
    ? "fully remote"
    : `remote, with the team based in ${location}`
}

/** A short summary built from the fields the API actually returns. */
function buildDescription(job: Job) {
  const jobType = job.jobType ? job.jobType.toLowerCase() : "full-time"

  return `${job.companyName} is hiring a ${job.title} to join the ${getDepartment(
    job
  )} team. This ${jobType} role is ${describeWorkplace(
    job
  )}, and you will work closely with cross-functional partners to ship work that matters.`
}

/** Small chips that summarise the role, built from the job's own fields. */
function buildTags(job: Job) {
  const tags = [
    { icon: Tag, label: job.category },
    { icon: Layers, label: job.department ?? "" },
    { icon: Clock, label: job.jobType },
    {
      icon: job.isRemote ? Globe : MapPin,
      label: job.isRemote ? "Remote" : "On-site",
    },
  ]

  const seen = new Set<string>()

  return tags.filter((tag) => {
    if (!tag.label || seen.has(tag.label)) return false

    seen.add(tag.label)
    return true
  })
}

function SectionTitle({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="text-sm font-semibold text-white">
      {children}
    </h3>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-2.5 text-sm leading-6 text-zinc-400"
        >
          <span
            aria-hidden="true"
            className="mt-[9px] size-1.5 shrink-0 rounded-full bg-zinc-600"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function JobDetailsView({ job }: { job: Job }) {
  const salary = formatSalary(job)
  const responsibilities = toBullets(job.responsibilities)
  const qualifications = toBullets(job.qualifications)
  const tags = buildTags(job)
  const initial = job.companyName.charAt(0).toUpperCase() || "J"

  const stats: {
    icon: LucideIcon
    label: string
    value: string
    suffix?: string
  }[] = [
    {
      icon: Wallet,
      label: "Salary Range",
      value: salary.range,
      suffix: `/ ${salary.unit}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: formatJobLocation(job),
    },
    {
      icon: Clock,
      label: "Job Type",
      value: job.jobType || "Not specified",
    },
    {
      icon: ChartNoAxesColumn,
      label: "Experience",
      value: EXPERIENCE,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
      {/* Job header */}
      <header className="rounded-2xl border border-white/[0.07] bg-[#101014] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-[#5C53FE]/25 bg-[#5C53FE]/10 text-lg font-semibold text-[#A79EFF]"
            >
              {initial}
            </span>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {job.title}
              </h1>

              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
                <span className="truncate">{job.companyName}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-emerald-400"
                  />
                  Verified Employer
                </span>
              </p>
            </div>
          </div>

          <JobDetailsActions jobTitle={job.title} />
        </div>
      </header>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          {/* Quick facts */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ icon: Icon, label, value, suffix }) => (
              <div
                key={label}
                className="rounded-xl border border-white/[0.07] bg-[#101014] p-4"
              >
                <dt className="flex items-center gap-2 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-3 text-sm font-semibold break-words text-white">
                  {value}
                  {suffix ? (
                    <span className="ml-1 text-xs font-normal text-zinc-500">
                      {suffix}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          {/* Job description */}
          <section
            aria-labelledby="job-description-heading"
            className="rounded-2xl border border-white/[0.07] bg-[#101014] p-5 sm:p-6 lg:p-7"
          >
            <h2
              id="job-description-heading"
              className="text-base font-semibold text-white"
            >
              Job Description
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {buildDescription(job)}
            </p>

            <div className="mt-7">
              <SectionTitle>Responsibilities</SectionTitle>

              {responsibilities.length > 0 ? (
                <BulletList items={responsibilities} />
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  No responsibilities added yet.
                </p>
              )}
            </div>

            <div className="mt-7">
              <SectionTitle>Requirements</SectionTitle>

              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-zinc-300"
                  >
                    <Icon className="size-3 text-zinc-500" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>

              {qualifications.length > 0 ? (
                <BulletList items={qualifications} />
              ) : (
                <p className="mt-4 text-sm text-zinc-500">
                  No qualifications added yet.
                </p>
              )}
            </div>

            <div className="mt-7">
              <SectionTitle>Benefits</SectionTitle>

              <ul className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {BENEFITS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-xs text-zinc-300"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                      <Icon
                        className="size-3.5 text-zinc-400"
                        aria-hidden="true"
                      />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Company overview */}
        <aside className="min-w-0">
          <section
            aria-labelledby="company-overview-heading"
            className="rounded-2xl border border-white/[0.07] bg-[#101014] p-5"
          >
            <h2
              id="company-overview-heading"
              className="text-base font-semibold text-white"
            >
              Company Overview
            </h2>

            {/* The API has no company cover image yet, so draw a placeholder. */}
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A0E]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(92,83,254,0.35),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(56,189,248,0.18),transparent_60%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 [background-image:linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] [background-size:28px_28px] opacity-20"
              />

              <div className="relative flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-semibold text-white backdrop-blur-sm">
                  {initial}
                </span>
                <span className="text-sm font-medium text-white/80">
                  {job.companyName}
                </span>
                <span className="text-[11px] text-white/45">
                  {getDepartment(job)}
                </span>
              </div>
            </div>

            <dl className="mt-5 space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
                  Size
                </dt>
                <dd className="text-xs font-medium text-zinc-300">
                  {COMPANY_SIZE}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
                  Industry
                </dt>
                <dd className="truncate text-xs font-medium text-zinc-300">
                  {job.category || "Not specified"}
                </dd>
              </div>
            </dl>

            <VisitWebsiteButton companyName={job.companyName} />
          </section>
        </aside>
      </div>
    </div>
  )
}
