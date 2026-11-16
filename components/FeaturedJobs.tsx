"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BriefcaseBusiness,
  DollarSign,
  MapPin,
  type LucideIcon,
} from "lucide-react"

import {
  formatLocation,
  formatSalary,
  type Job,
} from "@/app/dashboard/recruiter/_data/jobData"
import { getJobs } from "@/lib/api/jobs"

const FEATURED_COUNT = 6

const EASE = [0.22, 1, 0.36, 1] as const

const container = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.1 },
  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
}

const cardVariant = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: EASE },
}

function Chip({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] whitespace-nowrap text-zinc-300">
      <Icon className="size-3 text-zinc-500" aria-hidden="true" />
      {children}
    </span>
  )
}

/** `formatLocation` would turn a plain "Remote" job into "Remote (Remote)". */
function jobLocation(job: Job) {
  const isJustRemote = (job.location ?? "").trim().toLowerCase() === "remote"

  return job.isRemote && isJustRemote ? "Remote" : formatLocation(job)
}

function JobCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-white/[0.07] bg-[#0d0e13] p-5 sm:p-6">
      <div className="h-5 w-2/3 rounded bg-white/10" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-4/5 rounded bg-white/5" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-24 rounded bg-white/5" />
        <div className="h-6 w-20 rounded bg-white/5" />
      </div>
      <div className="mt-4 h-6 w-28 rounded bg-white/5" />
      <div className="mt-6 h-4 w-20 rounded bg-white/5" />
    </div>
  )
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Load a small slice of the latest public jobs.
  useEffect(() => {
    // Ignore the response if the component unmounts mid-request.
    let active = true

    async function loadJobs() {
      try {
        const data = await getJobs()

        const jobList: Job[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : []

        if (active) setJobs(jobList.slice(0, FEATURED_COUNT))
      } catch (loadError) {
        console.error("Failed to fetch featured jobs:", loadError)
        if (active) setJobs([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="relative isolate overflow-hidden bg-black px-4 pb-20 text-white sm:px-6 sm:pb-24 lg:px-8">
      {/* Ambient glow behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(92,83,254,0.12),transparent)]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[#7C65FF]" />
            <span className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400 uppercase sm:text-xs">
              Smart Job Discovery
            </span>
            <span className="size-1.5 rounded-full bg-[#7C65FF]" />
          </div>

          <h2 className="mx-auto mt-4 max-w-2xl bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-3xl leading-tight font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            The roles you&apos;d never
            <span className="block">find by searching</span>
          </h2>
        </motion.div>

        {/* Job cards */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-10 rounded-xl border border-white/[0.07] bg-[#0d0e13] p-10 text-center sm:mt-12">
            <BriefcaseBusiness
              className="mx-auto size-8 text-zinc-600"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-zinc-400">
              No jobs are live right now. Check back soon.
            </p>
          </div>
        ) : (
          <motion.ul
            variants={container}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.05 }}
            className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          >
            {jobs.map((job) => {
              const salary = formatSalary(job)
              const jobId = job._id || job.id

              return (
                <motion.li
                  key={jobId}
                  variants={cardVariant}
                  className="h-full"
                >
                  <article className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-[#0d0e13] p-5 transition-colors duration-300 hover:border-white/15 hover:bg-[#121319] sm:p-6">
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {job.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                      {job.responsibilities ||
                        job.qualifications ||
                        `${job.companyName} is hiring for this role.`}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Chip icon={MapPin}>{jobLocation(job)}</Chip>
                      <Chip icon={BriefcaseBusiness}>
                        {job.isRemote ? "Remote" : job.jobType}
                      </Chip>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Chip icon={DollarSign}>
                        {salary.range}{" "}
                        <span className="text-zinc-500">/ {salary.unit}</span>
                      </Chip>
                    </div>

                    <div className="mt-auto pt-6">
                      <Link
                        href={`/browse-jobs/${jobId}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
                      >
                        Apply Now
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </motion.li>
              )
            })}
          </motion.ul>
        )}

        {/* All jobs button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/browse-jobs"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            View all open jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
