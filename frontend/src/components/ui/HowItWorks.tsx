"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Check, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Connect Your Services",
      description: "Add your endpoints, APIs, and websites to the monitoring network with just a few clicks.",
    },
    {
      number: 2,
      title: "Distributed Verification",
      description: "Multiple nodes around the world monitor your services independently for trustless verification.",
    },
    {
      number: 3,
      title: "Real-time Consensus",
      description: "Nodes reach consensus about your service status, preventing false positives and ensuring accuracy.",
    },
    {
      number: 4,
      title: "Actionable Insights",
      description: "Receive alerts and access detailed performance analytics to optimize your infrastructure.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How DecentralWatch Works"
          subtitle="A simple but powerful approach to reliable uptime monitoring"
        />
        
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative aspect-square max-w-lg mx-auto rounded-full bg-muted/50 overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4">
                    {/* Central node */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-chart-1 rounded-full flex items-center justify-center z-20">
                      <div className="w-8 h-8 bg-card rounded-full animate-ping opacity-60 absolute"></div>
                      <span className="text-primary-foreground font-semibold">YOU</span>
                    </div>
                    
                    {/* Distributed nodes */}
                    {[...Array(8)].map((_, index) => {
                      const angle = (index * Math.PI * 2) / 8;
                      const radius = 100;
                      const x = Math.cos(angle) * radius + 50 - 6; // Adjust to center
                      const y = Math.sin(angle) * radius + 50 - 6; // Adjust to center
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: 0.1 * index,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100
                          }}
                          className="absolute w-12 h-12 bg-chart-2 rounded-full flex items-center justify-center"
                          style={{ left: `${x}%`, top: `${y}%` }}
                        >
                          <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 200 200">
                      <g stroke="currentColor" strokeOpacity="0.3" strokeWidth="1">
                        {[...Array(8)].map((_, index) => {
                          const angle = (index * Math.PI * 2) / 8;
                          const radius = 100;
                          const x = Math.cos(angle) * radius + 100;
                          const y = Math.sin(angle) * radius + 100;
                          
                          return (
                            <motion.line
                              key={index}
                              x1="100"
                              y1="100"
                              x2={x}
                              y2={y}
                              initial={{ pathLength: 0, opacity: 0 }}
                              whileInView={{ pathLength: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                            />
                          );
                        })}
                      </g>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div>
              <ol className="relative space-y-8">
                {steps.map((step, index) => (
                  <motion.li
                    key={step.number}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="pl-10 relative"
                  >
                    <span className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                    
                    {index < steps.length - 1 && (
                      <span className="absolute left-4 top-8 h-12 w-px bg-border/50"></span>
                    )}
                  </motion.li>
                ))}
              </ol>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 pl-10"
              >
                <p className="text-muted-foreground">Additional benefits:</p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Immutable, tamper-proof monitoring history",
                    "Full data ownership and privacy",
                    "No central authority or single point of failure",
                    "Resistant to censorship and network partitions"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-chart-1 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}