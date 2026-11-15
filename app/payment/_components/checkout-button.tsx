"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { toast } from "@/components/ui/toast"

type CheckoutButtonProps = {
  /** Formatted price, e.g. "BDT 2,553.33" or "$20.00". */
  amount: string
}

type CheckoutSessionResponse = {
  url?: string
  error?: string
}

export function CheckoutButton({ amount }: CheckoutButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  async function handleCheckout() {
    setIsRedirecting(true)

    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
      })

      const data = (await response
        .json()
        .catch(() => ({}))) as CheckoutSessionResponse

      if (!response.ok || !data.url) {
        toast.add({
          title: "Payment failed",
          description: data.error ?? "Could not start the checkout.",
          type: "error",
        })

        setIsRedirecting(false)
        return
      }

      window.location.href = data.url
    } catch {
      setIsRedirecting(false)

      toast.add({
        title: "Payment failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isRedirecting}
      className="group mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-b from-[#1B7BFF] to-[#0B5FE6] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(11,107,255,0.28)] ring-1 ring-white/15 transition-all ring-inset hover:from-[#2A86FF] hover:to-[#0B6BFF] hover:shadow-[0_10px_30px_rgba(11,107,255,0.4)] focus-visible:ring-2 focus-visible:ring-[#4D9BFF]/70 focus-visible:outline-none active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
    >
      {isRedirecting ? (
        "Redirecting to Stripe…"
      ) : (
        <>
          Checkout {amount}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  )
}
