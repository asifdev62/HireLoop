import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

/**
 * This module must never be imported by a client component. It reads the
 * Better Auth session on the server and forwards the session token to the
 * Express API. Adding "server-only" makes an accidental client import a
 * build error instead of a leaked secret.
 */

export type AppRole = "seeker" | "recruiter" | "admin"

export const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000"

/** Reads the verified session from the request cookies. */
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

/**
 * For layouts and pages: sends anonymous visitors to the sign-in page.
 */
export async function requireUser() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  return session
}

/**
 * For layouts and pages: requires one of the given roles.
 * The role comes from the session stored in MongoDB, never from the client.
 */
export async function requireRole(...roles: AppRole[]) {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const role = session.user.role as AppRole | undefined

  if (!role || !roles.includes(role)) {
    redirect("/unauthorized")
  }

  return session
}

/**
 * For server actions: throws a readable error instead of redirecting, so the
 * calling component can show a toast.
 */
export async function requireSession() {
  const session = await getSession()

  if (!session?.user?.id || !session.session?.token) {
    throw new Error("Please sign in to continue")
  }

  return session
}

/**
 * Calls the Express API with the current user's session token.
 * Identity is never taken from the browser: the API verifies this token and
 * derives the user id and role itself.
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const session = await requireSession()

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      Authorization: `Bearer ${session.session.token}`,
    },
    cache: "no-store",
  })
}

/** Reads a safe, human-readable message from an API error response. */
export async function readApiError(response: Response, fallback: string) {
  try {
    const data: unknown = await response.json()

    if (
      data &&
      typeof data === "object" &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      return (data as { message: string }).message
    }
  } catch {
    // The body was not JSON; use the fallback.
  }

  return fallback
}

/** @deprecated Use apiFetch. Kept so older server actions keep working. */
export const authFetch = apiFetch
