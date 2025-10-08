import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

// Get user's saved payment methods
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
      select: { email: true },
    })

    if (!user?.email) {
      return NextResponse.json({ paymentMethods: [] })
    }

    // Get customer from Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json({ paymentMethods: [] })
    }

    const customer = customers.data[0]

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    })

    return NextResponse.json({
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
      })),
    })
  } catch (error) {
    console.error("Get payment methods error:", error)
    return NextResponse.json(
      { error: "Failed to get payment methods" },
      { status: 500 }
    )
  }
}

// Delete a payment method
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentMethodId = searchParams.get('id')

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID required" },
        { status: 400 }
      )
    }

    // Detach payment method
    await stripe.paymentMethods.detach(paymentMethodId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete payment method error:", error)
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 }
    )
  }
}
