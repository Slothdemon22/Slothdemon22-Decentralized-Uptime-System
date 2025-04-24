"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { 
  Globe, 
  Lock, 
  Bell, 
  LineChart, 
  Shield, 
  Cpu,
  Clock,
  BarChart3
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Global Node Network",
      description: "Distributed monitoring from 1,000+ nodes worldwide providing accurate geographic insights.",
      iconClass: "bg-chart-1/10"
    },
    {
      icon: Lock,
      title: "Trustless Verification",
      description: "Cryptographically secure reports with consensus mechanisms to ensure reliability.",
      iconClass: "bg-chart-2/10"
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Instant notifications through multiple channels when issues are detected by the network.",
      iconClass: "bg-chart-3/10"
    },
    {
      icon: LineChart,
      title: "Advanced Analytics",
      description: "Comprehensive performance metrics and historical data visualization.",
      iconClass: "bg-chart-4/10"
    },
    {
      icon: Shield,
      title: "DDoS Protection",
      description: "Built-in DDoS detection and active protection through our distributed network.",
      iconClass: "bg-chart-5/10"
    },
    {
      icon: Cpu,
      title: "Smart Contracts",
      description: "Automate responses to downtime with programmable smart contract integrations.",
      iconClass: "bg-chart-1/10"
    },
    {
      icon: Clock,
      title: "Historical Reporting",
      description: "Access immutable records of your service's performance over time.",
      iconClass: "bg-chart-2/10"
    },
    {
      icon: BarChart3,
      title: "SLA Management",
      description: "Track and enforce Service Level Agreements with verifiable proof of uptime.",
      iconClass: "bg-chart-3/10"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Powerful Features for Modern Monitoring"
          subtitle="Comprehensive tools designed for reliability in a decentralized world"
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
              iconClassName={feature.iconClass}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden rounded-xl border border-border/60 p-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-5/10 opacity-50" />
          <div className="relative rounded-lg overflow-hidden bg-card p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">Scale with confidence</h3>
                <p className="mt-4 text-muted-foreground">
                  Our platform scales with your infrastructure, from small projects to global enterprises.
                  With transparent reporting, smart alerting, and actionable insights, you'll have
                  everything you need to ensure maximum uptime.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-chart-1/10">
                      <Clock className="h-6 w-6 text-chart-1" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">99.9% SLA</p>
                      <p className="text-sm text-muted-foreground">Guaranteed service</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-chart-2/10">
                      <Globe className="h-6 w-6 text-chart-2" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Global Coverage</p>
                      <p className="text-sm text-muted-foreground">1,000+ nodes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 to-chart-5/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-3xl" />
                </div>
                <div className="relative h-full flex items-center justify-center p-6">
                  <svg className="w-full h-full max-w-md" viewBox="0 0 300 200">
                    <rect x="10" y="10" width="280" height="180" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.2" />
                    {/* Graph line representing uptime */}
                    <polyline 
                      points="20,150 50,100 80,110 110,90 140,95 170,70 200,75 230,60 260,50 290,55" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {[
                      [20, 150], [50, 100], [80, 110], [110, 90], 
                      [140, 95], [170, 70], [200, 75], [230, 60], 
                      [260, 50], [290, 55]
                    ].map((point, i) => (
                      <circle 
                        key={i}
                        cx={point[0]} 
                        cy={point[1]} 
                        r="4" 
                        className="fill-chart-1" 
                      />
                    ))}
                    {/* X and Y axis */}
                    <line x1="10" y1="180" x2="290" y2="180" stroke="currentColor" strokeOpacity="0.2" />
                    <line x1="10" y1="10" x2="10" y2="180" stroke="currentColor" strokeOpacity="0.2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}