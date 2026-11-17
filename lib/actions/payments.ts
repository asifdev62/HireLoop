"use server"

import { apiFetch, readApiError, requireSession } from "@/lib/core/server"

type VerifyResult = {
  success?: boolean
  message?: string
  alreadyVerified?: boolean
}

/**
 * Confirms a Stripe Checkout session and marks the signed-in user premium.
 *
 * The session id alone is not enough: the API checks that the Stripe session
 * metadata belongs to the authenticated user.
 */
export async function verifyCheckoutAction(
  sessionId: string
): Promise<VerifyResult> {
  await requireSession()

  if (
    typeof sessionId !== "string" ||
    sessionId.length < 10 ||
    sessionId.length > 200
  ) {
    return { success: false, message: "Invalid checkout session" }
  }

  const response = await apiFetch("/payments/checkout-verify", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  })

  if (!response.ok) {
    return {
      success: false,
      message: await readApiError(response, "Could not verify the payment"),
    }
  }

  return response.json()
}
