import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { serverId, amount, message, isAnonymous } = body

    if (!serverId || !amount) {
      return NextResponse.json(
        { error: "Server ID and amount are required" },
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

    // Create Stripe Payment Intent
    // Money goes directly to server owner's connected account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountFloat * 100), // Convert to cents
      currency: "usd",
      application_fee_amount: Math.round(amountFloat * 100 * 0.05), // 5% platform fee
      transfer_data: {
        destination: server.owner.stripeAccountId,
      },
      metadata: {
        serverId: server.id,
        serverName: server.name,
        donorId: session?.user?.id || "anonymous",
        isAnonymous: isAnonymous ? "true" : "false",
      },
    })

    // Create donation record in database (pending)
    const donation = await prisma.donation.create({
      data: {
        amount: amountFloat,
        message,
        isAnonymous: isAnonymous || false,
        stripePaymentId: paymentIntent.id,
        stripeStatus: "pending",
        serverId: server.id,
        donorId: session?.user?.id || null,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      donationId: donation.id,
    })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json(
      { error: "Failed to process donation" },
      { status: 500 }
    )
  }
}
