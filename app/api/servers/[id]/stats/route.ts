import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
const minecraftUtil = require("minecraft-server-util")
const net = require("net")

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const server = await prisma.server.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        gameType: true,
        serverIp: true,
      },
    })

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      )
    }

    if (!server.serverIp) {
      return NextResponse.json({
        serverId: server.id,
        serverName: server.name,
        gameType: server.gameType,
        stats: {
          online: false,
          error: "Server address not configured",
        },
      })
    }

    // Parse IP and port
    const [ip, portStr] = server.serverIp.split(":")
    
    if (!portStr) {
      return NextResponse.json({
        serverId: server.id,
        serverName: server.name,
        gameType: server.gameType,
        stats: {
          online: false,
          error: "Server port not configured",
        },
      })
    }

    const port = parseInt(portStr)

    // Handle Minecraft servers
    if (server.gameType.toLowerCase().includes("minecraft")) {
      try {
        const response = await minecraftUtil.status(ip, port, {
          timeout: 5000,
          enableSRV: true,
        })

        // Update player count in database
        await prisma.server.update({
          where: { id },
          data: { playerCount: response.players.online },
        })

        return NextResponse.json({
          serverId: server.id,
          serverName: server.name,
          gameType: server.gameType,
          stats: {
            online: true,
            players: {
              online: response.players.online,
              max: response.players.max,
            },
            version: response.version?.name || null,
            motd: response.motd?.clean || response.motd?.raw || null,
            serverType: "Minecraft",
          },
        })
      } catch (error: any) {
        console.error(`Minecraft query failed for ${ip}:${port}:`, error.message)
        return NextResponse.json({
          serverId: server.id,
          serverName: server.name,
          gameType: server.gameType,
          stats: {
            online: false,
            error: "Server offline or unreachable",
          },
        })
      }
    }

    // For other games, do a simple TCP connection test
    try {
      const isOnline = await testTCPConnection(ip, port)
      
      if (isOnline) {
        return NextResponse.json({
          serverId: server.id,
          serverName: server.name,
          gameType: server.gameType,
          stats: {
            online: true,
            serverType: server.gameType,
          },
        })
      } else {
        return NextResponse.json({
          serverId: server.id,
          serverName: server.name,
          gameType: server.gameType,
          stats: {
            online: false,
            error: "Server offline",
          },
        })
      }
    } catch (error) {
      return NextResponse.json({
        serverId: server.id,
        serverName: server.name,
        gameType: server.gameType,
        stats: {
          online: false,
          error: "Connection test failed",
        },
      })
    }
  } catch (error) {
    console.error("Server stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch server stats" },
      { status: 500 }
    )
  }
}

// Test TCP connection to a server
function testTCPConnection(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    
    socket.setTimeout(5000)
    
    socket.on("connect", () => {
      socket.destroy()
      resolve(true)
    })
    
    socket.on("timeout", () => {
      socket.destroy()
      resolve(false)
    })
    
    socket.on("error", () => {
      resolve(false)
    })
    
    socket.connect(port, host)
  })
}

