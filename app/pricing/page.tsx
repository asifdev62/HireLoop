import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { PricingCards } from "@/components/Pricing"

export default function PricingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      {/* Soft purple ambience behind the header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,rgba(92,83,254,0.28),transparent_70%)]"
      />

      <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5C53FE]/30 bg-[#5C53FE]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#A79FFF] uppercase">
            <Sparkles className="size-3" aria-hidden="true" />
            Pricing
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Simple pricing for
            <span className="block bg-linear-to-r from-white via-[#C7C2FF] to-[#7C65C1] bg-clip-text text-transparent">
              serious work
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Start free. Upgrade when you need more applications or more job
            posts. Plans are tied to your account type, so you only pay for the
            side you are on.
          </p>
        </div>

        <h2 className="sr-only">Plans</h2>
        <PricingCards className="mt-12 sm:mt-16" />

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
