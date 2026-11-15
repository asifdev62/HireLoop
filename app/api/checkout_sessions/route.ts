import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"

type HeaderReader = {
  get(name: string): string | null
}

/**
 * Stripe needs absolute redirect URLs. `Origin` is present on the browser's
 * POST, but fall back to BETTER_AUTH_URL if a proxy strips it.
 */
function resolveOrigin(headerList: HeaderReader) {
  const origin = headerList.get("origin")

  if (origin) {
    return origin
  }

  return process.env.BETTER_AUTH_URL || "http://localhost:3000"
}

const SEEKER_PRICE_ID = "price_1UbzBuRxznHYYJr5v2jrhb5M" // $20.00
const RECRUITER_PRICE_ID = "price_1Uc8ZdRxznHYYJr5lHZd0xs3" // $50.00

export async function POST() {
  const userSession = await getSession()
  try {
    const origin = resolveOrigin(await headers())
    const userRole = userSession?.user.role

    const isSubscription = userRole === "recruiter"
    const priceId = isSubscription ? RECRUITER_PRICE_ID : SEEKER_PRICE_ID
    const mode = isSubscription ? "subscription" : "payment"

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      customer_email: userSession?.user.email,
      metadata: {
        userId: userSession?.user.id ?? null,
        role: userRole ?? "seeker",
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata: {
                userId: userSession?.user.id ?? null,
                role: userRole ?? "seeker",
              },
            },
          }
        : {}),
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?canceled=true`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "hire_loop_web_007",
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 }
      )
    }

    // The client redirects itself, so the browser can leave the app for Stripe.
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
