
"use client"
 
import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Globe, MapPin, CalendarDays, DollarSign } from "lucide-react"
import { FaArrowRightToBracket } from "react-icons/fa6";

 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createJob } from "@/lib/actions/jobs";
 
export default function AddJobsPage() {
  const [isRemote, setIsRemote] = useState(false)
  const [jobType, setJobType] = useState("Full-time")
  const [isSubmitting, setIsSubmitting] = useState(false)
 
 const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    category: "",
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    salaryFrequency: "per month",
    responsibilities: "",
    qualifications: "",
  })
 
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
 
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
 
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
 
    // shadcn Select does not support the native `required` attribute
    if (!formData.category) {
      toast.error("Please select a job category.")
      return
    }

      if (Number(formData.minSalary) > Number(formData.maxSalary)) {
    toast.error("Maximum salary must be greater than minimum salary.")
    return
  }
 
    const jobData = {
      ...formData,
      jobType,
      isRemote,
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
    }
 
    try {
      setIsSubmitting(true)
 
      // TODO: Send jobData to your backend API.
      const result = await createJob(jobData)
      console.log("createdJob", result)
      
      toast.success("Job published successfully!")

    } catch (error) {
  console.error("Create Job Error:", error)

  toast.error(
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again."
  )
} finally {
      setIsSubmitting(false)
    }
  }
 
  const inputClass =
    "border-white/10 bg-[#1C1C20] text-white placeholder:text-zinc-500 focus-visible:ring-[#5C53FE]"
 
  // SelectTrigger defaults to w-fit, so force full width to match the inputs
  const selectClass = `${inputClass} h-9 w-full data-[placeholder]:text-zinc-500`
 
  const selectContentClass = "border-white/10 bg-[#1C1C20] text-white"
 
  const labelClass = "text-xs font-medium text-zinc-400"
 
  const sectionClass =
    "space-y-5 rounded-xl border border-white/[0.06] bg-[#141418] p-5 sm:p-6"
 
  return (
    <div className="w-full px-15 py-6 text-white sm:px-6 lg:px-20">
      <div className="w-full space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs text-zinc-500">
              Manage Jobs <span className="mx-1">›</span> Create New Listing
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Post a New Job
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Fill in the position specifications to attract qualified talent.
            </p>
          </div>
 
        </div>
 
        <form id="add-job-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">
              <span className="mr-2 text-[#7C65FF]">1.</span>
              Basic Information
            </h2>
 
            <div className="space-y-2">
              <Label htmlFor="title" className={labelClass}>
                Job Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
 
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName" className={labelClass}>
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
 
              <div className="space-y-2">
                <Label className={labelClass}>Job Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value ?? "" }))
                  }
                >
                  <SelectTrigger className={selectClass}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="Engineering & Tech">
                      Engineering & Tech
                    </SelectItem>
                    <SelectItem value="Design & Creative">
                      Design & Creative
                    </SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Customer Support">
                      Customer Support
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
 
            <div className="space-y-3">
              <Label className={labelClass}>Job Type *</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {["Full-time", "Part-time", "Contract", "Internship"].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJobType(type)}
                      className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                        jobType === type
                          ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                          : "border-white/10 bg-[#1C1C20] text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>
          </section>
 
          {/* Location & Compensation */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">
              <span className="mr-2 text-[#7C65FF]">2.</span>
              Location, Compensation & Timeline
            </h2>
 
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#1C1C20] p-4">
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-[#9B8CFF]" />
                <div>
                  <p className="text-sm font-medium">Remote Work Allowed</p>
                  <p className="text-xs text-zinc-500">
                    Enable worldwide or distributed candidate applications.
                  </p>
                </div>
              </div>
              <Switch checked={isRemote} onCheckedChange={setIsRemote} />
            </div>
 
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className={labelClass}>
                  <MapPin className="mr-1 inline size-3.5" />
                  Job Location *
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. New York, USA"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="deadline" className={labelClass}>
                  <CalendarDays className="mr-1 inline size-3.5" />
                  Application Deadline *
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
 
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="minSalary" className={labelClass}>
                  Minimum Salary *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute top-2.5 left-3 size-4 text-zinc-500" />
                  <Input
                    id="minSalary"
                    name="minSalary"
                    type="number"
                    min="0"
                    placeholder="25"
                    value={formData.minSalary}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="maxSalary" className={labelClass}>
                  Maximum Salary *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute top-2.5 left-3 size-4 text-zinc-500" />
                  <Input
                    id="maxSalary"
                    name="maxSalary"
                    type="number"
                    min="0"
                    placeholder="40"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <Label className={labelClass}>Salary Frequency</Label>
                <Select
                  value={formData.salaryFrequency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      salaryFrequency: value ?? "per month",
                    }))
                  }
                >
                  <SelectTrigger className={selectClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="per hour">Per hour</SelectItem>
                    <SelectItem value="per day">Per day</SelectItem>
                    <SelectItem value="per month">Per month</SelectItem>
                    <SelectItem value="per year">Per year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
 
          {/* Responsibilities & Requirements */}
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold">
              <span className="mr-2 text-[#7C65FF]">3.</span>
              Responsibilities & Requirements
            </h2>
 
            <div className="space-y-2">
              <Label htmlFor="responsibilities" className={labelClass}>
                Key Responsibilities *
              </Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="Describe the main responsibilities of this position..."
                value={formData.responsibilities}
                onChange={handleChange}
                className={`${inputClass} min-h-32`}
                required
              />
            </div>
 
            <div className="space-y-2">
              <Label htmlFor="qualifications" className={labelClass}>
                Qualifications & Requirements *
              </Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                placeholder="List the required skills, experience, and qualifications..."
                value={formData.qualifications}
                onChange={handleChange}
                className={`${inputClass} min-h-32`}
                required
              />
            </div>
          </section>
 
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#5C53FE] p-5 text-white hover:bg-[#4F46E5]"
            >
              {isSubmitting ? "Publishing..." : "Publish Job"}
              <FaArrowRightToBracket />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
 

