import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SUPPORTED_COUNTRIES } from "@/lib/countries"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { country } = body

    if (!country) {
      return NextResponse.json(
        { error: "Country is required" },
        { status: 400 }
      )
    }

    // Validate country code
    const validCountry = SUPPORTED_COUNTRIES.find(c => c.code === country)
    if (!validCountry) {
      return NextResponse.json(
        { error: "Invalid country code" },
        { status: 400 }
      )
    }

    // Check if user already has a Stripe account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true },
    })

    if (user?.stripeAccountId) {
      return NextResponse.json(
        { error: "Cannot change country after connecting Stripe" },
        { status: 400 }
      )
    }

    // Update user's country
    await prisma.user.update({
      where: { id: session.user.id },
      data: { country },
    })

    return NextResponse.json({ success: true, country })
  } catch (error) {
    console.error("Update country error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
