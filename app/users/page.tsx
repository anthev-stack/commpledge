import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Members</h1>
          <p className="text-gray-600 mt-2">
            Browse all {users.length} members of our community
          </p>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No users yet</h2>
            <p className="text-gray-600">Be the first to join our community!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 block"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {user.name || "Anonymous User"}
                      </h2>
                      <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                        user.role === "MODERATOR" ? "bg-blue-100 text-blue-700" :
                        user.role === "SUSPENDED" ? "bg-orange-100 text-orange-700" :
                        user.role === "BANNED" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Community Member</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

