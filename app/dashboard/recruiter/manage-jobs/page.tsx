import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  Globe,
  MapPin,
  Megaphone,
  MoreVertical,
  PenTool,
  Pencil,
  Plus,
  Server,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react"

import type { JobData } from "@/lib/actions/jobs"

type JobStatus = "Active" | "Expired"

type JobPost = JobData & {
  id: string
  // Display-only grouping shown under the job title in the table.
  department: string
  applicants: number
  status: JobStatus
  postedAgo: string
}

const jobs: JobPost[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    companyName: "HirePulse Network",
    category: "Engineering & Tech",
    department: "Engineering",
    location: "New York, USA",
    deadline: "2025-05-30",
    minSalary: 25,
    maxSalary: 40,
    salaryFrequency: "per hour",
    responsibilities:
      "Build and maintain responsive web interfaces using React and Next.js.",
    qualifications:
      "3+ years of frontend experience with React, TypeScript, and modern CSS.",
    jobType: "Full-time",
    isRemote: true,
    applicants: 34,
    status: "Active",
    postedAgo: "2d ago",
  },
  {
    id: "job-2",
    title: "Senior Product Designer",
    companyName: "HirePulse Labs",
    category: "Design & Creative",
    department: "Design",
    location: "London, UK (Hybrid)",
    deadline: "2025-06-14",
    minSalary: 90000,
    maxSalary: 115000,
    salaryFrequency: "per year",
    responsibilities:
      "Own the end-to-end product design process, from research to polished UI.",
    qualifications:
      "5+ years of product design experience and a strong portfolio of shipped work.",
    jobType: "Full-time",
    isRemote: false,
    applicants: 19,
    status: "Active",
    postedAgo: "1w ago",
  },
  {
    id: "job-3",
    title: "DevOps Specialist",
    companyName: "HirePulse Platform",
    category: "Engineering & Tech",
    department: "Infrastructure",
    location: "Berlin, Germany",
    deadline: "2025-06-30",
    minSalary: 95000,
    maxSalary: 120000,
    salaryFrequency: "per year",
    responsibilities:
      "Maintain CI/CD pipelines, cloud infrastructure, and production monitoring.",
    qualifications:
      "Hands-on experience with AWS, Docker, Kubernetes, and infrastructure as code.",
    jobType: "Full-time",
    isRemote: false,
    applicants: 12,
    status: "Active",
    postedAgo: "2w ago",
  },
  {
    id: "job-4",
    title: "Product Marketing Lead",
    companyName: "HirePulse Network",
    category: "Marketing",
    department: "Marketing",
    location: "EU/US",
    deadline: "2025-07-15",
    minSalary: 80000,
    maxSalary: 105000,
    salaryFrequency: "per year",
    responsibilities:
      "Lead go-to-market strategy, positioning, and launch campaigns for new products.",
    qualifications:
      "4+ years in B2B marketing with a track record of successful product launches.",
    jobType: "Full-time",
    isRemote: true,
    applicants: 27,
    status: "Active",
    postedAgo: "5d ago",
  },
  {
    id: "job-5",
    title: "QA Automation Engineer",
    companyName: "HirePulse Platform",
    category: "Engineering & Tech",
    department: "Quality",
    location: "Dublin, Ireland (Hybrid)",
    deadline: "2025-05-01",
    minSalary: 35,
    maxSalary: 50,
    salaryFrequency: "per hour",
    responsibilities:
      "Design and maintain automated test suites for web and API services.",
    qualifications:
      "Experience with Playwright or Cypress, API testing, and CI test pipelines.",
    jobType: "Part-time",
    isRemote: false,
    applicants: 8,
    status: "Expired",
    postedAgo: "",
  },
]

const salaryUnits: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per month": "mo",
  "per year": "yr",
}

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
})

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
  return (
    departmentStyles[department] ?? {
      icon: BriefcaseBusiness,
      iconClass: "border-white/10 bg-white/5 text-zinc-300",
    }
  )
}

function formatCompensation(job: JobPost) {
  const unit = salaryUnits[job.salaryFrequency] ?? job.salaryFrequency
  return {
    range: `$${compactNumber.format(job.minSalary)} - $${compactNumber.format(job.maxSalary)}`,
    unit,
  }
}

