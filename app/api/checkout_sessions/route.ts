import { NextResponse } from "next/server"

import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"

const SEEKER_PRICE_ID = "price_1UbzBuRxznHYYJr5v2jrhb5M" // $20.00
const RECRUITER_PRICE_ID = "price_1Uc8ZdRxznHYYJr5lHZd0xs3" // $50.00

/**
 * Stripe needs absolute redirect URLs. Only the configured app origin is
 * allowed, never a value taken from the request (that would let an attacker
 * send the payment confirmation to their own site).
 */
function getTrustedOrigin() {
  return (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  )
}

export async function POST() {
  const userSession = await getSession()

  if (!userSession?.user?.id || !userSession.user.email) {
    return NextResponse.json(
      { error: "Please sign in to continue" },
      { status: 401 }
    )
  }

  const userRole = userSession.user.role

  // Admins do not buy seeker/recruiter plans, and unknown roles are rejected.
  if (userRole !== "seeker" && userRole !== "recruiter") {
    return NextResponse.json(
      { error: "This plan is not available for your account" },
      { status: 403 }
    )
  }

  try {
    const origin = getTrustedOrigin()
    const isSubscription = userRole === "recruiter"
    const priceId = isSubscription ? RECRUITER_PRICE_ID : SEEKER_PRICE_ID
    const mode = isSubscription ? "subscription" : "payment"

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      customer_email: userSession.user.email,
      metadata: {
        userId: userSession.user.id,
        role: userRole,
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata: {
                userId: userSession.user.id,
                role: userRole,
              },
            },
          }
        : {}),
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?canceled=true`,
      integration_identifier: "hire_loop_web_007",
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch {
    // Do not return Stripe/database error details to the browser.
    console.error("Failed to create a Stripe checkout session")

    return NextResponse.json(
      { error: "Could not start the checkout. Please try again." },
      { status: 500 }
    )
  }
}
