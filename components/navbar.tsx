"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { Bell, LogOut, Mail, MenuIcon, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

const signInButtonClassName =
  "inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#645BFF] shadow-[0_2px_4px_rgba(0,0,0,0.03),inset_0_3px_10px_rgba(255,255,255,0.2)] border border-[#090A15]/10 transition-all hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 cursor-pointer"

const getStartedButtonClassName =
  "inline-flex h-9 items-center justify-center rounded-lg bg-[#5C53FE] px-4.5 text-sm font-medium text-[#EDEDEF] shadow-[0_2px_4px_rgba(0,0,0,0.03),inset_0_3px_10px_rgba(255,255,255,0.2)] border border-[#090A15]/10 transition-all hover:bg-[#4f46e5] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 cursor-pointer"

const iconButtonClassName =
  "rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"

function getInitials(name?: string | null) {
  const initials = name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()

  return initials || "U"
}

function UserAvatar({
  name,
  image,
  className,
}: {
  name?: string | null
  image?: string | null
  className?: string
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "inline-flex size-9 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10",
        className
      )}
    >
      {image ? (
        <AvatarPrimitive.Image
          src={image}
          alt={name ? `${name}'s avatar` : "User avatar"}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      ) : null}
      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center text-xs font-semibold text-white">
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

function UserActions({
  name,
  email,
  image,
  isSigningOut,
  onSignOut,
  onNavigate,
}: {
  name?: string | null
  email?: string | null
  image?: string | null
  isSigningOut: boolean
  onSignOut: () => void
  onNavigate: () => void
}) {
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Messages"
        className={iconButtonClassName}
      >
        <Mail className="size-4.5" />
      </button>
      <button
        type="button"
        aria-label="Notifications"
        className={iconButtonClassName}
      >
        <Bell className="size-4.5" />
      </button>
      <PopoverPrimitive.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverPrimitive.Trigger
          render={
            <button
              type="button"
              aria-label="Open profile menu"
              className="ml-1 rounded-full transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none cursor-pointer"
            />
          }
        >
          <UserAvatar name={name} image={image} />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            side="bottom"
            align="end"
            sideOffset={8}
            className="z-[60]"
          >
            <PopoverPrimitive.Popup className="w-80 max-w-[90vw] rounded-2xl border border-white/10 bg-[#141418] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.7)] transition duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <UserAvatar name={name} image={image} className="size-10" />
                <div className="min-w-0">
                  <PopoverPrimitive.Title className="truncate text-sm font-semibold text-white">
                    My Account
                  </PopoverPrimitive.Title>
                  <PopoverPrimitive.Description className="truncate text-xs text-zinc-400">
                    Profile details
                  </PopoverPrimitive.Description>
                </div>
              </div>

              <form
                onSubmit={(event) => event.preventDefault()}
                className="mt-3 space-y-3"
              >
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-400">
                    Name
                  </span>
                  <input
                    readOnly
                    value={name ?? ""}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-400">
                    Email
                  </span>
                  <input
                    readOnly
                    value={email ?? ""}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  />
                </label>
              </form>

              <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-2">
                <Link
                  href="/profile"
                  onClick={() => {
                    setPopoverOpen(false)
                    onNavigate()
                  }}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 focus-visible:outline-none"
                >
                  <UserIcon className="size-4" />
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={onSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.error(error.message ?? "Could not sign out")
        return
      }

      setOpen(false)
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      {/* Background ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(92,83,254,0.15),transparent)]"
      />

      {/* Main Navbar container: Frame 2147234461 (1320x74) in Figma */}
      <nav
        aria-label="Main"
        className="mx-auto flex h-[68px] sm:h-[74px] w-full max-w-[1320px] items-center justify-between rounded-[14px] border border-white/[0.07] bg-[#141418] px-5 sm:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="hireloop home"
          className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60"
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

        {/* Desktop Navbar Inner Frame: nav-bar (588x68) in Figma */}
        <div className="hidden md:flex items-center rounded-lg border border-white/[0.07] bg-[#1A1A1F] px-3.5 py-1.5 sm:px-4">
          <div className="flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 rounded-md px-1 py-1",
                    isActive
                      ? "text-[#EDEDEF] font-semibold"
                      : "text-[#EDEDEF]/80"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <Separator orientation="vertical" className="mx-3 sm:mx-4 h-5 bg-white/20" />

          {isPending ? (
            <div
              aria-hidden="true"
              className="size-9 animate-pulse rounded-full bg-white/10"
            />
          ) : user ? (
            <UserActions
              name={user.name}
              email={user.email}
              image={user.image}
              isSigningOut={isSigningOut}
              onSignOut={handleSignOut}
              onNavigate={() => setOpen(false)}
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/sign-in" className={signInButtonClassName}>
                Sign In
              </Link>
              <Link href="/sign-up" className={getStartedButtonClassName}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-white hover:bg-white/10 hover:text-white md:hidden cursor-pointer"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-white/10 bg-[#141418] text-white"
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

            <div className="flex flex-col gap-1.5 px-4 pt-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60",
                      isActive
                        ? "bg-white/5 text-white font-semibold"
                        : "text-white/70"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="mt-auto border-t border-white/10 p-4">
              {isPending ? (
                <div
                  aria-hidden="true"
                  className="h-10 animate-pulse rounded-xl bg-white/10"
                />
              ) : user ? (
                <div className="flex items-center justify-end">
                  <UserActions
                    name={user.name}
                    email={user.email}
                    image={user.image}
                    isSigningOut={isSigningOut}
                    onSignOut={handleSignOut}
                    onNavigate={() => setOpen(false)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className={cn(signInButtonClassName, "h-10 w-full justify-center")}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className={cn(getStartedButtonClassName, "h-10 w-full justify-center")}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
