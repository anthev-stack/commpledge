import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

// Called after payment method is successfully saved
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { setupIntentId } = body

    if (!setupIntentId) {
      return NextResponse.json(
        { error: "Setup intent ID required" },
        { status: 400 }
      )
    }

    // Retrieve the setup intent to get payment method
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (!setupIntent.payment_method) {
      return NextResponse.json(
        { error: "No payment method found" },
        { status: 400 }
      )
    }

    const paymentMethodId = setupIntent.payment_method as string

    // Update user with payment method info
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripePaymentMethodId: paymentMethodId,
        stripeCustomerId: setupIntent.customer as string,
        hasPaymentMethod: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment method saved error:", error)
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    )
  }
}
