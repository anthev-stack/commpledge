import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export const dynamic = 'force-dynamic'

interface UserProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      role: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/users"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 mb-6">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-30 h-30 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-semibold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name || "Anonymous User"}
                  </h1>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                    user.role === "MODERATOR" ? "bg-blue-100 text-blue-700" :
                    user.role === "SUSPENDED" ? "bg-orange-100 text-orange-700" :
                    user.role === "BANNED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">Community Member</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500 mb-1">User ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{user.id}</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Member Since</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Display Name</dt>
                  <dd className="text-sm text-gray-900">{user.name || "Not set"}</dd>
                </div>

                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Profile Picture</dt>
                  <dd className="text-sm text-gray-900">
                    {user.image ? "Yes" : "No"}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Role</dt>
                  <dd className="text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                      user.role === "MODERATOR" ? "bg-blue-100 text-blue-700" :
                      user.role === "SUSPENDED" ? "bg-orange-100 text-orange-700" :
                      user.role === "BANNED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Activity Section - Placeholder */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">No activity yet</p>
                <p className="text-sm text-gray-500 mt-1">Pledges and commitments will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

