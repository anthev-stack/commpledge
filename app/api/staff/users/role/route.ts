import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request) {
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

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role required" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ["user", "moderator", "admin", "suspended", "banned"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Prevent moderators from promoting to admin or modifying other admins/moderators
    if (staff.role === "MODERATOR") {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      })

      if (role === "ADMIN" || targetUser?.role === "ADMIN" || targetUser?.role === "MODERATOR") {
        return NextResponse.json(
          { error: "Moderators cannot modify admin or moderator accounts" },
          { status: 403 }
        )
      }
    }

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    // Log activity
    let action = "user_promoted"
    if (role === "suspended") action = "user_suspended"
    if (role === "banned") action = "user_banned"
    if (role === "user") action = "user_role_changed"

    await prisma.activityLog.create({
      data: {
        userId,
        action,
        metadata: {
          role,
          changedBy: session.user.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Role update error:", error)
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    )
  }
}

