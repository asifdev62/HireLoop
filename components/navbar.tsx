"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

const getStartedClassName = cn(
  buttonVariants({ size: "lg" }),
  "h-9 rounded-lg border-0 bg-violet-600 bg-linear-to-r from-violet-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.9)] hover:bg-violet-500 hover:from-violet-400 hover:to-indigo-500 hover:text-white focus-visible:ring-violet-400/50"
)

export function Navbar() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#131314]/95 px-4 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-6"
      >
        <Link
          href="/"
          aria-label="hireloop home"
          className="shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
        >
          <Image
            src="/images/logo.png"
            alt="hireloop"
            width={154}
            height={44}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/65 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />
          <Link
            href="/sign-in"
            className="rounded-lg px-3 py-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
          >
            Sign In
          </Link>
          <Link href="/sign-up" className={getStartedClassName}>
            Get Started
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-white hover:bg-white/10 hover:text-white md:hidden"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-white/10 bg-[#131314] text-white"
          >
            <SheetHeader className="border-b border-white/10 pb-4">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Link
                href="/"
                aria-label="hireloop home"
                onClick={() => setOpen(false)}
                className="w-fit"
              >
                <Image
                  src="/images/logo.png"
                  alt="hireloop"
                  width={154}
                  height={44}
                  className="h-8 w-auto"
                />
              </Link>
            </SheetHeader>

            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-4">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className={cn(getStartedClassName, "h-10 justify-center")}
              >
                Get Started
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
