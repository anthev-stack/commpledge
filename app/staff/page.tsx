"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

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
  const [tab, setTab] = useState<"users" | "servers" | "tickets" | "web">("users")
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
  const [currentTheme, setCurrentTheme] = useState("default")
  const [savingTheme, setSavingTheme] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

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
        setUserRole(data.role) // Set the user role to state
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
      } else if (tab === "tickets") {
        fetchTickets()
      } else if (tab === "web") {
        fetchCurrentTheme()
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

  const fetchCurrentTheme = async () => {
    try {
      const response = await fetch("/api/settings/theme")
      if (response.ok) {
        const data = await response.json()
        setCurrentTheme(data.theme)
      }
    } catch (error) {
      console.error("Failed to fetch theme:", error)
    }
  }

  const handleThemeChange = async (newTheme: string) => {
    if (!confirm(`Change site theme to ${newTheme}? This will affect all users.`)) {
      return
    }

    setSavingTheme(true)
    try {
      const response = await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme })
      })

      if (response.ok) {
        setCurrentTheme(newTheme)
        alert("Theme updated successfully! Users will see the new theme on their next page load.")
        // Reload to apply theme
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update theme")
      }
    } catch (error) {
      console.error("Failed to update theme:", error)
      alert("Failed to update theme")
    } finally {
      setSavingTheme(false)
    }
  }

  const handleGifUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'bat' | 'snowflake') => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/gif')) {
      alert('Please upload a GIF file')
      return
    }

    // Validate file size (max 100KB)
    if (file.size > 100000) {
      alert('File size must be under 100KB for optimal performance')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/admin/upload-gif', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        alert(`${type === 'bat' ? 'Bat' : 'Snowflake'} GIF uploaded successfully!`)
        // Reload to show new GIF
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to upload GIF')
      }
    } catch (error) {
      console.error('Failed to upload GIF:', error)
      alert('Failed to upload GIF')
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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen py-8">
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
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg mb-6">
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
              {userRole === "ADMIN" && (
                <button
                  onClick={() => setTab("web")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                    tab === "web"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Web Management
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {tab !== "web" && (
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
          )}

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
            ) : tab === "tickets" ? (
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
            ) : tab === "web" ? (
              /* Web Management */
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Theme Management</h2>
                  <p className="text-gray-600">Change the global theme for all users. This will affect the entire website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dark Theme */}
                  <div
                    onClick={() => handleThemeChange("dark")}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme === "dark"
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {currentTheme === "dark" && (
                      <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-4xl mb-3">🌙</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Dark</h3>
                    <p className="text-sm text-gray-600 mb-4">Dark theme with green accents</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500"></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-600"></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>

                  {/* Default Theme */}
                  <div
                    onClick={() => handleThemeChange("default")}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme === "default"
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {currentTheme === "default" && (
                      <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-4xl mb-3">🎨</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Default</h3>
                    <p className="text-sm text-gray-600 mb-4">Clean and professional design</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-600"></div>
                      <div className="w-8 h-8 rounded-full bg-cyan-500"></div>
                    </div>
                  </div>

                  {/* Halloween Theme */}
                  <div
                    onClick={() => handleThemeChange("halloween")}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme === "halloween"
                        ? "border-orange-600 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    {currentTheme === "halloween" && (
                      <div className="absolute top-3 right-3 bg-orange-600 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-4xl mb-3">🎃</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Halloween</h3>
                    <p className="text-sm text-gray-600 mb-4">Spooky and festive orange and black theme</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-orange-600"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                    </div>
                  </div>

                  {/* Christmas Theme */}
                  <div
                    onClick={() => handleThemeChange("christmas")}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme === "christmas"
                        ? "border-red-600 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    {currentTheme === "christmas" && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-4xl mb-3">🎄</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Christmas</h3>
                    <p className="text-sm text-gray-600 mb-4">Festive red and green holiday theme</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-red-600"></div>
                      <div className="w-8 h-8 rounded-full bg-green-600"></div>
                      <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
                    </div>
                  </div>

                  {/* Birthday Theme */}
                  <div
                    onClick={() => handleThemeChange("birthday")}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme === "birthday"
                        ? "border-pink-500 ring-2 ring-pink-200"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    {currentTheme === "birthday" && (
                      <div className="absolute top-3 right-3 bg-pink-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-4xl mb-3">🎂</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Birthday</h3>
                    <p className="text-sm text-gray-600 mb-4">Colorful and celebratory theme</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-pink-500"></div>
                      <div className="w-8 h-8 rounded-full bg-violet-500"></div>
                      <div className="w-8 h-8 rounded-full bg-amber-500"></div>
                    </div>
                  </div>

                  {/* New Year Theme */}
                  <div
                    onClick={() => handleThemeChange("newyear")}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme === "newyear"
                        ? "border-blue-800 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {currentTheme === "newyear" && (
                      <div className="absolute top-3 right-3 bg-blue-800 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="text-4xl mb-3">🎆</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">New Year</h3>
                    <p className="text-sm text-gray-600 mb-4">Elegant gold and blue celebration theme</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-800"></div>
                      <div className="w-8 h-8 rounded-full bg-cyan-600"></div>
                      <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
                    </div>
                  </div>
                </div>

                {savingTheme && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-indigo-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <span>Updating theme...</span>
                    </div>
                  </div>
                )}

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Theme Change Notice</h4>
                      <p className="text-sm text-blue-800">
                        Changing the theme will affect all users immediately. Users will see the new theme on their next page load or refresh.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Theme Animation GIF Uploader */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme Animation GIFs</h2>
                  <p className="text-gray-600 mb-6">Upload custom animated GIFs for Halloween and Christmas themes. These will appear as flying animations across the screen.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Halloween Bat GIF */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🎃</span>
                        <h3 className="text-lg font-semibold text-white">Halloween Bat Animation</h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Upload a small animated GIF of a flying bat (recommended: 25x25px, transparent background)
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <Image src="/images/bat.gif" alt="Current bat" width={32} height={32} className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">Current: bat.gif</p>
                            <p className="text-xs text-gray-400">15 bats flying at 2x speed</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            accept=".gif"
                            className="hidden"
                            id="bat-upload"
                            onChange={(e) => handleGifUpload(e, 'bat')}
                          />
                          <label
                            htmlFor="bat-upload"
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg cursor-pointer text-center text-sm font-medium transition"
                          >
                            Upload New Bat GIF
                          </label>
                          <button
                            onClick={() => window.open('/images/bat.gif', '_blank')}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition"
                          >
                            View Current
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Christmas Snowflake GIF */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">❄️</span>
                        <h3 className="text-lg font-semibold text-white">Christmas Snowflake Animation</h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Upload a small animated GIF of a falling snowflake (recommended: 20x20px, transparent background)
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Image src="/images/snowflake.gif" alt="Current snowflake" width={32} height={32} className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">Current: snowflake.gif</p>
                            <p className="text-xs text-gray-400">25 snowflakes falling at 1.5x speed</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            accept=".gif"
                            className="hidden"
                            id="snowflake-upload"
                            onChange={(e) => handleGifUpload(e, 'snowflake')}
                          />
                          <label
                            htmlFor="snowflake-upload"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer text-center text-sm font-medium transition"
                          >
                            Upload New Snowflake GIF
                          </label>
                          <button
                            onClick={() => window.open('/images/snowflake.gif', '_blank')}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition"
                          >
                            View Current
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-900 mb-1">GIF Upload Guidelines</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Keep GIFs small (under 50KB) for better performance</li>
                          <li>• Use transparent backgrounds for best visual effect</li>
                          <li>• Recommended sizes: 20-30px for optimal performance</li>
                          <li>• Test the animation on different screen sizes</li>
                          <li>• Consider creating new GIFs each year for variety</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

