"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CATEGORIES = [
  {
    value: "bug_report",
    label: "Bug Report",
    description: "Report a bug or technical issue"
  },
  {
    value: "feature_request",
    label: "Feature Request",
    description: "Suggest a new feature or improvement"
  },
  {
    value: "support",
    label: "Support",
    description: "Get help with using the platform"
  },
  {
    value: "report_user_server",
    label: "Report User/Server",
    description: "Report inappropriate content or behavior"
  },
  {
    value: "other",
    label: "Other",
    description: "Something else not covered above"
  }
]

const PRIORITIES = [
  {
    value: "low",
    label: "Low",
    description: "Not urgent, can wait"
  },
  {
    value: "medium",
    label: "Medium",
    description: "Normal priority"
  },
  {
    value: "high",
    label: "High",
    description: "Important, needs attention soon"
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Critical issue, needs immediate attention"
  }
]

export default function CreateTicketPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: ""
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const ticket = await response.json()
        router.push(`/tickets/${ticket.id}`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create ticket")
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create ticket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Support Ticket</h1>
          <p className="text-gray-600">
            Need help? Report a bug? Have a suggestion? We&apos;re here to help!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief description of your issue or request"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label} - {category.description}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select priority</option>
              {PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label} - {priority.description}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={8}
              maxLength={1000}
              placeholder="Please provide as much detail as possible about your issue or request..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for getting help faster:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about what you&apos;re experiencing</li>
              <li>• Include steps to reproduce the issue (for bugs)</li>
              <li>• Mention your browser and device if relevant</li>
              <li>• Attach screenshots if helpful</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
