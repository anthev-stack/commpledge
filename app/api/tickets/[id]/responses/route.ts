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

    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Check if ticket exists and user can access it
    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    // Create response
    const response = await prisma.ticketResponse.create({
      data: {
        content: content.trim(),
        ticketId: id,
        userId: session.user.id,
        isStaff: false, // User responses are not staff responses
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
    console.error("Error creating response:", error)
    return NextResponse.json(
      { error: "Failed to create response" },
      { status: 500 }
    )
  }
}

