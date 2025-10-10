"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: string
  _count: {
    pledges: number
    servers: number
  }
}

interface Server {
  id: string
  name: string
  gameType: string
  cost: number
  isActive: boolean
  status: string
  owner: {
    name: string
    email: string
  }
  _count: {
    pledges: number
  }
}

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  assignedUser?: {
    id: string
    name: string
  }
  _count: {
    responses: number
  }
}

export default function StaffDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<"users" | "servers" | "tickets">("users")
  const [users, setUsers] = useState<User[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ticketFilters, setTicketFilters] = useState({
    status: "all",
    category: "all",
    priority: "all"
  })

  useEffect(() => {
    if (session?.user) {
      // Check if user has staff role
      fetchUserRole()
    }
  }, [session])

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/user/me")
      if (response.ok) {
        const data = await response.json()
        console.log("User role data:", data)
        if (data.role !== "ADMIN" && data.role !== "MODERATOR") {
          console.log("User is not staff, redirecting to dashboard")
          router.push("/dashboard")
          return
        }
        console.log("User is staff, loading data")
        // User is staff, load data
        if (tab === "users") {
          fetchUsers()
        } else if (tab === "servers") {
          fetchServers()
        } else {
          fetchTickets()
        }
      } else {
        console.error("Failed to fetch user role, status:", response.status)
        const errorData = await response.text()
        console.error("Error response:", errorData)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to check role:", error)
      router.push("/dashboard")
    }
  }

  useEffect(() => {
    if (session?.user) {
      if (tab === "users") {
        fetchUsers()
      } else if (tab === "servers") {
        fetchServers()
      } else {
        fetchTickets()
      }
    }
  }, [tab, session, ticketFilters])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/staff/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/staff/servers")
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

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (ticketFilters.status !== "all") params.append("status", ticketFilters.status)
      if (ticketFilters.category !== "all") params.append("category", ticketFilters.category)
      if (ticketFilters.priority !== "all") params.append("priority", ticketFilters.priority)
      
      const response = await fetch(`/api/staff/tickets?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    const roleActions: Record<string, string> = {
      suspended: "suspend",
      banned: "ban",
      user: "restore to user",
      moderator: "promote to moderator",
      admin: "promote to admin",
    }

    if (!confirm(`Are you sure you want to ${roleActions[newRole]} "${userName}"?`)) {
      return
    }

    try {
      const response = await fetch("/api/staff/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        alert(`User role updated successfully!`)
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update role")
      }
    } catch (error) {
      console.error("Role update error:", error)
      alert("Failed to update role")
    }
  }

  const handleDeleteServer = async (serverId: string, serverName: string) => {
    if (!confirm(`Are you sure you want to delete "${serverName}"? This will cancel all pledges.`)) {
      return
    }

    try {
      const response = await fetch(`/api/staff/servers/${serverId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Server deleted successfully!")
        fetchServers()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete server")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete server")
    }
  }

  const handleTicketStatusChange = async (ticketId: string, newStatus: string, ticketTitle: string) => {
    try {
      const response = await fetch(`/api/staff/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        alert(`Ticket "${ticketTitle}" status updated to ${newStatus}!`)
        fetchTickets()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update ticket status")
      }
    } catch (error) {
      console.error("Status update error:", error)
      alert("Failed to update ticket status")
    }
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      bug_report: "Bug Report",
      feature_request: "Feature Request",
      support: "Support",
      report_user_server: "Report User/Server",
      other: "Other"
    }
    return categories[category] || category
  }

  const getPriorityLabel = (priority: string) => {
    const priorities: Record<string, string> = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent"
    }
    return priorities[priority] || priority
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      closed: "Closed"
    }
    return statuses[status] || status
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700"
      case "high": return "bg-orange-100 text-orange-700"
      case "medium": return "bg-yellow-100 text-yellow-700"
      case "low": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-700"
      case "in_progress": return "bg-purple-100 text-purple-700"
      case "resolved": return "bg-green-100 text-green-700"
      case "closed": return "bg-gray-100 text-gray-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.gameType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setTab("users")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  tab === "users"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setTab("servers")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  tab === "servers"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Server Management
              </button>
              <button
                onClick={() => setTab("tickets")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  tab === "tickets"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Ticket Management
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                tab === "users" ? "Search users by name or email..." :
                tab === "servers" ? "Search servers by name or game..." :
                "Search tickets by title or user..."
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Ticket Filters */}
          {tab === "tickets" && (
            <div className="px-6 pb-4 border-b border-gray-200">
              <div className="flex gap-4">
                <select
                  value={ticketFilters.status}
                  onChange={(e) => setTicketFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={ticketFilters.category}
                  onChange={(e) => setTicketFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="support">Support</option>
                  <option value="report_user_server">Report User/Server</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={ticketFilters.priority}
                  onChange={(e) => setTicketFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : tab === "users" ? (
              /* User Management */
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No users found</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User"}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{user.name || "Unnamed"}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                                user.role === "MODERATOR" ? "bg-blue-100 text-blue-700" :
                                user.role === "SUSPENDED" ? "bg-orange-100 text-orange-700" :
                                user.role === "BANNED" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{user._count.pledges} pledges</span>
                              <span>{user._count.servers} servers</span>
                              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.name || user.email || "User")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                            <option value="suspended">Suspended</option>
                            <option value="banned">Banned</option>
                          </select>
                          <Link
                            href={`/users/${user.id}`}
                            className="text-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : tab === "servers" ? (
              /* Server Management */
              <div className="space-y-4">
                {filteredServers.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No servers found</p>
                ) : (
                  filteredServers.map((server) => (
                    <div key={server.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{server.name}</h3>
                            {!server.isActive && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                Inactive
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {server.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{server.gameType}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Owner: {server.owner.name || server.owner.email}</span>
                            <span>${server.cost}/month</span>
                            <span>{server._count.pledges} pledgers</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link href={`/servers/${server.id}`}>
                            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                              View
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteServer(server.id, server.name)}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Ticket Management */
              <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No tickets found</p>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                              {getStatusLabel(ticket.status)}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {getPriorityLabel(ticket.priority)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {getCategoryLabel(ticket.category)}</span>
                            <span>From: {ticket.user.name || ticket.user.email}</span>
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span>{ticket._count.responses} responses</span>
                            {ticket.assignedUser && (
                              <span className="text-indigo-600">Assigned to: {ticket.assignedUser.name}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleTicketStatusChange(ticket.id, e.target.value, ticket.title)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                          <Link
                            href={`/staff/tickets/${ticket.id}`}
                            className="text-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            View & Respond
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

