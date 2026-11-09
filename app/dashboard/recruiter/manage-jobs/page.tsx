"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { toast } from "@/components/ui/toast"
import {
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  Eye,
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
  X,
} from "lucide-react"

import { getJobs } from "@/lib/api/jobs"
import { deleteJob } from "@/lib/actions/jobs"

type Job = {
  _id?: string
  id?: string
  title: string
  companyName: string
  category: string
  department?: string
  location: string
  deadline: string
  minSalary: number
  maxSalary: number
  salaryFrequency: string
  responsibilities?: string
  qualifications?: string
  jobType: string
  isRemote: boolean
  applicants?: number
  status?: string
  postedAgo?: string
}

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

function getDepartment(job: Job) {
  return job.department || job.category || "General"
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

function formatSalary(job: Job) {
  const unit = salaryUnits[job.salaryFrequency] ?? job.salaryFrequency
  const min = compactNumber.format(Number(job.minSalary)).toLowerCase()
  const max = compactNumber.format(Number(job.maxSalary)).toLowerCase()

  return {
    range: `$${min} - $${max}`,
    unit,
  }
}

function formatDate(date: string) {
  if (!date) return "Not specified"

  const value = new Date(`${date}T00:00:00Z`)

  if (Number.isNaN(value.getTime())) return date

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

function getStatus(job: Job): "Active" | "Expired" {
  if (job.deadline) {
    const deadline = new Date(`${job.deadline}T23:59:59Z`)

    if (!Number.isNaN(deadline.getTime()) && deadline < new Date()) {
      return "Expired"
    }
  }

  return job.status === "Expired" ? "Expired" : "Active"
}

function formatLocation(job: Job) {
  return job.isRemote ? `Remote (${job.location})` : job.location
}

function JobIcon({ job }: { job: Job }) {
  const { icon: Icon, iconClass } = getDepartmentStyle(getDepartment(job))

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

function StatusBadge({ status }: { status: string }) {
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

function LocationLine({ job }: { job: Job }) {
  const Icon = job.isRemote ? Globe : MapPin

  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{formatLocation(job)}</span>
    </p>
  )
}

function Deadline({ job }: { job: Job }) {
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

type JobActionsProps = {
  job: Job
  onView: (job: Job) => void
  onDelete: (id: string) => Promise<boolean>
}

function JobActions({ job, onView, onDelete }: JobActionsProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menu, setMenu] = useState<{ top: number; right: number } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const jobId = job._id || job.id
  const updateHref = jobId ? `/dashboard/recruiter/edit-jobs/${jobId}` : "#"

  useEffect(() => {
    if (!menu) return

    function closeMenu() {
      setMenu(null)
    }

    window.addEventListener("scroll", closeMenu, true)
    window.addEventListener("resize", closeMenu)

    return () => {
      window.removeEventListener("scroll", closeMenu, true)
      window.removeEventListener("resize", closeMenu)
    }
  }, [menu])

  function toggleMenu() {
    if (menu) {
      setMenu(null)
      return
    }

    const rect = buttonRef.current?.getBoundingClientRect()

    if (!rect) return

    const menuHeight = 158
    const openUp = rect.bottom + menuHeight > window.innerHeight

    setMenu({
      top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    })
  }

  async function handleDelete() {
    if (!jobId) {
      toast.add({
        title: "Job ID Not Found!",
        description: "This job ID could not be found.",
        type: "error",
      })
      return
    }

    setDeleting(true)

    try {
      const success = await onDelete(jobId)

      if (success) {
        setMenu(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        title="More actions"
        aria-label={`More actions for ${job.title}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(menu)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </button>

      {menu && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenu(null)}
          />

          <div
            role="menu"
            style={{ top: menu.top, right: menu.right }}
            className="fixed z-50 w-44 rounded-xl border border-white/10 bg-[#18181B] p-1.5 shadow-2xl shadow-black/50"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenu(null)
                onView(job)
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Eye className="size-4" aria-hidden="true" />
              View Details
            </button>

            <Link
              href={updateHref}
              role="menuitem"
              onClick={(event) => {
                if (!jobId) {
                  event.preventDefault()
                  toast.add({
                    title: "Job ID Not Found!",
                    description: "This job ID could not be found.",
                    type: "error",
                  })
                  return
                }

                setMenu(null)
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Update Job
            </Link>

            <div className="my-1 border-t border-white/[0.07]" />

            <button
              type="button"
              role="menuitem"
              onClick={handleDelete}
              disabled={deleting}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {deleting ? "Deleting..." : "Delete Job"}
            </button>
          </div>
        </>
      )}
    </>
  )
}

function JobDetailsModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const jobId = job._id || job.id
  const compensation = formatSalary(job)
  const status = getStatus(job)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101014] shadow-2xl shadow-black/60"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <JobIcon job={job} />

            <div className="min-w-0">
              <h2
                id="job-details-title"
                className="truncate text-lg font-semibold text-white"
              >
                {job.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#9B8CFF]">
                {getDepartment(job)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Company
              </p>
              <p className="mt-1 text-sm text-zinc-200">{job.companyName}</p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Location
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-200">
                {job.isRemote ? (
                  <Globe className="size-4 shrink-0 text-zinc-500" />
                ) : (
                  <MapPin className="size-4 shrink-0 text-zinc-500" />
                )}
                {formatLocation(job)}
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Job Type
              </p>
              <div className="mt-1.5">
                <TypeBadge jobType={job.jobType} />
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Compensation
              </p>
              <p className="mt-1 text-sm whitespace-nowrap text-zinc-200">
                {compensation.range}{" "}
                <span className="text-zinc-500">/ {compensation.unit}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Applicants
              </p>
              <div className="mt-1.5">
                <Applicants count={job.applicants ?? 0} />
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
                Status
              </p>
              <div className="mt-1.5">
                <StatusBadge status={status} />
              </div>
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

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-zinc-400 uppercase">
              Key Responsibilities
            </h3>
            <p className="mt-2 text-sm leading-6 whitespace-pre-line text-zinc-300">
              {job.responsibilities || "No responsibilities added yet."}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-zinc-400 uppercase">
              Qualifications & Requirements
            </h3>
            <p className="mt-2 text-sm leading-6 whitespace-pre-line text-zinc-300">
              {job.qualifications || "No qualifications added yet."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.07] p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Close
          </button>

          {jobId && (
            <Link
              href={`/dashboard/recruiter/edit-jobs/${jobId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F46E5]"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Update Job
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileJobCard({
  job,
  onView,
  onDelete,
}: {
  job: Job
  onView: (job: Job) => void
  onDelete: (id: string) => Promise<boolean>
}) {
  const compensation = formatSalary(job)
  const status = getStatus(job)

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
              {getDepartment(job)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <StatusBadge status={status} />
          <JobActions job={job} onView={onView} onDelete={onDelete} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="col-span-2">
          <p className="text-[10px] tracking-[0.1em] text-zinc-500 uppercase">
            Company &amp; Location
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
            <Applicants count={job.applicants ?? 0} />
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
    </li>
  )
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs()

        const jobList: Job[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : []

        setJobs(jobList)
      } catch (loadError) {
        console.error("Failed to fetch jobs:", loadError)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  async function handleDelete(id: string): Promise<boolean> {
    try {
      const data = await deleteJob(id)

      if (data?.deletedCount === 0) {
        toast.add({
          title: "Job Not Found!",
          description: "This job could not be found.",
          type: "error",
        })
        return false
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => (job._id || job.id) !== id)
      )

      toast.add({
        title: "Job Deleted",
        description: "The job has been permanently deleted.",
        type: "success",
      })
      return true
    } catch (deleteError) {
      console.error("Delete error:", deleteError)
      toast.add({
        title: "Delete Failed!",
        description: "This job could not be deleted.",
        type: "error",
      })
      return false
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-6 sm:px-6 lg:px-8 lg:pt-6 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
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

        {/* Job Postings */}
        <div className="mt-7 overflow-hidden rounded-xl border border-white/[0.07] bg-[#09090B]">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto size-7 animate-spin rounded-full border-2 border-[#5C53FE] border-t-transparent" />

              <p className="mt-3 text-sm text-zinc-400">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <BriefcaseBusiness className="mx-auto size-8 text-zinc-600" />

              <h2 className="mt-3 text-sm font-medium">Failed to load jobs</h2>

              <p className="mt-1 text-xs text-zinc-500">
                Please check your connection and try again.
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-10 text-center">
              <BriefcaseBusiness className="mx-auto size-8 text-zinc-600" />

              <h2 className="mt-3 text-sm font-medium">No jobs found</h2>

              <p className="mt-1 text-xs text-zinc-500">
                Create your first job post to start hiring.
              </p>

              <Link
                href="/dashboard/recruiter/add-jobs"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F46E5]"
              >
                <Plus className="size-4" aria-hidden="true" />
                New Job Post
              </Link>
            </div>
          ) : (
            <>
              {/* Table — xl and up */}
              <div className="dark-scrollbar hidden overflow-x-auto xl:block">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      {[
                        { label: "Job Title & Dept" },
                        { label: "Company & Location" },
                        { label: "Type" },
                        { label: "Compensation" },
                        {
                          label: "Applicants",
                          className: "hidden 2xl:table-cell",
                        },
                        { label: "Status" },
                        {
                          label: "Deadline",
                          className: "hidden 2xl:table-cell",
                        },
                      ].map(({ label, className = "" }) => (
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
                            <span className="text-zinc-500">
                              / {compensation.unit}
                            </span>
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
                              <JobActions
                                job={job}
                                onView={setSelectedJob}
                                onDelete={handleDelete}
                              />
                            </div>
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
                  <MobileJobCard
                    key={job._id || job.id}
                    job={job}
                    onView={setSelectedJob}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}
