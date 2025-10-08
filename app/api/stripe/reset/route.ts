import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

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

    // Get user's current Stripe account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true },
    })

    // If they have a Stripe account, try to delete it
    if (user?.stripeAccountId) {
      try {
        await stripe.accounts.del(user.stripeAccountId)
        console.log("Deleted Stripe account:", user.stripeAccountId)
      } catch (error: any) {
        // Account might already be deleted or not exist, that's ok
        console.log("Could not delete Stripe account (might not exist):", error.message)
      }
    }

    // Reset user's Stripe fields in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        stripeAccountId: null,
        stripeAccountStatus: null,
        stripeOnboardingComplete: false,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: "Stripe connection reset. You can now connect with updated settings."
    })
  } catch (error) {
    console.error("Reset Stripe error:", error)
    return NextResponse.json(
      { error: "Failed to reset Stripe connection" },
      { status: 500 }
    )
  }
}
