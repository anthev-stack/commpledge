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
            donations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate total donations for each server
    const serversWithStats = await Promise.all(
      servers.map(async (server) => {
        const donations = await prisma.donation.aggregate({
          where: {
            serverId: server.id,
            stripeStatus: "succeeded",
          },
          _sum: {
            amount: true,
          },
        })

        return {
          ...server,
          totalDonations: donations._sum.amount || 0,
          donorCount: server._count.donations,
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
    const { name, description, gameType, serverIp, playerCount, goal, imageUrl } = body

    if (!name || !gameType) {
      return NextResponse.json(
        { error: "Name and game type are required" },
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
        playerCount: playerCount ? parseInt(playerCount) : null,
        goal: goal ? parseFloat(goal) : null,
        imageUrl,
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
