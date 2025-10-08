"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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
}

function CheckoutForm({ serverId, serverName, onSuccess }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/servers/${serverId}?donation=success`,
        },
      })

      if (submitError) {
        setError(submitError.message || "Payment failed")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Complete Donation"}
      </button>
    </form>
  )
}

export default function DonateModal({ server, isOpen, onClose }: DonateModalProps) {
  const { data: session } = useSession()
  const [amount, setAmount] = useState("5")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"amount" | "payment">("amount")

  useEffect(() => {
    if (!isOpen) {
      // Reset when closed
      setStep("amount")
      setAmount("5")
      setMessage("")
      setIsAnonymous(false)
      setClientSecret("")
      setError("")
    }
  }, [isOpen])

  const handleCreatePayment = async () => {
    const amountFloat = parseFloat(amount)
    
    if (isNaN(amountFloat) || amountFloat < 1) {
      setError("Minimum donation is $1.00")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/stripe/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId: server.id,
          amount: amountFloat,
          message,
          isAnonymous,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create payment")
        return
      }

      setClientSecret(data.clientSecret)
      setStep("payment")
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
          <h2 className="text-xl font-bold text-gray-900">
            {step === "amount" ? "Make a Donation" : "Complete Payment"}
          </h2>
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
          {step === "amount" ? (
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

              {/* Continue Button */}
              <button
                onClick={handleCreatePayment}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Continue to Payment"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Powered by Stripe • Secure payment processing
              </p>
            </div>
          ) : (
            <div>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                    },
                  }}
                >
                  <CheckoutForm
                    serverId={server.id}
                    serverName={server.name}
                    onSuccess={onClose}
                  />
                </Elements>
              )}

              <button
                onClick={() => setStep("amount")}
                className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back to donation details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
