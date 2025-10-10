import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all communities with filters
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")
    const gameType = url.searchParams.get("gameType")
    const region = url.searchParams.get("region")
    const tag = url.searchParams.get("tag")

    // Build where clause
    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (gameType && gameType !== "all") {
      where.gameTypes = { has: gameType }
    }

    if (region && region !== "all") {
      where.region = region
    }

    if (tag && tag !== "all") {
      where.tags = { has: tag }
    }

    // Fetch communities
    const communities = await prisma.community.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            servers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(communities)
  } catch (error) {
    console.error("Error fetching communities:", error)
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    )
  }
}

// POST - Create a new community
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to create a community" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      about,
      imageUrl,
      bannerUrl,
      discordUrl,
      websiteUrl,
      twitterUrl,
      youtubeUrl,
      gameTypes,
      region,
      tags,
      memberCount,
    } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    // Create community
    const community = await prisma.community.create({
      data: {
        name,
        description,
        about,
        imageUrl,
        bannerUrl,
        discordUrl,
        websiteUrl,
        twitterUrl,
        youtubeUrl,
        gameTypes: gameTypes || [],
        region,
        tags: tags || [],
        memberCount: memberCount || 0,
        ownerId: session.user.id,
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

    return NextResponse.json(community)
  } catch (error) {
    console.error("Error creating community:", error)
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    )
  }
}

