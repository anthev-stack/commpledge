import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://commpledge.vercel.app'

  // Fetch all public servers
  const servers = await prisma.server.findMany({
    where: {
      status: 'active',
      isPrivate: false,
    },
    select: {
      id: true,
      updatedAt: true,
    },
  })

  // Fetch all communities
  const communities = await prisma.community.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      updatedAt: true,
    },
  })

  // Fetch some users (public profiles)
  const users = await prisma.user.findMany({
    take: 1000, // Limit to prevent too large sitemap
    select: {
      id: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servers`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/communities`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/users`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help/stripe-setup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help/discord-webhooks`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Server pages
  const serverPages = servers.map((server) => ({
    url: `${baseUrl}/servers/${server.id}`,
    lastModified: server.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Community pages
  const communityPages = communities.map((community) => ({
    url: `${baseUrl}/communities/${community.id}`,
    lastModified: community.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // User profile pages
  const userPages = users.map((user) => ({
    url: `${baseUrl}/users/${user.id}`,
    lastModified: user.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...serverPages, ...communityPages, ...userPages]
}

