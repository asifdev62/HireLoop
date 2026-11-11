const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type JobData = {
  title: string
  companyName: string
  category: string
  location: string
  deadline: string
  minSalary: number
  maxSalary: number
  salaryFrequency: string
  responsibilities: string
  qualifications: string
  jobType: string
  isRemote: boolean
}

