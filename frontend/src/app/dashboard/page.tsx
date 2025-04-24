"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StatusDashboard from "@/components/ui/StatusDashboard"
import { DashboardHeader } from "@/components/ui/DashboardHeader"
import { WebsiteData } from "@/types/websiteTypes"
import { fetchWebsites } from "@/lib/api"

export default function WebsiteListPage() {
  const [websites, setWebsites] = useState<WebsiteData[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const router = useRouter()

  useEffect(() => {
    const getWebsites = async () => {
      try {
        setLoading(true)
        const data = await fetchWebsites()
        
        if (data) {
          setWebsites(data)
          setLastUpdated(new Date())
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    getWebsites()

    // Set up interval for polling
    const intervalId = setInterval(getWebsites, 30000) // 30 seconds

    // Cleanup function
    return () => {
      clearInterval(intervalId)
    }
  }, [router])

  // Calculate overall health
  const calculateSystemHealth = () => {
    if (websites.length === 0) return { healthy: 0, total: 0, percentage: 0 }
    
    const healthy = websites.filter(site => {
      const ticks = site.Ticks || []
      return ticks.length > 0 && ticks[0].status === "Good"
    }).length
    
    return {
      healthy,
      total: websites.length,
      percentage: Math.round((healthy / websites.length) * 100)
    }
  }

  const systemHealth = calculateSystemHealth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader 
        lastUpdated={lastUpdated}
        health={systemHealth}
        loading={loading}
      />
      
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        {error && (
          <div className="my-6 p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <StatusDashboard 
          websites={websites} 
          loading={loading} 
        />
      </main>
    </div>
  )
}