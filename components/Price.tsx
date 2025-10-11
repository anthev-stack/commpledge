'use client'

import { useCurrency } from './CurrencyProvider'

interface PriceProps {
  amountUSD: number
  showCode?: boolean
  className?: string
}

export function Price({ amountUSD, showCode = false, className = '' }: PriceProps) {
  const { formatPrice, isLoading } = useCurrency()

  if (isLoading) {
    return <span className={className}>${ amountUSD.toFixed(2)}</span>
  }

  return <span className={className}>{formatPrice(amountUSD, showCode)}</span>
}

