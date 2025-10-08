import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Gamedig from "gamedig"
import { getGameByName } from "@/lib/supported-games"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const server = await prisma.server.findUnique({
      where: { id },
      select: {
        serverIp: true,
        gameType: true,
      },
    })

    if (!server || !server.serverIp) {
      return NextResponse.json(
        { error: "Server not found or no IP set" },
        { status: 404 }
      )
    }

    // Parse IP and port
    const [host, portStr] = server.serverIp.split(":")
    const game = getGameByName(server.gameType)

    if (!game) {
      return NextResponse.json(
        { error: "Game type not supported for querying" },
        { status: 400 }
      )
    }

    const port = portStr ? parseInt(portStr) : game.defaultPort

    try {
      // Query the game server
      const state = await Gamedig.query({
        type: game.type,
        host: host,
        port: port,
      })

      // Format response based on game type
      const response: any = {
        online: true,
        name: state.name,
        map: state.map || null,
        players: {
          current: state.players.length,
          max: state.maxplayers,
        },
        ping: state.ping,
      }

      // Add game-specific data
      if (game.type.includes("minecraft")) {
        response.version = state.version || null
        response.description = state.description || null
      } else if (game.type.includes("cs") || game.type.includes("tf2") || game.type.includes("garrysmod")) {
        // Source engine games
        response.map = state.map
        response.password = state.password || false
      } else if (game.type === "rust") {
        response.version = state.version || null
        response.description = state.description || null
        response.url = state.connect || null
      } else if (game.type.includes("ark")) {
        response.serverTime = state.raw?.time || null
        response.dayNumber = state.raw?.day || null
      }

      // Update player count in database
      await prisma.server.update({
        where: { id },
        data: {
          playerCount: state.players.length,
        },
      })

      return NextResponse.json(response)
    } catch (queryError: any) {
      // Server is offline or unreachable
      console.log(`Server query failed for ${host}:${port}:`, queryError.message)
      
      return NextResponse.json({
        online: false,
        error: "Server is offline or unreachable",
      })
    }
  } catch (error) {
    console.error("Server query error:", error)
    return NextResponse.json(
      { error: "Failed to query server" },
      { status: 500 }
    )
  }
}
