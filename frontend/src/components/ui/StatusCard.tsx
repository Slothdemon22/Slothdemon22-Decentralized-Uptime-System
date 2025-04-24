"use client"

import { WebsiteData, TickData } from "@/types/websiteTypes"
import { StatusHistory } from "./StatusHistory"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { calculateUptimePercentage } from "@/lib/StatusUtils"

interface StatusCardProps {
  website: WebsiteData
}

export function StatusCard({ website }: StatusCardProps) {
  const { url, Ticks = [] } = website
  
  // Sort ticks by date (newest first) and take the most recent 50
  const sortedTicks = [...Ticks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50)
  
  const currentStatus = sortedTicks.length > 0 ? sortedTicks[0].status : "Unknown"
  const isOnline = currentStatus === "Good"
  const lastChecked = sortedTicks.length > 0 
    ? new Date(sortedTicks[0].createdAt) 
    : null
  
  const domainName = url.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const uptime = calculateUptimePercentage(sortedTicks)
  
  // Calculate response time (if available)
  const lastResponseTime = sortedTicks.length > 0 && sortedTicks[0].responseTime
    ? `${sortedTicks[0].responseTime}ms`
    : "N/A"

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isOnline ? "border-l-4 border-l-emerald-500" : 
      currentStatus === "Unknown" ? "border-l-4 border-l-gray-400" : 
      "border-l-4 border-l-red-500"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold truncate" title={url}>
              {domainName}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">{url}</p>
          </div>
          <div className={cn(
            "rounded-full px-3 py-1 text-xs font-medium flex items-center",
            isOnline ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : 
            currentStatus === "Unknown" ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" : 
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          )}>
            {isOnline ? (
              <><CheckCircle size={14} className="mr-1" /> Online</>
            ) : currentStatus === "Unknown" ? (
              <><Clock size={14} className="mr-1" /> Unknown</>
            ) : (
              <><XCircle size={14} className="mr-1" /> Offline</>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <StatusHistory ticks={sortedTicks} />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-muted/30 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Uptime</p>
            <p className="text-lg font-semibold">{uptime}%</p>
          </div>
          <div className="bg-muted/30 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Response</p>
            <p className="text-lg font-semibold">{lastResponseTime}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-3">
        {lastChecked ? (
          <p>Last checked {formatDistanceToNow(lastChecked, { addSuffix: true })}</p>
        ) : (
          <p>No check data available</p>
        )}
      </CardFooter>
    </Card>
  )
}