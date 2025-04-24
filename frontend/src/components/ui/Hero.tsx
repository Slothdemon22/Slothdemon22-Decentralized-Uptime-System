"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { AnimatedText } from "@/components/ui/animated-text";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Network,
  Activity,
  Globe,
  Clock,
  CheckCircle2
} from "lucide-react";

export function HeroSection() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  const statsVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <AnimatedGradient />
      
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background/20 via-background/60 to-background" />
      
      <motion.div 
        style={{ opacity, scale, y }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24"
      >
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-sm mb-6 hover:border-primary/40 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2 text-primary animate-pulse" />
              <span className="text-gradient font-medium">Monitoring reimagined for Web3</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              <AnimatedText text="Decentralized Uptime" className="block" />
              <AnimatedText text="Monitoring for your sites" className="block" />
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-chart-1 via-chart-2 to-chart-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              Monitor your services with a global, decentralized network. 
              No single point of failure. Trustless verification. Real-time alerts.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="gap-2 animated-gradient dark:text-black hover:scale-105 transition-transform">
                <Link href="/dashboard">
                  Get Started 
                  
                </Link>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" className="gap-2 animated-gradient dark:text-black hover:scale-105 bg-green-400  dark:bg-gradient-to-r dark:from-green-500 dark:via-green-300 to-green-100  transition-transform" >
                <Link href="/validator">
                  Become a Validator
                  
                </Link>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: Globe, label: "Global Coverage", value: "1000+" },
                { icon: Clock, label: "Response Time", value: "<100ms" },
                { icon: Shield, label: "Uptime SLA", value: "99.99%" },
                { icon: CheckCircle2, label: "Success Rate", value: "99.9%" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statsVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/50 hover:border-primary/20 transition-colors hover-glow"
                >
                  <stat.icon className="h-6 w-6 text-primary mb-2" />
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-12"
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by innovative companies worldwide</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                {["Company A", "Company B", "Company C", "Company D"].map((company, index) => (
                  <motion.div
                    key={company}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    className="text-muted-foreground/70 hover:text-foreground font-medium transition cursor-pointer"
                  >
                    {company}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right content - Illustrated dashboard */}
          <motion.div
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className="flex-1 relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
              className="relative z-10"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-2xl hover-glow">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-background/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">DecentralWatch Dashboard</div>
                  <div></div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-background/50 rounded-lg p-4 border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center">
                        <Shield className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-xs text-muted-foreground">Uptime</p>
                          <p className="text-2xl font-bold text-gradient">99.99%</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-background/50 rounded-lg p-4 border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center">
                        <Zap className="w-8 h-8 text-chart-1 mr-3" />
                        <div>
                          <p className="text-xs text-muted-foreground">Response</p>
                          <p className="text-2xl font-bold text-gradient">238ms</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-background/50 rounded-lg p-4 border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center">
                        <Network className="w-8 h-8 text-chart-2 mr-3" />
                        <div>
                          <p className="text-xs text-muted-foreground">Nodes</p>
                          <p className="text-2xl font-bold text-gradient">1,248</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "api.example.com", status: "Up", response: "127ms", uptime: "100%" },
                      { name: "app.example.com", status: "Up", response: "219ms", uptime: "99.98%" },
                      { name: "cdn.example.com", status: "Up", response: "83ms", uptime: "99.95%" },
                      { name: "auth.example.com", status: "Up", response: "176ms", uptime: "100%" },
                      { name: "socket.example.com", status: "Up", response: "98ms", uptime: "99.99%" },
                    ].map((service, index) => (
                      <motion.div
                        key={service.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background hover:border-primary/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex space-x-6">
                          <span className="text-sm text-green-500">{service.status}</span>
                          <span className="text-sm text-muted-foreground">{service.response}</span>
                          <span className="text-sm text-muted-foreground">{service.uptime}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-chart-1/20 backdrop-blur-md -z-10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-chart-2/20 backdrop-blur-md -z-10"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 7,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}