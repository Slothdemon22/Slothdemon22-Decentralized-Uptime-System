"use client"

import { SystemHealth } from "@/types/websiteTypes"
import { cn } from "@/lib/utils"
import { BarChart, RefreshCw } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { AnimatedText } from "@/components/ui/animated-text";

interface DashboardHeaderProps {
  lastUpdated: Date
  health: SystemHealth
  loading: boolean
}

export function DashboardHeader({ lastUpdated, health, loading }: DashboardHeaderProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <motion.header style={{ opacity, scale, y }} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <AnimatedGradient />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background/20 via-background/60 to-background" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 text-center lg:text-left relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-sm mb-6 hover:border-primary/40 transition-colors"
            >
              <BarChart className="h-8 w-8 text-foreground mr-3" />
              <h1 className="text-2xl font-bold leading-7 text-foreground sm:truncate">
                Status Dashboard
              </h1>
            </motion.div>
            <p className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              <span className={cn(
                "inline-flex items-center mr-2",
                loading ? "animate-spin" : ""
              )}>
                <RefreshCw size={14} className="mr-1" />
              </span>
              <span>
                Last updated: {formattedTime} on {formattedDate}
              </span>
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <div className="bg-card shadow-sm rounded-lg p-4 inline-flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">System Health</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  health.percentage >= 90 ? "bg-green-100 text-green-800" : 
                  health.percentage >= 75 ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                )}>
                  {health.percentage}%
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold">
                {health.healthy}/{health.total}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                monitored websites online
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}