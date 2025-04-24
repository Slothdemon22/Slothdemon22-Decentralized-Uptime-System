"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Server, Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface Tick {
  _id: string
  status: string
  latency: number
  statusCode: number
  createdAt: string
}

interface Website {
  _id: string
  url: string
  userID: string
  Ticks: Tick[]
  createdAt: string
  updatedAt: string
}

export default function WebsiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<Website | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latencyData, setLatencyData] = useState<any[]>([])
  const [uptimeData, setUptimeData] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    currentStatus: "unknown",
    uptime: 0,
    avgLatency: 0,
    maxLatency: 0,
    minLatency: 0,
    totalChecks: 0,
    successfulChecks: 0,
    failedChecks: 0,
  })

  useEffect(() => {
    const fetchWebsiteDetails = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("authToken")

        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("http://localhost:4242/api/getWebsites", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch website details")
        }

        const data = await response.json()
        const websiteId = params.id as string
        const foundWebsite = data.websites.find((site: Website) => site._id === websiteId)

        if (!foundWebsite) {
          throw new Error("Website not found")
        }

        setWebsite(foundWebsite)
        processWebsiteData(foundWebsite)
      } catch (err: any) {
        setError(err.message)
        console.error("Error fetching website details:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebsiteDetails()
  }, [params.id, router])

  const processWebsiteData = (website: Website) => {
    // Sort ticks by date (newest first)
    const sortedTicks = [...website.Ticks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    // Process latency data for chart
    const latencyChartData = sortedTicks
      .slice(0, 50)
      .reverse()
      .map((tick) => {
        return {
          time: new Date(tick.createdAt).toLocaleTimeString(),
          latency: tick.latency || 0,
          status: tick.status === "Good" ? "up" : tick.status === "Degraded" ? "degraded" : "down",
        }
      })
    setLatencyData(latencyChartData)

    // Process uptime data (daily)
    const uptimeByDay = new Map<string, { total: number; up: number }>()

    sortedTicks.forEach((tick) => {
      const date = new Date(tick.createdAt).toLocaleDateString()
      if (!uptimeByDay.has(date)) {
        uptimeByDay.set(date, { total: 0, up: 0 })
      }

      const dayData = uptimeByDay.get(date)!
      dayData.total++
      if (tick.status === "Good") {
        dayData.up++
      }
    })

    const uptimeChartData = Array.from(uptimeByDay.entries()).map(([date, data]) => {
      return {
        date,
        uptime: data.total > 0 ? (data.up / data.total) * 100 : 0,
      }
    })
    setUptimeData(uptimeChartData)

    // Calculate metrics
    const totalChecks = sortedTicks.length
    const successfulChecks = sortedTicks.filter((tick) => tick.status === "Good").length
    const failedChecks = totalChecks - successfulChecks
    const uptime = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0

    const latencies = sortedTicks.map((tick) => tick.latency || 0).filter((l) => l > 0)
    const avgLatency = latencies.length > 0 ? latencies.reduce((sum, val) => sum + val, 0) / latencies.length : 0
    const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0
    const minLatency = latencies.length > 0 ? Math.min(...latencies) : 0

    const currentStatus =
      sortedTicks.length > 0
        ? sortedTicks[0].status === "Good"
          ? "up"
          : sortedTicks[0].status === "Degraded"
            ? "degraded"
            : "down"
        : "unknown"

    setMetrics({
      currentStatus,
      uptime,
      avgLatency,
      maxLatency,
      minLatency,
      totalChecks,
      successfulChecks,
      failedChecks,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "#2ECC71"
      case "degraded":
        return "#F39C12"
      case "down":
        return "#E74C3C"
      default:
        return "#555555"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-6 w-6 text-[#2ECC71]" />
      case "degraded":
        return <AlertTriangle className="h-6 w-6 text-[#F39C12]" />
      case "down":
        return <XCircle className="h-6 w-6 text-[#E74C3C]" />
      default:
        return <Clock className="h-6 w-6 text-[#555555]" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E20] text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#CCCCCC]">Loading website details...</p>
      </div>
    )
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-[#1E1E20] text-white flex flex-col items-center justify-center p-4">
        <XCircle className="h-16 w-16 text-[#E74C3C] mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Website</h1>
        <p className="text-[#CCCCCC] mb-6">{error || "Website not found"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333333] text-white px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-[#CCCCCC] hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2A2A2A]">
              <Server className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{website.url}</h1>
              <p className="text-[#CCCCCC]">Monitoring since {formatDate(website.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#888888]">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.currentStatus)}
                <span className="text-xl font-semibold" style={{ color: getStatusColor(metrics.currentStatus) }}>
                  {metrics.currentStatus === "up"
                    ? "Operational"
                    : metrics.currentStatus === "degraded"
                      ? "Degraded"
                      : metrics.currentStatus === "down"
                        ? "Down"
                        : "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#888888]">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-[#2ECC71]" />
                <span className="text-xl font-semibold">{metrics.uptime.toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#888888]">Avg. Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-[#3498DB]" />
                <span className="text-xl font-semibold">{metrics.avgLatency.toFixed(0)} ms</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-[#888888]">Total Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-[#9B59B6]" />
                <span className="text-xl font-semibold">{metrics.totalChecks}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader>
              <CardTitle>Latency (ms)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis dataKey="time" stroke="#888888" tick={{ fill: "#888888" }} tickLine={{ stroke: "#888888" }} />
                  <YAxis stroke="#888888" tick={{ fill: "#888888" }} tickLine={{ stroke: "#888888" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333333", color: "white" }}
                    labelStyle={{ color: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#3498DB"
                    strokeWidth={2}
                    dot={{ fill: "#3498DB", r: 4 }}
                    activeDot={{ r: 6, fill: "#3498DB" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader>
              <CardTitle>Uptime (%)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis dataKey="date" stroke="#888888" tick={{ fill: "#888888" }} tickLine={{ stroke: "#888888" }} />
                  <YAxis
                    stroke="#888888"
                    tick={{ fill: "#888888" }}
                    tickLine={{ stroke: "#888888" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", borderColor: "#333333", color: "white" }}
                    labelStyle={{ color: "white" }}
                    formatter={(value: any) => [`${value.toFixed(2)}%`, "Uptime"]}
                  />
                  <Area type="monotone" dataKey="uptime" stroke="#2ECC71" fill="#2ECC7133" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
                  <span className="text-[#888888]">Highest Latency</span>
                  <span className="font-medium">{metrics.maxLatency} ms</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
                  <span className="text-[#888888]">Lowest Latency</span>
                  <span className="font-medium">{metrics.minLatency} ms</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
                  <span className="text-[#888888]">Average Latency</span>
                  <span className="font-medium">{metrics.avgLatency.toFixed(2)} ms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#252525] border-[#333333] text-white">
            <CardHeader>
              <CardTitle>Availability Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
                  <span className="text-[#888888]">Successful Checks</span>
                  <span className="font-medium text-[#2ECC71]">{metrics.successfulChecks}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
                  <span className="text-[#888888]">Failed Checks</span>
                  <span className="font-medium text-[#E74C3C]">{metrics.failedChecks}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
                  <span className="text-[#888888]">Uptime Percentage</span>
                  <span className="font-medium">{metrics.uptime.toFixed(3)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
