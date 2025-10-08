import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { calculateOptimizedCosts } from "@/lib/optimization"
import { calculatePlatformFee, calculateStripeFee, MAX_FAILED_PAYMENTS } from "@/lib/constants"

export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const today = new Date()
    const currentDay = today.getDate()

    // Find servers that need processing (withdrawalDay - 2 = today)
    const targetWithdrawalDay = currentDay + 2 > 31 ? (currentDay + 2) - 31 : currentDay + 2

    const servers = await prisma.server.findMany({
      where: {
        isActive: true,
        withdrawalDay: targetWithdrawalDay,
      },
      include: {
        owner: {
          select: {
            stripeAccountId: true,
            stripeOnboardingComplete: true,
          },
        },
        pledges: {
          where: {
            status: "ACTIVE",
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                stripeCustomerId: true,
                stripePaymentMethodId: true,
                hasPaymentMethod: true,
                role: true,
                failedPayments: true,
              },
            },
          },
        },
      },
    })

    const results = []

    for (const server of servers) {
      try {
        // Skip if owner hasn't completed Stripe setup
        if (!server.owner.stripeAccountId || !server.owner.stripeOnboardingComplete) {
          continue
        }

        // Filter out suspended/banned users
        const validPledges = server.pledges.filter(
          p => p.user.role !== "SUSPENDED" && p.user.role !== "BANNED" && p.user.hasPaymentMethod
        )

        if (validPledges.length === 0) {
          continue
        }

        // Calculate optimized costs
        const pledgeAmounts = validPledges.map(p => p.amount)
        const optimization = calculateOptimizedCosts(pledgeAmounts, server.cost)

        let totalCollected = 0
        let successfulCharges = 0
        let failedCharges = 0

        // Process each pledge
        for (let i = 0; i < validPledges.length; i++) {
          const pledge = validPledges[i]
          const chargeAmount = optimization.optimizedCosts[i]

          try {
            // Charge the user
            const paymentIntent = await stripe.paymentIntents.create({
              amount: Math.round(chargeAmount * 100),
              currency: "usd",
              customer: pledge.user.stripeCustomerId!,
              payment_method: pledge.user.stripePaymentMethodId!,
              off_session: true,
              confirm: true,
              application_fee_amount: Math.round(chargeAmount * 0.02 * 100), // 2% platform fee
              transfer_data: {
                destination: server.owner.stripeAccountId!,
              },
              metadata: {
                serverId: server.id,
                userId: pledge.user.id,
                pledgeId: pledge.id,
                pledgedAmount: pledge.amount.toString(),
                chargedAmount: chargeAmount.toString(),
              },
            })

            if (paymentIntent.status === "succeeded") {
              totalCollected += chargeAmount
              successfulCharges++

              // Update pledge
              await prisma.pledge.update({
                where: { id: pledge.id },
                data: {
                  lastChargedAt: new Date(),
                  optimizedAmount: chargeAmount,
                },
              })

              // Reset failed payments
              await prisma.user.update({
                where: { id: pledge.user.id },
                data: {
                  failedPayments: 0,
                },
              })

              // Log success
              await prisma.activityLog.create({
                data: {
                  userId: pledge.user.id,
                  serverId: server.id,
                  action: "payment_success",
                  details: JSON.stringify({
                    amount: chargeAmount,
                    pledgeId: pledge.id,
                  }),
                },
              })
            }
          } catch (error: any) {
            failedCharges++

            // Increment failed payments
            const updatedUser = await prisma.user.update({
              where: { id: pledge.user.id },
              data: {
                failedPayments: { increment: 1 },
                lastFailedPayment: new Date(),
              },
            })

            // Suspend if too many failures
            if (updatedUser.failedPayments >= MAX_FAILED_PAYMENTS) {
              await prisma.user.update({
                where: { id: pledge.user.id },
                data: {
                  role: "SUSPENDED",
                  suspendedAt: new Date(),
                  suspensionReason: `Account suspended after ${MAX_FAILED_PAYMENTS} failed payment attempts`,
                },
              })

              // Cancel their pledge
              await prisma.pledge.update({
                where: { id: pledge.id },
                data: { status: "FAILED" },
              })
            }

            // Log failure
            await prisma.activityLog.create({
              data: {
                userId: pledge.user.id,
                serverId: server.id,
                action: "payment_failed",
                details: JSON.stringify({
                  amount: chargeAmount,
                  pledgeId: pledge.id,
                  error: error.message,
                }),
              },
            })
          }
        }

        // Create withdrawal record
        const platformFee = calculatePlatformFee(totalCollected)
        const stripeFee = calculateStripeFee(totalCollected)
        const netAmount = totalCollected - platformFee - stripeFee

        await prisma.withdrawal.create({
          data: {
            serverId: server.id,
            scheduledDate: new Date(),
            withdrawalDate: new Date(today.setDate(today.getDate() + 2)),
            totalAmount: totalCollected,
            collectedAmount: totalCollected,
            platformFee,
            netAmount,
            status: successfulCharges > 0 ? "completed" : "failed",
            pledgeCount: validPledges.length,
            successfulCharges,
            failedCharges,
          },
        })

        results.push({
          serverId: server.id,
          serverName: server.name,
          totalCollected,
          successfulCharges,
          failedCharges,
        })
      } catch (error) {
        console.error(`Error processing server ${server.id}:`, error)
        results.push({
          serverId: server.id,
          error: "Failed to process",
        })
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { error: "Failed to process withdrawals" },
      { status: 500 }
    )
  }
}
