import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Reset Stripe connection (for troubleshooting)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Reset user's Stripe fields
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripeAccountId: null,
        stripeAccountStatus: null,
        stripeOnboardingComplete: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset Stripe error:", error)
    return NextResponse.json(
      { error: "Failed to reset Stripe connection" },
      { status: 500 }
    )
  }
}
