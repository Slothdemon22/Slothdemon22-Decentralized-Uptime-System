"use client"

import { WebsiteData } from "@/types/websiteTypes"
import { StatusCard } from "./StatusCard"
import { Skeleton } from "@/components/ui/skeleton"

interface StatusDashboardProps {
  websites: WebsiteData[]
  loading: boolean
}

export default function StatusDashboard({ websites, loading }: StatusDashboardProps) {
  if (loading && websites.length === 0) {
    return (
      <div className="space-y-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-32 w-full mb-3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!loading && websites.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center mt-8">
        <h3 className="text-lg font-medium mb-2">No websites found</h3>
        <p className="text-muted-foreground">Add a website to start monitoring its status.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-8">
      {websites.map((site) => (
        <StatusCard key={site._id} website={site} />
      ))}
    </div>
  )
}