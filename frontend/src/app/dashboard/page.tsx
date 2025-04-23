"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function WebsiteListPage() {
  const [websites, setWebsites] = useState<any[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    if (!token) {
      router.push("/login")
      return
    }

    const fetchWebsites = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getWebsites", {
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
        console.log("Websites fetched:", data.websites)
        setError("")
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWebsites()
  }, [router])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Websites & Latest Ticks</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-6">
          {websites.map((site: any) => (
            <li key={site._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{site.url}</h3>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Website ID:</strong> {site._id}
              </div>

              <div className="mt-3">
                <h4 className="font-medium mb-1">Latest 20 Ticks:</h4>
                <ul className="list-disc pl-5 space-y-1">
                        {(site.Ticks || [])
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 20)
                            .map((tick: any, index: number) => (
                            <li key={tick._id || index}>
                                <span
                                className={`font-medium ${
                                    tick.status === "Good"
                                    ? "text-green-600"
                                    : tick.status === "Bad"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                                >
                                {new Date(tick.createdAt).toLocaleString()} - {tick.status}
                                </span>
                            </li>
                            ))}
                        </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
