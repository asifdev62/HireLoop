"use client"

import { useState } from "react"
import { Check, Copy, Printer } from "lucide-react"

import { toast } from "@/components/ui/toast"

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.add({
        title: "Copied to clipboard",
        description: "Transaction ID copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.add({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please copy manually.",
        type: "error",
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${text}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0B6BFF]/60 focus-visible:outline-none active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5 text-zinc-400" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

export function PrintReceiptButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white focus-visible:underline focus-visible:outline-none ${className}`}
    >
      <Printer className="size-3.5 text-zinc-500" aria-hidden="true" />
      <span>Print Receipt</span>
    </button>
  )
}
