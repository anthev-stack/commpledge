import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-[#16213e]">
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

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#16213e"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Split Cost Sharing</h3>
            <p className="text-gray-300 leading-relaxed">
              Pay only what you pledged or less. We optimize costs to reduce everyone&apos;s payments 
              when others pledge alongside you respecting your pledge limit.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.97L12 14v6h2v-4.5l1.5-1.5V22h2zm-8-18c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 14.54 8H13c-.8 0-1.54.37-2.01.97L8 14v6h2v-4.5l1.5-1.5V22h2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Community Driven</h3>
            <p className="text-gray-300 leading-relaxed">
              Join forces with other community members to make server costs more affordable for server owners.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Transparent Process</h3>
            <p className="text-gray-300 leading-relaxed">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Browse Servers to Play!</h3>
              <p className="text-gray-300 leading-relaxed">
                Discover amazing gaming servers across Minecraft, Rust, Terraria, ARK, Valheim, and more. 
                Find communities that match your interests.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pledge Your Support</h3>
              <p className="text-gray-300 leading-relaxed">
                Choose how much you can afford to contribute monthly - whether it&apos;s $2, $5, or $10. 
                Every pledge helps keep the server running.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pay Less Than You Pledged</h3>
              <p className="text-gray-300 leading-relaxed">
                When others join and pledge, costs get split! You&apos;ll often pay less than your pledged 
                amount while still supporting the community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enjoy & Connect</h3>
              <p className="text-gray-300 leading-relaxed">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Upload Your Server</h3>
              <p className="text-gray-300 leading-relaxed">
                Create your server listing with details about your community, game type, and monthly hosting costs. 
                Set your server&apos;s unique personality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Invite Your Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Share your server with your Discord community, friends, and social media. Let them know they 
                can help support the server they love.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Watch Pledges Come In</h3>
              <p className="text-gray-300 leading-relaxed">
                See your community members pledge their support. Track how much of your hosting costs are 
                being covered by the community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold mx-auto">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Focus on Your Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Spend less time worrying about hosting costs and more time building amazing experiences for 
                your players. Let the community support what they love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Keep Your Community Alive?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of gamers sharing server costs and building amazing communities together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!session && (
              <Link
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg text-lg font-bold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
            )}
            <Link
              href="/servers"
              className="bg-white hover:bg-gray-50 text-emerald-600 px-10 py-4 rounded-lg text-lg font-bold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-emerald-600"
            >
              Browse Servers
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
