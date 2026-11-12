"use client"

import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { applyToAJob } from "@/lib/actions/applications"

type JobApplyButtonProps = {
  jobId: string
  jobTitle: string
  companyName: string
}

const JobApplyButton = ({jobId, jobTitle, companyName}: JobApplyButtonProps) => {
  const router = useRouter()

  const { data: session } = authClient.useSession()
  const user = session?.user

  const handleApplyNow = async () => {
  
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
      return
    }
    else if(user.role === "seeker"){
      //TODO: only send jobId and userid or email address for the application
      const application = {
        jobId: jobId,
        userId: user.id,
        user: user.email,
        jobTitle: jobTitle,
        companyNmae: companyName
      }

      const result = await applyToAJob(application);
      if(result.insertedId){
        console.log("Application submited successfully")
        router.push("/browse-jobs")
      }

    }
    else{
      console.log("user is not a job seeker")
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
