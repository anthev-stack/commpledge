"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { SUPPORTED_COUNTRIES } from "@/lib/countries"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState(session?.user?.name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  // Stripe Connect status
  const [stripeStatus, setStripeStatus] = useState<any>(null)
  const [stripeLoading, setStripeLoading] = useState(true)
  const [connectingStripe, setConnectingStripe] = useState(false)
  
  // Country selection
  const [country, setCountry] = useState("")
  const [userCountry, setUserCountry] = useState("")
  const [savingCountry, setSavingCountry] = useState(false)

  useEffect(() => {
    checkStripeStatus()
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me")
      const data = await response.json()
      if (data.country) {
        setUserCountry(data.country)
        setCountry(data.country)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const checkStripeStatus = async () => {
    try {
      const response = await fetch("/api/stripe/connect")
      const data = await response.json()
      setStripeStatus(data)
    } catch (error) {
      console.error("Error checking Stripe status:", error)
    } finally {
      setStripeLoading(false)
    }
  }

  const handleSaveCountry = async () => {
    if (!country) {
      setError("Please select a country")
      return
    }

    setSavingCountry(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/user/country", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to save country")
        return
      }

      setUserCountry(country)
      setMessage("Country saved! You can now connect Stripe.")
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setSavingCountry(false)
    }
  }

  const handleConnectStripe = async () => {
    if (!userCountry) {
      setError("Please select and save your country first")
      return
    }

    setConnectingStripe(true)
    setError("")

    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
      })
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Failed to connect Stripe")
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Failed to get onboarding URL")
      }
    } catch (error) {
      setError("Failed to connect Stripe")
    } finally {
      setConnectingStripe(false)
    }
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Something went wrong")
        return
      }

      setMessage("Profile updated successfully!")
      await update()
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account settings and profile information
            </p>
          </div>

          <div className="p-6">
            {/* Profile Picture Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
              <div className="flex items-center space-x-4">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name || "User"}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">
                    {session.user?.image 
                      ? "Your profile picture from your authentication provider"
                      : "No profile picture set"}
                  </p>
                  {!session.user?.image && (
                    <p className="text-xs text-gray-500 mt-1">
                      Sign in with Discord to set a profile picture
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              
              {message && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={session.user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Payout Method (Stripe Connect) */}
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payout Method
                <span className="ml-2 text-sm font-normal text-red-600">* Required to create servers</span>
              </h2>

              {stripeLoading ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span className="text-sm">Checking Stripe status...</span>
                </div>
              ) : stripeStatus?.onboardingComplete ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-green-800">Stripe Connected</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your payout method is set up and ready to receive donations!</p>
                        <p className="mt-2">
                          <strong>Status:</strong> Active<br />
                          <strong>Charges:</strong> {stripeStatus.chargesEnabled ? "Enabled" : "Disabled"}<br />
                          <strong>Payouts:</strong> {stripeStatus.payoutsEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-yellow-800">Payout Method Required</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p className="mb-3">
                          You need to connect a payout method before you can create a server and receive donations.
                        </p>
                        <p className="mb-3">
                          <strong>What you&apos;ll need:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 mb-4">
                          <li>Bank account information</li>
                          <li>Personal identification (for verification)</li>
                          <li>Tax information (for compliance)</li>
                        </ul>
                        <p className="text-xs">
                          <strong>Note:</strong> You don&apos;t need a business account! Stripe Connect Express allows you to receive donations as an individual.
                        </p>
                      </div>
                      <button
                        onClick={handleConnectStripe}
                        disabled={connectingStripe}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {connectingStripe ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                            </svg>
                            Connect Stripe Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                <p>
                  <strong>Powered by Stripe Connect.</strong> Stripe is a secure payment platform trusted by millions. Your financial information is safe and protected.
                </p>
              </div>
            </div>

            {/* Account Details */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                  <dd className="text-sm text-gray-900 mt-1">{session.user?.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Authentication Method</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {session.user?.image ? "Discord OAuth" : "Email & Password"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

