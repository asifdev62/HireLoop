"use client"

/**
 * The interactive controls on the job details page.
 *
 * Applying and saving are not wired to the API yet, so both buttons give
 * feedback with a toast until those flows exist.
 */

import { useState } from "react"
import { Bookmark, ExternalLink } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

export function JobDetailsActions({ jobTitle }: { jobTitle: string }) {
  const [saved, setSaved] = useState(false)

  function toggleSaved() {
    const next = !saved
    setSaved(next)

    toast[next ? "success" : "message"](
      next ? "Job saved" : "Removed from saved jobs",
      {
        description: next
          ? `${jobTitle} was added to your saved jobs.`
          : `${jobTitle} was removed from your saved jobs.`,
      }
    )
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={toggleSaved}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved jobs" : "Save job"}
        title={saved ? "Remove from saved jobs" : "Save job"}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none",
          saved
            ? "border-[#5C53FE]/50 bg-[#5C53FE]/15 text-white"
            : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
        )}
      >
        <Bookmark
          className={cn("size-4", saved && "fill-current")}
          aria-hidden="true"
        />
      </button>

      {/* TODO: open the application form once it exists. */}
      <button
        type="button"
        onClick={() =>
          toast.info("Applications open soon", {
            description: `The application flow for ${jobTitle} is not ready yet.`,
          })
        }
        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        Apply Now
      </button>
    </div>
  )
}

export function VisitWebsiteButton({ companyName }: { companyName: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        toast.info("No website on file", {
          description: `We do not have a website for ${companyName} yet.`,
        })
      }
      className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
    >
      Visit Website
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </button>
  )
}