function formatDeadline(deadline: string) {
  const date = new Date(`${deadline}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) {
    return deadline
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

function formatLocation(job: JobPost) {
  return job.isRemote ? `Remote (${job.location})` : job.location
}

function JobIcon({ job }: { job: JobPost }) {
  const { icon: Icon, iconClass } = getDepartmentStyle(job.department)

  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${iconClass}`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}

function TypeBadge({ jobType }: { jobType: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] whitespace-nowrap text-zinc-300">
      {jobType}
    </span>
  )
}

function StatusBadge({ status }: { status: JobStatus }) {
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

function Applicants({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-zinc-400">
      <Users className="size-3.5 text-zinc-500" aria-hidden="true" />
      <span className="font-medium text-zinc-200">{count}</span> Candidates
    </span>
  )
}

function LocationLine({ job }: { job: JobPost }) {
  const Icon = job.isRemote ? Globe : MapPin

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{formatLocation(job)}</span>
    </p>
  )
}

function Deadline({ job }: { job: JobPost }) {
  return (
    <>
      <p className="text-xs whitespace-nowrap text-zinc-200">
        {formatDeadline(job.deadline)}
      </p>
      <p className="mt-1 text-[11px] text-zinc-500">
        {job.status === "Active" ? `Posted ${job.postedAgo}` : "Closed"}
      </p>
    </>
  )
}

function JobActions({ job }: { job: JobPost }) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <button
        type="button"
        aria-label={`Update ${job.title}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#5C53FE]/25 bg-[#5C53FE]/10 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-[#A79EFF] transition hover:border-[#5C53FE]/40 hover:bg-[#5C53FE]/20"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Update
      </button>
      <button
        type="button"
        aria-label={`Delete ${job.title}`}
        title="Delete job"
        className="inline-flex rounded-lg p-1.5 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 xl:max-[1359px]:hidden"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`More actions for ${job.title}`}
        title="More actions"
        className="inline-flex rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white xl:max-[1359px]:hidden"
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function MobileJobCard({ job }: { job: JobPost }) {
  const compensation = formatCompensation(job)

  return (
    <li className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <JobIcon job={job} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {job.title}
            </p>
            <p className="mt-0.5 text-[11px] text-[#9B8CFF]">
              {job.department}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="col-span-2">
          <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
            Company
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
            <Applicants count={job.applicants} />
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

      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <JobActions job={job} />
      </div>
    </li>
  )
}

export default function ManageJobsPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
              Manage Jobs
              <ChevronRight className="size-3" aria-hidden="true" />
              Job Listings &amp; Postings
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Manage Job Posts
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/add-jobs"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition hover:bg-[#4F46E5] focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] focus-visible:outline-none sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            New Job Post
          </Link>
        </div>

        {/* Postings */}
        <div className="mt-7 overflow-hidden rounded-xl border border-white/[0.07] bg-[#101014]">
          {/* Table — xl and up, horizontally scrollable when space is tight */}
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Job Title &amp; Dept
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Company &amp; Location
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Compensation
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase xl:max-[1439px]:hidden"
                  >
                    Applicants
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Deadline
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const compensation = formatCompensation(job)

                  return (
                    <tr
                      key={job.id}
                      className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <JobIcon job={job} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {job.title}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#9B8CFF]">
                              {job.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <p className="text-xs font-medium whitespace-nowrap text-zinc-200">
                          {job.companyName}
                        </p>
                        <LocationLine job={job} />
                      </td>
                      <td className="px-3 py-4">
                        <TypeBadge jobType={job.jobType} />
                      </td>
                      <td className="px-3 py-4 text-xs whitespace-nowrap text-zinc-200">
                        {compensation.range}{" "}
                        <span className="text-zinc-500">
                          / {compensation.unit}
                        </span>
                      </td>
                      <td className="px-3 py-4 xl:max-[1439px]:hidden">
                        <Applicants count={job.applicants} />
                      </td>
                      <td className="px-3 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-3 py-4">
                        <Deadline job={job} />
                      </td>
                      <td className="px-3 py-4">
                        <JobActions job={job} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cards — below xl */}
          <ul className="divide-y divide-white/[0.06] xl:hidden">
            {jobs.map((job) => (
              <MobileJobCard key={job.id} job={job} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
