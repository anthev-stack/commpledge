"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

function StaffLink() {
  const [isStaff, setIsStaff] = useState(false)

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => {
        if (data.role === "ADMIN" || data.role === "MODERATOR") {
          setIsStaff(true)
        }
      })
      .catch(() => {})
  }, [])

  if (!isStaff) return null

  return (
    <Link href="/staff" className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition flex items-center">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      Staff
    </Link>
  )
}

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-900 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                  Community Pledges
                </span>
                <span className="bg-emerald-400 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">
                  BETA
                </span>
              </div>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Home
              </Link>
              <Link
                href="/servers"
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Servers
              </Link>
              <Link
                href="/communities"
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Communities
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/users"
                    className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Users
                  </Link>
                  <Link
                    href="/tickets"
                    className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Tickets
                  </Link>
                  <StaffLink />
                </>
              )}
            </div>
          </div>
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/settings">
                  <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium text-white">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-white hover:bg-gray-100 text-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 p-2"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
              >
                Home
              </Link>
              <Link
                href="/servers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
              >
                Servers
              </Link>
              <Link
                href="/communities"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
              >
                Communities
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                  >
                    Users
                  </Link>
                  <Link
                    href="/tickets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition"
                  >
                    Tickets
                  </Link>
                  <StaffLink />
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-md">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user?.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {session.user?.name || "User"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.user?.email}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                      className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
              {!session && (
                <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center text-sm font-medium transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-center text-sm font-medium transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

