"use client"

import { useState } from "react"
import Link from "next/link"
import { Network, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGoogleSignUp = () => {
    setIsLoading(true)
    // In a real implementation, this would trigger the Google OAuth flow
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:4242/api/addUser", 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create account")
      }

      const data = await response.json()
      console.log(data) // Handle success (e.g., redirect user)
      setIsLoading(false)
      // You can redirect or show a success message
      console.log("Account created successfully")
    } catch (error:any) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-white/10 bg-black">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Network className="h-6 w-6 text-white" />
            <span className="text-xl font-bold">DecentralMonitor</span>
          </div>
          <Link href="/login" className="text-sm text-white hover:text-white/90 transition-colors">
            Already have an account?
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-white/10">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Create your account</CardTitle>
            <CardDescription className="text-white/80">
              Start monitoring your website from around the world
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-800 border-white/20 text-white placeholder:text-white/40 focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-800 border-white/20 text-white placeholder:text-white/40 focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-800 border-white/20 text-white placeholder:text-white/40 focus:border-white"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-white/90 mt-2">
                {isLoading ? <LoadingSpinner /> : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-white/60">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 flex items-center justify-center gap-2 h-11"
            >
              {isLoading ? <LoadingSpinner /> : <GoogleIcon />}
              Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-white/60">Why sign up</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Global Monitoring",
                  description: "Monitor your website from multiple locations worldwide",
                },
                {
                  title: "Real-time Alerts",
                  description: "Get instant notifications when your website goes down",
                },
                {
                  title: "Comprehensive Analytics",
                  description: "Detailed insights into your website's performance",
                },
              ].map((feature, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 flex-none">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                    <p className="text-xs text-white/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-xs text-white/70 text-center">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 text-sm">© {new Date().getFullYear()} DecentralMonitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// Google Icon Component
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.63c1.38 0 2.55.47 3.48 1.27l2.59-2.04C16.99 2.1 14.86 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="h-4 w-4 border-2 border-t-2 border-t-white border-white/60 border-solid rounded-full animate-spin"></div>
  )
}
