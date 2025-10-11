import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import { Server, Users, DollarSign, Heart } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white overflow-hidden border-b-4 border-[#16213e]">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="text-center">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Split cost sharing</h3>
            <p className="text-gray-300">
              Pay only what you pledged or less. We optimize costs to reduce everyone&apos;s payments 
              when others pledge alongside you respecting your pledge limit.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Community driven</h3>
            <p className="text-gray-300">
              Join forces with other community members to make server costs 
              more affordable for server owners.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Transparent process</h3>
            <p className="text-gray-300">
              See exactly what you&apos;ll pay and how your pledge helped reduce 
              costs for everyone else if you pledged more!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Community Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-16 border border-slate-700/50">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-2 uppercase">For Community Members</h3>
              <p className="text-gray-400">Join servers and help share hosting costs</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Browse servers to play!</h4>
                  <p className="text-sm text-gray-300">
                    Discover amazing gaming servers across Minecraft, Rust, Terraria, ARK, Valheim, and more. Find communities that match your interests.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Pledge your support</h4>
                  <p className="text-sm text-gray-300">
                    Choose how much you can afford to contribute monthly - whether it&apos;s $2, $5, or $10. Every pledge helps keep the server running.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Pay less than you pledged</h4>
                  <p className="text-sm text-gray-300">
                    When others join and pledge, costs get split! You&apos;ll often pay less than your pledged amount while still supporting the community.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Enjoy & connect</h4>
                  <p className="text-sm text-gray-300">
                    Play on your chosen servers knowing you&apos;re helping keep them alive. Connect with like-minded gamers and build lasting friendships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Server Owners */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-16 border border-slate-700/50">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-2 uppercase">For Server Owners</h3>
              <p className="text-gray-400">Share hosting costs with your community</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Upload your server</h4>
                  <p className="text-sm text-gray-300">
                    Create your server listing with details about your community, game type, and monthly hosting costs. Set your server&apos;s unique personality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Invite your community</h4>
                  <p className="text-sm text-gray-300">
                    Share your server with your Discord community, friends, and social media. Let them know they can help support the server they love.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Watch pledges come in</h4>
                  <p className="text-sm text-gray-300">
                    See your community members pledge their support. Track how much of your hosting costs are being covered by the community.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Focus on your community</h4>
                  <p className="text-sm text-gray-300">
                    Spend less time worrying about hosting costs and more time building amazing experiences for your players. Let the community support what they love.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
