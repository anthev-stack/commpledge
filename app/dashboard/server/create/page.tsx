"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

const GAME_TYPES = [
  "Minecraft",
  "Rust",
  "ARK: Survival Evolved",
  "Valheim",
  "7 Days to Die",
  "Terraria",
  "Garry's Mod",
  "Counter-Strike",
  "Team Fortress 2",
  "Left 4 Dead 2",
  "Other",
]

export default function CreateServerPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [stripeStatus, setStripeStatus] = useState<any>(null)
  const [checkingStripe, setCheckingStripe] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gameType: "",
    serverIp: "",
    playerCount: "",
    goal: "",
    imageUrl: "",
  })

  useEffect(() => {
    checkStripeConnection()
  }, [])

  const checkStripeConnection = async () => {
    try {
      const response = await fetch("/api/stripe/connect")
      const data = await response.json()
      setStripeStatus(data)

      if (!data.onboardingComplete) {
        setError("You must connect your Stripe account before creating a server")
      }
    } catch (error) {
      setError("Failed to check Stripe status")
    } finally {
      setCheckingStripe(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripeStatus?.onboardingComplete) {
      setError("Please connect your Stripe account first")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create server")
        return
      }

      // Redirect to the new server page
      router.push(`/servers/${data.id}`)
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

  if (checkingStripe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking account status...</p>
        </div>
      </div>
    )
  }

  if (!stripeStatus?.onboardingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Stripe Account Required</h2>
              <p className="text-gray-600 mb-6">
                You need to connect your Stripe account before you can create a server and receive donations.
              </p>
              <div className="space-y-3">
                <Link
                  href="/settings"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Connect Stripe in Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create Game Server Listing</h1>
            <p className="text-sm text-gray-600 mt-1">
              Share your server with the community and start receiving donations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Server Name */}
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
                placeholder="e.g., Cameron's Awesome Minecraft Server"
              />
            </div>

            {/* Game Type */}
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
                <option value="">Select a game</option>
                {GAME_TYPES.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
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
                placeholder="Tell players about your server, mods, rules, community, etc."
              />
            </div>

            {/* Server IP */}
            <div>
              <label htmlFor="serverIp" className="block text-sm font-medium text-gray-700 mb-1">
                Server IP/Address
              </label>
              <input
                type="text"
                id="serverIp"
                name="serverIp"
                value={formData.serverIp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., play.myserver.com or 123.45.67.89:25565"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional - Let players know how to connect
              </p>
            </div>

            {/* Player Count */}
            <div>
              <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Players
              </label>
              <input
                type="number"
                id="playerCount"
                name="playerCount"
                min="1"
                value={formData.playerCount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 50"
              />
            </div>

            {/* Monthly Goal */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Goal (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="goal"
                  name="goal"
                  min="0"
                  step="0.01"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional - Set a monthly funding goal for server costs
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Server Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/server-banner.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional - Add a banner image for your server (use imgur or similar)
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Server"}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">About Donations</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Donations go directly to your connected Stripe account</li>
                <li>Platform takes 5% to cover costs (Stripe fee separate)</li>
                <li>You'll receive payouts automatically (daily/weekly)</li>
                <li>Donors can leave optional messages with their donation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
