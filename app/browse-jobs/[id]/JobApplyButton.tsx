"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

type JobApplyButtonProps = {
  jobId: string
}

const JobApplyButton = ({jobId}: JobApplyButtonProps) => {
  const router = useRouter()

  const { data: session } = authClient.useSession()
  const user = session?.user

  const handleApplyNow = () => {
  
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
      return
    }
    else{
      console.log("save the application to the database")
    }

    // TODO: open the application form once it exists.
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
