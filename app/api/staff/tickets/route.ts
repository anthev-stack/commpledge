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

    // Check if user is staff
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "admin" && user?.role !== "moderator") {
      return NextResponse.json(
        { error: "Forbidden - Staff access only" },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const category = url.searchParams.get("category")
    const priority = url.searchParams.get("priority")

    // Build where clause
    const where: any = {}
    if (status && status !== "all") where.status = status
    if (category && category !== "all") where.category = category
    if (priority && priority !== "all") where.priority = priority

    // Get all tickets with responses and user info
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
        responses: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // Open tickets first
        { priority: "desc" }, // Urgent first
        { createdAt: "desc" }, // Newest first
      ],
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    )
  }
}
