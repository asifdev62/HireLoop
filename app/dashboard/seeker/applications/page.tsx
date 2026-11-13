"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Download, FileText } from "lucide-react"

import { ApplicationStats } from "./_components/application-stats"
import { ApplicationsPagination } from "./_components/applications-pagination"
import { ApplicationsTable } from "./_components/applications-table"
import { MobileApplicationCard } from "./_components/mobile-application-card"

import { getMyApplications, JobApplication } from "@/lib/actions/applications"
import { authClient } from "@/lib/auth-client"

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

  // Get applications from backend.
  useEffect(() => {
    if (isPending) return

    const userId = session?.user?.id
    if (!userId) return

    const loadApplications = async () => {
      try {
        const data = await getMyApplications(userId)
        setApplications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.log("Failed to load applications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [session?.user?.id, isPending])

  // Signed-out users are not loading anything.
  const isLoading = isPending || (loading && Boolean(session?.user?.id))

  // Active applications.
  const activeApplications = applications.filter(
    (application) => !application.archived
  )

  // Applications based on selected tab.
  const tabApplications =
    tab === "active"
      ? activeApplications
      : applications.filter((application) => application.archived)

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
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-4 pb-8 sm:px-6 lg:px-8 lg:pt-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-1.5 text-sm text-zinc-400">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-white/[0.07] bg-[#101014] p-1">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeTab(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    tab === id ? "bg-white/10 text-white" : "text-zinc-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs"
            >
              <Download className="size-3.5" />
              Export PDF
            </button>
          </div>
        </header>

        <div className="mt-6">
          <ApplicationStats applications={activeApplications} />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.07] bg-[#101014]">
          {isLoading ? (
            <p className="p-10 text-center text-sm text-zinc-400">
              Loading applications...
            </p>
          ) : visibleApplications.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="mx-auto size-8 text-zinc-600" />

              <h2 className="mt-3 text-sm font-medium">
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
                  className="mt-4 inline-flex rounded-lg bg-[#5C53FE] px-4 py-2.5 text-sm"
                >
                  Browse Jobs
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
