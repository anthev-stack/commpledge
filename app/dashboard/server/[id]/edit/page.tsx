"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { SUPPORTED_GAMES } from "@/lib/supported-games"

export default function EditServerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [serverId, setServerId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [initialData, setInitialData] = useState<any>(null)
  const [pledgeCount, setPledgeCount] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gameType: "",
    serverIp: "",
    playerCount: "",
    cost: "",
    withdrawalDay: "",
    imageUrl: "",
  })

  useEffect(() => {
    params.then(p => {
      setServerId(p.id)
      fetchServer(p.id)
    })
  }, [])

  const fetchServer = async (id: string) => {
    try {
      const response = await fetch(`/api/servers/${id}`)
      if (response.ok) {
        const data = await response.json()
        setInitialData({
          cost: data.cost,
          withdrawalDay: data.withdrawalDay,
        })
        setPledgeCount(data.pledgerCount || 0)
        setFormData({
          name: data.name || "",
          description: data.description || "",
          gameType: data.gameType || "",
          serverIp: data.serverIp || "",
          playerCount: data.playerCount?.toString() || "",
          cost: data.cost?.toString() || "",
          withdrawalDay: data.withdrawalDay?.toString() || "",
          imageUrl: data.imageUrl || "",
        })
      } else {
        setError("Server not found")
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    } catch (error) {
      console.error("Failed to fetch server:", error)
      setError("Failed to load server")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Check if cost or withdrawalDay changed
    const costChanged = initialData && parseFloat(formData.cost) !== initialData.cost
    const withdrawalDayChanged = initialData && parseInt(formData.withdrawalDay) !== initialData.withdrawalDay

    if ((costChanged || withdrawalDayChanged) && pledgeCount > 0) {
      const confirmMessage = `⚠️ WARNING: You are changing the ${costChanged ? 'monthly cost' : ''}${costChanged && withdrawalDayChanged ? ' and ' : ''}${withdrawalDayChanged ? 'withdrawal day' : ''}.\n\nThis will REMOVE ALL ${pledgeCount} CURRENT PLEDGES.\n\nPledgers will need to re-pledge with the new details.\n\nAre you absolutely sure you want to continue?`
      
      if (!confirm(confirmMessage)) {
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/servers/${serverId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Server updated successfully!")
        if (data.pledgesRemoved > 0) {
          alert(`Server updated! ${data.pledgesRemoved} pledges were removed. Notify your community to re-pledge!`)
        }
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        setError(data.error || "Failed to update server")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!session) {
    router.push("/login")
    return null
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading server...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Server</h1>

          {pledgeCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">⚠️ Warning</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    This server has <strong>{pledgeCount} active pledgers</strong>. Changing the monthly cost or withdrawal day will remove all pledges!
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Rest of the form fields - same as create */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Server Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="gameType" className="block text-sm font-medium text-gray-700 mb-1">
                Game Type <span className="text-red-600">*</span>
              </label>
              <select
                id="gameType"
                name="gameType"
                required
                value={formData.gameType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a game...</option>
                <optgroup label="FPS Games">
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                  <option value="Counter-Strike: Global Offensive">CS:GO</option>
                  <option value="Team Fortress 2">Team Fortress 2</option>
                </optgroup>
                <optgroup label="Survival/Sandbox">
                  <option value="Minecraft: Java Edition">Minecraft: Java Edition</option>
                  <option value="Rust">Rust</option>
                  <option value="ARK: Survival Evolved">ARK: Survival Evolved</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="serverIp" className="block text-sm font-medium text-gray-700 mb-1">
                Server IP Address
              </label>
              <input
                type="text"
                id="serverIp"
                name="serverIp"
                value={formData.serverIp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="play.example.com:25565"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Cost (USD) <span className="text-red-600">*</span>
                </label>
                {pledgeCount > 0 && (
                  <span className="text-xs text-yellow-600">⚠️ Changing this will remove all pledges</span>
                )}
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  required
                  min="1"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="relative">
                <label htmlFor="withdrawalDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Withdrawal Day <span className="text-red-600">*</span>
                </label>
                {pledgeCount > 0 && (
                  <span className="text-xs text-yellow-600">⚠️ Changing this will remove all pledges</span>
                )}
                <select
                  id="withdrawalDay"
                  name="withdrawalDay"
                  required
                  value={formData.withdrawalDay}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>Day {day}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
