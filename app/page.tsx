import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
                COMMUNITY PLEDGES
              </h1>
              <span className="bg-emerald-400 text-emerald-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                BETA
              </span>
            </div>
            
            <p className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 max-w-4xl mx-auto leading-relaxed">
              Share the cost of community servers with your members
            </p>
            
            <p className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto text-emerald-100">
              Pledge what you can afford whether it&apos;s $2 or $10, we&apos;ll optimize with split costs 
              to make hosting affordable for everyone. <span className="font-semibold text-white">Keeping community servers alive!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link
                href="/servers"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg text-lg font-bold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Browse Servers
              </Link>
              {session && (
                <Link
                  href="/dashboard/server/create"
                  className="bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-white"
                >
                  Create Server
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider - Transparent to show body background */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="transparent"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Split Cost Sharing</h3>
            <p className="text-gray-200 leading-relaxed">
              Pay only what you pledged or less. We optimize costs to reduce everyone&apos;s payments 
              when others pledge alongside you respecting your pledge limit.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Community Driven</h3>
            <p className="text-gray-200 leading-relaxed">
              Join forces with other community members to make server costs more affordable for server owners.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Transparent Process</h3>
            <p className="text-gray-200 leading-relaxed">
              See exactly what you&apos;ll pay and how your pledge helped reduce costs for everyone else if you pledged more!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Community Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-emerald-400 font-semibold">For Community Members</p>
            <p className="text-lg text-gray-300 mt-2">Join servers and help share hosting costs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Browse Servers to Play!</h3>
              <p className="text-gray-200 leading-relaxed">
                Discover amazing gaming servers across Minecraft, Rust, Terraria, ARK, Valheim, and more. 
                Find communities that match your interests.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pledge Your Support</h3>
              <p className="text-gray-200 leading-relaxed">
                Choose how much you can afford to contribute monthly - whether it&apos;s $2, $5, or $10. 
                Every pledge helps keep the server running.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pay Less Than You Pledged</h3>
              <p className="text-gray-200 leading-relaxed">
                When others join and pledge, costs get split! You&apos;ll often pay less than your pledged 
                amount while still supporting the community.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enjoy & Connect</h3>
              <p className="text-gray-200 leading-relaxed">
                Play on your chosen servers knowing you&apos;re helping keep them alive. Connect with 
                like-minded gamers and build lasting friendships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Server Owners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xl text-emerald-400 font-semibold">For Server Owners</p>
            <p className="text-lg text-gray-300 mt-2">Share hosting costs with your community</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Upload Your Server</h3>
              <p className="text-gray-200 leading-relaxed">
                Create your server listing with details about your community, game type, and monthly hosting costs. 
                Set your server&apos;s unique personality.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Invite Your Community</h3>
              <p className="text-gray-200 leading-relaxed">
                Share your server with your Discord community, friends, and social media. Let them know they 
                can help support the server they love.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Watch Pledges Come In</h3>
              <p className="text-gray-200 leading-relaxed">
                See your community members pledge their support. Track how much of your hosting costs are 
                being covered by the community.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Focus on Your Community</h3>
              <p className="text-gray-200 leading-relaxed">
                Spend less time worrying about hosting costs and more time building amazing experiences for 
                your players. Let the community support what they love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Keep Your Community Alive?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join thousands of gamers sharing server costs and building amazing communities together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!session && (
              <Link
                href="/register"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-lg text-lg font-bold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
            )}
            <Link
              href="/servers"
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-10 py-4 rounded-lg text-lg font-bold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-white"
            >
              Browse Servers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4">Community Pledges</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Keeping community servers alive since 2025. Share the cost with your community or 
                simply pledge to your favorite community server.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/servers" className="hover:text-indigo-400 transition">
                    Browse Servers
                  </Link>
                </li>
                <li>
                  <Link href="/users" className="hover:text-indigo-400 transition">
                    Members
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-indigo-400 transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-indigo-400 transition">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="hover:text-indigo-400 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/tickets" className="hover:text-indigo-400 transition">
                    Support Tickets
                  </Link>
                </li>
                <li>
                  <Link href="/tickets/create" className="hover:text-indigo-400 transition">
                    Create Ticket
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-indigo-400 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-indigo-400 transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-indigo-400 transition">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-indigo-400 transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Community Pledges. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm text-gray-400 font-medium">Stripe secure payments</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
