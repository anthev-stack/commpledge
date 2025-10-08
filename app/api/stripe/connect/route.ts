import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe, STRIPE_CONNECT_REFRESH_URL, STRIPE_CONNECT_RETURN_URL } from "@/lib/stripe"

// Create Stripe Connect account and get onboarding link
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    let accountId = user.stripeAccountId

    // Check if user has selected a country
    if (!user.country) {
      return NextResponse.json(
        { error: "Please select your country first" },
        { status: 400 }
      )
    }

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: user.country,
        email: user.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })

      accountId = account.id

      // Save to database
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          stripeAccountId: accountId,
          stripeAccountStatus: "pending",
        },
      })
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: STRIPE_CONNECT_REFRESH_URL,
      return_url: STRIPE_CONNECT_RETURN_URL,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Stripe Connect error:", error)
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    )
  }
}

// Check Stripe Connect account status
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeAccountId: true,
        stripeAccountStatus: true,
        stripeOnboardingComplete: true,
      },
    })

    if (!user?.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        onboardingComplete: false,
      })
    }

    // Check account status with Stripe
    const account = await stripe.accounts.retrieve(user.stripeAccountId)

    const isComplete = account.details_submitted && account.charges_enabled

    // Update database if status changed
    if (isComplete !== user.stripeOnboardingComplete) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          stripeOnboardingComplete: isComplete,
          stripeAccountStatus: isComplete ? "active" : "pending",
        },
      })
    }

    return NextResponse.json({
      connected: true,
      onboardingComplete: isComplete,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    })
  } catch (error) {
    console.error("Error checking Stripe status:", error)
    return NextResponse.json(
      { error: "Failed to check Stripe status" },
      { status: 500 }
    )
  }
}
