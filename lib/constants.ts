// Pledge system constants

export const MIN_PLEDGE = 2.00 // Minimum pledge amount in USD
export const MAX_PLEDGE = 30.00 // Maximum pledge amount in USD
export const PLATFORM_FEE_PERCENTAGE = 0.02 // 2% platform fee
export const STRIPE_FEE_PERCENTAGE = 0.029 // 2.9% Stripe fee
export const STRIPE_FEE_FIXED = 0.30 // $0.30 fixed Stripe fee
export const CHARGE_DAYS_BEFORE = 2 // Charge pledgers 2 days before withdrawal
export const MAX_FAILED_PAYMENTS = 3 // Suspend user after 3 failed payments

// Fee calculations
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100) / 100
}

export function calculateStripeFee(amount: number): number {
  return Math.round((amount * STRIPE_FEE_PERCENTAGE + STRIPE_FEE_FIXED) * 100) / 100
}

export function calculateNetAmount(amount: number): number {
  const platformFee = calculatePlatformFee(amount)
  const stripeFee = calculateStripeFee(amount)
  return Math.round((amount - platformFee - stripeFee) * 100) / 100
}

// Calculate total fees
export function calculateTotalFees(amount: number): {
  platformFee: number
  stripeFee: number
  totalFees: number
  netAmount: number
} {
  const platformFee = calculatePlatformFee(amount)
  const stripeFee = calculateStripeFee(amount)
  const totalFees = platformFee + stripeFee
  const netAmount = amount - totalFees

  return {
    platformFee: Math.round(platformFee * 100) / 100,
    stripeFee: Math.round(stripeFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
  }
}
