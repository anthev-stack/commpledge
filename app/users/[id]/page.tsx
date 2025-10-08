import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface UserProfilePageProps {
  params: {
    id: string
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name || "Anonymous User"}
                </h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
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

