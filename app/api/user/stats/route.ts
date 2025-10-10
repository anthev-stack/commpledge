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

    // Get total pledged amount
    const pledgeStats = await prisma.pledge.aggregate({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      _sum: {
        amount: true,
      },
      _count: true,
    })

    // Get servers created count
    const serversCount = await prisma.server.count({
      where: {
        ownerId: session.user.id,
        status: "active",
      },
    })

    return NextResponse.json({
      totalPledged: pledgeStats._sum.amount || 0,
      activePledges: pledgeStats._count,
      serversCreated: serversCount,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}


