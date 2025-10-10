import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET current theme
export async function GET() {
  try {
    const themeSetting = await prisma.siteSettings.findUnique({
      where: { key: "theme" }
    })

    return NextResponse.json({ 
      theme: themeSetting?.value || "dark" 
    })
  } catch (error) {
    console.error("Error fetching theme:", error)
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 }
    )
  }
}

// POST - Update theme (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access only" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { theme } = body

    // Validate theme
    const validThemes = ["dark", "default", "halloween", "christmas", "birthday", "newyear"]
    if (!validThemes.includes(theme)) {
      return NextResponse.json(
        { error: "Invalid theme" },
        { status: 400 }
      )
    }

    // Update or create theme setting
    const themeSetting = await prisma.siteSettings.upsert({
      where: { key: "theme" },
      update: {
        value: theme,
        updatedBy: session.user.id
      },
      create: {
        key: "theme",
        value: theme,
        updatedBy: session.user.id
      }
    })

    // Log the theme change
    await prisma.activityLog.create({
      data: {
        action: "theme_changed",
        userId: session.user.id,
        metadata: {
          oldTheme: themeSetting.value,
          newTheme: theme
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      theme: themeSetting.value 
    })
  } catch (error) {
    console.error("Error updating theme:", error)
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    )
  }
}

