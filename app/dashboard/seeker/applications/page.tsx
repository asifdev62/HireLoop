"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react"

import { TablePagination } from "@/components/table-pagination"
import type { JobApplication } from "@/lib/actions/applications"
import { authClient } from "@/lib/auth-client"

import { getMyApplications } from "./_actions/applications"
import { ApplicationStats } from "./_components/application-stats"
import { ApplicationsTable } from "./_components/applications-table"
import { MobileApplicationCard } from "./_components/mobile-application-card"

const PAGE_SIZE = 5

type Tab = "active" | "archived"

const TABS: { id: Tab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
]

export default function MyApplicationsPage() {
  const { data: session, isPending } = authClient.useSession()

  const [applications, setApplications] = useState<JobApplication[]>([])
  const [tab, setTab] = useState<Tab>("active")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  // Get applications from the API.
  useEffect(() => {
    if (isPending) return

    const userId = session?.user?.id
    if (!userId) return

    // Ignore the response if the user changes while it is still loading.
    let active = true

    const loadApplications = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getMyApplications()
        if (active) setApplications(data)
      } catch (loadError) {
        console.error("Failed to load applications:", loadError)

        // An API failure is not the same as "no applications yet", so it gets
        // its own message instead of the empty state.
        if (active) {
          setApplications([])
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load your applications."
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadApplications()

    return () => {
      active = false
    }
  }, [session?.user?.id, isPending, reloadToken])

  // Signed-out users are not loading anything.
  const isLoading = isPending || (loading && Boolean(session?.user?.id))

  // Active applications.
  const activeApplications = applications.filter(
    (application) => !application.archived
  )

  const archivedApplications = applications.filter(
    (application) => application.archived
  )

  // Applications based on selected tab.
  const tabApplications =
    tab === "active" ? activeApplications : archivedApplications

  const totalPages = Math.ceil(tabApplications.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(1, totalPages))

  const visibleApplications = tabApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Change tab.
  const changeTab = (newTab: Tab) => {
    setTab(newTab)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-10 sm:px-6 lg:px-8 lg:pt-6">
        {/* Hero ----------------------------------------------------------- */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0C0C11] px-5 py-8 sm:px-8 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,101,255,0.28),transparent_55%),radial-gradient(ellipse_at_80%_120%,rgba(56,189,248,0.18),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] [background-size:36px_36px] opacity-[0.12]"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C65FF]/30 bg-[#7C65FF]/10 px-3 py-1 text-[11px] font-medium text-[#C3BCFF]">
                <Sparkles className="size-3" aria-hidden="true" />
                Applications
              </span>

              <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Every application,{" "}
                <span className="bg-gradient-to-r from-[#C3BCFF] via-[#8B7BFF] to-[#38BDF8] bg-clip-text text-transparent">
                  one clear timeline
                </span>
                .
              </h1>

              <p className="mt-2.5 max-w-xl text-sm leading-6 text-zinc-400">
                {activeApplications.length > 0
                  ? `${activeApplications.length.toLocaleString()} active ${
                      activeApplications.length === 1
                        ? "application"
                        : "applications"
                    } in flight. Track reviews, interviews, and offers without losing the thread.`
                  : "Apply to a role and your progress will show up here, from review to offer."}
              </p>
            </div>

            <Link
              href="/browse-jobs"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
            >
              <Search className="size-3.5" aria-hidden="true" />
              Find more jobs
            </Link>
          </div>
        </section>

        {/* Stats ---------------------------------------------------------- */}
        <div className="mt-4">
          <ApplicationStats applications={activeApplications} />
        </div>

        {/* Toolbar -------------------------------------------------------- */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#0F0F13] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div
            role="group"
            aria-label="Application status"
            className="flex items-center gap-0.5 self-start rounded-lg border border-white/10 bg-[#15151B] p-0.5"
          >
            {TABS.map(({ id, label }) => {
              const count =
                id === "active"
                  ? activeApplications.length
                  : archivedApplications.length

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeTab(id)}
                  aria-pressed={tab === id}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#7C65FF]/60 focus-visible:outline-none ${
                    tab === id
                      ? "bg-white text-[#09090B]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      tab === id
                        ? "bg-[#09090B]/10 text-[#09090B]"
                        : "bg-white/[0.06] text-zinc-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] text-zinc-500" aria-live="polite">
              <span className="font-semibold text-white">
                {tabApplications.length.toLocaleString()}
              </span>{" "}
              {tabApplications.length === 1 ? "application" : "applications"}{" "}
              {tab === "active" ? "in progress" : "archived"}
            </p>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[11px] font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-[#7C65FF]/60 focus-visible:outline-none"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Results -------------------------------------------------------- */}
        <section
          aria-label="My applications"
          className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0F0F13]"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 p-12 text-center">
              <Loader2
                className="size-6 animate-spin text-[#7C65FF]"
                aria-hidden="true"
              />
              <p className="text-sm text-zinc-400">
                Loading your applications...
              </p>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <AlertTriangle className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                Could not load applications
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setReloadToken((token) => token + 1)}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : visibleApplications.length === 0 ? (
            <div className="p-10 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[#7C65FF]/25 bg-[#7C65FF]/10 text-[#C3BCFF]">
                <FileText className="size-5" aria-hidden="true" />
              </span>

              <h2 className="mt-4 text-sm font-semibold text-white">
                {tab === "archived"
                  ? "No archived applications"
                  : "No applications yet"}
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
                {tab === "archived"
                  ? "Applications you archive will show up here."
                  : "Browse jobs and apply to track your progress here."}
              </p>

              {tab === "active" && (
                <Link
                  href="/browse-jobs"
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#7C65FF] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#6C5CFF]"
                >
                  <Search className="size-3.5" aria-hidden="true" />
                  Browse jobs
                </Link>
              )}
            </div>
          ) : (
            <>
              <ApplicationsTable applications={visibleApplications} />

              <ul className="divide-y divide-white/[0.06] md:hidden">
                {visibleApplications.map((application) => (
                  <MobileApplicationCard
                    key={application._id ?? application.jobId}
                    application={application}
                  />
                ))}
              </ul>

              <TablePagination
                page={currentPage}
                pageSize={PAGE_SIZE}
                total={tabApplications.length}
                onPageChange={setPage}
              />
            </>
          )}
        </section>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
          <ArrowUpRight className="size-3" aria-hidden="true" />
          Open a job to see the full description and application details.
        </p>
      </div>
    </div>
  )
}
