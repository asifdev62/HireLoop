export type JobData = {
  title: string
  companyName: string
  companyId?: string
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
  /**
   * Legacy fields from the old browser-side flow. They are ignored by the
   * server action and by the API; ownership always comes from the session.
   */
  recruiterId?: string
  recruiterEmail?: string
}
