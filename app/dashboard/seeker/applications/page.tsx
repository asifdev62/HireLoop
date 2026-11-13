"use client"

/**
 * My Applications page.
 *
 * Right now it renders `DUMMY_APPLICATIONS`. When the applications API is
 * ready, swap that line for `getMyApplications(user.id)` from
 * "@/lib/actions/applications" — the rest of the page stays the same.
 */

import Link from "next/link"
import { useMemo, useState } from "react"
import { Download, FileText } from "lucide-react"

import { ApplicationStats } from "./_components/application-stats"
import { ApplicationsPagination } from "./_components/applications-pagination"
import { ApplicationsTable } from "./_components/applications-table"
import { MobileApplicationCard } from "./_components/mobile-application-card"
import { DUMMY_APPLICATIONS, type ApplicationRow } from "./_data/applications"

const PAGE_SIZE = 5

type Tab = "active" | "archived"

const TABS: { id: Tab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
]

export default function MyApplicationsPage() {
  const [tab, setTab] = useState<Tab>("active")
  const [page, setPage] = useState(1)

  // TODO: replace with the signed-in seeker's applications from the API.
  const applications: ApplicationRow[] = DUMMY_APPLICATIONS

  const activeApplications = useMemo(
    () => applications.filter((application) => !application.archived),
    [applications]
  )

  const tabApplications = useMemo(
    () =>
      applications.filter(
        (application) => application.archived === (tab === "archived")
      ),
    [applications, tab]
  )

  const totalPages = Math.max(1, Math.ceil(tabApplications.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const visibleApplications = tabApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function changeTab(nextTab: Tab) {
    setTab(nextTab)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-4 pb-8 sm:px-6 lg:px-8 lg:pt-6">
        {/* Title, filters, export */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-1.5 text-sm text-zinc-400">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div
              role="tablist"
              aria-label="Filter applications"
              className="inline-flex items-center rounded-lg border border-white/[0.07] bg-[#101014] p-1"
            >
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => changeTab(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none ${
                    tab === id
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* TODO: export the applications as a PDF once the data is loaded. */}
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium whitespace-nowrap text-zinc-200 transition-colors hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export PDF
            </button>
          </div>
        </header>

        {/* Totals */}
        <div className="mt-6">
          <ApplicationStats applications={activeApplications} />
        </div>

        {/* Application list */}
        <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.07] bg-[#101014]">
          {visibleApplications.length === 0 ? (
            <div className="p-10 text-center">
              <FileText
                className="mx-auto size-8 text-zinc-600"
                aria-hidden="true"
              />

              <h2 className="mt-3 text-sm font-medium text-white">
                {tab === "archived"
                  ? "No archived applications"
                  : "No applications yet"}
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                {tab === "archived"
                  ? "Applications you archive will show up here."
                  : "Browse jobs and apply to track your progress here."}
              </p>

              {tab === "active" && (
                <Link
                  href="/browse-jobs"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F46E5]"
                >
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Table — md and up */}
              <ApplicationsTable applications={visibleApplications} />

              {/* Cards — below md */}
              <ul className="divide-y divide-white/[0.06] md:hidden">
                {visibleApplications.map((application) => (
                  <MobileApplicationCard
                    key={application._id ?? application.jobId}
                    application={application}
                  />
                ))}
              </ul>

              <ApplicationsPagination
                page={currentPage}
                pageSize={PAGE_SIZE}
                total={tabApplications.length}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
