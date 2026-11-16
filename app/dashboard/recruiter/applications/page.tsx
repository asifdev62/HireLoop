import { Suspense } from "react"

import { ApplicationsView } from "./_components/applications-view"

/**
 * Recruiter "Applications" page.
 *
 * `ApplicationsView` reads the `?jobId=` filter from the URL, and Next needs a
 * Suspense boundary around `useSearchParams`, so the wrapper keeps both happy.
 */
export default function RecruiterApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] px-4 py-10 text-center text-sm text-zinc-400">
          Loading applications...
        </div>
      }
    >
      <ApplicationsView />
    </Suspense>
  )
}
