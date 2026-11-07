"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Role = "seeker" | "recruiter" | "admin"

const ROLES: {
  value: Role
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: "seeker", label: "Seeker", icon: Briefcase },
  { value: "recruiter", label: "Recruiter", icon: Building2 },
  { value: "admin", label: "Admin", icon: ShieldCheck },
]

export default function SignUpPage() {
  const [formData, setFormData] = useState<{
    name: string
    email: string
    password: string
    confirmPassword: string
    role: Role
    agreeToTerms: boolean
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
    agreeToTerms: false,
  })
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the Terms and Conditions.")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Your account has been created successfully!")

      router.push("/")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Redirecting to Google... Please wait!")
    } catch {
      toast.error("Google sign-up failed. Please try again.")
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 text-white selection:bg-violet-500/30 selection:text-white sm:px-6 lg:px-8">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.22),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(79,70,229,0.15),transparent)]"
      />

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-block transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/logo.png"
              alt="hireloop"
              width={160}
              height={46}
              priority
              className="mx-auto h-9 w-auto"
            />
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Join HireLoop to discover and apply to top opportunities
          </p>
        </div>

        {/* Card Container */}
        <div className="relative rounded-2xl border border-white/10 bg-[#121316]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8">
          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                I am a
              </label>
              <div
                role="radiogroup"
                aria-label="Select your role"
                className="grid grid-cols-3 gap-2"
              >
                {ROLES.map(({ value, label, icon: Icon }) => {
                  const isSelected = formData.role === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          role: value,
                        }))
                      }
                      className={cn(
                        "group relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all focus:ring-2 focus:ring-violet-500/40 focus:outline-none",
                        isSelected
                          ? "border-violet-500 bg-violet-600/15 text-white shadow-[0_0_15px_rgba(124,58,237,0.25)] ring-1 ring-violet-500/50"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-200"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4.5 transition-colors",
                          isSelected
                            ? "text-violet-400"
                            : "text-zinc-400 group-hover:text-zinc-200"
                        )}
                      />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Full Name Field */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-zinc-300"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Md Asif Ali"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="asif@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-sm text-white transition-all placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-medium text-zinc-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-sm text-white transition-all placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 size-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 focus:outline-none"
              />
              <label
                htmlFor="agreeToTerms"
                className="cursor-pointer text-xs leading-normal text-zinc-400 select-none"
              >
                I agree to HireLoop&apos;s{" "}
                <Link
                  href="/terms"
                  className="text-violet-400 hover:text-violet-300 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-violet-400 hover:text-violet-300 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.9)] transition-all hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="h-px w-full bg-white/10" />
            <span className="absolute bg-[#121316] px-3 text-xs font-medium text-zinc-500 uppercase">
              Or sign up with email
            </span>
          </div>

          {/* Social Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 active:scale-[0.99]"
          >
            <svg className="size-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Toggle to Sign In */}
          <p className="mt-6 text-center text-xs text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
