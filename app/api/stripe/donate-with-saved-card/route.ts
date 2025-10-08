import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to donate" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { serverId, amount, message, isAnonymous, paymentMethodId } = body

    if (!serverId || !amount || !paymentMethodId) {
      return NextResponse.json(
        { error: "Server ID, amount, and payment method are required" },
        { status: 400 }
      )
    }

    // Validate amount (minimum $1.00)
    const amountFloat = parseFloat(amount)
    if (amountFloat < 1) {
      return NextResponse.json(
        { error: "Minimum donation is $1.00" },
        { status: 400 }
      )
    }

    // Get server and verify owner has Stripe connected
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        owner: {
          select: {
            stripeAccountId: true,
            stripeOnboardingComplete: true,
          },
        },
      },
    })

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      )
    }

    if (!server.owner.stripeAccountId || !server.owner.stripeOnboardingComplete) {
      return NextResponse.json(
        { error: "Server owner has not set up payment processing" },
        { status: 400 }
      )
    }

    // Get customer from payment method
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    
    if (!paymentMethod.customer) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      )
    }

    // Create Payment Intent with saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountFloat * 100), // Convert to cents
      currency: "usd",
      customer: paymentMethod.customer as string,
      payment_method: paymentMethodId,
      off_session: false, // User is present, they clicked donate
      confirm: true, // Confirm immediately
      application_fee_amount: Math.round(amountFloat * 100 * 0.05), // 5% platform fee
      transfer_data: {
        destination: server.owner.stripeAccountId,
      },
      metadata: {
        serverId: server.id,
        serverName: server.name,
        donorId: session.user.id,
        isAnonymous: isAnonymous ? "true" : "false",
      },
    })

    // Create donation record in database
    const donation = await prisma.donation.create({
      data: {
        amount: amountFloat,
        message,
        isAnonymous: isAnonymous || false,
        stripePaymentId: paymentIntent.id,
        stripeStatus: paymentIntent.status === "succeeded" ? "succeeded" : "pending",
        serverId: server.id,
        donorId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      status: paymentIntent.status,
    })
  } catch (error: any) {
    console.error("Donation error:", error)
    
    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message || "Card was declined" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process donation" },
      { status: 500 }
    )
  }
}
