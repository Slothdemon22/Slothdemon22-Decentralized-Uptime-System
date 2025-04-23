"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  Globe,
  Server,
  Clock,
  ArrowRight,
  Zap,
  Network,
  Laptop,
  MonitorCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export default function GetStartedGuide() {
  const [activeSection, setActiveSection] = useState("overview")
  const [mounted, setMounted] = useState(false)

  // Only run client-side code after mounting
  useEffect(() => {
    setMounted(true)

    // Intersection Observer for section detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -100px 0px", threshold: 0.1 },
    )

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Add this useEffect to handle reveal animations
  useEffect(() => {
    // Create an intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")

            // Add staggered animation to child elements
            const items = entry.target.querySelectorAll(".reveal-item")
            items.forEach((item, index) => {
              item.style.animationDelay = `${index * 0.1}s`
            })
          }
        })
      },
      { rootMargin: "0px 0px -100px 0px", threshold: 0.1 },
    )

    // Observe all sections
    document.querySelectorAll(".reveal-section").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [mounted]) // Only run after component is mounted

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    })
  }

  if (!mounted) {
    // Return a simple skeleton on first render
    return <div className="min-h-screen bg-background"></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DecentralMonitor</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {["overview", "architecture", "create-monitors", "how-it-works"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeSection === section ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                {section
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </button>
            ))}
          </nav>
          <div>
            <Button>Dashboard</Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        {/* Hero Section */}
        <section id="overview" className="py-20 reveal-section">
          <div className="text-center space-y-6 reveal-item">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              Get Started Guide
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Decentralized Website Monitoring</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor your website's performance from validators around the world, not just a single central server.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg">
                Start Monitoring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>

          <div className="mt-20 relative reveal-item">
            <InformativeMonitoringMap />
          </div>
        </section>

        {/* Rest of the content remains the same */}
        {/* Architecture Section */}
        <section id="architecture" className="py-20 border-t reveal-section">
          <div className="space-y-6 reveal-item">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Decentralized Architecture</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center">
              Unlike traditional monitoring services that rely on a single point of failure, our system leverages a
              network of global validators.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
            <div className="reveal-item">
              <SimpleArchitectureDiagram />
            </div>
            <div className="space-y-8">
              {[
                {
                  icon: <Globe className="h-5 w-5 text-primary" />,
                  title: "Global Validators",
                  description:
                    "Our network consists of validators distributed across different geographic locations, ensuring diverse and reliable monitoring data.",
                },
                {
                  icon: <Activity className="h-5 w-5 text-primary" />,
                  title: "Real-time Metrics",
                  description:
                    "Get accurate latency and uptime metrics from multiple perspectives, not just from a single central server.",
                },
                {
                  icon: <Server className="h-5 w-5 text-primary" />,
                  title: "No Single Point of Failure",
                  description:
                    "Even if some validators go offline, your monitoring continues uninterrupted through the remaining network nodes.",
                },
              ].map((item, index) => (
                <div key={index} className="space-y-3 reveal-item" style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground pl-14">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Create Monitors Section */}
        <section id="create-monitors" className="py-20 border-t reveal-section">
          <div className="space-y-6 reveal-item">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Create Your First Monitor</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center">
              Setting up monitoring for your website is simple and takes just a few minutes.
            </p>
          </div>

          <div className="mt-16 reveal-item">
            <Tabs defaultValue="ui" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ui">Using Dashboard UI</TabsTrigger>
                <TabsTrigger value="api">Using API</TabsTrigger>
              </TabsList>
              <TabsContent value="ui" className="mt-6">
                <div className="space-y-8">
                  {[
                    {
                      step: 1,
                      title: "Sign in to your dashboard",
                      description:
                        "Access your dashboard using your credentials or create a new account if you haven't already.",
                    },
                    {
                      step: 2,
                      title: "Create a new monitor",
                      description:
                        'Click on the "Add Monitor" button and enter your website URL and monitoring preferences.',
                    },
                    {
                      step: 3,
                      title: "Select validator regions",
                      description:
                        "Choose which geographic regions you want to monitor your website from. We recommend selecting at least 3 different regions for comprehensive coverage.",
                    },
                    {
                      step: 4,
                      title: "Configure alerts (optional)",
                      description:
                        "Set up notification preferences for when your website experiences downtime or performance issues.",
                    },
                    {
                      step: 5,
                      title: "Start monitoring",
                      description:
                        'Click "Start Monitoring" and your website will immediately begin being monitored by our global validator network.',
                      button: (
                        <Button>
                          Start Monitoring
                          <Zap className="ml-2 h-4 w-4" />
                        </Button>
                      ),
                    },
                  ].map((step) => (
                    <div
                      key={step.step}
                      className="flex gap-6 items-start reveal-item"
                      style={{ transitionDelay: `${(step.step - 1) * 100}ms` }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                        {step.step}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        {step.step !== 5 && (
                          <div className="mt-4 border rounded-lg overflow-hidden">
                            <div className="w-full h-[200px] bg-muted/50 flex items-center justify-center">
                              <span className="text-muted-foreground">Step {step.step} Screenshot</span>
                            </div>
                          </div>
                        )}
                        {step.button && <div className="mt-4">{step.button}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="api" className="mt-6">
                <div className="space-y-8">
                  {[
                    {
                      title: "1. Get your API key",
                      content: (
                        <Card>
                          <CardHeader>
                            <CardTitle>Generate API Key</CardTitle>
                            <CardDescription>Create an API key in your dashboard under Settings → API</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-muted p-4 rounded-md">
                              <code className="text-sm">YOUR_API_KEY_HERE</code>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    },
                    {
                      title: "2. Create a monitor via API",
                      content: (
                        <Card>
                          <CardHeader>
                            <CardTitle>API Request</CardTitle>
                            <CardDescription>Send a POST request to our API endpoint</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code className="text-sm">
                                {`curl -X POST https://api.decentralmonitor.com/v1/monitors \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "name": "My Website",
    "check_frequency": 60,
    "regions": ["us-east", "europe-west", "asia-east"],
    "alerts": {
      "email": "alerts@example.com",
      "downtime_threshold": 30
    }
  }'`}
                              </code>
                            </pre>
                          </CardContent>
                        </Card>
                      ),
                    },
                    {
                      title: "3. Check monitor status",
                      content: (
                        <Card>
                          <CardHeader>
                            <CardTitle>API Request</CardTitle>
                            <CardDescription>Get the status of your monitor</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code className="text-sm">
                                {`curl https://api.decentralmonitor.com/v1/monitors/{monitor_id} \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                              </code>
                            </pre>
                          </CardContent>
                        </Card>
                      ),
                    },
                    {
                      title: "4. Sample response",
                      content: (
                        <Card>
                          <CardHeader>
                            <CardTitle>API Response</CardTitle>
                            <CardDescription>Example of monitor status response</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code className="text-sm">
                                {`{
  "id": "mon_12345",
  "url": "https://example.com",
  "name": "My Website",
  "status": "up",
  "uptime": 99.98,
  "last_checked": "2023-04-22T15:30:45Z",
  "regions": [
    {
      "name": "us-east",
      "status": "up",
      "latency": 87,
      "last_checked": "2023-04-22T15:30:45Z"
    },
    {
      "name": "europe-west",
      "status": "up",
      "latency": 142,
      "last_checked": "2023-04-22T15:30:40Z"
    },
    {
      "name": "asia-east",
      "status": "up",
      "latency": 210,
      "last_checked": "2023-04-22T15:30:42Z"
    }
  ]
}`}
                              </code>
                            </pre>
                          </CardContent>
                        </Card>
                      ),
                    },
                  ].map((item, index) => (
                    <div key={index} className="reveal-item" style={{ transitionDelay: `${index * 100}ms` }}>
                      <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                      {item.content}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 border-t reveal-section">
          <div className="space-y-6 reveal-item">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center">
              Understanding the technology behind our decentralized monitoring system.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Network className="h-6 w-6 text-primary" />,
                title: "Validator Network",
                description:
                  "Our system consists of a network of validator nodes distributed across different geographic regions. Each validator independently monitors your website and reports metrics back to the network.",
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Monitoring Process",
                description:
                  "When you create a monitor, your request is distributed to validators in your selected regions. These validators perform regular checks on your website at the specified frequency.",
              },
              {
                icon: <MonitorCheck className="h-6 w-6 text-primary" />,
                title: "Data Aggregation",
                description:
                  "Results from all validators are aggregated to provide comprehensive insights about your website's performance. This gives you a global perspective on how users from different regions experience your site.",
              },
            ].map((item, index) => (
              <div key={index} className="reveal-item" style={{ transitionDelay: `${index * 100}ms` }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-16 reveal-item">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "How is this different from traditional monitoring?",
                      answer:
                        "Traditional monitoring services typically use a single server or a few centralized servers to check your website. Our decentralized approach uses multiple independent validators from different geographic locations, providing a more accurate representation of how users around the world experience your site.",
                    },
                    {
                      question: "How many validators monitor my website?",
                      answer:
                        "The number of validators depends on your plan and selected regions. Our basic plan includes monitoring from 3 different regions, while premium plans can include up to 20 regions for comprehensive global coverage.",
                    },
                    {
                      question: "What metrics are collected?",
                      answer:
                        "Our validators collect uptime status, response time (latency), SSL certificate validity, DNS resolution time, and content verification. Premium plans also include page load time, resource loading performance, and custom transaction monitoring.",
                    },
                    {
                      question: "How quickly am I notified of downtime?",
                      answer:
                        "Alerts are triggered within 60 seconds of detected downtime. To prevent false positives, we verify downtime across multiple validators before sending notifications. Premium plans offer faster notification times of up to 15 seconds.",
                    },
                    {
                      question: "Can I become a validator?",
                      answer:
                        "Yes! We have an open validator program where you can run a validator node and earn rewards. Visit our Validator Program page to learn more about requirements and compensation.",
                    },
                  ].map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t reveal-section">
          <div className="text-center space-y-6 reveal-item">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of websites already benefiting from decentralized monitoring.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" className="gap-2">
                Start Monitoring Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-muted/40">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Network className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">DecentralMonitor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized website monitoring from validators around the world.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "API", "Validator Program"],
            },
            {
              title: "Resources",
              links: ["Documentation", "Blog", "Community", "Status Page"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Contact", "Privacy Policy"],
            },
          ].map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2 text-sm">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DecentralMonitor. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["twitter", "github", "linkedin"].map((social) => (
                <a key={social} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">{social.charAt(0).toUpperCase() + social.slice(1)}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`lucide lucide-${social}`}
                  >
                    {social === "twitter" && (
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    )}
                    {social === "github" && (
                      <>
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </>
                    )}
                    {social === "linkedin" && (
                      <>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// New Informative Monitoring Map Component
function InformativeMonitoringMap() {
  // Sample monitoring data for different regions
  const monitoringData = [
    {
      id: "us-east",
      name: "US East",
      position: { top: "30%", left: "25%" },
      status: "up",
      latency: 87,
      lastChecked: "2 min ago",
      uptime: 99.98,
    },
    {
      id: "us-west",
      name: "US West",
      position: { top: "35%", left: "18%" },
      status: "up",
      latency: 102,
      lastChecked: "1 min ago",
      uptime: 99.95,
    },
    {
      id: "eu-west",
      name: "Europe West",
      position: { top: "28%", left: "45%" },
      status: "up",
      latency: 142,
      lastChecked: "3 min ago",
      uptime: 99.97,
    },
    {
      id: "eu-central",
      name: "Europe Central",
      position: { top: "25%", left: "50%" },
      status: "degraded",
      latency: 189,
      lastChecked: "2 min ago",
      uptime: 99.82,
    },
    {
      id: "asia-east",
      name: "Asia East",
      position: { top: "35%", left: "75%" },
      status: "up",
      latency: 210,
      lastChecked: "1 min ago",
      uptime: 99.91,
    },
    {
      id: "asia-south",
      name: "Asia South",
      position: { top: "45%", left: "65%" },
      status: "up",
      latency: 230,
      lastChecked: "4 min ago",
      uptime: 99.89,
    },
    {
      id: "australia",
      name: "Australia",
      position: { top: "65%", left: "80%" },
      status: "up",
      latency: 245,
      lastChecked: "2 min ago",
      uptime: 99.93,
    },
    {
      id: "south-america",
      name: "South America",
      position: { top: "65%", left: "30%" },
      status: "down",
      latency: 320,
      lastChecked: "5 min ago",
      uptime: 98.76,
    },
  ]

  // Status color mapping
  const getStatusColor = (status:any) => {
    switch (status) {
      case "up":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "down":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Status icon mapping
  const getStatusIcon = (status:any) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Latency color mapping
  const getLatencyColor = (latency:any) => {
    if (latency < 100) return "text-green-500"
    if (latency < 200) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="relative h-[500px] w-full bg-muted rounded-xl overflow-hidden">
      <div className="absolute inset-0">
        {/* World Map Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full opacity-20" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
            {/* Simplified world map outline */}
            <path
              d="M150,100 Q250,50 350,100 T550,100 T750,100 T950,100 V400 Q850,450 750,400 T550,400 T350,400 T150,400 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Your Website */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center mb-2 border-2 border-primary">
              <Laptop className="h-8 w-8 text-primary" />
            </div>
            <Badge className="mb-1">Your Website</Badge>
            <Badge variant="outline">example.com</Badge>
          </div>
        </div>

        {/* Validator Nodes */}
        <TooltipProvider>
          {monitoringData.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                top: node.position.top,
                left: node.position.left,
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 border-2 border-background shadow-md ${
                        node.status === "up" ? "animate-pulse-dot" : ""
                      }`}
                      style={{
                        backgroundColor: `hsl(var(--${node.status === "up" ? "primary" : node.status === "degraded" ? "warning" : "destructive"}))`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    >
                      <Server className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium bg-background/80 px-2 py-0.5 rounded-full">{node.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 p-0">
                  <Card className="border-0">
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {getStatusIcon(node.status)} {node.name} Validator
                      </CardTitle>
                      <CardDescription className="text-xs">Last checked: {node.lastChecked}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Status:</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium capitalize">
                          <span className={`h-2 w-2 rounded-full ${getStatusColor(node.status)}`}></span>
                          {node.status}
                        </div>

                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>Latency:</span>
                        </div>
                        <div className={`font-medium ${getLatencyColor(node.latency)}`}>{node.latency} ms</div>

                        <div className="flex items-center gap-1">
                          <BarChart className="h-3 w-3" />
                          <span>Uptime:</span>
                        </div>
                        <div className="font-medium">{node.uptime}%</div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipContent>
              </Tooltip>

              {/* Connection lines to central website */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                  width: "1000px",
                  height: "500px",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
              >
                <line
                  x1="50%"
                  y1="50%"
                  x2={node.position.left}
                  y2={node.position.top}
                  stroke={`hsl(var(--${node.status === "up" ? "primary" : node.status === "degraded" ? "warning" : "destructive"}))`}
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  className="animate-dash-line"
                  style={{ animationDelay: `${Math.random() * 1}s` }}
                  strokeOpacity="0.6"
                />
              </svg>
            </div>
          ))}
        </TooltipProvider>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Monitoring Status</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span>Up (Normal)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span>Degraded (Slow Response)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span>Down (Unreachable)</span>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2">Global Monitoring Stats</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>Active Validators:</div>
            <div className="font-medium">8 regions</div>

            <div>Global Uptime:</div>
            <div className="font-medium text-green-500">99.91%</div>

            <div>Avg. Latency:</div>
            <div className="font-medium text-yellow-500">178 ms</div>

            <div>Last Check:</div>
            <div className="font-medium">1 min ago</div>
          </div>
        </div>

        {/* Data Flow Animations */}
        {monitoringData
          .filter((node) => node.status === "up")
          .map((node, index) => (
            <div
              key={`flow-${node.id}`}
              className="absolute w-2 h-2 rounded-full bg-primary animate-ping-slow"
              style={{
                top: `calc(${node.position.top} + 5px)`,
                left: `calc(${node.position.left} + 5px)`,
                animationDelay: `${index * 0.5}s`,
              }}
            ></div>
          ))}
      </div>
    </div>
  )
}

// Enhanced Architecture Diagram with subtle animations
function SimpleArchitectureDiagram() {
  return (
    <div className="relative h-[400px] w-full bg-muted rounded-xl overflow-hidden p-6">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Central Website - static */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center mb-2">
              <Laptop className="h-8 w-8 text-primary" />
            </div>
            <span className="text-sm font-medium">Your Website</span>
          </div>

          {/* Validators - with subtle pulse animations */}
          <div className="absolute top-[20%] left-[20%] flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center mb-2 animate-pulse-dot"
              style={{ animationDelay: "0s" }}
            >
              <Server className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium">US Validator</span>
          </div>

          <div className="absolute top-[20%] right-[20%] flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center mb-2 animate-pulse-dot"
              style={{ animationDelay: "0.5s" }}
            >
              <Server className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium">EU Validator</span>
          </div>

          <div className="absolute bottom-[20%] left-[20%] flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center mb-2 animate-pulse-dot"
              style={{ animationDelay: "1s" }}
            >
              <Server className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium">Asia Validator</span>
          </div>

          <div className="absolute bottom-[20%] right-[20%] flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center mb-2 animate-pulse-dot"
              style={{ animationDelay: "1.5s" }}
            >
              <Server className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium">AU Validator</span>
          </div>

          {/* Animated connection lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="20%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              className="animate-dash-line"
              style={{ animationDelay: "0s" }}
            />
            <line
              x1="80%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              className="animate-dash-line"
              style={{ animationDelay: "0.2s" }}
            />
            <line
              x1="20%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              className="animate-dash-line"
              style={{ animationDelay: "0.4s" }}
            />
            <line
              x1="80%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              className="animate-dash-line"
              style={{ animationDelay: "0.6s" }}
            />
          </svg>

          {/* Data flow animations */}
          <div
            className="absolute top-[35%] left-[35%] w-2 h-2 rounded-full bg-primary animate-ping-slow"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-[35%] right-[35%] w-2 h-2 rounded-full bg-primary animate-ping-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-[35%] left-[35%] w-2 h-2 rounded-full bg-primary animate-ping-slow"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-[35%] right-[35%] w-2 h-2 rounded-full bg-primary animate-ping-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>
    </div>
  )
}
