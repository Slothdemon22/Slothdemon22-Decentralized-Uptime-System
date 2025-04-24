"use client"

import { SystemHealth } from "@/types/websiteTypes"
import { cn } from "@/lib/utils"
import { BarChart, RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  lastUpdated: Date
  health: SystemHealth
  loading: boolean
}

export function DashboardHeader({ lastUpdated, health, loading }: DashboardHeaderProps) {
  const formattedTime = lastUpdated.toLocaleTimeString()
  const formattedDate = lastUpdated.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <header className="border-b border-border/40 bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-foreground mr-3" />
              <h1 className="text-2xl font-bold leading-7 text-foreground sm:truncate">
                Status Dashboard
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground flex items-center">
              <span className={cn(
                "inline-flex items-center mr-2",
                loading ? "animate-spin" : ""
              )}>
                <RefreshCw size={14} className="mr-1" />
              </span>
              <span>
                Last updated: {formattedTime} on {formattedDate}
              </span>
            </p>
          </div>
          
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <div className="bg-card shadow-sm rounded-lg p-4 inline-flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">System Health</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  health.percentage >= 90 ? "bg-green-100 text-green-800" : 
                  health.percentage >= 75 ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                )}>
                  {health.percentage}%
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold">
                {health.healthy}/{health.total}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                monitored websites online
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}