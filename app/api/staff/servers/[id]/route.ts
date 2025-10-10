import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    // Check if user is staff
    const staff = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (staff?.role !== "ADMIN" && staff?.role !== "MODERATOR") {
      return NextResponse.json(
        { error: "Forbidden - Staff access only" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Get server info before deleting
    const server = await prisma.server.findUnique({
      where: { id },
      select: {
        name: true,
        ownerId: true,
        _count: {
          select: {
            pledges: true,
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

    // Log activity for owner
    await prisma.activityLog.create({
      data: {
        userId: server.ownerId,
        action: "server_deleted",
        metadata: {
          serverName: server.name,
          deletedBy: session.user.id,
          pledgesRemoved: server._count.pledges,
        },
      },
    })

    // Delete server
    await prisma.server.delete({
      where: { id },
    })

    return NextResponse.json({ 
      success: true,
      pledgesRemoved: server._count.pledges,
    })
  } catch (error) {
    console.error("Server deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete server" },
      { status: 500 }
    )
  }
}

