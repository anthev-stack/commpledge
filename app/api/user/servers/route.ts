import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const servers = await prisma.server.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        _count: {
          select: {
            pledges: true,
            favorites: true,
          },
        },
        boosts: {
          where: {
            isActive: true,
            expiresAt: {
              gt: new Date()
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform servers to include boost information
    const serversWithBoostInfo = servers.map(server => ({
      ...server,
      isBoosted: server.boosts.length > 0,
      boostExpiresAt: server.boosts[0]?.expiresAt || null,
    }))

    return NextResponse.json(serversWithBoostInfo)
  } catch (error) {
    console.error("Error fetching user servers:", error)
    return NextResponse.json(
      { error: "Failed to fetch servers" },
      { status: 500 }
    )
  }
}

