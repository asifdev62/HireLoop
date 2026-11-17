"use client"

import { useRouter } from "next/navigation"

import {
  applyToJobAction,
  getMyApplicationsCountAction,
} from "@/lib/actions/application-actions"

import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { getPremiumStatusAction } from "@/lib/actions/users"

type JobApplyButtonProps = {
  jobId: string
}

const JobApplyButton = ({ jobId }: JobApplyButtonProps) => {
  const router = useRouter()

  const { data: session } = authClient.useSession()
  const user = session?.user

  const handleApplyNow = async () => {
    try {
      if (!user) {
        router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
        return
      }

      if (user.role !== "seeker") {
        console.log("User is not a job seeker")
        return
      }
      //is premium user
      const premiumResult = await getPremiumStatusAction()

      // Get total applications of this user
      const countResult = await getMyApplicationsCountAction()

      // Check application limit (the API enforces this too)
      if (!premiumResult.premium && countResult >= 2) {
        router.push("/payment")
        return
      }

      // Submit new application. Identity and job details are added on the
      // server; the browser only sends the job id.
      const result = await applyToJobAction({ jobId })

      if (result.insertedId) {
        router.push("/browse-jobs")

        toast.add({
          title: "Application Submitted",
          description: "Your application has been submitted successfully",
        })
      }
    } catch (error) {
      toast.add({
        title: "Could not apply",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleApplyNow}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        Apply Now
      </button>
    </div>
  )
}

export default JobApplyButton
