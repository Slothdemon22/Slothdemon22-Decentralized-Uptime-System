"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { 
  CheckCircle2, 
  XCircle,
  ArrowRight, 
  Shield, 
  Lock, 
  Activity, 
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComparisonSection() {
  const comparisonPoints = [
    {
      feature: "Reliability",
      decentralized: {
        value: true,
        description: "No single point of failure with distributed consensus mechanisms"
      },
      traditional: {
        value: false,
        description: "Vulnerable to service outages from a single provider"
      }
    },
    {
      feature: "Global Coverage",
      decentralized: {
        value: true,
        description: "Thousands of independent nodes across all geographic regions"
      },
      traditional: {
        value: true,
        description: "Limited to the provider's data center locations"
      }
    },
    {
      feature: "Censorship Resistance",
      decentralized: {
        value: true,
        description: "Resistant to censorship and manipulation of monitoring data"
      },
      traditional: {
        value: false,
        description: "Subject to corporate or government influence"
      }
    },
    {
      feature: "Verifiable Reports",
      decentralized: {
        value: true,
        description: "Cryptographically signed reports with multi-node verification"
      },
      traditional: {
        value: false,
        description: "Must trust the provider's word about your uptime"
      }
    },
    {
      feature: "Cost Efficiency",
      decentralized: {
        value: true,
        description: "Pay only for the resources you use, not for idle infrastructure"
      },
      traditional: {
        value: false,
        description: "Fixed pricing tiers regardless of actual usage needs"
      }
    },
    {
      feature: "Data Ownership",
      decentralized: {
        value: true,
        description: "Full ownership of your monitoring data with privacy controls"
      },
      traditional: {
        value: false,
        description: "Data typically owned and controlled by the provider"
      }
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Reliability",
      description: "Eliminate reliance on a single provider for monitoring critical infrastructure."
    },
    {
      icon: Lock,
      title: "Greater Transparency",
      description: "Access verifiable proof of monitoring events and uptime statistics."
    },
    {
      icon: Activity,
      title: "Improved Accuracy",
      description: "Multiple independent verifications reduce false positives and negatives."
    },
    {
      icon: Server,
      title: "Future-Proof Solution",
      description: "Built for the decentralized future of web services and applications."
    }
  ];

  return (
    <section id="comparison" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Decentralized Monitoring?"
          subtitle="Compare our approach with traditional centralized monitoring solutions"
        />
        
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground border-b border-border w-1/3">Feature</th>
                  <th className="text-left py-4 px-4 font-medium border-b border-border bg-chart-1/5 w-1/3">
                    <span className="flex items-center text-chart-1">
                      <Activity className="mr-2 h-5 w-5" />
                      DecentralWatch
                    </span>
                  </th>
                  <th className="text-left py-4 px-4 font-medium border-b border-border w-1/3">
                    <span className="text-muted-foreground">Traditional Monitoring</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonPoints.map((point, index) => (
                  <motion.tr
                    key={point.feature}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{point.feature}</td>
                    <td className="py-4 px-4 bg-chart-1/5">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-chart-1 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{point.decentralized.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start">
                        {point.traditional.value ? (
                          <CheckCircle2 className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm text-muted-foreground">{point.traditional.description}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg border border-border/50"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button className="gap-2">
              Start Monitoring Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}