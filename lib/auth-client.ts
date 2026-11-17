import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

/**
 * No hardcoded baseURL: the client talks to the same origin it was served
 * from. That keeps cookies first-party and avoids pointing production at
 * localhost.
 */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
})
