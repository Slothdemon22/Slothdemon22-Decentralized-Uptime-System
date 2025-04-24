export async function fetchWebsites() {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  
    if (!token) {
      throw new Error("Authentication required")
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
  
    return data.websites || []
  }