"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface DonateModalProps {
  server: {
    id: string
    name: string
    owner: {
      name: string
    }
  }
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function DonateModal({ server, isOpen, onClose, onSuccess }: DonateModalProps) {
  const { data: session } = useSession()
  const [amount, setAmount] = useState("5")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods()
    } else {
      // Reset when closed
      setAmount("5")
      setMessage("")
      setIsAnonymous(false)
      setError("")
      setSelectedPaymentMethod("")
    }
  }, [isOpen])

  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true)
    try {
      const response = await fetch("/api/stripe/payment-methods")
      const data = await response.json()
      setPaymentMethods(data.paymentMethods || [])
      if (data.paymentMethods && data.paymentMethods.length > 0) {
        setSelectedPaymentMethod(data.paymentMethods[0].id)
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    } finally {
      setLoadingPaymentMethods(false)
    }
  }

  const handleDonate = async () => {
    const amountFloat = parseFloat(amount)
    
    if (isNaN(amountFloat) || amountFloat < 1) {
      setError("Minimum donation is $1.00")
      return
    }

    if (!selectedPaymentMethod) {
      setError("Please select a payment method")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/stripe/donate-with-saved-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId: server.id,
          amount: amountFloat,
          message,
          isAnonymous,
          paymentMethodId: selectedPaymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to process donation")
        return
      }

      // Success!
      setMessage("Donation successful! Thank you for your support!")
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Make a Donation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loadingPaymentMethods ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Payment Method Found
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  You need to add a payment method before you can make a donation. This makes future donations quick and easy!
                </p>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Add Payment Method in Settings
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Server Info */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-800">
                  <strong>Supporting:</strong> {server.name}
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  by {server.owner.name}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum: $1.00</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Leave a message for the server owner..."
                />
              </div>

              {/* Anonymous */}
              {session && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Donate anonymously (your name won&apos;t be shown)
                  </label>
                </div>
              )}

              {!session && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    You&apos;re donating as a guest. Your donation will be anonymous.
                  </p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} •••• {pm.last4} (Exp: {pm.expMonth}/{pm.expYear})
                    </option>
                  ))}
                </select>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 inline-block"
                >
                  Manage payment methods →
                </Link>
              </div>

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Donate $${amount}`}
              </button>

              <p className="text-xs text-gray-500 text-center">
                💳 Secure payment via Stripe • Your card is never charged without confirmation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
