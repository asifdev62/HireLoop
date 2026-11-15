"use client"

import { Suspense, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"

import { toast } from "@/components/ui/toast"

import { CheckoutButton } from "./_components/checkout-button"
import { authClient } from "@/lib/auth-client"

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const isRecruiter = user?.role === "recruiter"
  const planName = isRecruiter ? "Hireloop Recruiter Pro" : "Hireloop Pro Plan"
  const planDescription = isRecruiter
    ? "Unlimited job postings & candidate hiring tools"
    : "Access to all features & unlimited applications"
  const price = isRecruiter ? "$50.00" : "$20.00"
  const backHref = isRecruiter
    ? "/dashboard/recruiter/manage-jobs"
    : "/dashboard/seeker"

  const canceled = searchParams.get("canceled")

  useEffect(() => {
    if (canceled !== "true") return

    toast.add({
      title: "Order Canceled!",
      description: "Continue to shop around and check out when you're ready.",
    })
  }, [canceled])

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#08080A] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_50%_at_50%_-10%,rgba(11,107,255,0.14),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-48 -z-10 size-96 rounded-full bg-[#5C53FE]/[0.07] blur-[130px]"
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Link
              href={backHref}
              aria-label="Back to dashboard"
              className="flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B6BFF]/60 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="/"
              aria-label="Hireloop home"
              className="rounded-md focus-visible:ring-2 focus-visible:ring-[#0B6BFF]/60 focus-visible:outline-none"
            >
              <Image
                src="/images/logo.png"
                alt="Hireloop"
                width={154}
                height={44}
                priority
                className="h-7 w-auto"
              />
            </Link>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-medium text-emerald-300/90 sm:inline-flex">
            <Lock className="size-3" aria-hidden="true" />
            Secure checkout
          </span>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <section aria-label="Order summary" className="min-w-0">
            <h2 className="text-[10px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">
              Order summary
            </h2>

            <div className="mt-5 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight text-white">
                  {planName}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{planDescription}</p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-white">
                {price}
              </p>
            </div>

            <div className="mt-6 h-px bg-linear-to-r from-white/[0.12] via-white/[0.06] to-transparent" />

            <div className="mt-5 flex items-center justify-between gap-6">
              <p className="text-sm font-semibold text-white">Total</p>
              <p className="text-base font-semibold tracking-tight text-white">
                {price}
              </p>
            </div>
          </section>

          <section aria-label="Payment method">
            <h2 className="text-xs font-semibold text-white">Payment method</h2>

            <div className="mt-4 rounded-xl bg-linear-to-b from-white/[0.14] to-white/[0.03] p-px shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="rounded-[11px] bg-[#101014]">
                <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
                  <span className="flex size-7 items-center justify-center rounded-md bg-[#0B6BFF]/10 text-[#69A7FF] ring-1 ring-[#0B6BFF]/20 ring-inset">
                    <CreditCard className="size-3.5" aria-hidden="true" />
                  </span>

                  <span className="text-xs font-semibold text-white">Card</span>

                  <span className="ml-auto rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium tracking-wide text-zinc-500">
                    Stripe
                  </span>
                </div>

                <p className="px-4 py-4 text-xs leading-5 text-zinc-400">
                  You&apos;ll be redirected to Stripe&apos;s secure checkout to
                  complete your payment. Card details are never stored on
                  Hireloop.
                </p>
              </div>
            </div>

            <CheckoutButton amount={price} />

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <Lock className="size-3 text-zinc-600" aria-hidden="true" />
              Powered by{" "}
              <span className="font-medium text-zinc-400">Stripe</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentPageContent />
    </Suspense>
  )
}
