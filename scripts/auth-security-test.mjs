/**
 * End-to-end Better Auth security test.
 *
 * Start the app first (`npm run build` then `npm start`), then run:
 *   node scripts/auth-security-test.mjs
 *
 * It creates two temporary accounts, checks that a client cannot assign
 * itself the admin role, checks that update-user cannot change the role, and
 * checks that a real admin still can. All temporary data is deleted at the
 * end.
 */

import dotenv from "dotenv"
import { MongoClient } from "mongodb"

dotenv.config()

const BASE = process.env.BETTER_AUTH_URL || "http://localhost:3000"
const tag = `auth-sec-${Date.now()}`
const password = "Str0ng-Test-Password-123!"
const seekerEmail = `${tag}-seeker@example.invalid`
const recruiterEmail = `${tag}-recruiter@example.invalid`

const client = new MongoClient(process.env.MONGODB_URL)

const results = []

function record(name, ok, detail = "") {
  results.push({ name, ok })
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}${detail ? ` — ${detail}` : ""}`)
}

async function post(pathname, body, cookie) {
  const response = await fetch(`${BASE}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: BASE,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : []

  return {
    status: response.status,
    data,
    cookie: setCookies.map((value) => value.split(";")[0]).join("; "),
  }
}

async function waitForServer() {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE}/sign-in`)
      if (response.ok) return
    } catch {
      // not ready
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error("Next.js server did not start in time")
}

try {
  await waitForServer()
  await client.connect()

  const db = client.db("hireloopdb")
  const users = db.collection("user")

  // 0. The privileged `role` field itself must be rejected outright.
  const rawRoleSignUp = await post("/api/auth/sign-up/email", {
    name: "Security Raw Role",
    email: `${tag}-raw@example.invalid`,
    password,
    role: "admin",
  })
  record(
    "A raw role field is rejected by sign-up",
    rawRoleSignUp.status === 400,
    `status=${rawRoleSignUp.status} code=${rawRoleSignUp.data?.code}`
  )

  // 1. A new account that asks for "admin" must become a seeker.
  const seekerSignUp = await post("/api/auth/sign-up/email", {
    name: "Security Seeker",
    email: seekerEmail,
    password,
    requestedRole: "admin",
  })

  const seeker = await users.findOne({ email: seekerEmail })
  record(
    "Sign-up with role=admin is downgraded to seeker",
    seekerSignUp.status === 200 && seeker?.role === "seeker",
    `status=${seekerSignUp.status} role=${seeker?.role}`
  )

  // 2. A recruiter sign-up keeps the recruiter role.
  const recruiterSignUp = await post("/api/auth/sign-up/email", {
    name: "Security Recruiter",
    email: recruiterEmail,
    password,
    requestedRole: "recruiter",
  })

  const recruiter = await users.findOne({ email: recruiterEmail })
  record(
    "Sign-up with role=recruiter is allowed",
    recruiterSignUp.status === 200 && recruiter?.role === "recruiter",
    `status=${recruiterSignUp.status} role=${recruiter?.role}`
  )

  const recruiterCookie = recruiterSignUp.cookie

  // 3. The signed-in recruiter cannot promote themselves via update-user.
  const promote = await post(
    "/api/auth/update-user",
    { role: "admin" },
    recruiterCookie
  )

  const recruiterAfter = await users.findOne({ _id: recruiter._id })
  record(
    "update-user cannot change your own role",
    // Better Auth rejects the field (400) and, as a second layer, the update
    // hook strips it. Either way the stored role must not change.
    (promote.status === 200 || promote.status === 400) &&
      recruiterAfter?.role === "recruiter",
    `status=${promote.status} code=${promote.data?.code} role=${recruiterAfter?.role}`
  )

  // 4. A real admin can still change another user's role.
  await users.updateOne(
    { _id: recruiter._id },
    { $set: { role: "admin" } }
  )

  const adminSignIn = await post("/api/auth/sign-in/email", {
    email: recruiterEmail,
    password,
  })

  const setRole = await post(
    "/api/auth/admin/set-role",
    { userId: seeker._id.toString(), role: "recruiter" },
    adminSignIn.cookie
  )

  const seekerAfter = await users.findOne({ _id: seeker._id })
  record(
    "A real admin can change another user's role",
    setRole.status === 200 && seekerAfter?.role === "recruiter",
    `status=${setRole.status} role=${seekerAfter?.role}`
  )

  // 5. A non-admin cannot call the admin endpoint.
  const nonAdminCookie = seekerSignUp.cookie
  const forbidden = await post(
    "/api/auth/admin/set-role",
    { userId: recruiter._id.toString(), role: "seeker" },
    nonAdminCookie
  )
  record(
    "A seeker cannot call the admin set-role endpoint",
    forbidden.status === 401 || forbidden.status === 403,
    `status=${forbidden.status}`
  )
} catch (error) {
  console.error("Auth test crashed:", error.message)
  process.exitCode = 1
} finally {
  try {
    const db = client.db("hireloopdb")
    const testUsers = await db
      .collection("user")
      .find({
        email: {
          $in: [seekerEmail, recruiterEmail, `${tag}-raw@example.invalid`],
        },
      })
      .toArray()

    const ids = testUsers.map((user) => user._id)

    await db.collection("session").deleteMany({ userId: { $in: ids } })
    await db.collection("account").deleteMany({ userId: { $in: ids } })
    await db.collection("user").deleteMany({ _id: { $in: ids } })

    console.log("Cleaned up temporary auth test accounts.")
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
