import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
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

    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    // Create staff response
    const response = await prisma.ticketResponse.create({
      data: {
        content: content.trim(),
        ticketId: id,
        userId: session.user.id,
        isStaff: true, // Staff responses are marked as staff
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    // Update ticket's updatedAt timestamp
    await prisma.ticket.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error creating staff response:", error)
    return NextResponse.json(
      { error: "Failed to create response" },
      { status: 500 }
    )
  }
}
