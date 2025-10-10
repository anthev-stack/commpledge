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
    const type = searchParams.get('type') // 'server' or 'community'

    const favorites = await prisma.userFavorite.findMany({
      where: {
        userId: session.user.id,
        ...(type === 'server' && { serverId: { not: null } }),
        ...(type === 'community' && { communityId: { not: null } })
      },
      include: {
        server: {
          include: {
            owner: {
              select: { id: true, name: true, image: true }
            },
            _count: {
              select: { pledges: true }
            }
          }
        },
        community: {
          include: {
            owner: {
              select: { id: true, name: true, image: true }
            },
            _count: {
              select: { servers: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ favorites })

  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { serverId, communityId } = body

    if (!serverId && !communityId) {
      return NextResponse.json(
        { error: "Either serverId or communityId is required" },
        { status: 400 }
      )
    }

    if (serverId && communityId) {
      return NextResponse.json(
        { error: "Cannot favorite both server and community in one request" },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await prisma.userFavorite.findFirst({
      where: {
        userId: session.user.id,
        ...(serverId && { serverId }),
        ...(communityId && { communityId })
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Already favorited" },
        { status: 400 }
      )
    }

    // Verify the item exists
    if (serverId) {
      const server = await prisma.server.findUnique({
        where: { id: serverId }
      })
      if (!server) {
        return NextResponse.json(
          { error: "Server not found" },
          { status: 404 }
        )
      }
    }

    if (communityId) {
      const community = await prisma.community.findUnique({
        where: { id: communityId }
      })
      if (!community) {
        return NextResponse.json(
          { error: "Community not found" },
          { status: 404 }
        )
      }
    }

    // Create favorite
    const favorite = await prisma.userFavorite.create({
      data: {
        userId: session.user.id,
        ...(serverId && { serverId }),
        ...(communityId && { communityId })
      }
    })

    return NextResponse.json({ 
      success: true, 
      favorite: {
        id: favorite.id,
        serverId: favorite.serverId,
        communityId: favorite.communityId,
        createdAt: favorite.createdAt
      }
    })

  } catch (error) {
    console.error("Error creating favorite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    // Find and delete the favorite
    const favorite = await prisma.userFavorite.findFirst({
      where: {
        userId: session.user.id,
        ...(serverId && { serverId }),
        ...(communityId && { communityId })
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      )
    }

    await prisma.userFavorite.delete({
      where: { id: favorite.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Error deleting favorite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
