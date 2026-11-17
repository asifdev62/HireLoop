/**
 * Frontend RBAC smoke test.
 *
 * Start the app first, then run:
 *   BETTER_AUTH_URL=http://localhost:3100 node scripts/route-rbac-test.mjs
 *
 * It creates one temporary seeker, then checks that the seeker can open the
 * seeker dashboard but is redirected away from the recruiter/admin dashboards.
 * The temporary account is deleted at the end.
 */

import dotenv from "dotenv"
import { MongoClient } from "mongodb"

dotenv.config()

const BASE = process.env.BETTER_AUTH_URL || "http://localhost:3000"
const tag = `route-rbac-${Date.now()}`
const password = "Str0ng-Test-Password-123!"
const email = `${tag}@example.invalid`

const client = new MongoClient(process.env.MONGODB_URL)
const results = []

function record(name, ok, detail = "") {
  results.push({ name, ok })
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail ? ` — ${detail}` : ""}`)
}

async function request(pathname, cookie) {
  const response = await fetch(`${BASE}${pathname}`, {
    redirect: "manual",
    headers: cookie ? { Cookie: cookie } : {},
  })

  return {
    status: response.status,
    location: response.headers.get("location") ?? "",
  }
}

try {
  await client.connect()

  const db = client.db("hireloopdb")
  const users = db.collection("user")

  // Sign up a seeker and keep its session cookie.
  const signUp = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify({
      name: "Route RBAC Seeker",
      email,
      password,
      requestedRole: "seeker",
    }),
  })

  if (signUp.status !== 200) {
    throw new Error(`Sign-up failed with status ${signUp.status}`)
  }

  const cookie = signUp.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ")

  const seekerDashboard = await request("/dashboard/seeker", cookie)
  record(
    "Seeker can open /dashboard/seeker",
    seekerDashboard.status === 200,
    `status=${seekerDashboard.status}`
  )

  const recruiterDashboard = await request("/dashboard/recruiter", cookie)
  record(
    "Seeker is redirected away from /dashboard/recruiter",
    recruiterDashboard.status === 307 &&
      recruiterDashboard.location.endsWith("/unauthorized"),
    `status=${recruiterDashboard.status} location=${recruiterDashboard.location}`
  )

  const adminDashboard = await request("/dashboard/admin", cookie)
  record(
    "Seeker is redirected away from /dashboard/admin",
    adminDashboard.status === 307 &&
      adminDashboard.location.endsWith("/unauthorized"),
    `status=${adminDashboard.status} location=${adminDashboard.location}`
  )

  const adminUsers = await request("/dashboard/admin/users", cookie)
  record(
    "Seeker is redirected away from /dashboard/admin/users",
    adminUsers.status === 307 && adminUsers.location.endsWith("/unauthorized"),
    `status=${adminUsers.status} location=${adminUsers.location}`
  )

  const paymentSuccess = await request("/payment/success", cookie)
  record(
    "Seeker without a receipt is redirected out of /payment/success",
    paymentSuccess.status === 307 && paymentSuccess.location.endsWith("/payment"),
    `status=${paymentSuccess.status} location=${paymentSuccess.location}`
  )

  const user = await users.findOne({ email })
  record(
    "Temporary seeker has the seeker role",
    user?.role === "seeker",
    `role=${user?.role}`
  )
} catch (error) {
  console.error("Route RBAC test crashed:", error.message)
  process.exitCode = 1
} finally {
  try {
    const db = client.db("hireloopdb")
    const testUsers = await db
      .collection("user")
      .find({ email })
      .toArray()
    const ids = testUsers.map((user) => user._id)

    await db.collection("session").deleteMany({ userId: { $in: ids } })
    await db.collection("account").deleteMany({ userId: { $in: ids } })
    await db.collection("user").deleteMany({ _id: { $in: ids } })

    console.log("Cleaned up temporary route RBAC account.")
  } catch (error) {
    console.error("Cleanup failed:", error.message)
  }

  await client.close()

  const failed = results.filter((result) => !result.ok).length
  console.log(
    `\nSummary: ${results.length - failed} passed, ${failed} failed, ${results.length} total`
  )

  if (failed > 0) process.exitCode = 1
}
