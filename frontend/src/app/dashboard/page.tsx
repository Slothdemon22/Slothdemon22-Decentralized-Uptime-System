"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Tick {
  status: "up" | "down" | "degraded" | "unknown"
  responseTime: number | null
  createdAt: string | null
}

interface Service {
  _id: string
  name: string
  Ticks: Tick[]
}

interface TickPopupProps {
  tick: Tick | null
  serviceName: string
  isOpen: boolean
  onClose: () => void
}

function TickPopup({ tick, serviceName, isOpen, onClose }: TickPopupProps) {
  if (!tick) return null

  const statusColors = {
    up: "bg-[#2ECC71]",
    down: "bg-[#E74C3C]",
    degraded: "bg-[#F39C12]",
    unknown: "bg-[#555555]",
  }

  const statusText = {
    up: "Operational",
    down: "Outage",
    degraded: "Degraded Performance",
    unknown: "No Data",
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-[#333] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-inter font-semibold flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColors[tick.status]}`}></div>
            Service Status Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="bg-black p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#888888] font-inter">Service</span>
              <span className="font-medium font-inter">{serviceName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#888888] font-inter">Status</span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium font-inter ${
                  tick.status === "up"
                    ? "bg-[#2ECC71]/20 text-[#2ECC71]"
                    : tick.status === "down"
                      ? "bg-[#E74C3C]/20 text-[#E74C3C]"
                      : tick.status === "degraded"
                        ? "bg-[#F39C12]/20 text-[#F39C12]"
                        : "bg-[#555555]/20 text-[#AAAAAA]"
                }`}
              >
                {statusText[tick.status]}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#888888] font-inter">Response Time</span>
              <span className="font-medium font-inter">
                {tick.responseTime !== null ? `${tick.responseTime}ms` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888888] font-inter">Timestamp</span>
              <span className="font-medium font-inter">{formatDateTime(tick.createdAt)}</span>
            </div>
          </div>

          <div className="text-sm text-[#888888] font-inter">
            {tick.status === "up" ? (
              <p>The service was responding normally at this time with good performance.</p>
            ) : tick.status === "down" ? (
              <p>The service was experiencing an outage at this time and was not responding to requests.</p>
            ) : tick.status === "degraded" ? (
              <p>The service was operational but experiencing degraded performance at this time.</p>
            ) : (
              <p>No monitoring data is available for this time period.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [selectedTick, setSelectedTick] = useState<Tick | null>(null)
  const [selectedServiceName, setSelectedServiceName] = useState<string>("")
  const [isTickPopupOpen, setIsTickPopupOpen] = useState(false)
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false)
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setAuthToken(token)

    if (token) {
      fetchServices(token)
      const interval = setInterval(() => fetchServices(token), 2 * 30000)
      return () => clearInterval(interval)
    } else {
      window.location.href = "/login"
    }
  }, [])

  const fetchServices = async (token: string) => {
    try {
      setIsLoading(true)

      const response = await fetch("http://localhost:4242/api/getWebsites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken")
          window.location.href = "/login"
          return
        }
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      console.log("Fetched services:", data)

      // Transform the data to match our service structure
      const mappedServices = (data.websites || []).map((site: any) => ({
        _id: site._id,
        name: site.url,
        Ticks: (site.Ticks || []).map((tick: any) => ({
          status: tick.status === "Good" ? "up" : tick.status === "Degraded" ? "degraded" : "down",
          responseTime: tick.latency,
          createdAt: tick.createdAt,
        })),
      }))

      setServices(mappedServices)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddWebsite = async () => {
    try {
      if (!newWebsiteUrl.trim()) return

      const response = await fetch("http://localhost:4242/api/addWebsite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: newWebsiteUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to add website")
      }

      // Refresh the services list
      await fetchServices(authToken!)

      // Reset and close dialog
      setNewWebsiteUrl("")
      setIsAddWebsiteOpen(false)
    } catch (error) {
      console.error("Error adding website:", error)
    }
  }

  // Calculate uptime percentage for a service
  const calculateUptime = (ticks: Tick[]) => {
    if (!ticks || ticks.length === 0) return 100.0
    const upTicks = ticks.filter((tick) => tick.status === "up").length
    return (upTicks / ticks.length) * 100
  }

  // Check if all services are operational
  const allServicesOperational = services.every((service) => {
    const latestTick = service.Ticks && service.Ticks.length > 0 ? service.Ticks[0] : null
    return latestTick ? latestTick.status === "up" : true
  })

  // Format date like "Mar 14 at 06:11am IST"
  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) +
      " IST"
    )
  }

  // Map service names to display names
  const getDisplayName = (name: string) => {
    if (name.includes("api")) return "API"
    if (name.includes("match")) return "Matching engine"
    if (name.includes("data")) return "Data"
    if (name.includes("web")) return "Web"
    return name
  }

  const handleTickClick = (tick: Tick, serviceName: string) => {
    setSelectedTick(tick)
    setSelectedServiceName(serviceName)
    setIsTickPopupOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#1E1E20] text-white flex flex-col items-center py-16 px-4 font-inter">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Status Header */}
        <div className="flex flex-col items-center mb-12 text-white">
          <div className="w-16 h-16 rounded-full bg-[#2ECC71]/20 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-[#2ECC71]" />
          </div>
          <h1 className="text-3xl font-bold mb-2 font-inter">
            {allServicesOperational ? "All services are online" : "Some services are experiencing issues"}
          </h1>
          <p className="text-[#CCCCCC] text-sm font-inter">Last updated on {formatDate(lastUpdated)}</p>
        </div>

        {/* Add Website Button */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => setIsAddWebsiteOpen(true)}
            className="bg-[#2ECC71] hover:bg-[#27AE60] text-black font-medium py-2 px-4 rounded-md transition-colors"
          >
            Add Website
          </button>
        </div>

        {/* Add Website Dialog */}
        <Dialog open={isAddWebsiteOpen} onOpenChange={setIsAddWebsiteOpen}>
          <DialogContent className="bg-[#1A1A1A] border-[#333] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-inter font-semibold">Add Website to Monitor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <label htmlFor="website-url" className="text-sm text-[#CCCCCC] font-inter">
                  Website URL
                </label>
                <input
                  id="website-url"
                  type="text"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2 rounded-md bg-[#252525] border border-[#333] text-white font-inter"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddWebsiteOpen(false)}
                  className="px-4 py-2 rounded-md bg-[#333] text-white hover:bg-[#444] transition-colors font-inter"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWebsite}
                  disabled={!newWebsiteUrl.trim()}
                  className="px-4 py-2 rounded-md bg-[#2ECC71] text-black font-medium hover:bg-[#27AE60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  Add Website
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Status Card */}
        <Card className="w-full bg-zinc-900 border-0 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-medium text-white font-inter">Current status by service</h2>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-white rounded-md bg-[#2A2A2A] text-sm font-inter">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2ECC71] text-white"></span>
                    Operational
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#333333]">
                  <DropdownMenuItem className="text-white hover:bg-[#333333] font-inter">All Services</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#333333] font-inter">Incidents</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#333333] font-inter">Maintenance</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoading ? (
              <div className="space-y-10">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="space-y-2 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-32 bg-gray-700 rounded"></div>
                      <div className="h-5 w-24 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-700 rounded"></div>
                      <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {/* Fallback to default services if API returns empty */}
                {services.length > 0
                  ? services.map((service, index) => {
                      const uptime = calculateUptime(service.Ticks)
                      const displayName = getDisplayName(service.name)
                      const totalTicks = 50 // Total number of ticks to display

                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#2ECC71]"></span>
                              <span className="font-medium text-white font-inter">{displayName}</span>
                            </div>
                            <span className="text-[#2ECC71] text-sm font-medium font-inter">
                              {uptime.toFixed(3)}% uptime
                            </span>
                          </div>

                          <div className="flex gap-[2px]">
                            {/* Generate status bars */}
                            {Array.from({ length: totalTicks }).map((_, i) => {
                              // If we have ticks, use them, otherwise show as unknown
                              let tick: Tick

                              if (service.Ticks && i < service.Ticks.length) {
                                // We have data for this tick
                                tick = service.Ticks[service.Ticks.length - 1 - i]
                              } else {
                                // No data for this tick, mark as unknown
                                tick = {
                                  status: "unknown",
                                  responseTime: null,
                                  createdAt: null,
                                }
                              }

                              return (
                                <div
                                  key={i}
                                  className={`h-8 flex-1 cursor-pointer hover:opacity-80 transition-opacity ${
                                    tick.status === "up"
                                      ? "bg-[#2ECC71]"
                                      : tick.status === "down"
                                        ? "bg-[#E74C3C]"
                                        : tick.status === "degraded"
                                          ? "bg-[#F39C12]"
                                          : "bg-[#555555]" // Gray for unknown/no data
                                  }`}
                                  onClick={() => handleTickClick(tick, displayName)}
                                />
                              )
                            })}
                          </div>

                          <div className="flex justify-between text-xs text-[#888888] font-inter">
                            <span>90 days ago</span>
                            <span>Today</span>
                          </div>
                        </div>
                      )
                    })
                  : // Default services if API returns empty
                    [
                      { name: "Web", uptime: 100.0 },
                      { name: "Matching engine", uptime: 99.967 },
                      { name: "API", uptime: 100.0 },
                      { name: "Data", uptime: 100.0 },
                    ].map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2ECC71]"></span>
                            <span className="font-medium font-inter">{service.name}</span>
                          </div>
                          <span className="text-[#2ECC71] text-sm font-medium font-inter">
                            {service.uptime.toFixed(3)}% uptime
                          </span>
                        </div>

                        <div className="flex gap-[2px]">
                          {Array.from({ length: 50 }).map((_, i) => {
                            // For demo data, show some ticks as unknown
                            let tick: Tick

                            if (i < 30) {
                              // Only show 30 days of data for demo
                              const isDown = service.name === "Matching engine" && (i === 15 || i === 22)
                              tick = {
                                status: isDown ? "down" : "up",
                                responseTime: isDown ? 500 : 100,
                                createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                              }
                            } else {
                              // No data for older dates
                              tick = {
                                status: "unknown",
                                responseTime: null,
                                createdAt: null,
                              }
                            }

                            return (
                              <div
                                key={i}
                                className={`h-8 flex-1 cursor-pointer hover:opacity-80 transition-opacity ${
                                  tick.status === "up"
                                    ? "bg-[#2ECC71]"
                                    : tick.status === "down"
                                      ? "bg-[#E74C3C]"
                                      : "bg-[#555555]"
                                }`}
                                onClick={() => handleTickClick(tick, service.name)}
                              />
                            )
                          })}
                        </div>

                        <div className="flex justify-between text-xs text-[#888888] font-inter">
                          <span>90 days ago</span>
                          <span>Today</span>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <TickPopup
        tick={selectedTick}
        serviceName={selectedServiceName}
        isOpen={isTickPopupOpen}
        onClose={() => setIsTickPopupOpen(false)}
      />
    </div>
  )
}
