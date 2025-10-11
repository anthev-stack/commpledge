import Link from "next/link"
import { Metadata } from "next"
import { CreditCard, MessageSquare, DollarSign, Server, TrendingUp, CheckCircle, Users, Zap, Coins, Settings } from "lucide-react"

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
    icon: CreditCard,
    category: "Server Owners",
    popular: true,
  },
  {
    title: "Discord Webhook Setup",
    description: "Step-by-step guide to create Discord webhooks for pledge notifications",
    href: "/help/discord-webhooks",
    icon: MessageSquare,
    category: "Server Owners",
    popular: true,
  },
  {
    title: "How to Pledge",
    description: "Learn how to support your favorite gaming servers with monthly pledges",
    href: "/help/how-to-pledge",
    icon: DollarSign,
    category: "Community Members",
    popular: true,
  },
  {
    title: "Creating a Server",
    description: "Complete guide to creating and managing your game server listing",
    href: "/help/creating-server",
    icon: Server,
    category: "Server Owners",
    popular: false,
  },
  {
    title: "Understanding Optimization",
    description: "Learn how our smart cost optimization algorithm works to reduce payments",
    href: "/help/optimization",
    icon: TrendingUp,
    category: "Community Members",
    popular: false,
  },
  {
    title: "Payment Methods",
    description: "How to add, update, and manage your payment methods",
    href: "/help/payment-methods",
    icon: CheckCircle,
    category: "Community Members",
    popular: false,
  },
  {
    title: "Creating Communities",
    description: "Build your gaming community profile and attract new members",
    href: "/help/creating-communities",
    icon: Users,
    category: "Server Owners",
    popular: false,
  },
  {
    title: "Server Boosting",
    description: "Boost your server to the top of the browse page for 24 hours",
    href: "/help/server-boosting",
    icon: Zap,
    category: "Server Owners",
    popular: false,
  },
  {
    title: "Currency & Pricing",
    description: "How currency conversion works and understanding pricing",
    href: "/help/currency",
    icon: Coins,
    category: "General",
    popular: false,
  },
  {
    title: "Troubleshooting",
    description: "Common issues and solutions for pledgers and server owners",
    href: "/help/troubleshooting",
    icon: Settings,
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
                  <div className="bg-emerald-500/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <topic.icon className="w-6 h-6 text-emerald-400" />
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
                      <div className="bg-emerald-500/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <topic.icon className="w-5 h-5 text-emerald-400" />
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

