import Link from "next/link"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Discord Webhook Setup Guide - Community Pledges",
  description: "Learn how to create and configure Discord webhooks to receive pledge notifications directly in your Discord server. Step-by-step tutorial with screenshots.",
  keywords: "discord webhooks, discord integration, pledge notifications, discord bot setup, gaming server discord, webhook tutorial",
}

export default function DiscordWebhooksPage() {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Discord Webhook Setup Guide
              </h1>
              <p className="text-gray-300">
                Get real-time pledge notifications sent directly to your Discord server with rich embeds showing pledge amounts, goals, and progress.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Table of Contents</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#what-is" className="hover:text-emerald-400 transition">1. What is a Discord Webhook?</a></li>
            <li><a href="#create-webhook" className="hover:text-emerald-400 transition">2. Creating a Webhook in Discord</a></li>
            <li><a href="#add-to-server" className="hover:text-emerald-400 transition">3. Adding Webhook to Your Server</a></li>
            <li><a href="#what-notifications" className="hover:text-emerald-400 transition">4. What Notifications You&apos;ll Receive</a></li>
            <li><a href="#troubleshooting" className="hover:text-emerald-400 transition">5. Troubleshooting</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section id="what-is" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. What is a Discord Webhook?</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                A Discord webhook is a special URL that allows external applications (like Community Pledges) to send messages directly to a specific channel in your Discord server.
              </p>
              <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">✨ Benefits:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Real-time notifications when someone pledges to your server</li>
                  <li>Beautiful rich embeds with pledge details</li>
                  <li>See pledge amounts, goals, and current progress</li>
                  <li>Keep your community informed and excited</li>
                  <li>No bot required - works instantly</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="create-webhook" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. Creating a Webhook in Discord</h2>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Step 1: Open Server Settings</h3>
                <p className="text-gray-300 mb-2">
                  Right-click on your Discord server name in the left sidebar and select <strong className="text-white">&quot;Server Settings&quot;</strong>
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Step 2: Navigate to Integrations</h3>
                <p className="text-gray-300 mb-2">
                  In the left sidebar of Server Settings, click on <strong className="text-white">&quot;Integrations&quot;</strong>
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Step 3: Create New Webhook</h3>
                <p className="text-gray-300 mb-2">
                  Click the <strong className="text-white">&quot;Create Webhook&quot;</strong> or <strong className="text-white">&quot;New Webhook&quot;</strong> button
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Step 4: Configure Webhook</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong className="text-white">Name:</strong> Choose a name like &quot;Community Pledges&quot; or &quot;Pledge Notifications&quot;</li>
                  <li><strong className="text-white">Channel:</strong> Select the channel where you want notifications (e.g., #announcements, #pledges)</li>
                  <li><strong className="text-white">Avatar:</strong> Optional - you can upload a custom icon</li>
                </ul>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Step 5: Copy Webhook URL</h3>
                <p className="text-gray-300 mb-3">
                  Click the <strong className="text-white">&quot;Copy Webhook URL&quot;</strong> button
                </p>
                <div className="bg-slate-900/50 border border-slate-600 rounded p-3 font-mono text-sm text-gray-400 break-all">
                  https://discord.com/api/webhooks/1234567890/AbCdEfGhIjKlMnOpQrStUvWxYz
                </div>
                <p className="text-yellow-400 text-sm mt-2">
                  ⚠️ Keep this URL secret! Anyone with this URL can send messages to your Discord channel.
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Step 6: Save Settings</h3>
                <p className="text-gray-300">
                  Click <strong className="text-white">&quot;Save Changes&quot;</strong> at the bottom of the Discord settings
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="add-to-server" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Adding Webhook to Your Server</h2>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">When Creating a New Server:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Go to <Link href="/dashboard/server/create" className="text-emerald-400 hover:text-emerald-300">Create Server</Link></li>
                  <li>Fill in your server details</li>
                  <li>Find the <strong className="text-white">&quot;Discord Webhook URL&quot;</strong> field</li>
                  <li>Paste your copied webhook URL</li>
                  <li>Click &quot;Create Server&quot;</li>
                </ol>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">For an Existing Server:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Go to <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300">Dashboard</Link></li>
                  <li>Find your server and click <strong className="text-white">&quot;Edit&quot;</strong></li>
                  <li>Scroll to the <strong className="text-white">&quot;Discord Webhook URL&quot;</strong> field</li>
                  <li>Paste your webhook URL</li>
                  <li>Click &quot;Save Changes&quot;</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="what-notifications" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. What Notifications You&apos;ll Receive</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                When a user pledges to your server, a beautiful notification will be sent to your Discord channel:
              </p>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">Notification Includes:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong className="text-white">Pledger Name:</strong> Who made the pledge</li>
                  <li><strong className="text-white">Pledge Amount:</strong> How much they pledged per month</li>
                  <li><strong className="text-white">Server Goal:</strong> Your monthly server cost</li>
                  <li><strong className="text-white">Current Progress:</strong> Total pledged so far</li>
                  <li><strong className="text-white">Pledger Count:</strong> How many people are pledging</li>
                  <li><strong className="text-white">Status:</strong> Whether the goal is reached</li>
                  <li><strong className="text-white">Direct Link:</strong> Button to view your server page</li>
                </ul>
              </div>

              <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-400 mb-3">🎉 Example Notification:</h3>
                <div className="bg-slate-900/50 rounded p-4 space-y-2 text-sm">
                  <p className="text-white font-bold">New Pledge Received! 🎮</p>
                  <p className="text-gray-300"><strong className="text-emerald-400">Pledger:</strong> JohnGamer123</p>
                  <p className="text-gray-300"><strong className="text-emerald-400">Amount:</strong> $10.00/month</p>
                  <p className="text-gray-300"><strong className="text-emerald-400">Goal:</strong> $50.00/month</p>
                  <p className="text-gray-300"><strong className="text-emerald-400">Progress:</strong> $35.00 / $50.00 (70%)</p>
                  <p className="text-gray-300"><strong className="text-emerald-400">Pledgers:</strong> 5 people</p>
                  <p className="text-yellow-400">⚡ Almost there! Only $15.00 more needed!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="troubleshooting" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Troubleshooting</h2>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-red-400 mb-2">❌ Problem: Notifications Not Appearing</h3>
                <p className="text-gray-300 mb-3">Possible solutions:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Verify the webhook URL is correct (should start with <code className="bg-slate-900/50 px-2 py-1 rounded text-emerald-400">https://discord.com/api/webhooks/</code>)</li>
                  <li>Check if the webhook was deleted in Discord Server Settings</li>
                  <li>Ensure the channel still exists</li>
                  <li>Try creating a new webhook and updating your server settings</li>
                </ul>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-red-400 mb-2">❌ Problem: Invalid Webhook URL Error</h3>
                <p className="text-gray-300 mb-3">Possible solutions:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Make sure you copied the entire URL (including the token at the end)</li>
                  <li>Don&apos;t add extra spaces before or after the URL</li>
                  <li>The URL must start with <code className="bg-slate-900/50 px-2 py-1 rounded text-emerald-400">https://</code></li>
                  <li>Try copying the webhook URL again from Discord</li>
                </ul>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Important Security Note</h3>
                <p className="text-gray-300">
                  Never share your webhook URL publicly! Anyone with the URL can send messages to your Discord channel. 
                  If your webhook URL is compromised, delete it in Discord Server Settings and create a new one.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">💡 Best Practices</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <p>Create a dedicated <strong className="text-white">#pledges</strong> or <strong className="text-white">#announcements</strong> channel for notifications</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <p>Name your webhook clearly (e.g., &quot;Pledge Bot&quot; or &quot;Server Support&quot;)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <p>Test it by having a friend make a small pledge or making one yourself</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <p>Pin important pledge notifications to keep your community motivated</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <p>Set channel permissions so only admins can send messages (prevents spam)</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">❓ Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Can I use multiple webhooks?</h3>
                <p className="text-gray-300">
                  You can only set one webhook per server. If you need notifications in multiple channels, 
                  consider using Discord&apos;s channel following feature to mirror messages.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Is the webhook optional?</h3>
                <p className="text-gray-300">
                  Yes! Webhooks are completely optional. Your server will work perfectly fine without one.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Can I change the webhook later?</h3>
                <p className="text-gray-300">
                  Absolutely! You can update or remove the webhook URL anytime by editing your server settings.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Do I need to manage roles or permissions?</h3>
                <p className="text-gray-300">
                  No! Webhooks work independently of Discord bot permissions. Just make sure the channel exists and the webhook is active.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">What if I delete my webhook in Discord?</h3>
                <p className="text-gray-300">
                  Notifications will stop working. Simply create a new webhook and update it in your server settings on Community Pledges.
                </p>
              </div>
            </div>
          </section>

          {/* Need More Help */}
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Need More Help?</h3>
            <p className="text-gray-300 mb-4">
              Still having trouble setting up your Discord webhook? Our support team is here to help!
            </p>
            <Link
              href="/tickets/create"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Create Support Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

