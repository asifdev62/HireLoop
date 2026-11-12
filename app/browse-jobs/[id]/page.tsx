import { notFound } from "next/navigation"
import {
  Bookmark,
  Clock,
  Globe,
  HeartPulse,
  Laptop,
  Layers,
  MapPin,
  PiggyBank,
  Plane,
  Tag,
  TrendingUp,
  Wallet,
} from "lucide-react"

import Navbar from "@/components/Navbar"
import { getJobById } from "@/lib/api/jobs"
import {
  formatSalary,
  getDepartment,
  type Job,
} from "@/app/dashboard/recruiter/_data/jobData"

import { CompanyOverviewCard } from "../_components/company-overview-card"
import JobApplyButton from "./JobApplyButton"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
}

// The API does not have an experience field yet, so the page shows fixed text.
const EXPERIENCE = "5+ Years"

const BENEFITS = [
  { icon: HeartPulse, label: "Full Health & Dental" },
  { icon: PiggyBank, label: "Competitive 401k" },
  { icon: Laptop, label: "Latest Hardware Stipend" },
  { icon: Plane, label: "Unlimited PTO" },
]

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params

  // Get this job from the API by its id.
  const data = await getJobById(id).catch(() => null)

  // A wrong id returns an empty response, so show the 404 page.
  const job: Job | null = data && data.title ? data : null

  if (!job) notFound()

  const salary = formatSalary(job)
  const initial = job.companyName.charAt(0).toUpperCase() || "J"
  const jobType = job.jobType ? job.jobType.toLowerCase() : "full-time"

  // "Remote (Remote)" looks wrong, so a plain remote job just shows "Remote".
  let location = job.location || "Not specified"
  if (job.isRemote) {
    location =
      location.toLowerCase() === "remote" ? "Remote" : `Remote (${location})`
  }

  // The API gives one text block. Each line becomes one bullet point.
  const responsibilities = (job.responsibilities || "")
    .split("\n")
    .filter(Boolean)

  const qualifications = (job.qualifications || "").split("\n").filter(Boolean)

  // Small chips under "Requirements".
  const tags = [
    { icon: Tag, label: job.category },
    { icon: Layers, label: job.department || "" },
    { icon: Clock, label: job.jobType },
    {
      icon: job.isRemote ? Globe : MapPin,
      label: job.isRemote ? "Remote" : "On-site",
    },
  ].filter((tag) => tag.label)

  // The four cards under the header.
  const stats = [
    { icon: Wallet, label: "Salary Range", value: salary.range },
    { icon: MapPin, label: "Location", value: location },
    { icon: Clock, label: "Job Type", value: job.jobType },
    { icon: TrendingUp, label: "Experience", value: EXPERIENCE },
  ]

  // One short sentence for the "Job Description" paragraph.
  const workPlace = job.isRemote ? "fully remote" : `based in ${location}`
  const description = `${job.companyName} is hiring a ${job.title} to join the ${getDepartment(job)} team. This ${jobType} role is ${workPlace}, and you will work with a cross-functional team to ship work that matters.`

  return (
    <main className="relative isolate min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        {/* Header: logo, title, company, buttons */}
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

            <div className="flex shrink-0 items-center gap-2">
              {/* TODO: save the job once the saved-jobs API exists. */}
              <button
                type="button"
                aria-label="Save job"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-zinc-400 transition-colors hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
              >
                <Bookmark className="size-4" aria-hidden="true" />
              </button>

              {/* TODO: open the application form once it exists. */}
              <JobApplyButton
                jobId={job._id}
                jobTitle={job.title}
                companyName={job.companyName}
              />
            </div>
          </div>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-5">
            {/* Salary, location, job type, experience */}
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ icon: Icon, label, value }) => (
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
                  </dd>
                </div>
              ))}
            </dl>

            {/* Description, responsibilities, requirements, benefits */}
            <section className="rounded-2xl border border-white/[0.07] bg-[#101014] p-5 sm:p-6 lg:p-7">
              <h2 className="text-base font-semibold text-white">
                Job Description
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {description}
              </p>

              <div className="mt-7">
                <h3 className="text-sm font-semibold text-white">
                  Responsibilities
                </h3>

                {responsibilities.length > 0 ? (
                  <ul className="mt-3 space-y-2.5">
                    {responsibilities.map((item, index) => (
                      <li
                        key={index}
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
                ) : (
                  <p className="mt-3 text-sm text-zinc-500">
                    No responsibilities added yet.
                  </p>
                )}
              </div>

              <div className="mt-7">
                <h3 className="text-sm font-semibold text-white">
                  Requirements
                </h3>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {tags.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-zinc-300"
                    >
                      <Icon
                        className="size-3 text-zinc-500"
                        aria-hidden="true"
                      />
                      {label}
                    </li>
                  ))}
                </ul>

                {qualifications.length > 0 ? (
                  <ul className="mt-3 space-y-2.5">
                    {qualifications.map((item, index) => (
                      <li
                        key={index}
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
                ) : (
                  <p className="mt-4 text-sm text-zinc-500">
                    No qualifications added yet.
                  </p>
                )}
              </div>

              <div className="mt-7">
                <h3 className="text-sm font-semibold text-white">Benefits</h3>

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
            <CompanyOverviewCard
              companyName={job.companyName}
              industry={job.category}
              department={getDepartment(job)}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
