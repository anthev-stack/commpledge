import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const communityId = searchParams.get('communityId')

    if (!serverId && !communityId) {
      return NextResponse.json(
        { error: "Either serverId or communityId is required" },
        { status: 400 }
      )
    }

    const favorite = await prisma.userFavorite.findFirst({
      where: {
        userId: session.user.id,
        ...(serverId && { serverId }),
        ...(communityId && { communityId })
      }
    })

    return NextResponse.json({ 
      isFavorited: !!favorite,
      favoriteId: favorite?.id || null
    })

  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
