import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateOptimizedCosts, canAcceptPledge, getOptimizationPreview } from "@/lib/optimization"
import { MIN_PLEDGE, MAX_PLEDGE } from "@/lib/constants"

// Get pledge status and optimization preview
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        pledges: {
          where: { status: "ACTIVE" },
          select: { amount: true, userId: true },
        },
      },
    })

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      )
    }

    // Get user's existing pledge if any
    let userPledge = null
    if (session?.user?.id) {
      userPledge = await prisma.pledge.findUnique({
        where: {
          userId_serverId: {
            userId: session.user.id,
            serverId: id,
          },
        },
      })
    }

    const pledgeAmounts = server.pledges.map(p => p.amount)
    const optimization = calculateOptimizedCosts(pledgeAmounts, server.cost)

    return NextResponse.json({
      canPledge: optimization.isAcceptingPledges && !userPledge,
      hasPledge: !!userPledge,
      userPledge,
      currentPledges: server.pledges.length,
      maxPledges: optimization.maxPeople,
      totalPledged: optimization.totalPledged,
      serverCost: server.cost,
      savings: optimization.savings,
    })
  } catch (error) {
    console.error("Get pledge status error:", error)
    return NextResponse.json(
      { error: "Failed to get pledge status" },
      { status: 500 }
    )
  }
}

// Create a pledge
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to pledge" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { amount } = body

    // Validate amount
    const pledgeAmount = parseFloat(amount)
    if (isNaN(pledgeAmount) || pledgeAmount < MIN_PLEDGE || pledgeAmount > MAX_PLEDGE) {
      return NextResponse.json(
        { error: `Pledge amount must be between $${MIN_PLEDGE} and $${MAX_PLEDGE}` },
        { status: 400 }
      )
    }

    // Check user status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        hasPaymentMethod: true,
        stripePaymentMethodId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is suspended or banned
    if (user.role === "SUSPENDED" || user.role === "BANNED") {
      return NextResponse.json(
        { error: "Your account is suspended. Please contact support." },
        { status: 403 }
      )
    }

    // Check if user has payment method
    if (!user.hasPaymentMethod || !user.stripePaymentMethodId) {
      return NextResponse.json(
        { error: "Please add a payment method in Settings before pledging" },
        { status: 400 }
      )
    }

    // Get server and existing pledges
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        pledges: {
          where: { status: "ACTIVE" },
          select: { amount: true, userId: true },
        },
      },
    })

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      )
    }

    if (!server.isActive) {
      return NextResponse.json(
        { error: "This server is not accepting pledges" },
        { status: 400 }
      )
    }

    // Check if user already has a pledge
    const existingPledge = server.pledges.find(p => p.userId === session.user.id)
    if (existingPledge) {
      return NextResponse.json(
        { error: "You already have a pledge for this server" },
        { status: 400 }
      )
    }

    // Check if server can accept more pledges
    if (!canAcceptPledge(server.pledges.length, server.cost)) {
      return NextResponse.json(
        { error: "Server has reached maximum capacity" },
        { status: 400 }
      )
    }

    // Calculate optimization preview
    const existingAmounts = server.pledges.map(p => p.amount)
    const preview = getOptimizationPreview(pledgeAmount, existingAmounts, server.cost)

    // Create pledge
    const pledge = await prisma.pledge.create({
      data: {
        amount: pledgeAmount,
        optimizedAmount: preview.estimatedPayment,
        userId: session.user.id,
        serverId: id,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        serverId: id,
        action: "pledge_created",
        details: JSON.stringify({
          amount: pledgeAmount,
          optimizedAmount: preview.estimatedPayment,
        }),
      },
    })

    // Recalculate optimization for all pledges
    const allPledges = await prisma.pledge.findMany({
      where: {
        serverId: id,
        status: "ACTIVE",
      },
      select: { id: true, amount: true },
    })

    const allAmounts = allPledges.map(p => p.amount)
    const optimization = calculateOptimizedCosts(allAmounts, server.cost)

    // Update optimized amounts for all pledges
    await Promise.all(
      allPledges.map((p, index) =>
        prisma.pledge.update({
          where: { id: p.id },
          data: { optimizedAmount: optimization.optimizedCosts[index] },
        })
      )
    )

    return NextResponse.json({
      pledge,
      message: preview.potentialSavings > 0
        ? `Pledge created! You'll pay approximately $${preview.estimatedPayment.toFixed(2)} (saving $${preview.potentialSavings.toFixed(2)})`
        : `Pledge created! You'll pay $${preview.estimatedPayment.toFixed(2)} monthly`,
      optimization: {
        pledgedAmount: pledgeAmount,
        estimatedPayment: preview.estimatedPayment,
        potentialSavings: preview.potentialSavings,
      },
    })
  } catch (error) {
    console.error("Create pledge error:", error)
    return NextResponse.json(
      { error: "Failed to create pledge" },
      { status: 500 }
    )
  }
}

// Delete a pledge (unpledge)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find user's pledge
    const pledge = await prisma.pledge.findUnique({
      where: {
        userId_serverId: {
          userId: session.user.id,
          serverId: id,
        },
      },
    })

    if (!pledge) {
      return NextResponse.json(
        { error: "You don't have a pledge for this server" },
        { status: 404 }
      )
    }

    // Cancel pledge
    await prisma.pledge.update({
      where: { id: pledge.id },
      data: { status: "CANCELLED" },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        serverId: id,
        action: "pledge_cancelled",
        details: JSON.stringify({
          amount: pledge.amount,
        }),
      },
    })

    // Recalculate optimization for remaining pledges
    const remainingPledges = await prisma.pledge.findMany({
      where: {
        serverId: id,
        status: "ACTIVE",
      },
      select: { id: true, amount: true },
    })

    if (remainingPledges.length > 0) {
      const server = await prisma.server.findUnique({
        where: { id },
        select: { cost: true },
      })

      if (server) {
        const amounts = remainingPledges.map(p => p.amount)
        const optimization = calculateOptimizedCosts(amounts, server.cost)

        // Update optimized amounts
        await Promise.all(
          remainingPledges.map((p, index) =>
            prisma.pledge.update({
              where: { id: p.id },
              data: { optimizedAmount: optimization.optimizedCosts[index] },
            })
          )
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete pledge error:", error)
    return NextResponse.json(
      { error: "Failed to cancel pledge" },
      { status: 500 }
    )
  }
}
