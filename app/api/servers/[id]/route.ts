import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            stripeAccountId: true,
            stripeOnboardingComplete: true,
          },
        },
        pledges: {
          where: {
            status: "ACTIVE",
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
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
        },
      },
    })

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      )
    }

    // Calculate pledge stats
    const pledgeStats = await prisma.pledge.aggregate({
      where: {
        serverId: id,
        status: "ACTIVE",
      },
      _sum: {
        amount: true,
        optimizedAmount: true,
      },
      _count: true,
    })

    return NextResponse.json({
      ...server,
      totalPledged: pledgeStats._sum.amount || 0,
      totalOptimized: pledgeStats._sum.optimizedAmount || 0,
      pledgerCount: pledgeStats._count,
    })
  } catch (error) {
    console.error("Error fetching server:", error)
    return NextResponse.json(
      { error: "Failed to fetch server" },
      { status: 500 }
    )
  }
}

// Update server
export async function PATCH(
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
    const body = await request.json()

    // Check if user owns this server
    const existingServer = await prisma.server.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingServer || existingServer.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const server = await prisma.server.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        gameType: body.gameType,
        serverIp: body.serverIp,
        playerCount: body.playerCount ? parseInt(body.playerCount) : null,
        goal: body.goal ? parseFloat(body.goal) : null,
        imageUrl: body.imageUrl,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error("Error updating server:", error)
    return NextResponse.json(
      { error: "Failed to update server" },
      { status: 500 }
    )
  }
}

// Delete server
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

    // Check if user owns this server
    const existingServer = await prisma.server.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!existingServer || existingServer.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Soft delete by updating status
    await prisma.server.update({
      where: { id },
      data: { status: "archived" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting server:", error)
    return NextResponse.json(
      { error: "Failed to delete server" },
      { status: 500 }
    )
  }
}
