// import Link from "next/link"
// import { redirect } from "next/navigation"
// import { Check } from "lucide-react"
// import type Stripe from "stripe"

// import { stripe } from "@/lib/stripe"

// type SuccessPageProps = {
//   searchParams: Promise<{ session_id?: string }>
// }

// export default async function Success({ searchParams }: SuccessPageProps) {
//   const { session_id: sessionId } = await searchParams

//   // The success URL always carries a session id; anything else is a manual visit.
//   if (!sessionId) {
//     redirect("/")
//   }

//   let session: Stripe.Checkout.Session | null = null

//   try {
//     session = await stripe.checkout.sessions.retrieve(sessionId, {
//       expand: ["line_items", "payment_intent"],
//     })
//   } catch {
//     session = null
//   }

//   // An open, expired, or invalid session never reaches the success view.
//   if (!session || session.status !== "complete") {
//     redirect("/")
//   }

//   const customerEmail = session.customer_details?.email

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-4 py-16 text-white">
//       <section
//         id="success"
//         className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141418] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8"
//       >
//         <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
//           <Check className="size-6" aria-hidden="true" />
//         </div>

//         <h1 className="mt-4 text-lg font-semibold tracking-tight">
//           Payment successful
//         </h1>

//         <p className="mt-3 text-sm leading-6 text-zinc-400">
//           We appreciate your business! A confirmation email will be sent to{" "}
//           <span className="font-semibold text-white">
//             {customerEmail ?? "your email address"}
//           </span>
//           . If you have any questions, please email{" "}
//           <a
//             href="mailto:orders@example.com"
//             className="text-[#A79EFF] hover:underline"
//           >
//             orders@example.com
//           </a>
//           .
//         </p>

//         <Link
//           href="/dashboard/seeker"
//           className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
//         >
//           Go to Workspace Dashboard
//         </Link>
//       </section>
//     </main>
//   )
// }









import { checkoutverify } from '@/lib/actions/payments'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export default async function Success({ searchParams }: {searchParams: Promise<{ session_id?:string}>}) {

  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')


  const {
    status,
    payment_status,
      metadata,
    customer_email,
    payment_intent,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && payment_status === "paid") {
    console.log( status,
    payment_status,
    metadata,
    customer_email,
    payment_intent,)


  const result = await checkoutverify(session_id)
  console.log(result)
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }
}

