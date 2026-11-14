// "use client"

// import { useRouter } from "next/navigation"

// import { applyToAJob, getMyApplicationsCount } from "@/lib/actions/applications"
// import { authClient } from "@/lib/auth-client"

// type JobApplyButtonProps = {
//   jobId: string
//   jobTitle: string
//   companyName: string
//   jobType: string
//   location: string
//   isRemote: boolean
// }

// const JobApplyButton = ({
//   jobId,
//   jobTitle,
//   companyName,
//   jobType,
//   location,
//   isRemote,
// }: JobApplyButtonProps) => {
//   const router = useRouter()

//   const { data: session } = authClient.useSession()
//   const user = session?.user

//   const handleApplyNow = async () => {
//     if (!user) {
//       router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
//       return
//     }

//     if (user.role !== "seeker") {
//       console.log("user is not a job seeker")
//       return
//     }

//     //number of jobs applied by this user
//     const countResult = await getMyApplicationsCount(user.id)

//     if(countResult >= 10){
//       router.push("/payment")
//       return
//     }
//     else{
//           // Everything "My Applications" shows is saved with the application, so the
//     // row still reads correctly if the job post is edited later.
//     const result = await applyToAJob({
//       userId: user.id,
//       applicantName: user.name,
//       applicantEmail: user.email,
//       jobId,
//       jobTitle,
//       companyName,
//       jobType,
//       location,
//       isRemote,
//     })

//     if (result.insertedId) {
//       console.log("Application submitted successfully")
//       router.push("/browse-jobs")
//     }
//     }

//   }

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={handleApplyNow}
//         className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
//       >
//         Apply Now
//       </button>
//     </div>
//   )
// }

// export default JobApplyButton






"use client"

import { useRouter } from "next/navigation"

import {
  applyToAJob,
  getMyApplicationsCount,
} from "@/lib/actions/applications"

import { authClient } from "@/lib/auth-client"

type JobApplyButtonProps = {
  jobId: string
  jobTitle: string
  companyName: string
  jobType: string
  location: string
  isRemote: boolean
}

const JobApplyButton = ({
  jobId,
  jobTitle,
  companyName,
  jobType,
  location,
  isRemote,
}: JobApplyButtonProps) => {
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

      // Get total applications of this user
      const countResult = await getMyApplicationsCount(user.id)

      // Check application limit
      if (countResult >= 10) {
        router.push("/payment")
        return
      }

      // Submit new application
      const result = await applyToAJob({
        userId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        jobId,
        jobTitle,
        companyName,
        jobType,
        location,
        isRemote,
      })

      if (result.insertedId) {
        console.log("Application submitted successfully")
        router.push("/browse-jobs")
      }
    } catch (error) {
      console.error("Application failed:", error)
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
