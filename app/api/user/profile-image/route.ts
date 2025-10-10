import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only WebP, PNG, JPG, and GIF files are allowed" },
        { status: 400 }
      )
    }

    // Check if user is staff for GIF support
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    const isStaff = user?.role === "ADMIN" || user?.role === "MODERATOR"
    
    if (file.type === 'image/gif' && !isStaff) {
      return NextResponse.json(
        { error: "Only partners, moderators, and admins can upload GIF profile pictures" },
        { status: 403 }
      )
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      )
    }

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const imageUrl = `data:${file.type};base64,${base64}`

    // Update user's profile image
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    })

    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl
    })

  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
