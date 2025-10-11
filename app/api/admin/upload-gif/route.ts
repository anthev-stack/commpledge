import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file || !type) {
      return NextResponse.json({ error: "File and type are required" }, { status: 400 })
    }

    // Validate type
    if (!['bat', 'snowflake'].includes(type)) {
      return NextResponse.json({ error: "Invalid type. Must be 'bat' or 'snowflake'" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/gif')) {
      return NextResponse.json({ error: "File must be a GIF" }, { status: 400 })
    }

    // Validate file size (max 100KB)
    if (file.size > 100000) {
      return NextResponse.json({ error: "File size must be under 100KB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine file path
    const fileName = type === 'bat' ? 'bat.gif' : 'snowflake.gif'
    const filePath = join(process.cwd(), 'public', 'images', fileName)

    // Write file to public/images directory
    await writeFile(filePath, buffer)

    return NextResponse.json({ 
      success: true, 
      message: `${type} GIF uploaded successfully`,
      fileName 
    })

  } catch (error) {
    console.error("Error uploading GIF:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
