import { NextResponse } from "next/server"
import { query as gamedigQuery } from "gamedig"

// Test endpoint to debug game server queries
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const host = searchParams.get("host") || "bmc.mc-complex.com"
  const port = parseInt(searchParams.get("port") || "25565")
  const type = searchParams.get("type") || "minecraft"

  try {
    console.log(`Testing query: ${host}:${port} (type: ${type})`)
    
    const state = await gamedigQuery({
      type: type,
      host: host,
      port: port,
      socketTimeout: 10000,
      maxRetries: 3,
    })

    return NextResponse.json({
      success: true,
      server: {
        name: state.name,
        map: state.map,
        players: state.players.length,
        maxplayers: state.maxplayers,
        ping: state.ping,
        version: state.version,
        raw: state.raw,
      },
    })
  } catch (error: any) {
    console.error(`Query failed:`, error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack,
      host,
      port,
      type,
    })
  }
}

