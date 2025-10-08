"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export const dynamic = 'force-dynamic'

interface Server {
  id: string
  name: string
  description: string
  gameType: string
  serverIp: string
  playerCount: number
  goal: number
  imageUrl: string
  owner: {
    id: string
    name: string
    image: string
  }
  totalDonations: number
  donorCount: number
}

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    try {
      const response = await fetch("/api/servers")
      const data = await response.json()
      setServers(data)
    } catch (error) {
      console.error("Error fetching servers:", error)
    } finally {
      setLoading(false)
    }
  }

  const gameTypes = ["all", ...new Set(servers.map(s => s.gameType))]
  const filteredServers = filter === "all" 
    ? servers 
    : servers.filter(s => s.gameType === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading servers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Game Servers</h1>
          <p className="text-gray-600 mt-2">
            Support your favorite game servers with donations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {gameTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === type
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {type === "all" ? "All Games" : type}
            </button>
          ))}
        </div>

        {/* Server Grid */}
        {filteredServers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No servers found
            </h2>
            <p className="text-gray-600">
              Be the first to create a server listing!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServers.map((server) => (
              <Link
                key={server.id}
                href={`/servers/${server.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                {/* Server Image */}
                {server.imageUrl ? (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={server.imageUrl}
                      alt={server.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                )}

                <div className="p-4">
                  {/* Game Type Badge */}
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded mb-2">
                    {server.gameType}
                  </span>

                  {/* Server Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {server.name}
                  </h3>

                  {/* Description */}
                  {server.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {server.description}
                    </p>
                  )}

                  {/* Server Details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {server.playerCount && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {server.playerCount} players
                      </span>
                    )}
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {server.donorCount} donors
                    </span>
                  </div>

                  {/* Progress Bar (if goal set) */}
                  {server.goal && server.goal > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>${server.totalDonations.toFixed(2)} raised</span>
                        <span>${server.goal.toFixed(2)} goal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((server.totalDonations / server.goal) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Owner */}
                  <div className="flex items-center pt-3 border-t border-gray-200">
                    {server.owner.image ? (
                      <Image
                        src={server.owner.image}
                        alt={server.owner.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {server.owner.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <span className="ml-2 text-xs text-gray-600">
                      by {server.owner.name || "Anonymous"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
