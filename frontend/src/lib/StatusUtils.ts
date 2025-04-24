import { TickData } from "@/types/websiteTypes"

/**
 * Calculate uptime percentage based on tick data
 */
export function calculateUptimePercentage(ticks: TickData[]): number {
  if (!ticks || ticks.length === 0) return 0
  
  const goodTicks = ticks.filter(tick => tick.status === "Good").length
  return Math.round((goodTicks / ticks.length) * 100)
}

/**
 * Get the average response time from ticks (if available)
 */
export function getAverageResponseTime(ticks: TickData[]): number | null {
  if (!ticks || ticks.length === 0) return null
  
  const ticksWithResponseTime = ticks.filter(tick => 
    tick.responseTime !== undefined && tick.responseTime !== null
  )
  
  if (ticksWithResponseTime.length === 0) return null
  
  const sum = ticksWithResponseTime.reduce((acc, tick) => 
    acc + (tick.responseTime || 0), 0
  )
  
  return Math.round(sum / ticksWithResponseTime.length)
}

/**
 * Group ticks by status to get status distribution
 */
export function getStatusDistribution(ticks: TickData[]) {
  if (!ticks || ticks.length === 0) {
    return { Good: 0, Bad: 0, Unknown: 0 }
  }
  
  return ticks.reduce((acc, tick) => {
    const status = tick.status || "Unknown"
    return {
      ...acc,
      [status]: (acc[status as keyof typeof acc] || 0) + 1
    }
  }, { Good: 0, Bad: 0, Unknown: 0 })
}