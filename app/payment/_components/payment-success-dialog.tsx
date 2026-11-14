"use client"

import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"

type PaymentSuccessDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Formatted amount that was paid, e.g. "BDT 2,553.33". */
  amount: string
  /** Stripe Checkout Session id shown in the verified row. */
  sessionId: string
}

/**
 * "Upgrade successful" dialog shown after a payment goes through
 * (image 2 of the checkout design).
 */
export function PaymentSuccessDialog({
  open,
  onOpenChange,
  amount,
  sessionId,
}: PaymentSuccessDialogProps) {
  const router = useRouter()

  function goToDashboard() {
    router.push("/dashboard/seeker")
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />

        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[71] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#141418] p-6 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition duration-200 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 sm:p-7">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
            <Check className="size-6" aria-hidden="true" />
          </div>

          <span className="mt-4 inline-flex rounded-md border border-[#5C53FE]/25 bg-[#5C53FE]/10 px-2 py-1 text-[9px] font-semibold tracking-[0.14em] text-[#A79EFF] uppercase">
            Upgrade successful
          </span>

          <Dialog.Title className="mt-3 text-lg font-semibold tracking-tight text-white">
            Welcome to Hireloop Pro
          </Dialog.Title>

          <Dialog.Description className="mt-3 text-xs leading-5 text-zinc-400">
            Your payment of{" "}
            <span className="font-semibold text-white">{amount}</span> was
            received perfectly.
            <br />
            All advanced premium modules are unlocked on your account. You may
            need to re-authenticate to see the effect.
          </Dialog.Description>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left">
            <ShieldCheck
              className="size-4 shrink-0 text-zinc-500"
              aria-hidden="true"
            />

            <span className="shrink-0 text-[11px] font-medium text-zinc-400">
              Session ID Verified
            </span>

            <code className="ml-auto truncate font-mono text-[10px] text-zinc-500">
              {sessionId.slice(0, 18)}…
            </code>
          </div>

          <Dialog.Close
            render={
              <button
                type="button"
                onClick={goToDashboard}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              />
            }
          >
            Go to Workspace Dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
