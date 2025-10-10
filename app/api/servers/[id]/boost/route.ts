import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: serverId } = await params

    // Check if server exists and user owns it
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: { owner: true }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    if (server.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if user has an active boost for this server
    const existingBoost = await prisma.serverBoost.findFirst({
      where: {
        serverId,
        userId: session.user.id,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (existingBoost) {
      return NextResponse.json(
        { error: "Server is already boosted" },
        { status: 400 }
      )
    }

    // Check if user has a payment method
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        stripeCustomerId: true, 
        hasPaymentMethod: true,
        stripePaymentMethodId: true 
      }
    })

    if (!user?.hasPaymentMethod || !user.stripePaymentMethodId) {
      return NextResponse.json(
        { error: "No payment method found. Please add a payment method first." },
        { status: 400 }
      )
    }

    // Create payment intent for $3.00 boost
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 300, // $3.00 in cents
      currency: 'usd',
      customer: user.stripeCustomerId!,
      payment_method: user.stripePaymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      off_session: true,
      metadata: {
        type: 'server_boost',
        serverId,
        userId: session.user.id
      }
    })

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: "Payment failed" },
        { status: 400 }
      )
    }

    // Create boost record
    const boost = await prisma.serverBoost.create({
      data: {
        serverId,
        userId: session.user.id,
        cost: 3.00,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        isActive: true
      }
    })

    // Log the boost activity
    await prisma.activityLog.create({
      data: {
        action: 'server_boosted',
        userId: session.user.id,
        serverId,
        metadata: {
          boostId: boost.id,
          cost: 3.00,
          expiresAt: boost.expiresAt
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      boost: {
        id: boost.id,
        expiresAt: boost.expiresAt,
        cost: boost.cost
      }
    })

  } catch (error) {
    console.error("Error boosting server:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: serverId } = await params

    // Get current boost status for this server
    const boost = await prisma.serverBoost.findFirst({
      where: {
        serverId,
        userId: session.user.id,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!boost) {
      return NextResponse.json({ boost: null })
    }

    return NextResponse.json({ 
      boost: {
        id: boost.id,
        expiresAt: boost.expiresAt,
        startsAt: boost.startsAt,
        cost: boost.cost,
        timeLeft: Math.max(0, boost.expiresAt.getTime() - Date.now())
      }
    })

  } catch (error) {
    console.error("Error fetching boost status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
