import Link from "next/link"

export default function Footer() {
  return (
    <footer className="text-gray-300 bg-[#16213e]">
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
                <Link href="/servers" className="hover:text-emerald-400 transition">
                  Browse Servers
                </Link>
              </li>
              <li>
                <Link href="/users" className="hover:text-emerald-400 transition">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-emerald-400 transition">
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
                <Link href="/help" className="hover:text-emerald-400 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-emerald-400 transition">
                  Support Tickets
                </Link>
              </li>
              <li>
                <Link href="/tickets/create" className="hover:text-emerald-400 transition">
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
                <Link href="/privacy" className="hover:text-emerald-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-emerald-400 transition">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-emerald-400 transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 Community Pledges. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <select className="bg-transparent text-gray-400 text-sm border-none outline-none">
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
