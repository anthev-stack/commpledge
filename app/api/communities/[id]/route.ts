import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET single community
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        servers: {
          where: { isActive: true },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                pledges: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(community)
  } catch (error) {
    console.error("Error fetching community:", error)
    return NextResponse.json(
      { error: "Failed to fetch community" },
      { status: 500 }
    )
  }
}

// PATCH - Update community
export async function PATCH(
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

    // Check ownership
    const community = await prisma.community.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    if (community.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own communities" },
        { status: 403 }
      )
    }

    // Update community
    const updated = await prisma.community.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        about: body.about,
        imageUrl: body.imageUrl,
        bannerUrl: body.bannerUrl,
        discordUrl: body.discordUrl,
        websiteUrl: body.websiteUrl,
        twitterUrl: body.twitterUrl,
        youtubeUrl: body.youtubeUrl,
        gameTypes: body.gameTypes,
        region: body.region,
        tags: body.tags,
        memberCount: body.memberCount ? parseInt(body.memberCount, 10) : 0,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating community:", error)
    return NextResponse.json(
      { error: "Failed to update community" },
      { status: 500 }
    )
  }
}

// DELETE community
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

    const { id } = await params

    // Check ownership
    const community = await prisma.community.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    if (community.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own communities" },
        { status: 403 }
      )
    }

    // Delete community (this will unlink servers but not delete them)
    await prisma.community.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting community:", error)
    return NextResponse.json(
      { error: "Failed to delete community" },
      { status: 500 }
    )
  }
}

