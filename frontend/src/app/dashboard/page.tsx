"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function WebsiteListPage() {
  const [websites, setWebsites] = useState<any[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchWebsites = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:4242/api/getWebsites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch websites")
      }

      setWebsites(data.websites || [])
      setError("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchWebsites()

    // Set up interval for polling
    const intervalId = setInterval(fetchWebsites, 30000) // 30 seconds

    // Cleanup function
    return () => {
      clearInterval(intervalId)
    }
  }, [router])

  const getStatusSummary = (ticks: any[]) => {
    if (!ticks || ticks.length === 0) return "No data"
    const lastTick = ticks[0]
    return lastTick.status === "Good" ? "Online" : "Offline"
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Website Status Dashboard</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          {websites.map((site: any) => {
            const sortedTicks = (site.Ticks || [])
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 50)
            
            const statusSummary = getStatusSummary(sortedTicks)

            return (
              <div key={site._id} className="border rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{site.url}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusSummary === "Online" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {statusSummary}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <div className="flex space-x-1 pb-2">
                    {sortedTicks.length > 0 ? (
                      sortedTicks.map((tick: any, index: number) => (
                        <div 
                          key={tick._id || index} 
                          className={`h-8 w-4 rounded-sm ${
                            tick.status === "Good" 
                              ? "bg-green-500" 
                              : "bg-red-500"
                          }`}
                          title={`${new Date(tick.createdAt).toLocaleString()} - ${tick.status}`}
                        />
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No tick data available</div>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Latest {sortedTicks.length} checks - {new Date(sortedTicks[0]?.createdAt || new Date()).toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}