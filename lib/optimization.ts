import { MIN_PLEDGE } from "./constants"

interface OptimizationResult {
  optimizedCosts: number[]
  isAcceptingPledges: boolean
  maxPeople: number
  totalPledged: number
  serverCost: number
  savings: number
}

/**
 * Smart optimization algorithm to reduce costs when pledges exceed server requirements
 * @param pledgeAmounts Array of pledged amounts
 * @param serverCost Monthly server cost
 * @param minCostPerPerson Minimum cost per person (default: MIN_PLEDGE)
 * @returns Optimized costs and status
 */
export function calculateOptimizedCosts(
  pledgeAmounts: number[],
  serverCost: number,
  minCostPerPerson: number = MIN_PLEDGE
): OptimizationResult {
  const totalPledged = pledgeAmounts.reduce((sum, amount) => sum + amount, 0)
  const pledgeCount = pledgeAmounts.length
  
  // CASE 1: No pledges yet
  if (pledgeCount === 0) {
    return {
      optimizedCosts: [],
      isAcceptingPledges: true,
      maxPeople: Math.floor(serverCost / minCostPerPerson),
      totalPledged: 0,
      serverCost,
      savings: 0,
    }
  }
  
  // CASE 2: Calculate maximum people allowed at minimum cost
  // Example: $30 server / $2 minimum = 15 max people
  const maxPeople = Math.floor(serverCost / minCostPerPerson)
  
  // CASE 3: Too many people (at or above max capacity)
  // Everyone pays exactly the minimum
  if (pledgeCount >= maxPeople) {
    const optimizedCosts = new Array(pledgeCount).fill(minCostPerPerson)
    return {
      optimizedCosts,
      isAcceptingPledges: false,
      maxPeople,
      totalPledged,
      serverCost,
      savings: totalPledged - (pledgeCount * minCostPerPerson),
    }
  }
  
  // CASE 4: Total pledged < server cost
  // Users pay exactly what they pledged (no optimization)
  if (totalPledged < serverCost) {
    return {
      optimizedCosts: pledgeAmounts, // Users pay their full pledge
      isAcceptingPledges: true,
      maxPeople,
      totalPledged,
      serverCost,
      savings: 0,
    }
  }
  
  // CASE 5: Total pledged >= server cost (OPTIMIZATION HAPPENS HERE)
  // Distribute savings fairly among pledgers
  let optimizedCosts = [...pledgeAmounts]
  let excess = totalPledged - serverCost
  
  // Sort pledgers by amount (highest first)
  const sortedIndices = pledgeAmounts
    .map((amount, index) => ({ amount, index }))
    .sort((a, b) => b.amount - a.amount)
    .map(item => item.index)
  
  // Identify who can participate in cost reduction
  // (only those who pledged more than minimum)
  const eligiblePledgers = sortedIndices.filter(index => 
    optimizedCosts[index] > minCostPerPerson
  )
  
  if (eligiblePledgers.length > 0) {
    // Calculate total amount that can be reduced
    const totalReducible = eligiblePledgers.reduce((sum, index) => 
      sum + (optimizedCosts[index] - minCostPerPerson), 0
    )
    
    if (excess <= totalReducible) {
      // Distribute savings proportionally among eligible pledgers
      for (const index of eligiblePledgers) {
        const currentCost = optimizedCosts[index]
        const maxReduction = currentCost - minCostPerPerson
        const proportionalReduction = (maxReduction / totalReducible) * excess
        
        optimizedCosts[index] = Math.round((currentCost - proportionalReduction) * 100) / 100
      }
    } else {
      // Reduce everyone to minimum and distribute remaining excess
      for (const index of eligiblePledgers) {
        optimizedCosts[index] = minCostPerPerson
      }
    }
  }
  
  const canAcceptMore = pledgeCount < maxPeople
  const totalOptimized = optimizedCosts.reduce((sum, cost) => sum + cost, 0)
  const savings = totalPledged - totalOptimized
  
  return {
    optimizedCosts,
    isAcceptingPledges: canAcceptMore,
    maxPeople,
    totalPledged,
    serverCost,
    savings: Math.round(savings * 100) / 100,
  }
}

/**
 * Calculate if a server can accept more pledges
 */
export function canAcceptPledge(
  currentPledgeCount: number,
  serverCost: number,
  minCostPerPerson: number = MIN_PLEDGE
): boolean {
  const maxPeople = Math.floor(serverCost / minCostPerPerson)
  return currentPledgeCount < maxPeople
}

/**
 * Get optimization preview for a single user
 * Shows what they'll likely pay vs what they pledge
 */
export function getOptimizationPreview(
  userPledgeAmount: number,
  existingPledges: number[],
  serverCost: number
): {
  pledgeAmount: number
  estimatedPayment: number
  potentialSavings: number
} {
  const allPledges = [...existingPledges, userPledgeAmount]
  const result = calculateOptimizedCosts(allPledges, serverCost)
  const userIndex = allPledges.length - 1
  const estimatedPayment = result.optimizedCosts[userIndex]
  const potentialSavings = userPledgeAmount - estimatedPayment

  return {
    pledgeAmount: userPledgeAmount,
    estimatedPayment: Math.round(estimatedPayment * 100) / 100,
    potentialSavings: Math.round(Math.max(0, potentialSavings) * 100) / 100,
  }
}
