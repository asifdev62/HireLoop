"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react"

import Navbar from "@/components/Navbar"
import { toast } from "@/components/ui/toast"

import { PaymentSuccessDialog } from "./_components/payment-success-dialog"

type Currency = "BDT" | "USD"

/** Both prices are the same plan, shown in the two supported currencies. */
const PRICES: Record<Currency, { amount: string; total: string }> = {
  BDT: { amount: "2,553.33", total: "BDT 2,553.33" },
  USD: { amount: "20.00", total: "$20.00" },
}

const PLAN_NAME = "Hireloop Pro Plan"
const PLAN_DESCRIPTION = "Access to all features"

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "India",
  "Canada",
]

// A fake session id keeps the success dialog identical to the real Stripe flow.
const SESSION_ID = "cs_test_a1b8d3f12e5c9a4f6b7d8e9"

const CARD_INPUT_CLASS =
  "w-full rounded-md border border-white/10 bg-[#18181B] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"

const FIELD_LABEL_CLASS =
  "mb-1.5 block text-[10px] font-medium tracking-[0.1em] text-zinc-500 uppercase"

export default function PaymentPage() {
  const [currency, setCurrency] = useState<Currency>("BDT")
  const [successOpen, setSuccessOpen] = useState(false)

  const price = PRICES[currency]

  function handlePay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // TODO: create a Stripe Checkout Session on the server and redirect.
    // For now a successful payment is simulated, which opens the dialog.
    setSuccessOpen(true)
  }

  return (
    <main className="relative isolate min-h-screen bg-[#09090B] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(92,83,254,0.16),transparent)]"
      />

      <Navbar />

      <div className="mx-auto w-full max-w-[1080px] px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101014]">
          {/* Checkout header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/seeker"
                aria-label="Back to dashboard"
                className="flex size-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>

              <span className="flex size-8 items-center justify-center rounded-md text-zinc-500">
                <Lock className="size-3.5" aria-hidden="true" />
              </span>
            </div>

            <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-zinc-400">
              SANDBOX
            </span>
          </div>

          <div className="grid grid-cols-1 gap-10 px-5 pt-4 pb-8 sm:px-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
            {/* Left: currency + plan summary */}
            <section aria-label="Order summary" className="min-w-0">
              <h2 className="text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                Choose a currency:
              </h2>

              <div className="mt-3 flex flex-wrap gap-3">
                {(Object.keys(PRICES) as Currency[]).map((option) => {
                  const isSelected = currency === option

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCurrency(option)}
                      aria-pressed={isSelected}
                      className={`inline-flex min-w-[150px] items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none ${
                        isSelected
                          ? "border-white/40 bg-white/[0.06] text-white"
                          : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-base leading-none">
                        {option === "BDT" ? "🇧🇩" : "🇺🇸"}
                      </span>
                      {option === "BDT"
                        ? `BDT ${PRICES.BDT.amount}`
                        : `$${PRICES.USD.amount}`}
                    </button>
                  )
                })}
              </div>

              <p className="mt-2.5 text-[11px] text-zinc-600">
                1 USD = 127.6650 BDT
              </p>

              <div className="mt-8 border-t border-white/[0.07]" />

              <div className="mt-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {PLAN_NAME}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {PLAN_DESCRIPTION}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold whitespace-nowrap text-white">
                  {price.total}
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                {[
                  "Unlimited job applications",
                  "Priority application review",
                  "Advanced filters and job alerts",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs text-zinc-400"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            {/* Right: payment */}
            <section aria-label="Payment details" className="min-w-0">
              <button
                type="button"
                onClick={() =>
                  toast.add({
                    title: "Link checkout is not connected yet",
                    description:
                      "Stripe Link will be available once the payment flow is added.",
                    type: "info",
                  })
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1ED760] text-sm font-semibold text-[#062B14] transition-colors hover:bg-[#19c257] focus-visible:ring-2 focus-visible:ring-[#1ED760]/50 focus-visible:outline-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-base leading-none">⚡</span>
                  Link
                </span>

                <span className="ml-1 inline-flex items-center overflow-hidden rounded bg-white/85 text-[10px] font-bold tracking-wide text-[#0B0B0C]">
                  <span className="px-1.5 py-1">VISA</span>
                  <span className="bg-white/60 px-1.5 py-1">4242</span>
                </span>
              </button>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.07]" />
                <span className="text-[10px] font-medium tracking-[0.12em] text-zinc-600">
                  OR
                </span>
                <span className="h-px flex-1 bg-white/[0.07]" />
              </div>

              <form onSubmit={handlePay} className="mt-5">
                <label htmlFor="email" className={FIELD_LABEL_CLASS}>
                  Contact information
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="email@example.com"
                  className={CARD_INPUT_CLASS}
                />

                <h2 className="mt-6 text-sm font-semibold text-white">
                  Payment method
                </h2>

                <div className="mt-3 rounded-lg border border-white/10 bg-[#141418]">
                  <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-3 text-sm text-white">
                    <CreditCard
                      className="size-4 text-zinc-400"
                      aria-hidden="true"
                    />
                    Card
                  </div>

                  <div className="space-y-3 p-3.5">
                    <div>
                      <span className={FIELD_LABEL_CLASS}>
                        Card information
                      </span>

                      <div className="overflow-hidden rounded-md border border-white/10 bg-[#18181B] focus-within:border-zinc-500">
                        <div className="relative">
                          <input
                            aria-label="Card number"
                            name="cardNumber"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            required
                            placeholder="1234 1234 1234 1234"
                            className="w-full bg-transparent px-3 py-2.5 pr-20 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                          />

                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1"
                          >
                            <span className="rounded bg-[#1A1F71] px-1 py-0.5 text-[8px] font-bold text-white">
                              VISA
                            </span>
                            <span className="rounded bg-[#EB001B]/80 px-1 py-0.5 text-[8px] font-bold text-white">
                              MC
                            </span>
                            <span className="rounded bg-[#006FCF] px-1 py-0.5 text-[8px] font-bold text-white">
                              AMEX
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 border-t border-white/10">
                          <input
                            aria-label="Card expiry date"
                            name="expiry"
                            autoComplete="cc-exp"
                            required
                            placeholder="MM / YY"
                            className="w-full border-r border-white/10 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                          />
                          <input
                            aria-label="Card security code"
                            name="cvc"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            required
                            placeholder="CVC"
                            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={FIELD_LABEL_CLASS}>Cardholder name</span>
                      <input
                        aria-label="Cardholder name"
                        name="cardholder"
                        autoComplete="cc-name"
                        required
                        placeholder="Full name on card"
                        className={CARD_INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <span className={FIELD_LABEL_CLASS}>
                        Country or region
                      </span>

                      <div className="relative">
                        <select
                          aria-label="Country or region"
                          name="country"
                          defaultValue="Bangladesh"
                          className={`${CARD_INPUT_CLASS} appearance-none pr-9`}
                        >
                          {COUNTRIES.map((country) => (
                            <option
                              key={country}
                              value={country}
                              className="bg-[#18181B] text-white"
                            >
                              {country}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    name="save"
                    className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-[#5C53FE]"
                  />

                  <span className="text-xs text-zinc-300">
                    Save my information for faster checkout
                    <span className="mt-0.5 block text-[11px] text-zinc-600">
                      Pay securely on this site and everywhere Link is accepted.
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#5C53FE] text-sm font-semibold text-white shadow-[0_2px_14px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#4f46e5] focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
                >
                  Pay {price.total}
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Payments are encrypted and handled by Stripe
                </p>
              </form>
            </section>
          </div>

          <div className="border-t border-white/[0.06] px-5 py-5 text-center sm:px-7">
            <p className="text-[11px] font-medium text-zinc-500">
              Powered by{" "}
              <span className="font-semibold text-zinc-300">Stripe</span>
            </p>

            <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-zinc-600">
              <Link
                href="/terms"
                className="transition-colors hover:text-zinc-300"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-zinc-300"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Successful payment dialog (image 2) */}
      <PaymentSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        amount={price.total}
        sessionId={SESSION_ID}
      />
    </main>
  )
}
