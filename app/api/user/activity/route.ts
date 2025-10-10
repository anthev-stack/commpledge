import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "user" // "user" or "server"

    if (type === "user") {
      // Get user's own activity
      const activities = await prisma.activityLog.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          server: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      })

      return NextResponse.json(activities)
    } else {
      // Get activity on user's servers
      const userServers = await prisma.server.findMany({
        where: {
          ownerId: session.user.id,
        },
        select: {
          id: true,
        },
      })

      const serverIds = userServers.map(s => s.id)

      const activities = await prisma.activityLog.findMany({
        where: {
          serverId: { in: serverIds },
          userId: { not: session.user.id }, // Exclude own actions
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          server: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      })

      return NextResponse.json(activities)
    }
  } catch (error) {
    console.error("Error fetching activity:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: "Failed to fetch activity", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

