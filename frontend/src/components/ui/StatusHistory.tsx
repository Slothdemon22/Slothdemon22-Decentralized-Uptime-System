"use client"

import { TickData } from "@/types/websiteTypes"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StatusHistoryProps {
  ticks: TickData[]
}

export function StatusHistory({ ticks }: StatusHistoryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  if (!ticks || ticks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic text-center py-4">
        No historical data available
      </div>
    )
  }

  // Calculate total uptime percentage
  const uptime = (ticks.filter(tick => tick.status === "Good").length / ticks.length) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>90 days ago</span>
        <span>{uptime.toFixed(3)}% uptime</span>
        <span>Today</span>
      </div>
      
      <TooltipProvider>
        <div className="grid grid-cols-90 gap-px h-8">
          {ticks.map((tick, index) => {
            const isGood = tick.status === "Good"
            const date = new Date(tick.createdAt)
            const formattedDate = date.toLocaleString()
            const isHighlighted = hoveredIndex === index
            
            return (
              <Tooltip key={tick._id || index}>
                <TooltipTrigger asChild>
                  <div 
                    className="relative w-full h-full"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div 
                      className={cn(
                        "w-full h-full transition-all duration-150",
                        isGood ? "bg-emerald-500" : "bg-red-500",
                        isHighlighted ? "opacity-100" : "opacity-80"
                      )}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="text-xs p-2 bg-popover text-popover-foreground"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{formattedDate}</p>
                    <p>Status: {tick.status}</p>
                    {tick.responseTime && (
                      <p>Response time: {tick.responseTime}ms</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}