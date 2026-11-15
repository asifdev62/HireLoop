import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import type Stripe from "stripe"
import {
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  Hash,
  Mail,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { checkoutverify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"
import { CopyButton, PrintReceiptButton } from "./_components/success-actions"

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams

  if (!sessionId) {
    redirect("/payment")
  }

  let session: Stripe.Checkout.Session | null = null

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    })
  } catch (error) {
    console.error("Failed to retrieve Stripe checkout session:", error)
    redirect("/payment")
  }

  if (!session) {
    redirect("/payment")
  }

  if (session.status === "open") {
    redirect("/payment")
  }

  if (session.status !== "complete" || session.payment_status !== "paid") {
    redirect("/payment?canceled=true")
  }

  // Trigger backend verification / record update safely
  try {
    const verifyResult = await checkoutverify(sessionId)
    console.log("Checkout verification result:", verifyResult)
  } catch (error) {
    console.error("Error during checkout verification:", error)
  }

  // Extract payment_intent details
  const paymentIntent =
    session.payment_intent && typeof session.payment_intent === "object"
      ? (session.payment_intent as Stripe.PaymentIntent)
      : null

  // Transaction ID specifically under payment_intent.id
  const transactionId =
    paymentIntent?.id ??
    (typeof session.payment_intent === "string"
      ? session.payment_intent
      : null) ??
    sessionId

  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? null

  const customerName = session.customer_details?.name ?? null

  const rawAmount = session.amount_total ?? paymentIntent?.amount ?? 2000
  const currencyCode = (
    session.currency ??
    paymentIntent?.currency ??
    "usd"
  ).toUpperCase()

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(rawAmount / 100)

  const timestamp = (paymentIntent?.created ?? session.created) * 1000
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp))

  const planName =
    session.line_items?.data?.[0]?.description || "Hireloop Pro Plan"

  const paymentMethodType =
    paymentIntent?.payment_method_types?.[0]?.toUpperCase() ?? "CARD"

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08080A] px-4 py-6 text-white sm:py-8">
      {/* Background radial glow matching checkout theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-48 -z-10 size-96 rounded-full bg-[#5C53FE]/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-1/4 -z-10 size-96 rounded-full bg-emerald-500/[0.07] blur-[140px]"
      />

      <div className="mx-auto w-full max-w-[440px]">
        {/* Header bar */}
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Hireloop home"
            className="rounded-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#0B6BFF]/60 focus-visible:outline-none"
          >
            <Image
              src="/images/logo.png"
              alt="Hireloop"
              width={130}
              height={38}
              priority
              className="h-6 w-auto"
            />
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            <ShieldCheck className="size-3" aria-hidden="true" />
            Verified Payment
          </span>
        </header>

        {/* Success Card */}
        <section
          id="success"
          className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101014]/90 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-emerald-500/50 before:to-transparent sm:p-6"
        >
          {/* Glowing Success Icon */}
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/10">
            <Check className="size-5 stroke-[2.5]" aria-hidden="true" />
          </div>

          {/* Heading */}
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              <Sparkles className="size-2.5" aria-hidden="true" />
              Payment Confirmed
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Thank You For Your Order!
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Your transaction has completed successfully. A receipt has been
              sent to{" "}
              <span className="font-medium text-white">
                {customerEmail ?? "your email address"}
              </span>
              .
            </p>
          </div>

          {/* Highlighted Transaction ID Banner */}
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3 sm:p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25 ring-inset">
                  <Receipt className="size-3.5" aria-hidden="true" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold tracking-wide text-white uppercase">
                      Transaction ID
                    </span>
                    <span className="py-0.2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[9px] font-medium text-emerald-400">
                      Payment Intent
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Official Stripe payment reference
                  </p>
                </div>
              </div>

              <CopyButton
                text={transactionId}
                label="Copy ID"
                className="px-2 py-0.5 text-[11px]"
              />
            </div>

            <div className="mt-2 flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#0A0A0D] px-2.5 py-1.5">
              <code className="truncate font-mono text-[11px] text-zinc-200 select-all sm:text-xs">
                {transactionId}
              </code>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="mt-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 sm:p-3.5">
            <h2 className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
              Payment Summary
            </h2>

            <dl className="mt-2 divide-y divide-white/[0.06] text-xs">
              <div className="flex items-center justify-between py-1.5">
                <dt className="text-zinc-400">Purchased Plan</dt>
                <dd className="font-medium text-white">{planName}</dd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <dt className="text-zinc-400">Amount Paid</dt>
                <dd className="text-sm font-semibold text-emerald-400">
                  {formattedAmount}
                </dd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <dt className="text-zinc-400">Payment Status</dt>
                <dd>
                  <span className="py-0.2 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 text-[11px] font-medium text-emerald-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Paid
                  </span>
                </dd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <dt className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar
                    className="size-3 text-zinc-500"
                    aria-hidden="true"
                  />
                  Date & Time
                </dt>
                <dd className="font-medium text-zinc-300">{formattedDate}</dd>
              </div>

              {customerEmail && (
                <div className="flex items-center justify-between py-1.5">
                  <dt className="flex items-center gap-1.5 text-zinc-400">
                    <Mail className="size-3 text-zinc-500" aria-hidden="true" />
                    Billed To
                  </dt>
                  <dd className="max-w-[180px] truncate font-medium text-zinc-300 sm:max-w-xs">
                    {customerName
                      ? `${customerName} (${customerEmail})`
                      : customerEmail}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between py-1.5">
                <dt className="flex items-center gap-1.5 text-zinc-400">
                  <CreditCard
                    className="size-3 text-zinc-500"
                    aria-hidden="true"
                  />
                  Payment Method
                </dt>
                <dd className="font-medium text-zinc-300">
                  {paymentMethodType}
                </dd>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <dt className="flex items-center gap-1.5 text-zinc-400">
                  <Hash className="size-3 text-zinc-500" aria-hidden="true" />
                  Session ID
                </dt>
                <dd className="flex items-center gap-1.5">
                  <span className="max-w-[120px] truncate font-mono text-[10px] text-zinc-400 sm:max-w-[150px]">
                    {sessionId}
                  </span>
                  <CopyButton
                    text={sessionId}
                    label="Copy"
                    className="py-0.2 px-1.5 text-[10px]"
                  />
                </dd>
              </div>
            </dl>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/seeker"
              className="group inline-flex h-9.5 flex-1 items-center justify-center gap-1.5 rounded-lg bg-linear-to-b from-[#1B7BFF] to-[#0B5FE6] text-xs font-semibold text-white shadow-[0_6px_20px_rgba(11,107,255,0.25)] ring-1 ring-white/15 transition-all ring-inset hover:from-[#2A86FF] hover:to-[#0B6BFF] hover:shadow-[0_8px_24px_rgba(11,107,255,0.35)] focus-visible:ring-2 focus-visible:ring-[#4D9BFF]/70 focus-visible:outline-none"
            >
              <span>Go to Dashboard</span>
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/browse-jobs"
              className="inline-flex h-9.5 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Footer actions: print & support link */}
          <div className="mt-3.5 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-400 sm:flex-row">
            <PrintReceiptButton />

            <p>
              Need help?{" "}
              <a
                href="mailto:orders@example.com"
                className="text-[#69A7FF] hover:underline"
              >
                orders@example.com
              </a>
            </p>
          </div>
        </section>
      </div>

      <footer className="mt-4 text-center text-[11px] text-zinc-500">
        &copy; {new Date().getFullYear()} Hireloop. Powered by Stripe.
      </footer>
    </main>
  )
}
