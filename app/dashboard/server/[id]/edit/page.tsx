"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { SUPPORTED_GAMES } from "@/lib/supported-games"
import { REGIONS, getTagsForGame } from "@/lib/game-tags"

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
    serverPort: "",
    cost: "",
    withdrawalDay: "",
    imageUrl: "",
    region: "",
    tags: [] as string[],
    communityId: "",
    discordWebhook: "",
    isPrivate: false,
  })
  const [communities, setCommunities] = useState<any[]>([])

  useEffect(() => {
    params.then(p => {
      setServerId(p.id)
      fetchServer(p.id)
    })
    fetchCommunities()
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
        
        // Split serverIp into IP and port
        const [ip, port] = (data.serverIp || "").split(":")
        
        setFormData({
          name: data.name || "",
          description: data.description || "",
          gameType: data.gameType || "",
          serverIp: ip || "",
          serverPort: port || "",
          cost: data.cost?.toString() || "",
          withdrawalDay: data.withdrawalDay?.toString() || "",
          imageUrl: data.imageUrl || "",
          region: data.region || "",
          tags: data.tags || [],
          communityId: data.communityId || "",
          discordWebhook: data.discordWebhook || "",
          isPrivate: data.isPrivate || false,
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

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/user/communities")
      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
      }
    } catch (error) {
      console.error("Failed to fetch communities:", error)
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
      // Combine IP and port for server IP field
      const combinedServerIp = formData.serverIp && formData.serverPort
        ? `${formData.serverIp}:${formData.serverPort}`
        : formData.serverIp || ""

      const response = await fetch(`/api/servers/${serverId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          serverIp: combinedServerIp,
        }),
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
    const { name, value } = e.target
    
    // If changing game type, reset tags
    if (name === "gameType") {
      setFormData({
        ...formData,
        [name]: value,
        tags: [],
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const availableTags = formData.gameType ? getTagsForGame(formData.gameType) : []

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

            {/* Region */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Server Region
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select region...</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Community Link */}
            {communities.length > 0 && (
              <div>
                <label htmlFor="communityId" className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Community (Optional)
                </label>
                <select
                  id="communityId"
                  name="communityId"
                  value={formData.communityId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">No community</option>
                  {communities.map((community: any) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Link this server to your community profile to help promote it
                </p>
              </div>
            )}

            {/* Server IP and Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Server Address (for live stats)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    id="serverIp"
                    name="serverIp"
                    value={formData.serverIp}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., play.myserver.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Server IP or hostname</p>
                </div>
                <div>
                  <input
                    type="number"
                    id="serverPort"
                    name="serverPort"
                    value={formData.serverPort}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="25565"
                  />
                  <p className="text-xs text-gray-500 mt-1">Port</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {formData.gameType && availableTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Server Tags <span className="text-gray-500">(Select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        formData.tags.includes(tag)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.tags.length > 0 ? formData.tags.join(", ") : "None"}
                </p>
              </div>
            )}

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

            {/* Private/Public Server */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Server Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPrivate"
                    value="false"
                    checked={!formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.value === "true" })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">Public Server</div>
                    <div className="text-xs text-gray-500">
                      Visible in server browser, can be boosted, discoverable by everyone
                    </div>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPrivate"
                    value="true"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.value === "true" })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">Private Server</div>
                    <div className="text-xs text-gray-500">
                      Hidden from server browser, no boost option, share with friends via direct link
                    </div>
                  </div>
                </label>
              </div>
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
