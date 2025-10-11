import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center - Community Pledges | Support & Guides",
  description: "Find helpful guides and tutorials for using Community Pledges. Learn how to set up Stripe payments, create Discord webhooks, manage servers, and more.",
  keywords: "community pledges help, gaming server support, stripe setup guide, discord webhooks, server hosting help, pledge system tutorial",
}

const helpTopics = [
  {
    title: "Stripe Payout Setup",
    description: "Learn how to connect your Stripe account to receive payouts from server pledges",
    href: "/help/stripe-setup",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    category: "Server Owners",
    popular: true,
  },
  {
    title: "Discord Webhook Setup",
    description: "Step-by-step guide to create Discord webhooks for pledge notifications",
    href: "/help/discord-webhooks",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    category: "Server Owners",
    popular: true,
  },
  {
    title: "How to Pledge",
    description: "Learn how to support your favorite gaming servers with monthly pledges",
    href: "/help/how-to-pledge",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    category: "Community Members",
    popular: true,
  },
  {
    title: "Creating a Server",
    description: "Complete guide to creating and managing your game server listing",
    href: "/help/creating-server",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    category: "Server Owners",
    popular: false,
  },
  {
    title: "Understanding Optimization",
    description: "Learn how our smart cost optimization algorithm works to reduce payments",
    href: "/help/optimization",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    category: "Community Members",
    popular: false,
  },
  {
    title: "Payment Methods",
    description: "How to add, update, and manage your payment methods",
    href: "/help/payment-methods",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    category: "Community Members",
    popular: false,
  },
  {
    title: "Creating Communities",
    description: "Build your gaming community profile and attract new members",
    href: "/help/creating-communities",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    category: "Server Owners",
    popular: false,
  },
  {
    title: "Server Boosting",
    description: "Boost your server to the top of the browse page for 24 hours",
    href: "/help/server-boosting",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    category: "Server Owners",
    popular: false,
  },
  {
    title: "Currency & Pricing",
    description: "How currency conversion works and understanding pricing",
    href: "/help/currency",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    category: "General",
    popular: false,
  },
  {
    title: "Troubleshooting",
    description: "Common issues and solutions for pledgers and server owners",
    href: "/help/troubleshooting",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    category: "General",
    popular: false,
  },
]

export default function HelpPage() {
  const popularTopics = helpTopics.filter(topic => topic.popular)
  const categories = ["Server Owners", "Community Members", "General"]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find guides, tutorials, and answers to common questions about using Community Pledges
          </p>
        </div>

        {/* Popular Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">🔥 Popular Topics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {popularTopics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-6 hover:border-emerald-500 hover:shadow-xl transition group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-emerald-400 group-hover:text-emerald-300 transition">
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Topics by Category */}
        {categories.map((category) => {
          const categoryTopics = helpTopics.filter(topic => topic.category === category)
          
          if (categoryTopics.length === 0) return null

          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {categoryTopics.map((topic) => (
                  <Link
                    key={topic.href}
                    href={topic.href}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-4 hover:border-emerald-500 hover:shadow-xl transition group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-emerald-400 group-hover:text-emerald-300 transition flex-shrink-0">
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-400 transition">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {topic.description}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* Contact Support */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tickets/create"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Create Support Ticket
            </Link>
            <Link
              href="/tickets"
              className="inline-block bg-slate-700/50 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              View My Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

