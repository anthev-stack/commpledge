import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update donation status to succeeded
        await prisma.donation.updateMany({
          where: {
            stripePaymentId: paymentIntent.id,
          },
          data: {
            stripeStatus: "succeeded",
          },
        })

        console.log("Payment succeeded:", paymentIntent.id)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update donation status to failed
        await prisma.donation.updateMany({
          where: {
            stripePaymentId: paymentIntent.id,
          },
          data: {
            stripeStatus: "failed",
          },
        })

        console.log("Payment failed:", paymentIntent.id)
        break
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account

        // Update user's Stripe Connect status
        const user = await prisma.user.findFirst({
          where: {
            stripeAccountId: account.id,
          },
        })

        if (user) {
          const isComplete = account.details_submitted && account.charges_enabled

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              stripeOnboardingComplete: isComplete,
              stripeAccountStatus: isComplete ? "active" : "pending",
            },
          })

          console.log("Account updated:", account.id, "Complete:", isComplete)
        }
        break
      }

      default:
        console.log("Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
