"use client"

/**
 * The three-dot menu on every job row.
 * It opens a small dropdown with View / Update / Delete.
 */

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { toast } from "@/components/ui/toast"
import type { Job } from "../../_data/jobData"

type JobActionsProps = {
  job: Job
  onView: (job: Job) => void
  onDelete: (id: string) => Promise<boolean>
}

export function JobActions({ job, onView, onDelete }: JobActionsProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menu, setMenu] = useState<{ top: number; right: number } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const jobId = job._id || job.id
  const updateHref = jobId ? `/dashboard/recruiter/edit-jobs/${jobId}` : "#"

  // Close the menu when the page scrolls or the window is resized.
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
          {/* Clicking anywhere outside closes the menu. */}
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
