"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

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
    name: string
  }
  responses: {
    id: string
    content: string
    isStaff: boolean
    createdAt: string
    user: {
      name: string
    }
  }[]
}

const CATEGORIES: Record<string, string> = {
  bug_report: "Bug Report",
  feature_request: "Feature Request",
  support: "Support",
  report_user_server: "Report User/Server",
  other: "Other"
}

const PRIORITIES: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent"
}

const STATUSES: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed"
}

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [newResponse, setNewResponse] = useState("")
  const [submittingResponse, setSubmittingResponse] = useState(false)
  const [ticketId, setTicketId] = useState<string>("")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    
    // Get ticket ID from params
    params.then(p => {
      setTicketId(p.id)
      fetchTicket(p.id)
    })
  }, [session, status, router, params])

  const fetchTicket = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tickets/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data)
      } else if (response.status === 404) {
        router.push("/tickets")
      }
    } catch (error) {
      console.error("Failed to fetch ticket:", error)
      router.push("/tickets")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newResponse.trim()) return

    setSubmittingResponse(true)
    try {
      const response = await fetch(`/api/tickets/${ticketId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newResponse.trim() }),
      })

      if (response.ok) {
        setNewResponse("")
        fetchTicket(ticketId) // Refresh ticket data
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit response")
      }
    } catch (error) {
      console.error("Error submitting response:", error)
      alert("Failed to submit response")
    } finally {
      setSubmittingResponse(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800"
      case "in_progress": return "bg-purple-100 text-purple-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h1>
          <Link href="/tickets" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Tickets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
            <Link
              href="/tickets"
              className="text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tickets
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(ticket.status)}`}>
              {STATUSES[ticket.status]}
            </span>
            <span className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(ticket.priority)}`}>
              {PRIORITIES[ticket.priority]} Priority
            </span>
            <span className="text-sm text-gray-600">
              {CATEGORIES[ticket.category]}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <div>
              <span>Created by {ticket.user.name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <div>
              Last updated: {new Date(ticket.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Responses ({ticket.responses.length})
          </h2>
          
          {ticket.responses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No responses yet.</p>
          ) : (
            <div className="space-y-4">
              {ticket.responses.map((response) => (
                <div
                  key={response.id}
                  className={`p-4 rounded-lg ${
                    response.isStaff 
                      ? "bg-blue-50 border-l-4 border-blue-400" 
                      : "bg-gray-50 border-l-4 border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {response.user.name}
                      </span>
                      {response.isStaff && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Staff
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(response.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{response.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Response */}
        {ticket.status !== "closed" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Response</h2>
            <form onSubmit={handleSubmitResponse}>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={4}
                placeholder="Type your response here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submittingResponse || !newResponse.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submittingResponse ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Response"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {ticket.status === "closed" && (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600">This ticket is closed and no longer accepting responses.</p>
          </div>
        )}
      </div>
    </div>
  )
}

