import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get all servers
export async function GET() {
  try {
    const servers = await prisma.server.findMany({
      where: {
        status: "active",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            pledges: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate pledge stats for each server
    const serversWithStats = await Promise.all(
      servers.map(async (server) => {
        const pledgeStats = await prisma.pledge.aggregate({
          where: {
            serverId: server.id,
            status: "ACTIVE",
          },
          _sum: {
            amount: true,
            optimizedAmount: true,
          },
        })

        return {
          ...server,
          totalPledged: pledgeStats._sum.amount || 0,
          totalOptimized: pledgeStats._sum.optimizedAmount || 0,
          pledgerCount: server._count.pledges,
        }
      })
    )

    return NextResponse.json(serversWithStats)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json(
      { error: "Failed to fetch servers" },
      { status: 500 }
    )
  }
}

// Create a new server
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
    const { name, description, gameType, serverIp, playerCount, cost, withdrawalDay, imageUrl } = body

    if (!name || !gameType || !cost) {
      return NextResponse.json(
        { error: "Name, game type, and monthly cost are required" },
        { status: 400 }
      )
    }

    const monthlyCost = parseFloat(cost)
    if (isNaN(monthlyCost) || monthlyCost < 1) {
      return NextResponse.json(
        { error: "Monthly cost must be at least $1" },
        { status: 400 }
      )
    }

    const withdrawalDayNum = withdrawalDay ? parseInt(withdrawalDay) : 15
    if (withdrawalDayNum < 1 || withdrawalDayNum > 31) {
      return NextResponse.json(
        { error: "Withdrawal day must be between 1 and 31" },
        { status: 400 }
      )
    }

    // Check if user has connected Stripe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true, stripeOnboardingComplete: true },
    })

    if (!user?.stripeAccountId || !user?.stripeOnboardingComplete) {
      return NextResponse.json(
        { error: "Please connect your Stripe account before creating a server" },
        { status: 400 }
      )
    }

    const server = await prisma.server.create({
      data: {
        name,
        description,
        gameType,
        serverIp,
        playerCount: null, // Will be updated by live stats
        cost: monthlyCost,
        withdrawalDay: withdrawalDayNum,
        imageUrl,
        region: body.region || null,
        tags: body.tags || [],
        communityId: body.communityId || null,
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error("Error creating server:", error)
    return NextResponse.json(
      { error: "Failed to create server" },
      { status: 500 }
    )
  }
}
