"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Loader2 } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { saveJobAction, unsaveJobAction } from "@/lib/actions/saved-job-actions"
import { cn } from "@/lib/utils"

type JobSaveButtonProps = {
  jobId: string
  jobTitle: string
  initialSaved: boolean
}

/**
 * Bookmarks a job from the public job details page.
 *
 * The server component passes the current saved state, so the icon is correct
 * on the first render. Clicking saves or removes the job for the signed-in
 * seeker; visitors are sent to sign-in first.
 */
export default function JobSaveButton({
  jobId,
  jobTitle,
  initialSaved,
}: JobSaveButtonProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!session?.user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
      return
    }

    if (session.user.role !== "seeker") {
      toast.add({
        title: "Only job seekers can save jobs",
        description: "Switch to a seeker account to keep a saved jobs list.",
        type: "warning",
      })
      return
    }

    const nextSaved = !saved

    startTransition(async () => {
      try {
        if (nextSaved) {
          await saveJobAction(jobId)
        } else {
          await unsaveJobAction(jobId)
        }

        setSaved(nextSaved)

        toast.add({
          title: nextSaved ? "Job saved" : "Removed from saved jobs",
          description: nextSaved
            ? `${jobTitle} is now in your saved jobs.`
            : `${jobTitle} was removed from your saved jobs.`,
          type: nextSaved ? "success" : "info",
        })
      } catch (error) {
        toast.add({
          title: nextSaved ? "Could not save the job" : "Could not remove it",
          description:
            error instanceof Error ? error.message : "Please try again.",
          type: "error",
        })
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove job from saved jobs" : "Save job"}
      aria-pressed={saved}
      title={saved ? "Remove from saved jobs" : "Save job"}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70",
        saved
          ? "border-[#5C53FE]/40 bg-[#5C53FE]/15 text-[#A79EFF]"
          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Bookmark
          className={cn("size-4", saved && "fill-current")}
          aria-hidden="true"
        />
      )}
    </button>
  )
}
