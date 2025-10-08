"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import DonateModal from "@/components/DonateModal"

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
    stripeAccountId: string
    stripeOnboardingComplete: boolean
  }
  donations: Array<{
    id: string
    amount: number
    message: string
    createdAt: string
    donor: {
      id: string
      name: string
      image: string
    } | null
  }>
  totalDonations: number
  donorCount: number
}

export default function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams()
  const [server, setServer] = useState<Server | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [serverId, setServerId] = useState("")

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setServerId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (serverId) {
      fetchServer()
    }
  }, [serverId])

  useEffect(() => {
    // Show success message if redirected from payment
    if (searchParams.get("donation") === "success") {
      // Could add a success toast/notification here
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [searchParams])

  const fetchServer = async () => {
    try {
      const response = await fetch(`/api/servers/${serverId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Server not found")
        return
      }

      setServer(data)
    } catch (err) {
      setError("Failed to load server")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading server...</p>
        </div>
      </div>
    )
  }

  if (error || !server) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Server Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/servers"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse Servers
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = server.goal && server.goal > 0
    ? Math.min((server.totalDonations / server.goal) * 100, 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-br from-indigo-500 to-purple-600">
        {server.imageUrl && (
          <Image
            src={server.imageUrl}
            alt={server.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/servers"
              className="inline-flex items-center text-white hover:text-gray-200 mb-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Servers
            </Link>
            <span className="inline-block px-3 py-1 bg-white bg-opacity-90 text-indigo-800 text-sm font-semibold rounded">
              {server.gameType}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
              {server.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Server</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {server.description || "No description provided."}
              </p>

              {server.serverIp && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Server Address:</p>
                  <code className="text-sm text-indigo-600 font-mono">{server.serverIp}</code>
                </div>
              )}
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Supporters</h2>
              {server.donations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No donations yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {server.donations.map((donation) => (
                    <div key={donation.id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                      {donation.donor?.image ? (
                        <Image
                          src={donation.donor.image}
                          alt={donation.donor.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {donation.donor?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            {donation.donor?.name || "Anonymous"}
                          </span>
                          <span className="text-indigo-600 font-semibold">
                            ${donation.amount.toFixed(2)}
                          </span>
                        </div>
                        {donation.message && (
                          <p className="text-sm text-gray-600 mt-1">{donation.message}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              {/* Stats */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${server.totalDonations.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">
                  raised from {server.donorCount} {server.donorCount === 1 ? "donor" : "donors"}
                </p>
              </div>

              {/* Progress Bar */}
              {server.goal && server.goal > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{progressPercentage.toFixed(0)}% of goal</span>
                    <span>${server.goal.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Donate Button */}
              {server.owner.stripeOnboardingComplete ? (
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Donate Now
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    Server owner hasn't set up donations yet
                  </p>
                </div>
              )}

              {server.playerCount && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Up to {server.playerCount} players
                  </div>
                </div>
              )}
            </div>

            {/* Server Owner Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Owner</h3>
              <div className="flex items-center">
                {server.owner.image ? (
                  <Image
                    src={server.owner.image}
                    alt={server.owner.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {server.owner.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{server.owner.name || "Anonymous"}</p>
                  <Link
                    href={`/users/${server.owner.id}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      <DonateModal
        server={server}
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
      />
    </div>
  )
}
