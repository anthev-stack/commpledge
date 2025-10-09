"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Server {
  id: string
  name: string
  gameType: string
  cost: number
  withdrawalDay: number
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  _count: {
    pledges: number
  }
}

interface UserStats {
  totalPledged: number
  activePledges: number
  serversCreated: number
}

interface Activity {
  id: string
  action: string
  metadata: any
  createdAt: string
  user?: {
    id: string
    name: string
    image: string
  }
  server: {
    id: string
    name: string
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [servers, setServers] = useState<Server[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activityTab, setActivityTab] = useState<"user" | "server">("user")
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingActivity, setLoadingActivity] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchServers()
      fetchStats()
      fetchActivity("user")
    }
  }, [session])

  useEffect(() => {
    if (session?.user?.id) {
      fetchActivity(activityTab)
    }
  }, [activityTab, session])

  const fetchServers = async () => {
    try {
      const response = await fetch("/api/user/servers")
      if (response.ok) {
        const data = await response.json()
        setServers(data)
      }
    } catch (error) {
      console.error("Failed to fetch servers:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const fetchActivity = async (type: "user" | "server") => {
    setLoadingActivity(true)
    try {
      const response = await fetch(`/api/user/activity?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error)
    } finally {
      setLoadingActivity(false)
    }
  }

  const handleDelete = async (serverId: string, serverName: string) => {
    if (!confirm(`Are you sure you want to delete "${serverName}"? This action cannot be undone and will cancel all pledges.`)) {
      return
    }

    try {
      const response = await fetch(`/api/servers/${serverId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setServers(servers.filter(s => s.id !== serverId))
        alert("Server deleted successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete server")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete server")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "server_created":
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )
      case "pledge_created":
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "pledge_cancelled":
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "pledge_updated":
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const formatActivityMessage = (activity: Activity) => {
    const amount = activity.metadata?.amount
    const userName = activity.user?.name || "Someone"

    switch (activity.action) {
      case "server_created":
        return `You created server "${activity.server.name}"`
      case "pledge_created":
        return `You pledged $${amount}/month towards "${activity.server.name}"`
      case "pledge_updated":
        return `You updated your pledge to "${activity.server.name}" ($${amount}/month)`
      case "pledge_cancelled":
        return `You removed your pledge from "${activity.server.name}"`
      default:
        return activity.action
    }
  }

  const formatServerActivityMessage = (activity: Activity) => {
    const amount = activity.metadata?.amount
    const userName = activity.user?.name || "Someone"

    switch (activity.action) {
      case "pledge_created":
        return `${userName} pledged $${amount}/month towards "${activity.server.name}"`
      case "pledge_updated":
        return `${userName} updated their pledge to "${activity.server.name}" ($${amount}/month)`
      case "pledge_cancelled":
        return `${userName} removed their pledge from "${activity.server.name}"`
      default:
        return activity.action
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pledged</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats?.totalPledged.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Pledges</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.activePledges || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Servers Created</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.serversCreated || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {/* Create Server Card */}
          <Link href="/dashboard/server/create">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Server</h2>
              <p className="text-gray-600">Set up a new game server and start receiving pledges</p>
            </div>
          </Link>

          {/* Settings Card */}
          <Link href="/settings">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">Manage your profile and payment settings</p>
            </div>
          </Link>
        </div>

        {/* My Servers Section - Only show if user has servers */}
        {!loading && servers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Servers</h2>
          
          <div className="space-y-4">
              {servers.map((server) => (
                <div key={server.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {server.imageUrl ? (
                        <Image
                          src={server.imageUrl}
                          alt={server.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-2xl text-white font-bold">
                            {server.name[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{server.name}</h3>
                          {!server.isActive && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{server.gameType}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${server.cost}/month
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {server._count.pledges} pledgers
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Day {server.withdrawalDay}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/servers/${server.id}`}>
                        <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                          View
                        </button>
                      </Link>
                      <Link href={`/dashboard/server/${server.id}/edit`}>
                        <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(server.id, server.name)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        )}

        {/* Activity Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity</h2>
          
          <div className="bg-white rounded-lg shadow-md">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActivityTab("user")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                    activityTab === "user"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Your Activity
                </button>
                <button
                  onClick={() => setActivityTab("server")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                    activityTab === "server"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Server Activity
                </button>
              </div>
            </div>

            {/* Activity List */}
            <div className="p-6">
              {loadingActivity ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading activity...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-600">
                    {activityTab === "user"
                      ? "No activity yet. Start by creating a server or making a pledge!"
                      : "No activity on your servers yet. Share your servers to get pledges!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activityTab === "user"
                            ? formatActivityMessage(activity)
                            : formatServerActivityMessage(activity)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href={`/servers/${activity.server.id}`}
                        className="flex-shrink-0 text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        View →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
