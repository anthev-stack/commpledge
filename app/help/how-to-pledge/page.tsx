import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Pledge - Support Gaming Servers | Community Pledges Guide",
  description: "Learn how to support your favorite gaming servers with monthly pledges. Understand smart optimization, payment methods, and how cost-sharing works.",
  keywords: "how to pledge, support gaming servers, monthly pledges, pledge tutorial, gaming community support, server donations, cost sharing",
}

export default function HowToPledgePage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/help" className="text-emerald-400 hover:text-emerald-300 text-sm">
            ← Back to Help Center
          </Link>
        </div>

        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-3">
                How to Pledge to a Server
              </h1>
              <p className="text-gray-300">
                Support your favorite gaming servers by sharing the monthly hosting costs with other community members.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Start</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Browse servers at <Link href="/servers" className="text-emerald-400 hover:text-emerald-300">/servers</Link></li>
            <li>Click on a server you want to support</li>
            <li>Click the &quot;Make a Pledge&quot; button</li>
            <li>Enter your monthly pledge amount</li>
            <li>Add a payment method if you haven&apos;t already</li>
            <li>Confirm your pledge</li>
          </ol>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-6">
          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Step 1: Find a Server</h2>
            <p className="text-gray-300 mb-4">
              Head to the <Link href="/servers" className="text-emerald-400 hover:text-emerald-300">Servers</Link> page and browse available gaming servers. 
              You can filter by game type, region, or search for specific servers.
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-400 mb-2">What to Look For:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Game type you enjoy (Minecraft, Rust, ARK, etc.)</li>
                <li>Server region close to you for better ping</li>
                <li>Server tags matching your playstyle</li>
                <li>Funding progress and active pledgers</li>
              </ul>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Step 2: Choose Your Pledge Amount</h2>
            <p className="text-gray-300 mb-4">
              Click &quot;Make a Pledge&quot; on the server page. You can pledge between $2 and $30 per month.
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-emerald-400 mb-2">💡 Pledge Amount Tips:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong className="text-white">$2-$5:</strong> Great for casual players or supporting multiple servers</li>
                <li><strong className="text-white">$5-$10:</strong> Standard pledge amount, helps significantly</li>
                <li><strong className="text-white">$10-$20:</strong> Generous support for your favorite server</li>
                <li><strong className="text-white">$20-$30:</strong> Maximum pledge, huge help to server owners</li>
              </ul>
            </div>
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold mb-2">✨ The Magic of Optimization</p>
              <p className="text-gray-300">
                When total pledges exceed the server cost, everyone pays LESS than they pledged! 
                The system automatically optimizes to reduce everyone&apos;s payment while respecting pledge limits.
              </p>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Step 3: Add Payment Method</h2>
            <p className="text-gray-300 mb-4">
              If this is your first pledge, you&apos;ll need to add a payment method (credit/debit card).
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-emerald-400 mb-2">Supported Cards:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Visa</li>
                <li>Mastercard</li>
                <li>American Express</li>
                <li>Discover</li>
                <li>Most international debit cards</li>
              </ul>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">🔒 Security:</h3>
              <p className="text-gray-300">
                All payment processing is handled by Stripe, a trusted payment processor used by millions of businesses worldwide. 
                We never see or store your full card details.
              </p>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Step 4: When You&apos;ll Be Charged</h2>
            <p className="text-gray-300 mb-4">
              Each server owner sets their preferred payment date. You&apos;ll be charged 2 days before that date.
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-emerald-400 mb-3">Example Timeline:</h3>
              <div className="space-y-2 text-gray-300">
                <p>• <strong className="text-white">Server withdrawal day:</strong> 15th of the month</p>
                <p>• <strong className="text-white">You get charged:</strong> 13th of the month</p>
                <p>• <strong className="text-white">Server owner receives payout:</strong> 15th of the month</p>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <p className="text-blue-400 font-semibold mb-2">📧 Email Receipts</p>
              <p className="text-gray-300">
                You&apos;ll receive an email receipt from Stripe every time you&apos;re charged, showing the exact amount paid.
              </p>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Managing Your Pledges</h2>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-2">View Active Pledges</h3>
                <p className="text-gray-300">
                  Go to your <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300">Dashboard</Link> to see all your active pledges and monthly totals.
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-2">Change Pledge Amount</h3>
                <p className="text-gray-300">
                  Visit the server page and click &quot;Change Pledge Amount&quot; to update your monthly contribution.
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-2">Cancel a Pledge</h3>
                <p className="text-gray-300 mb-2">
                  You can cancel anytime by clicking &quot;Remove Pledge&quot; on the server page or in your dashboard.
                </p>
                <p className="text-yellow-400 text-sm">
                  ⚠️ Cancellations take effect immediately. You won&apos;t be charged on the next billing cycle.
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-2">Update Payment Method</h3>
                <p className="text-gray-300">
                  Visit <Link href="/settings" className="text-emerald-400 hover:text-emerald-300">Settings</Link> to update or change your payment card.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">❓ Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Can I pledge to multiple servers?</h3>
                <p className="text-gray-300">
                  Yes! You can pledge to as many servers as you want. Your dashboard will show your total monthly commitment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">What if I can&apos;t afford my pledge anymore?</h3>
                <p className="text-gray-300">
                  You can cancel or reduce your pledge anytime. There&apos;s no commitment - we understand circumstances change!
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">What happens if my payment fails?</h3>
                <p className="text-gray-300">
                  We&apos;ll retry the payment once. If it fails again, your pledge will be automatically cancelled and you can re-pledge when ready.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">How does the optimization actually work?</h3>
                <p className="text-gray-300 mb-2">
                  When pledges exceed the server cost, the system calculates reduced payments for everyone while respecting individual pledge limits. 
                  Learn more in our <Link href="/help/optimization" className="text-emerald-400 hover:text-emerald-300">Optimization Guide</Link>.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Can I get a refund?</h3>
                <p className="text-gray-300">
                  Please review our <Link href="/refund" className="text-emerald-400 hover:text-emerald-300">Refund Policy</Link> for details on refund eligibility and process.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Need Help CTA */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6 text-center mt-8">
          <h2 className="text-xl font-bold text-white mb-3">Ready to Start Pledging?</h2>
          <p className="text-gray-300 mb-4">
            Browse servers and find communities to support!
          </p>
          <Link
            href="/servers"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse Servers
          </Link>
        </div>
      </div>
    </div>
  )
}

